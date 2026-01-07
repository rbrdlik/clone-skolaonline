import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RootRedirect() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Načítání...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/timetable" replace />;
  }

  return <Navigate to="/signIn" replace />;
}
