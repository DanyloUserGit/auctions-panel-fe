import type { FC, PropsWithChildren } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate, Outlet } from 'react-router';

export const ProtectedRoute: FC<PropsWithChildren> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to={'/login'} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};