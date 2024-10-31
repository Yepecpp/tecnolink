import Axios, { InternalAxiosRequestConfig } from "axios";
import { API_URL } from "../constants/variables";
import storage from "@/utils/storage";

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  const token = storage.get("token");
  if (token) {
    config.headers.authorization = `${token}`;
  }
  config.headers.Accept = "application/json";
  return config;
}

export const axios = Axios.create({
  baseURL: API_URL,
});

axios.interceptors.request.use(authRequestInterceptor);
