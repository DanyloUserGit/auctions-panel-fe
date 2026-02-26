import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import LoginForm from '../components/ui/LoginFrom';
import Auctions from '../pages/Auctions';
import Favorite from '../pages/Favorite';
import Home from '../pages/Home';
import Inventory from '../pages/Inventory';
import Orders from '../pages/Orders';
import Purchases from '../pages/Purchases';
import { GuestRoute } from './GuestRoute';



const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    children: [
      {
        // element: <ProtectedRoute />,
        children: [
          { index: true, element: <Navigate to="/auctions" replace /> },
          { path: 'auctions', element: <Auctions /> },
          { path: 'favorites', element: <Favorite /> },
          { path: 'orders', element: <Orders /> },
          { path: 'purchases', element: <Purchases /> },
          { path: 'inventory', element: <Inventory /> },
        ],
      },
    ],

  },
  {
    path: "/login",
    element: (
      <GuestRoute>
        <LoginForm />
      </GuestRoute>
    ),
  },
]);




export default function AppRouter() {
  return <RouterProvider router={router} />;
}