import { useState, useEffect } from "react";

import { Spinner } from "@/components/ui";

import { AuthContextState, AuthContext } from ".";
import { login as serviceLogin, getAuth } from "@/services/auth";
import storage from "@/utils/storage";
import { Login } from "@/types";

//TODO: Fix infinite loading when server is unreachable

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [auth, setAuth] = useState<AuthContextState["auth"]>(() => null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (data: Login) => {
    const newAuth = await serviceLogin(data);

    if (!newAuth.token) return;

    storage.set("token", `Bearer ${newAuth.token}`);
    setAuth(() => newAuth);
  };

  const logout = () => {
    storage.clear("token");
    setAuth(null);
  };

  useEffect(() => {
    if (auth) return setIsLoading(false);

    const token = storage.get("token");
    if (!token) return setIsLoading(false);

    const authenticate = async () => {
      const newAuth = await getAuth();
      storage.set("token", `Bearer ${newAuth.token}`);
      setAuth(newAuth);
      setIsLoading(false);
    };
    authenticate();
  }, [auth]);

  if (isLoading)
    return (
      <main className="flex items-center justify-center w-screen h-screen">
        <Spinner />
      </main>
    );

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
