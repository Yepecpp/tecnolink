import { createContext } from "react";
import { Auth } from "@/types";
import { Login } from "@/types";

export type AuthContextState = {
  auth: Auth | null;
  login: (login: Login) => Promise<void>;
  logout: () => void;
};

const initialState: AuthContextState = {
  auth: null,
  login: async () => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthContextState>(initialState);
