import {
  AccessTime,
  Badge,
  Block,
  CheckCircle,
  Email,
  History,
  Security,
  Smartphone,
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
import { useEffect } from 'react';

interface WorkerControlModalProps {
  open: boolean;
  onClose: () => void;
  id: string;
  isLoading: boolean;
}

<<<<<<< HEAD
export const WorkerControlModal = ({ open, onClose, id, isLoading }: WorkerControlModalProps) => {
    if (!id) onClose()
    const { userData: data } = useControlCard(String(id));
    useEffect(() => { console.log(data) }, [data])
=======
export const WorkerControlModal = ({
  open,
  onClose,
  id,
  isLoading,
}: WorkerControlModalProps) => {
  if (!id) onClose();
  const { userData: data } = useControlCard(String(id));
>>>>>>> 35b9de295eaeafde65b69e1c187f3fcfbac357fa

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
          {/* Секція 1: Профіль (Використовуємо size) */}
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
                  bgcolor: 'primary.main',
                  fontSize: '2rem',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                }}
              >
                {data.profile.fullName[0]}
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {data.profile.fullName}
              </Typography>
              <Chip
                label={data.profile.role}
                size="small"
                color="primary"
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
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Badge color="action" sx={{ fontSize: 18 }} />
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary' }}
                    >
                      {data.profile.group}
                    </Typography>
                  </Stack>
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

          {/* Секція 2: Статус та Логи (Використовуємо size) */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={2} sx={{ height: '100%' }}>
              {/* Блок доступу */}
              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  borderRadius: '15px',
                  borderLeft: '4px solid',
                  borderLeftColor: data.status.isActive
                    ? 'success.main'
                    : 'warning.main',
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
                  <Security sx={{ fontSize: 16 }} /> Безпека та доступ
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
                  <strong>Макс. сесій:</strong> {data.limits.sessionLimit}
                </Typography>
              </Paper>

              {/* Блок активності */}
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
                  {data.recentEvents
                    .slice(0, 3)
                    .map((event: { id: string; createdAt: Date }) => (
                      <ListItem key={event.id} sx={{ px: 0, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <AccessTime sx={{ fontSize: 14 }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Подія: ${event.id.slice(0, 8)}`}
                          secondary={new Date(event.createdAt).toLocaleString(
                            'uk-UA',
                          )}
                          primaryTypographyProps={{
                            variant: 'caption',
                            fontWeight: 700,
                          }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                    ))}
                </List>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      ) : (
        <Box sx={{ py: 5, textAlign: 'center' }}>
          <Typography color="text.secondary">
            Дані працівника не знайдено
          </Typography>
        </Box>
      )}
    </BaseModal>
  );
};
