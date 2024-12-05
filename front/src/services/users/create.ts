import { axios } from "@/lib/axios";
import { IUser } from "@/types";

export async function addUser(user: IUser) {
  const response = await axios.post("/users/register", { data: user });
  return response.data.data;
}
