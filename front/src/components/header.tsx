import { useAuth } from "@/context";
import { PenTool } from "lucide-react";
import { Link } from "react-router-dom";

export const HeaderPage = () => {
  const { auth, logout } = useAuth();
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center">
      <Link className="flex items-center justify-center" to="#">
        <PenTool className="h-6 w-6 mr-2" />
        <span className="font-bold">Tecnolink</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          to="/"
        >
          How It Works
        </Link>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          to="/tecnician"
        >
          Services
        </Link>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          to="/create"
        >
          For Technicians
        </Link>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          to="#"
        >
          About Us
        </Link>
        {!auth ? (
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="/login"
          >
            Login
          </Link>
        ) : (
          <>
            <p
              className="text-sm font-medium hover:underline underline-offset-4 cursor-pointer"
              onClick={() => {
                logout();
              }}
            >
              Log out
            </p>
            <p className="text-sm font-medium hover:underline">
              {auth.user.name} {auth.user.lastName}
            </p>
          </>
        )}
      </nav>
    </header>
  );
};
