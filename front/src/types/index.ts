export * from "./interfaces/index";

import { IUser } from "@/types/interfaces/users.i";
import { IClient } from "@/types/interfaces/clients.i";

export type Login = {
  email?: string;
  username: string;
  password: string;
};

export type UserStatus = "active" | "inactive" | "banned";

export enum UserRoles {
  ADMIN = "admin",
  DELIVERY = "delivery",
  DISPATCHER = "dispatcher",
  SELLER = "seller",
}

export type LoginProvider = "local" | "google";

export type User = IUser;
export type Client = IClient;

export type Theme = "dark" | "light" | "system";

export type Auth = { token: string; user: User };

export type ListResponse<TData> = {
  data: TData[];
  total: number;
  totalFound: number;
};

export type PaginationParams = {
  contains?: string;
  limit: number;
  sort?: string;
  offset?: number;
  columnFilters?: string;
  page?: number;
  order?: "asc" | "desc";
};

export enum FormStatuses {
  create = "create",
  update = "update",
  detail = "detail",
}

export type FormStatus = keyof typeof FormStatuses;

export interface EntityFormProps<T> {
  initialState?: Partial<T>;
  status: FormStatus;
}
