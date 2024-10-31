import { useCallback } from "react";

import { useAuth } from "@/context";
import { User, UserRoles as Roles } from "@/types";

//type RoleTypes = keyof typeof Roles;

export const POLICIES = {
  administration: (user: User) => {
    if (user.role === "admin") {
      return true;
    }

    return false;
  },
};

export const useAuthorization = () => {
  const { auth } = useAuth();
  const user = auth?.user;

  if (!user) {
    throw Error("User does not exist!");
  }

  const checkAccess = useCallback(
    ({ allowedRoles }: { allowedRoles: Roles[] }) => {
      if (allowedRoles && allowedRoles.length > 0) {
        return allowedRoles?.includes(user.role);
      }

      return true;
    },
    [user.role]
  );

  return { checkAccess, role: user.role };
};
