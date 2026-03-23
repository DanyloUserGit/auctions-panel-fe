import { Security } from '@mui/icons-material';
import { Box, Paper, Stack, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Loader } from '../../../shared/ui/Loader';
import { useAuth } from '../../auth/model/useAuth';
import { Can } from '../../auth/ui/Can';
import type { NotificationChannel } from '../../notifications/model/types';
import {
  useNotificationsSettings,
  useUpdateNotificationsRequirements,
  useUpdateNotificationsSettings,
} from '../../notifications/model/useNotifications';
import NotificationsTable from '../../notifications/ui/NotificationsTable';

export default function NotificationsSettings() {
  const { data, isLoading } = useNotificationsSettings();
  const { mutate: updateGeneral } = useUpdateNotificationsSettings();
  const { mutate: updateRequirements } = useUpdateNotificationsRequirements();

  const { user } = useAuth();
  const groupId = user?.auctionGroupId;

  const queryClient = useQueryClient();

  const settings = data ?? [];

  const handleToggle = (
    id: string,
    field: 'isEnabled' | NotificationChannel | 'isMandatory',
  ) => {
    const currentItem = settings.find((s) => s.id === id);
    if (!currentItem) return;

    if (field === 'isMandatory') {
      const newValue = !currentItem.isMandatory;

      updateRequirements(
        {
          id: groupId || '',
          data: {
            typeId: currentItem.notificationTypeId,
            isMandatory: newValue,
          },
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ['notifications_settings'],
            });
          },
        },
      );

      return;
    }

    const updatedItem = { ...currentItem };

    if (field === 'isEnabled') {
      updatedItem.isEnabled = !currentItem.isEnabled;
    } else {
      const channels = currentItem.channels || [];
      updatedItem.channels = channels.includes(field)
        ? channels.filter((c) => c !== field)
        : [...channels, field];
    }

    updateGeneral(
      {
        typeId: updatedItem.notificationTypeId,
        isEnabled: updatedItem.isEnabled,
        channels: updatedItem.channels,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['notifications_settings'],
          });
        },
      },
    );
  };

  if (isLoading) return <Loader />;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, mx: 'auto' }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Сповіщення
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Керуйте тим, як і де ви отримуєте інформацію про активність в
            аукціонах.
          </Typography>
        </Box>
      </Stack>

      <Can roles={['Admin', 'SuperAdmin']}>
        <Paper
          sx={{
            p: 2,
            mb: 4,
            bgcolor: 'rgba(25, 118, 210, 0.05)',
            border: '1px dashed #1976d2',
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Security color="primary" fontSize="small" />
            <Typography
              variant="subtitle2"
              color="primary.main"
              sx={{ fontWeight: 700 }}
            >
              Адміністрування групи
            </Typography>
          </Stack>
          <Typography variant="caption" display="block">
            Позначте сповіщення як <b>обов'язкові</b>, щоб користувачі групи не
            могли їх вимкнути.
          </Typography>
        </Paper>
      </Can>

      <NotificationsTable settings={settings} handleToggle={handleToggle} />
    </Box>
  );
}
