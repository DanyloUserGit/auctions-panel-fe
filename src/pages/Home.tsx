import { Box } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/model/useAuth';
import { useNotificationToast } from '../features/notifications/model/useNotificationToast';
import { Notification } from '../features/notifications/ui/Notification';
import {
  connectNotificationSocket,
  disconnectNotificationSocket,
  subscribeToGlobalNotifications,
} from '../features/sessions/model/sockets';
import { useTabsStore } from '../features/sessions/model/tabs';
import SessionTabsBar from '../features/sessions/ui/SessionTabsBar';
import Sidebar from '../shared/ui/Sidebar';

export default function Home() {
  const queryClient = useQueryClient();
  const { showNotification, isOpen, closeNotification, message } = useNotificationToast();

  const { user } = useAuth();
  const userId = user?.id;

  const hasTabs = useTabsStore((state) => state.order.length > 0);

  useEffect(() => {
    if (!userId) return;
    connectNotificationSocket();
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
        {/* Рядок вкладок трансляцій: вкладки лишаються відкритими, поки користувач у панелі */}
        {hasTabs && <SessionTabsBar />}

        <Box sx={{ pl: { xs: 0, sm: 2 }, pr: 2, flexGrow: 1 }}>
          <Outlet />
        </Box>
      </Box>

      <Notification isOpen={isOpen} message={message} close={closeNotification} />
    </Box>
  );
}