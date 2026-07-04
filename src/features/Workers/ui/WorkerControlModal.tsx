import {
  AccessTime,
  Block,
  CheckCircle,
  Email,
  History,
  Security,
  Smartphone,
  Groups as GroupsIcon,
  SettingsApplications,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import BaseModal from '../../../shared/ui/Modal';
import { useControlCard } from '../../auth/model/useAuth';

interface WorkerControlModalProps {
  open: boolean;
  onClose: () => void;
  id: string;
  isLoading: boolean;
}

export const WorkerControlModal = ({
  open,
  onClose,
  id,
  isLoading,
}: WorkerControlModalProps) => {
  if (!id && open) onClose();

  const { userData: data } = useControlCard(String(id));

  const role = data?.profile?.role;
  const isSA = role === 'SuperAdmin';
  const isAdmin = role === 'Admin';
  const isUser = role === 'User';

  const showAuctionGroup = isUser || isSA;
  const showManagedGroup = isAdmin;

  const renderSkeleton = () => (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 5 }}>
        <Skeleton
          variant="rounded"
          height={280}
          sx={{ borderRadius: '15px' }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 7 }}>
        <Skeleton
          variant="rounded"
          height={280}
          sx={{ borderRadius: '15px' }}
        />
      </Grid>
    </Grid>
  );

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Картка контролю працівника"
      maxWidth="md"
    >
      {isLoading ? (
        renderSkeleton()
      ) : data ? (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: '15px',
                textAlign: 'center',
                height: '100%',
                bgcolor: '#fafafa',
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: isSA ? 'secondary.main' : 'primary.main',
                  fontSize: '2rem',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                }}
              >
                {data.profile.fullName?.[0] || '?'}
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {data.profile.fullName}
              </Typography>
              <Chip
                label={role}
                size="small"
                color={isSA ? 'secondary' : 'primary'}
                variant="filled"
                sx={{ mt: 1, fontWeight: 600 }}
              />

              <Box sx={{ mt: 4, textAlign: 'left' }}>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Email color="action" sx={{ fontSize: 18 }} />
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary' }}
                    >
                      {data.profile.email}
                    </Typography>
                  </Stack>

                  {showAuctionGroup && (
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <GroupsIcon color="action" sx={{ fontSize: 18 }} />
                      <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary' }}
                      >
                        <strong>Група аукціонів:</strong>{' '}
                        {data.profile.auctionGroup?.title || 'Немає'}
                      </Typography>
                    </Stack>
                  )}

                  {showManagedGroup && (
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <SettingsApplications
                        color="action"
                        sx={{ fontSize: 18 }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary' }}
                      >
                        <strong>Адмін групи:</strong>{' '}
                        {data.profile.managedGroup?.title || 'Не призначено'}
                      </Typography>
                    </Stack>
                  )}

                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Smartphone color="action" sx={{ fontSize: 18 }} />
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary' }}
                    >
                      {data.profile.phone || 'Не вказано'}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={2} sx={{ height: '100%' }}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  borderRadius: '15px',
                  borderLeft: '4px solid',
                  borderLeftColor: data.status.isActive
                    ? 'success.main'
                    : 'error.main',
                }}
              >
                <Typography
                  variant="overline"
                  color="text.secondary"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontWeight: 700,
                  }}
                >
                  <Security sx={{ fontSize: 16 }} /> Безпека та статус
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, my: 1.5 }}>
                  <Chip
                    icon={data.status.isActive ? <CheckCircle /> : <Block />}
                    label={data.status.isActive ? 'Активний' : 'Деактивований'}
                    color={data.status.isActive ? 'success' : 'default'}
                    size="small"
                  />
                  {data.status.isBlocked && (
                    <Chip label="Заблокований" color="error" size="small" />
                  )}
                </Box>
                <Typography variant="body2">
                  <strong>Права:</strong> {data.status.rights}
                </Typography>
                <Typography variant="body2">
                  <strong>Максимально сесій:</strong> {data.limits.sessionLimit}
                </Typography>
              </Paper>

              <Paper
                variant="outlined"
                sx={{ p: 2.5, borderRadius: '15px', flexGrow: 1 }}
              >
                <Typography
                  variant="overline"
                  color="text.secondary"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  <History sx={{ fontSize: 16 }} /> Останні події
                </Typography>
                <List dense disablePadding>
                  {data.recentEvents?.length > 0 ? (
                    data.recentEvents
                      .slice(0, 4)
                      .map(
                        (event: {
                          id: string;
                          action: string;
                          createdAt: string;
                        }) => (
                          <ListItem key={event.id} sx={{ px: 0, py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                              <AccessTime sx={{ fontSize: 14 }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                event.action || `ID: ${event.id.slice(0, 8)}`
                              }
                              secondary={new Date(
                                event.createdAt,
                              ).toLocaleString('uk-UA')}
                              primaryTypographyProps={{
                                variant: 'caption',
                                fontWeight: 700,
                              }}
                              secondaryTypographyProps={{ variant: 'caption' }}
                            />
                          </ListItem>
                        ),
                      )
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      Події відсутні
                    </Typography>
                  )}
                </List>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      ) : (
        <Box sx={{ py: 5, textAlign: 'center' }}>
          <Typography color="text.secondary">Інформація недоступна</Typography>
        </Box>
      )}
    </BaseModal>
  );
};
