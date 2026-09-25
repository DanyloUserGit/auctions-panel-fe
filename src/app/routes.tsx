import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import LoginForm from '../features/auth/ui/LoginForm';
import Auctions from '../pages/Auctions';
import Favorite from '../pages/Favorite';
import Home from '../pages/Home';
import InStock from '../pages/in-stock/InStock';
import NotificationsPage from '../pages/NotificationPage';
import Orders from '../pages/orders/Orders';
import ClientsPage from '../pages/clients/Clients';
import Profile from '../pages/Profile';
import Purchases from '../pages/purchases/Purchases';
import ResetPassword from '../pages/ResetPassword';
import SessionPage from '../pages/SessionPage';
import Workers from '../pages/Workers';
import { GuestRoute } from './GuestRoute';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';

const ADMINS: ('Admin' | 'SuperAdmin')[] = ['Admin', 'SuperAdmin'];

import AllActionsPage from '../pages/AllActions';
import Analytics from '../pages/analytics/ui/Analytics';
import BalancesPage from '../pages/balance/BalancePage';
import CalculationPage from '../pages/calculation/CalculationPage';
import Information from '../pages/Information';
import PageNotFound from '../pages/PageNotFound';
import { Processes } from '../pages/processes/Processes';
import SettingsPage from '../pages/Settings';
import TrainingPage from '../pages/Training';
import UserGroups from '../pages/UserGroups';

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
          { path: 'clients', element: <ClientsPage /> },
          { path: 'purchases', element: <Purchases /> },
          { path: 'inventory', element: <InStock /> },
          { path: 'me', element: <Profile /> },
          { path: 'workers', element: <RoleRoute roles={ADMINS}><Workers /></RoleRoute> },
          { path: 'user-groups', element: <RoleRoute roles={ADMINS}><UserGroups /></RoleRoute> },
          { path: 'notifications/list', element: <NotificationsPage /> },
          { path: 'learning', element: <TrainingPage /> },
          { path: 'info', element: <Information /> },
          { path: 'logs', element: <RoleRoute roles={ADMINS}><AllActionsPage /></RoleRoute> },
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
    path: '/session/:accountId',
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
  return <RouterProvider router={router} />;
}
