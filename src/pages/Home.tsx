import { Close } from '@mui/icons-material';
import { Box } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/model/useAuth';
import { useNotificationToast } from '../features/notifications/model/useNotificationToast';
import { Notification } from '../features/notifications/ui/Notification';
import {
  connectNotificationSocket,
  disconnectNotificationSocket,
  subscribeToGlobalNotifications,
} from '../features/sessions/model/sockets';
import { activeSessionsKeys } from '../features/sessions/model/useActiveSessions';
import { useConnectionStore } from '../features/sessions/model/useConnectionStore';
import { useRestoreSessions } from '../features/sessions/model/useRestoreSessions';
import Sidebar from '../shared/ui/Sidebar';

export default function Home() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
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
      {user && <Sidebar user={user} />}
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

            {Object.entries(connections).map(([connectionKey, _], index) => {
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
                        disconnectFromSession(connectionKey, user?.id!);
                        queryClient.setQueryData(activeSessionsKeys.all, (old: any[] = []) =>
                          old.filter((s) => s.id !== connectionKey)
                        );
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