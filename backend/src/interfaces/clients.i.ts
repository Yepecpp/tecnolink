import { z } from "zod";
import { zodObjectId } from "./common/id.ci";
import { zodDateCoerce } from "./common/parse.ci";
import { HydratedDocument } from "mongoose";
export const ClientZod = z.object({
  id: zodObjectId.optional(),
  code: z.string().min(1, "Code must be at least 1 characters long").optional(),
  name: z.string().min(2, "Name must be at least 2 characters long"),
  cellPhone: z.string().min(3, "Cellphone must be at least 3 characters long").optional(),
  seller: z.string().min(3, "Vendedor must be at least 3 characters long"),
  email: z.string().email("Invalid email address").optional(),
  rnc: z.string().min(3, "RNC must be at least 3 characters long").optional(),
  type: z.enum(["individual", "company"]),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isGeolocated: z.boolean(),
  status: z.enum(["active", "inactive"]).default("active"),
  createdAt: zodDateCoerce.optional(),
  updatedAt: zodDateCoerce.optional(),
});

export type IClient = z.infer<typeof ClientZod>;
export type ClientDocument = HydratedDocument<IClient> & {
  toJSON: () => IClient;
};
