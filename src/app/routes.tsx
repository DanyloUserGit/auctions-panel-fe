import { useEffect } from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import LoginForm from '../features/auth/ui/LoginFrom';
import NotificationsList from '../features/notifications/ui/NotificationList';
import { useSession } from '../features/sessions/model/store';
import Auctions from '../pages/Auctions';
import Favorite from '../pages/Favorite';
import Home from '../pages/Home';
import Inventory from '../pages/Inventory';
import Orders from '../pages/Orders';
import Profile from '../pages/Profile';
import Purchases from '../pages/Purchases';
import ResetPassword from '../pages/ResetPassword';
import SessionPage from '../pages/SessionPage';
import Workers from '../pages/Workers';
import { useWindowSize } from '../shared/hooks/useWindowSize';
import { GuestRoute } from './GuestRoute';
import { ProtectedRoute } from './ProtectedRoute';

import Information from '../pages/Information';
import SettingsPage from '../pages/Settings';
import TrainingPage from '../pages/Training';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <Navigate to="/auctions" replace /> },
          { path: 'auctions', element: <Auctions /> },
          { path: 'favorites', element: <Favorite /> },
          { path: 'orders', element: <Orders /> },
          { path: 'purchases', element: <Purchases /> },
          { path: 'inventory', element: <Inventory /> },
          { path: 'me', element: <Profile /> },
          { path: 'workers', element: <Workers /> },
          { path: 'notifications/list', element: <NotificationsList /> },

          // {
          //   path: 'notifications',
          //   children: [
          //     { index: true, element: <NotificationsPage /> }, // Налаштування (ваша поточна сторінка)
          //     { path: 'list', element: <NotificationsList /> }, // Список сповіщень (інбокс)
          //   ]
          // },
          { path: 'learning', element: <TrainingPage /> },
          { path: 'info', element: <Information /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: (
      <GuestRoute>
        <LoginForm />
      </GuestRoute>
    ),
  },
  {
    path: '/session/:sessionId?',
    element: (
      <ProtectedRoute>
        <SessionPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/reset-password/:id',
    element: (
      <ProtectedRoute>
        <ResetPassword />
      </ProtectedRoute>
    ),
  },
]);

// src/app/routes.tsx
export default function AppRouter() {
  const { width, height } = useWindowSize();
  const setWidth = useSession((state) => state.setWidth);
  const setHeight = useSession((state) => state.setHeight);

  useEffect(() => {
    setWidth(width);
    setHeight(height);
  }, [width, height, setWidth, setHeight]);

  return <RouterProvider router={router} />;
}
