import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border py-1 px-2 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        purple: "border-transparent bg-purple-500/10 text-purple-500",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground",
        green: "border-transparent bg-emerald-500/10 text-emerald-500",
        lime: "border-transparent bg-lime-500/10 text-lime-500",
        teal: "border-transparent bg-teal-500/10 text-teal-500",
        blue: "border-transparent bg-sky-500/10 text-sky-500",
        yellow: "border-transparent bg-amber-500/10 text-amber-500",
        red: "border-transparent bg-rose-500/10 text-rose-500",
        orange: "border-transparent bg-orange-500/10 text-orange-500",
        gray: "border-transparent bg-zinc-100 text-zinc-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants };
