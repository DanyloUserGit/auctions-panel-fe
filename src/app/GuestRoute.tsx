import type { FC, PropsWithChildren } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router';

export const GuestRoute: FC<PropsWithChildren> = ({ children }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return null;
    }

    if (user) {
        return <Navigate to={"/"} replace />;
    }

    return children;
};