import { z } from "zod";

export const AddressZod = z.object({
  street: z.string().optional(),
  number: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zip: z.string().optional(),
  geoRef: z
    .object({
      lat: z.number().or(z.null()).optional(),
      lng: z.number().or(z.null()).optional(),
    })
    .optional(),
});

export type IAddress = z.infer<typeof AddressZod>;
