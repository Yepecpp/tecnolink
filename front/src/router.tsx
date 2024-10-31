import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/App";
import Login from "./pages/Login-page";
import App from "./App";
import { useAuth } from "./context";

export const AppRouter = () => {
  const { auth } = useAuth();
  console.log(auth);
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
        <Route path="/*" element={<App />} />
      </Routes>
    </Router>
  );
};
