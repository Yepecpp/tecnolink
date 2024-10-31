import { useContext } from "react";
import {
  AuthContext,
  AuthContextState,
} from "@/context/AuthContext/AuthContext";

export const useAuth = (): AuthContextState => useContext(AuthContext);
