import * as React from "react";
import { X } from "lucide-react";
import { v4 as uuid } from "uuid";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

type Framework = {
  value: string;
  label: string;
  obligatory?: boolean;
};

interface MultiSelectProps {
  values: Framework[];
  onChange?: (value: Framework[]) => void;
  disabled?: boolean;
  initialValue?: string[];
  placeholder?: string;
}
export function MultiSelect({
  values,
  onChange,
  disabled,
  initialValue,
  placeholder,
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Framework[]>(
    initialValue &&
      initialValue?.every((v) => values.some((s) => s.value === v))
      ? values.filter((v) => initialValue.includes(v.value))
      : values.length
        ? [values[0]]
        : [],
  );
  React.useEffect(() => {
    if (initialValue) {
      setSelected(
        initialValue &&
          initialValue?.every((v) => values.some((s) => s.value === v))
          ? values.filter((v) => initialValue.includes(v.value))
          : values.length
            ? [values[0]]
            : [],
      );
    }
  }, [initialValue, values]);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = React.useCallback(
    (framework: Framework) => {
      if (framework.obligatory) {
        return;
      }
      const filtered = selected.filter((s) => s.value !== framework.value);
      setSelected(filtered);
      onChange?.(filtered);
    },
    [selected, onChange],
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            const newSelected = [...selected];
            newSelected.pop();
            setSelected(newSelected);
            onChange?.(newSelected);
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    [selected, onChange],
  );

  const selectables = values.filter(
    (v) =>
      !selected.some((s) => s.value === v.value) &&
      v.label.toLowerCase().includes(inputValue.toLowerCase()),
  );

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selected.map((framework) => {
            return (
              <Badge key={uuid()} variant="default">
                {framework.label}
                <button
                  type="button"
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 "
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(framework);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(framework)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          <CommandPrimitive.Input
            ref={inputRef}
            disabled={disabled}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder ?? "Select"}
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        <CommandList>
          {open && selectables.length > 0 ? (
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((framework) => {
                  return (
                    <CommandItem
                      key={uuid()}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => {
                        setInputValue("");
                        const newSelected = [...selected, framework];
                        setSelected(newSelected);
                        onChange?.(newSelected);
                      }}
                      className={"cursor-pointer"}
                    >
                      {framework.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          ) : null}
        </CommandList>
      </div>
    </Command>
  );
}

/*<FormField
            control={form.control}
            name="supportedCountries"
            render={({ field }) => {
              if (!field.value || field.value.length === 0) {
                field.onChange(["do"]);
              }
              return (
                <FormItem>
                  <FormControl>
                    <div>
                      <FormLabel>{t("fields.countries.label")}</FormLabel>
                      <div className="font medium mt-2  w-[40%]">
                        <MultiSelect
                          disabled={status === "detail"}
                          values={[
                            { value: "do", label: "RD" },
                            { value: "us", label: "US" },
                          ]}
                          onChange={(values) => {
                            field.onChange(values.map((v) => v.value));
                          }}
                          initialValue={field.value}
                          placeholder={t("fields.countries.select")}
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />*/
