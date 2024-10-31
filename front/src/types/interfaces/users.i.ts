import { z } from "zod";
import { zodDateCoerce } from "./common/parse.ci";
import { UserRoles } from "../index";
import { AddressZod } from "./common/address.ci";
import { BranchesZod } from "@/types/interfaces/branches.t";

export const UserZod = z
  .object({
    id: z.string().optional(),
    login: z.object({
      username: z
        .string()
        .min(3, "Username must be at least 3 characters long")
        .max(25, "Username must be at most 25 characters long"),
      email: z.string().email("Invalid email address"),
      password: z
        .string()
        .min(3, "Password must be at least 3 characters long")
        .optional(),
      provider: z.enum(["local", "google"]),
      lastPasswordChange: zodDateCoerce.optional(),
    }),
    cellPhone: z
      .string()
      .max(16, "Cellphone must be at most 12 characters long")
      .min(2, "Cellphone must be at least 2 characters long"),
    status: z.enum(["active", "inactive", "banned"]).default("active"),
    createdAt: zodDateCoerce.optional(),
    updatedAt: zodDateCoerce.optional(),
    role: z.nativeEnum(UserRoles),
    name: z
      .string()
      .max(25, "Name must be at most 25 characters long")
      .min(2, "Name must be at least 2 characters long"),
    lastName: z
      .string()
      .max(25, "Lastname must be at most 25 characters long")
      .min(2, "Lastname must be at least 2 characters long"),
    identity: z.object({
      idType: z.enum(["id", "passport"]),
      idNumber: z.string(),
    }),
    branch: BranchesZod.or(z.string()),
    address: AddressZod.optional(),
  })
  .refine((data) => {
    if (!data.login.password && !data.id) {
      return false;
    }
    return true;
  }, "Password is required");
export type IUser = z.infer<typeof UserZod>;
