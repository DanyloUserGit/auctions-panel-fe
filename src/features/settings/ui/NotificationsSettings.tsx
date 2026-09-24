import { Security } from '@mui/icons-material';
import { Alert, Box, Paper, Stack, Typography } from '@mui/material';
import { Loader } from '../../../shared/ui/Loader';
import { Can } from '../../auth/ui/Can';
import type { NotificationChannel } from '../../notifications/model/types';
import {
  useMyAdminGroups,
  useNotificationsSettings,
  useUpdateNotificationsRequirements,
  useUpdateNotificationsSettings,
} from '../../notifications/model/useNotifications';
import NotificationsTable from '../../notifications/ui/NotificationsTable';

export default function NotificationsSettings() {
  const { data, isLoading } = useNotificationsSettings();
  const {
    mutate: updateGeneral,
    isError: isGeneralError,
    error: generalError,
  } = useUpdateNotificationsSettings();
  const {
    mutate: updateRequirements,
    isError: isRequirementsError,
  } = useUpdateNotificationsRequirements();

  // Групи, якими керує поточний користувач (Admin/SuperAdmin керує максимум
  // однією групою). Це НЕ те саме, що user.auctionGroupId - те поле означає
  // групу, у якій сам користувач є учасником, а не якою він адмініструє.
  const { data: managedGroups } = useMyAdminGroups();
  const groupId = managedGroups?.[0]?.id;

  const settings = data ?? [];

  const handleToggle = (
    id: string,
    field: 'isEnabled' | NotificationChannel | 'isMandatory',
  ) => {
    const currentItem = settings.find((s) => s.id === id);
    if (!currentItem) return;

    if (field === 'isMandatory') {
      if (!groupId) return;

      updateRequirements({
        id: groupId,
        data: {
          typeId: currentItem.notificationTypeId,
          isMandatory: !currentItem.isMandatory,
        },
      });
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

    updateGeneral({
      typeId: updatedItem.notificationTypeId,
      isEnabled: updatedItem.isEnabled,
      channels: updatedItem.channels,
      value: updatedItem.value!,
    });
  };

  const handleValueChange = (id: string, newValue: number) => {
    const currentItem = settings.find((s) => s.id === id);
    if (!currentItem || currentItem.value === newValue) return;

    updateGeneral({
      typeId: currentItem.notificationTypeId,
      isEnabled: currentItem.isEnabled,
      channels: currentItem.channels,
      value: newValue,
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

          {!groupId && (
            <Alert severity="info" sx={{ mt: 1.5, borderRadius: '8px' }}>
              Ви не є адміністратором жодної групи, тому позначки "Mandatory"
              недоступні для зміни.
            </Alert>
          )}
        </Paper>
      </Can>

      {(isGeneralError || isRequirementsError) && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }}>
          {(generalError as { response?: { data?: { message?: string } } })
            ?.response?.data?.message ??
            'Не вдалося зберегти зміни. Спробуйте ще раз.'}
        </Alert>
      )}

      <NotificationsTable
        settings={settings}
        handleToggle={handleToggle}
        handleValueChange={handleValueChange}
      />
    </Box>
  );
}