import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

type Props = {
  children: ReactNode;
  requireAdmin?: boolean;
};

export default function ProtectedRoute({ children, requireAdmin = false }: Props) {
  const { user, loading } = useAuth();
  const location = useLocation();

    if (loading) {
        return null; // Wait for auth state to be restored
    }

    if (!user) 
    {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (requireAdmin && user.role !== "admin") {
      return <Navigate to="/login" replace />;
    }

  return <>{children}</>;
}
