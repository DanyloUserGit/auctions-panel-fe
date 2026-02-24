import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import LoginFrom from '../components/ui/LoginFrom';
import Auctions from '../pages/Auctions';
import Favorite from '../pages/Favorite';
import Home from '../pages/Home';
import Inventory from '../pages/Inventory';
import Orders from '../pages/Orders';
import Purchases from '../pages/Purchases';


const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginFrom />,
    },
    {
        path: '/',
        element: <Home />,
        children: [
            { index: true, element: <Navigate to="/auctions" replace /> },
            { path: 'auctions', element: <Auctions /> },
            { path: 'favorites', element: <Favorite /> },
            { path: 'orders', element: <Orders /> },
            { path: 'purchases', element: <Purchases /> },
            { path: 'inventory', element: <Inventory /> },
        ],
    },
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}