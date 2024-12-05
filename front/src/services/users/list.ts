import { axios } from "@/lib/axios";
import { User } from "@/types";
import { ListResponse } from "@/types";
import { PaginationParams } from "@/types";

export async function getAllUsers(
  queryParams: PaginationParams
): Promise<ListResponse<User>> {
  const { contains, limit, sort, columnFilters } = queryParams;

  const columnFiltersWithZip =
    columnFilters && columnFilters.includes("address")
      ? columnFilters.replace("address", "address.zip")
      : columnFilters;

  const response = await axios.get(
    `/users?limit=${limit}${sort ? `&sort=${sort}` : ""}${
      contains ? `&contains=${contains}` : ""
    }${columnFiltersWithZip ? columnFiltersWithZip : ""}
    `
  );
  return response.data;
}
