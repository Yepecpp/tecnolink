import { axios } from "@/lib/axios";
import { User } from "@/types";
import { ListResponse } from "@/types";
import { PaginationParams } from "@/types";

export async function getAllUsers(
  queryParams: PaginationParams
): Promise<ListResponse<User>> {
  const response = await axios.get(`/users`);
  return response.data;
}
