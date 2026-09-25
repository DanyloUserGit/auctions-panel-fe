import type { FC, PropsWithChildren } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../features/auth/model/useAuth';
import type { UserRole } from '../features/auth/model/user-schema';

// Сторінка лише для вказаних ролей; GA без керованої групи адміністративних сторінок не має.
// Бекенд перевіряє те саме - тут лише щоб не відкривати сторінку, яка покаже самі помилки.
export const RoleRoute: FC<PropsWithChildren<{ roles: UserRole[] }>> = ({ roles, children }) => {
  const { user } = useAuth();
  if (!user) return null;
  const allowed = roles.includes(user.role) && !(user.role === 'Admin' && !user.managedGroup);
  return allowed ? <>{children}</> : <Navigate to="/auctions" replace />;
};
