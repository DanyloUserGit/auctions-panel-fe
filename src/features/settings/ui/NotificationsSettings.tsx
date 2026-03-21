import { Security } from '@mui/icons-material';
import { Alert, Box, Paper, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { Loader } from '../../../shared/ui/Loader';
import { useAuth } from '../../auth/model/useAuth';
import { Can } from '../../auth/ui/Can';
import type {
  NotificationChannel,
  NotificationSetting,
} from '../../notifications/model/types';
import {
  useNotificationsSettings,
  useUpdateNotificationsRequirements,
  useUpdateNotificationsSettings,
} from '../../notifications/model/useNotifications';
import NotificationsTable from '../../notifications/ui/NotificationsTable';

export default function NotificationsSettings() {
  const { data, isLoading } = useNotificationsSettings();
  const { mutate: updateGeneral } = useUpdateNotificationsSettings();
  const { user } = useAuth();
  const groupId = user?.auctionGroupId;

  const { mutate: updateRequirements } = useUpdateNotificationsRequirements();

  const [settings, setSettings] = useState<NotificationSetting[]>([]);

  if (settings.length === 0 && data && Array.isArray(data)) {
    setSettings(data);
  }

  const handleToggle = (
    id: string,
    field: 'isEnabled' | NotificationChannel | 'isMandatory',
  ) => {
    const currentItem = settings.find((s) => s.id === id);
    if (!currentItem) return;
    const updatedItem = { ...currentItem };

    if (field === 'isMandatory') {
      const newValue = !currentItem.isMandatory;
      setSettings((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isMandatory: newValue } : s)),
      )

      updateRequirements({
        id: groupId ? groupId : '',
        data: {
          typeId: currentItem.notificationTypeId,
          isMandatory: newValue,
        },
      });
      return;
    }
    if (field === 'isEnabled') {
      updatedItem[field] = !currentItem[field];
    } else {
      const currentChannels = currentItem.channels || [];
      updatedItem.channels = currentChannels.includes(field)
        ? currentChannels.filter((c) => c !== field)
        : [...currentChannels, field];
    }

    setSettings((prev) => prev.map((s) => (s.id === id ? updatedItem : s)));

    updateGeneral({
      typeId: updatedItem.notificationTypeId,
      isEnabled: updatedItem.isEnabled,
      channels: updatedItem.channels,
    });
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
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Сповіщення
            </Typography>
          </Stack>
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
          <Typography variant="caption" display="block" sx={{ mb: 2 }}>
            Позначте сповіщення як <b>обов'язкові</b>, щоб користувачі групи не
            могли їх вимкнути.
          </Typography>
        </Paper>
      </Can>

      <NotificationsTable settings={settings} handleToggle={handleToggle} />

      <Alert severity="info" sx={{ mt: 3, borderRadius: '10px' }}>
        Для активації Telegram-сповіщень необхідно підключити бота{' '}
        <b>@AuctionMasterBot</b> у вашому профілі.
      </Alert>
    </Box>
  );
}
