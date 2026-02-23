import { Navigate } from "react-router";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  role: string;
}
export const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  // const {user}=useAuth();
  const user = null;
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  //if (user?.role !== role) {
  //  return <Navigate to="/forbidden" replace />;
 // }
  return children;
};
