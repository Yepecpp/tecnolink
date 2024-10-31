// import { describe, it, expect } from "vitest";
// import { render, screen } from "@testing-library/react";

import { AuthContext } from "@/context";

import { UserRoles } from "@/types";

export const TestAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
  roles?: UserRoles[];
}) => {
  return (
    <AuthContext.Provider
      value={{
        auth: {
          token: "test",
          user: {
            name: "Test",
            lastName: "User",
            login: {
              email: "test@gmail.com",
              username: "test",
              provider: "local",
            },
            status: "active",
            cellPhone: "1234567890",
            role: UserRoles.ADMIN,
            branch: "1",
            identity: {
              idNumber: "1234567890",
              idType: "passport",
            },
            createdAt: new Date(),
            updatedAt: new Date(),
            id: "1",
          },
        },
        login: async () => {},
        logout: () => {},
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// This describe is causing the dev server to crash

// describe("AuthProvider", () => {
//   it("should render children", () => {
//     render(
//       <TestAuthProvider>
//         <div>Test</div>
//       </TestAuthProvider>,
//     );
//     expect(screen.getByText("Test")).toBeDefined();
//   });
// });
