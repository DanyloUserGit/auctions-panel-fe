import type { FC, PropsWithChildren } from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../features/auth/model/useAuth';
import { useSessionTabs } from '../features/sessions/model/useSessionTabs';

export const ProtectedRoute: FC<PropsWithChildren> = ({ children }) => {
  const { user, isLoading } = useAuth();
  // Вкладки трансляцій відновлюються для будь-якої захищеної сторінки (панель або вкладка).
  useSessionTabs(user?.id);

  // Повторна перевірка користувача у фоні не демонтує сторінку (і трансляції на ній).
  if (isLoading && !user) {
    return null;
  }

  if (!user) {
    return <Navigate to={'/login'} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
