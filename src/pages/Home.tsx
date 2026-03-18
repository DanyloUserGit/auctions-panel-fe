import { Box } from '@mui/material';
import { Outlet } from 'react-router';
import Sidebar from '../shared/ui/Sidebar';
import { useEffect } from 'react';
import {
  connectNotificationSocket,
  disconnectNotificationSocket,
  subscribeToGlobalNotifications,
} from '../features/sessions/model/sockets';
import { useQueryClient } from '@tanstack/react-query';
import { useNotificationToast } from '../features/notifications/model/useNotificationToast';
import { Notification } from '../features/notifications/ui/Notification';
import { useAuth } from '../features/auth/model/useAuth';

export default function Home() {
  const queryClient = useQueryClient();
  const { showNotification, isOpen, closeNotification, message } =
    useNotificationToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    connectNotificationSocket(user.id);

    const unsubscribe = subscribeToGlobalNotifications({
      onReceived: (data) => {
        console.log('Отримано сповіщення:', data);

        showNotification(data.message);

        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      },

      onError: (err) => console.error('Socket error:', err.message),
    });

    return () => {
      unsubscribe();

      disconnectNotificationSocket();
    };
  }, [showNotification, queryClient, user]);
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
        }}
      >
        {/* <Tabs /> */}

        <Box sx={{ p: 2, flexGrow: 1 }}>
          <Outlet />
        </Box>
      </Box>
      <Notification
        isOpen={isOpen}
        message={message}
        close={closeNotification}
      />
    </Box>
  );
}
