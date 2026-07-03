import { useEffect, useRef } from 'react';
import { useActiveSessions } from './useActiveSessions';
import { useConnectionStore } from './useConnectionStore';

export const useRestoreSessions = (userId?: string) => {
    const { connectToSession, disconnectAll } = useConnectionStore();
    const { items: activeSessions, isLoading } = useActiveSessions(!!userId);
    const previousUserId = useRef<string | undefined>(undefined);

    // Захист від витоку чужих з'єднань: якщо в цій вкладці відбувся
    // логаут/логін під іншим юзером без повного перезавантаження сторінки,
    // примусово закриваємо всі старі WebRTC-з'єднання перед відновленням нових.
    useEffect(() => {
        const prev = previousUserId.current;

        if (prev && prev !== userId) {
            disconnectAll();
        }

        previousUserId.current = userId;
    }, [userId, disconnectAll]);

    useEffect(() => {
        if (!userId || isLoading) return;

        activeSessions.forEach((session: any) => {
            connectToSession(
                session.id,
                userId,
                {
                    auctionId: session.auctionId,
                    auctionAuthId: session.auctionAuthId,
                    width: 1920,
                    height: 1080,
                },
                false
            );
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, isLoading, activeSessions]);
};