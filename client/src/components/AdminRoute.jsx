import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Načítání...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signIn" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/timetable-change" replace />;
  }

  return children;
}
