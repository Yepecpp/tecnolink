import { Auth, Login } from "@/types";
import { axios } from "@/lib/axios";
import { authRoutes } from "../routes";

export async function getAuth(): Promise<Auth> {
  const response = await axios.get<Auth>(authRoutes.get);
  return response.data;
}

export async function login(data: Login): Promise<Auth> {
  const response = await axios.post<Auth>(authRoutes.loginPost, {
    login: data,
  });
  return response.data;
}
