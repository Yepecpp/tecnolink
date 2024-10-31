import { z } from "zod";
import { zodDateCoerce } from "./common/parse.ci";
import { AddressZod } from "./common/address.ci";
export const ClientZod = z.object({
  id: z.string().optional(),
  code: z.string().min(1, "Code must be at least 1 characters long").optional(),
  name: z.string().min(2, "Name must be at least 2 characters long"),
  category: z.string().optional(),
  cellPhone: z
    .string()
    .min(3, "Cellphone must be at least 3 characters long")
    .optional(),
  email: z.string().email("Invalid email address").optional(),
  rnc: z.string().min(3, "RNC must be at least 3 characters long").optional(),
  type: z.enum(["individual", "company"]),
  tags: z.array(z.string()).optional(),
  address: AddressZod.optional(),
  isGeolocated: z.boolean(),
  status: z.enum(["active", "inactive"]).default("active"),
  seller: z.string().min(3, "Vendedor must be at least 3 characters long"),
  createdAt: zodDateCoerce.optional(),
  updatedAt: zodDateCoerce.optional(),
});

export type IClient = z.infer<typeof ClientZod>;
