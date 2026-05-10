import { Box } from '@mui/material';
import { Close } from '@mui/icons-material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../shared/ui/Sidebar';
import { useEffect, useRef } from 'react';
import {
  connectNotificationSocket,
  disconnectNotificationSocket,
  subscribeToGlobalNotifications,
} from '../features/sessions/model/sockets';
import { useQueryClient } from '@tanstack/react-query';
import { useNotificationToast } from '../features/notifications/model/useNotificationToast';
import { Notification } from '../features/notifications/ui/Notification';
import { useAuth } from '../features/auth/model/useAuth';
import { useConnectionStore } from '../features/sessions/model/useConnectionStore';

const RESTORE_KEY = 'active_auction_sessions';

export const saveSessionToStorage = (sessionData: any) => {
  const existing = JSON.parse(localStorage.getItem(RESTORE_KEY) || '[]');
  const isExists = existing.some((s: any) => s.sessionId === sessionData.sessionId);
  if (!isExists) {
    localStorage.setItem(RESTORE_KEY, JSON.stringify([...existing, sessionData]));
  }
};

export const removeSessionFromStorage = (sessionId: string) => {
  const existing = JSON.parse(localStorage.getItem(RESTORE_KEY) || '[]');
  localStorage.setItem(RESTORE_KEY, JSON.stringify(existing.filter((s: any) => s.sessionId !== sessionId)));
};

// 2. У твоєму головному компоненті відновлюємо сесії:
export const useRestoreSessions = (userId?: string) => {
  const { connectToSession } = useConnectionStore();

  useEffect(() => {
    if (!userId) return; // Чекаємо на завантаження профілю юзера

    const savedSessions = JSON.parse(localStorage.getItem(RESTORE_KEY) || '[]');

    savedSessions.forEach((sessionInfo: any) => {
      connectToSession(
        sessionInfo.sessionId,
        userId,
        { auctionId: sessionInfo.auctionId, auctionAuthId: sessionInfo.auctionAuthId, width: 1920, height: 1080 },
        false
      );
    });
  }, [userId]);
}

export default function Home() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification, isOpen, closeNotification, message } = useNotificationToast();

  const { user } = useAuth();
  const userId = user?.id;

  const {
    connections,
    disconnectFromSession,
  } = useConnectionStore();
  const activeSessionsCount = Object.keys(connections).length;

  useRestoreSessions(userId);

  useEffect(() => {
    if (!userId) return;
    connectNotificationSocket(userId);
    const unsubscribe = subscribeToGlobalNotifications({
      onReceived: (data) => {
        showNotification(data.message);
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      },
      onError: (err) => console.error('Socket error:', err.message),
    });
    return () => {
      unsubscribe();
      disconnectNotificationSocket();
    };
  }, [showNotification, queryClient, userId]);


  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          pt: { xs: 8, sm: 0 },
        }}
      >
        {/* Панель фонових сесій */}
        {activeSessionsCount > 0 && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              overflowX: 'auto',
              px: { xs: 2, sm: 3 },
              py: 1.5,
              borderBottom: '1px solid',
              borderColor: 'grey.300',
              bgcolor: 'grey.50',
              mb: 2,
            }}
          >
            <Box sx={{ fontSize: '14px', color: 'text.secondary', fontWeight: 500, whiteSpace: 'nowrap' }}>
              Фонові трансляції:
            </Box>

            {Object.entries(connections).map(([connectionKey, conn], index) => {
              const isPending = connectionKey.startsWith('pending_');
              const tabLabel = isPending ? 'Підключення...' : `Сесія ${index + 1}`;

              return (
                <Box key={connectionKey} sx={{ display: 'flex', gap: 1 }}>
                  {/* Кнопка-вкладка */}
                  <Box
                    onClick={() => {
                      if (!isPending) navigate(`/session/${connectionKey}`);
                    }}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: 'grey.300',
                      bgcolor: 'background.paper',
                      '&:hover': { bgcolor: 'grey.200' },
                      userSelect: 'none',
                    }}
                  >
                    <Box sx={{ fontSize: '14px', fontWeight: 500, color: 'text.primary' }}>
                      {tabLabel}
                    </Box>
                    <Box
                      onClick={(e) => {
                        e.stopPropagation();
                        disconnectFromSession(connectionKey);
                      }}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        p: 0.25,
                        '&:hover': { bgcolor: 'grey.300' },
                      }}
                    >
                      <Close sx={{ width: '16px', height: '16px', color: 'text.secondary' }} />
                    </Box>
                  </Box>

                  {/* Рендеримо приховане відео ТІЛЬКИ якщо потік існує і ми НЕ дивимось цю сесію зараз */}
                  {/* {conn.stream && !isCurrentlyViewing && (
                    <HiddenVideo stream={conn.stream} />
                  )} */}
                </Box>
              );
            })}
          </Box>
        )}

        <Box sx={{ pl: { xs: 0, sm: 2 }, pr: 2, flexGrow: 1 }}>
          <Outlet />
        </Box>
      </Box>

      <Notification isOpen={isOpen} message={message} close={closeNotification} />
    </Box>
  );
}