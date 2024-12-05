import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/App";
import Login from "./pages/Login-page";
import App from "./pages/basePage";
import { useAuth } from "./context";
import { CreateTec } from "./pages/create-tec";
import TechnicianGrid from "./pages/listTecnician";

export const AppRouter = () => {
  const { auth } = useAuth();
  return (
    <Router>
      <Routes>
        <Route element={<ProtectedRoute isAllowed={!!auth} />}>
          <Route path="/test" element={<App />} />
        </Route>
        <Route
          path="/login"
          element={
            <ProtectedRoute isAllowed={!auth} redirectTo="/">
              <Login />
            </ProtectedRoute>
          }
        />
        <Route path="/create" element={<CreateTec />} />
        <Route path="/tecnician" element={<TechnicianGrid />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </Router>
  );
};
