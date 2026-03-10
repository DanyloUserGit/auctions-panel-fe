import { useEffect } from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import LoginForm from '../features/auth/ui/LoginFrom';
import { useSession } from '../features/sessions/model/store';
import Auctions from '../pages/Auctions';
import Favorite from '../pages/Favorite';
import Home from '../pages/Home';
import Inventory from '../pages/Inventory';
import Orders from '../pages/Orders';
import Purchases from '../pages/Purchases';
import SessionPage from '../pages/SessionPage';
import { useWindowSize } from '../shared/hooks/useWindowSize';
import { GuestRoute } from './GuestRoute';
import { ProtectedRoute } from './ProtectedRoute';
import ResetPassword from '../pages/ResetPassword';
import Profile from '../pages/Profile';
import Workers from '../pages/Workers';
import NotificationsPage from '../pages/Notification';
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
          { path: 'notifications', element: <NotificationsPage /> },
          { path: 'learning', element: <TrainingPage /> },
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
