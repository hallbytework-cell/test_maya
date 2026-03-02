import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
   const { user } = useAuth();

  return !user ? <Outlet /> : <Navigate to="/" replace />;
};

export default PublicRoute;
