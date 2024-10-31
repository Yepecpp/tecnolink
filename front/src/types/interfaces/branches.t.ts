import { z } from "zod";
import { zodDateCoerce } from "./common/parse.ci";
import { AddressZod } from "./common/address.ci";

export const BranchesZod = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Name must be at least 3 characters long"),
  address: AddressZod.optional(),
  phone: z.string().min(10, "Phone must be at least 10 characters long"),
  status: z.enum(["active", "inactive"]).default("active"),
  createdAt: zodDateCoerce.optional(),
  updatedAt: zodDateCoerce.optional(),
  companyId: z.string().optional(),
});

export type IBranch = z.infer<typeof BranchesZod>;
