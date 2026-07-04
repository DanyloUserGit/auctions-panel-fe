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
import InStock from '../pages/in-stock/InStock';
import NotificationsPage from '../pages/NotificationPage';
import Orders from '../pages/orders/Orders';
import Profile from '../pages/Profile';
import Purchases from '../pages/purchases/Purchases';
import ResetPassword from '../pages/ResetPassword';
import SessionPage from '../pages/SessionPage';
import Workers from '../pages/Workers';
import { useWindowSize } from '../shared/hooks/useWindowSize';
import { GuestRoute } from './GuestRoute';
import { ProtectedRoute } from './ProtectedRoute';

import AllActionsPage from '../pages/AllActions';
import Analytics from '../pages/analitics/ui/Analytics';
import BalancesPage from '../pages/balance/BalancePage';
import CalculationPage from '../pages/calculation/CalculationPage';
import Information from '../pages/Information';
import PageNotFound from '../pages/PageNotFound';
import { Processes } from '../pages/processes/Processes';
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
          { path: 'inventory', element: <InStock /> },
          { path: 'me', element: <Profile /> },
          { path: 'workers', element: <Workers /> },
          { path: 'notifications/list', element: <NotificationsPage /> },
          { path: 'learning', element: <TrainingPage /> },
          { path: 'info', element: <Information /> },
          { path: 'logs', element: <AllActionsPage /> },
          { path: 'settings', element: <SettingsPage /> },
          { path: 'accounting', element: <CalculationPage /> },
          { path: 'balances', element: <BalancesPage /> },
          { path: 'processes', element: <Processes /> },
          { path: 'analytics', element: <Analytics /> },
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
  {
    path: '*',
    element: (
      <ProtectedRoute>
        <PageNotFound />
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
