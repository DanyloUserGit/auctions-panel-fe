import type { ReactNode } from "react";
import { useNavigate } from "react-router";

interface ProtectedRouteProps {
  children: ReactNode;
  roles: string[];
}
export const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  // const {user}=useAuth();
  const navigate = useNavigate();
  const user = null;

  if (!user) {
    navigate("/login");
  }
  console.log(roles);
  //if (user?.role !== role) {
  //  return <Navigate to="/forbidden" replace />;
  // }
  return children;
};
