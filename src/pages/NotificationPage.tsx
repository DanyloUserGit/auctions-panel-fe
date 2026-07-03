import { ArrowBack, NotificationsNone } from '@mui/icons-material';
import {
  Box,
  IconButton,
  List,
  Pagination,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useNotifications } from '../features/notifications/model/useNotifications';
import NotificationItem from '../features/notifications/ui/NotificationItem';
import { Loader } from '../shared/ui/Loader';

export default function NotificationsPage() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [limit] = useState('20');

  const {
    data: response,
    isLoading,
    isFetching,
  } = useNotifications(page.toString(), limit);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) return <Loader />;

  const notifications = response?.data || [];
  const isEmpty = notifications.length === 0;

  const totalPages = response?.total
    ? Math.ceil(response.total / Number(limit))
    : 0;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{ bgcolor: 'action.hover' }}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" fontWeight={700}>
          Сповіщення
        </Typography>
      </Stack>

      <Paper
        sx={{
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          position: 'relative',
          opacity: isFetching ? 0.7 : 1,
          transition: 'opacity 0.2s',
        }}
      >
        {isEmpty ? (
          <Box sx={{ py: 10, textAlign: 'center' }}>
            <NotificationsNone
              sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }}
            />
            <Typography color="text.secondary">
              У вас поки немає сповіщень
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {notifications.map((item) => (
              <NotificationItem key={item.id} item={item} />
            ))}
          </List>
        )}
      </Paper>

      {totalPages > 1 && (
        <Stack direction="row" justifyContent="center" sx={{ mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            disabled={isFetching}
          />
        </Stack>
      )}
    </Box>
  );
}