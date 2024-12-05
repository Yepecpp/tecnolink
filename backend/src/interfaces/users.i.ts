import { z } from "zod";
import { zodObjectId } from "./common/id.ci";
import { zodDateCoerce } from "./common/parse.ci";
import { HydratedDocument } from "mongoose";
export enum UserRoles {
  tecnician = "tecnician",
  admin = "admin",
  client = "client",
}
export const UserZod = z
  .object({
    id: zodObjectId.optional(),
    login: z.object({
      username: z
        .string()
        .min(3, "Username must be at least 3 characters long")
        .max(25, "Username must be at most 25 characters long"),
      email: z.string().email("Invalid email address"),
      password: z.string().min(3, "Password must be at least 3 characters long").optional(),
      provider: z.enum(["local", "google"]),
      lastPasswordChange: zodDateCoerce.optional(),
    }),
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
    cellPhone: z
      .string()
      .max(16, "Cellphone must be at most 12 characters long")
      .min(2, "Cellphone must be at least 2 characters long"),
    identity: z.object({
      idType: z.enum(["id", "passport"]),
      idNumber: z.string().max(16, "it must be at most 16 characters long"),
    }),
  })
  .refine((data) => {
    if (!data.login.password && !data.id) {
      return false;
    }
    return true;
  }, "Password is required");
export type IUser = z.infer<typeof UserZod>;
export type UserDocument = HydratedDocument<IUser> & {
  toJSON: () => IUser;
};
