import { Navigate, Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
// import { useAuth } from '@/hooks/useAuth';
// import { UserRoles } from '@/types';

export function ProtectedRoute({
  isAllowed,
  redirectTo = "/login",
  children,
}: {
  isAllowed: boolean;
  redirectTo?: string;
  children?: React.ReactNode;
}) {
  const location = useLocation();
  if (!isAllowed) {
    return <Navigate to={redirectTo} state={{ from: location }} />;
  }
  return children ? children : <Outlet />;
}
