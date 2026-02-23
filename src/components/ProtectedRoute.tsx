import { Navigate } from "react-router";
import type { JSX } from "react/jsx-runtime";

interface ProtectedRouteProps {
  children: JSX.Element;
  role: string;
}
export const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  // const {user}=useAuth();
  const user = null;
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== role) {
    return <Navigate to="/forbidden" replace />;
  }
  return children;
};
