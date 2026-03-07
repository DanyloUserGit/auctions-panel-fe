import { type ReactNode } from 'react';
import { useAuth } from '../model/useAuth';
import type { UserRole } from '../model/user-schema';

interface CanProps {
  roles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode; // Що показати, якщо доступу немає (опціонально)
}

export const Can = ({ roles, children, fallback = null }: CanProps) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) return <>{fallback}</>;

  const hasAccess = roles.includes(user.role);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};
