import { History } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseModal from '../../../shared/ui/Modal';
import { getErrorMessage } from '../../../shared/utils';
import { useControlCard, useUpdateUser } from '../../auth/model/useAuth';
import { statusLabel, type AccessStatus } from '../../auth/model/user-schema';
import UserStatusDialog from './UserStatusDialog';

interface WorkerControlModalProps {
  open: boolean;
  onClose: () => void;
  id: string;
  isLoading: boolean;
}

type AdminFields = {
  hasContract: boolean;
  contractNumber: string | null;
  depositAmount: number | null;
  depositMethod: string | null;
  adminComment: string | null;
  adminExtra: string | null;
};

type ControlCard = {
  profile: {
    id: string;
    firstName: string;
    middleName: string | null;
    lastName: string;
    fullName: string;
    email: string;
    phone: string | null;
    city: string | null;
    role: string;
    userGroup: { name: string } | null;
    managedGroup: { name: string } | null;
  };
  admin: AdminFields | null;
  status: { isActive: boolean; isBlocked: boolean; accessStatus: AccessStatus };
  activity: {
    lastLogin: string | null;
    lastActivity: string | null;
    lastSession: { id: string; auction: string; startedAt: string; endedAt?: string | null; status: 'active' | 'ended' | 'error' } | null;
  };
  limits: { sessionLimit: number; groupSessionLimit: number; globalSessionLimit: number };
  recentIncidents: { id: string; createdAt: string; message: string; session?: { auction: { title: string } } }[];
};

const time = (value?: string | null) => (value ? dayjs(value).format('DD.MM.YYYY HH:mm') : '-');
const limit = (value: number) => (value > 0 ? String(value) : 'без ліміту');
const SESSION_STATUS = { active: 'активна', ended: 'завершена', error: 'помилка' } as const;

const Section = ({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) => (
  <Paper variant="outlined" sx={{ p: 2, borderRadius: '12px', height: '100%' }}>
    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      {action}
    </Stack>
    {children}
  </Paper>
);

const Row = ({ label, value }: { label: string; value: ReactNode }) => (
  <Typography variant="body2" sx={{ mb: 0.5 }}>
    <Box component="span" sx={{ color: 'text.secondary' }}>
      {label}:
    </Box>{' '}
    {value || '-'}
  </Typography>
);


// Адмін-поля картки (договір, депозит, коментар): редагують SA і GA своєї групи.
function AdminFieldsSection({ userId, initial }: { userId: string; initial: AdminFields }) {
  const updateUser = useUpdateUser();
  const [admin, setAdmin] = useState<AdminFields>(initial);

  const saveAdmin = () =>
    updateUser.mutate({
      id: userId,
      data: { ...admin, depositAmount: admin.depositAmount === null ? null : Number(admin.depositAmount) },
    });

  return (
    <Section title="Адміністративні поля">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControlLabel
            control={<Checkbox checked={admin.hasContract} onChange={(e) => setAdmin({ ...admin, hasContract: e.target.checked })} />}
            label="Договір укладено"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 8 }}>
          <TextField fullWidth size="small" label="Номер договору" value={admin.contractNumber ?? ''} onChange={(e) => setAdmin({ ...admin, contractNumber: e.target.value })} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            size="small"
            type="number"
            label="Сума депозиту"
            value={admin.depositAmount ?? ''}
            onChange={(e) => setAdmin({ ...admin, depositAmount: e.target.value === '' ? null : Number(e.target.value) })}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 8 }}>
          <TextField fullWidth size="small" label="Спосіб внесення депозиту" value={admin.depositMethod ?? ''} onChange={(e) => setAdmin({ ...admin, depositMethod: e.target.value })} />
        </Grid>
        <Grid size={12}>
          <TextField fullWidth multiline minRows={2} size="small" label="Коментар" value={admin.adminComment ?? ''} onChange={(e) => setAdmin({ ...admin, adminComment: e.target.value })} />
        </Grid>
        <Grid size={12}>
          <TextField fullWidth multiline minRows={2} size="small" label="Додаткове поле" value={admin.adminExtra ?? ''} onChange={(e) => setAdmin({ ...admin, adminExtra: e.target.value })} />
        </Grid>
        {updateUser.isError && (
          <Grid size={12}>
            <Alert severity="error">{getErrorMessage(updateUser.error)}</Alert>
          </Grid>
        )}
        {updateUser.isSuccess && (
          <Grid size={12}>
            <Alert severity="success">Збережено</Alert>
          </Grid>
        )}
        <Grid size={12}>
          <Button variant="contained" onClick={saveAdmin} disabled={updateUser.isPending}>
            Зберегти адмін-поля
          </Button>
        </Grid>
      </Grid>
    </Section>
  );
}

// Картка контролю користувача (ТЗ 11).
export const WorkerControlModal = ({ open, onClose, id }: WorkerControlModalProps) => {
  const navigate = useNavigate();
  const { userData, isLoading } = useControlCard(String(id));
  const data = userData as ControlCard | undefined;
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  if (!id && open) onClose();

  const goToLog = () => {
    onClose();
    navigate(`/logs?userId=${id}`);
  };


  return (
    <BaseModal open={open} onClose={onClose} title="Картка контролю працівника" maxWidth="md">
      {isLoading || !data ? (
        <Skeleton variant="rounded" height={320} />
      ) : (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Section title="Дані">
              <Row label="ПІБ" value={data.profile.fullName} />
              <Row label="Email" value={data.profile.email} />
              <Row label="Місто" value={data.profile.city} />
              <Row label="Телефон" value={data.profile.phone} />
              <Row label="Роль" value={data.profile.role} />
              <Row label="Група" value={data.profile.managedGroup?.name ?? data.profile.userGroup?.name} />
            </Section>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Section
              title="Активність"
              action={
                <Button size="small" startIcon={<History />} onClick={goToLog}>
                  Перейти в лог
                </Button>
              }
            >
              <Row label="Останній вхід" value={time(data.activity.lastLogin)} />
              <Row label="Остання активність" value={time(data.activity.lastActivity)} />
              <Row
                label="Остання сесія"
                value={
                  data.activity.lastSession
                    ? `${data.activity.lastSession.auction}, ${time(data.activity.lastSession.startedAt)}, ${SESSION_STATUS[data.activity.lastSession.status]}`
                    : null
                }
              />
            </Section>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Section
              title="Статус і ліміти"
              action={
                data.admin && (
                  <Button size="small" variant="outlined" onClick={() => setIsStatusOpen(true)}>
                    Змінити статус
                  </Button>
                )
              }
            >
              <Stack direction="row" spacing={1} mb={1}>
                <Chip size="small" color={data.status.isBlocked ? 'error' : 'success'} label={statusLabel(data.status)} />
              </Stack>
              <Row label="Особистий ліміт сесій" value={limit(data.limits.sessionLimit)} />
              <Row label="Ліміт групи" value={limit(data.limits.groupSessionLimit)} />
              <Row label="Загальний ліміт системи" value={limit(data.limits.globalSessionLimit)} />
            </Section>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Section title="Останні 10 інцидентів">
              {data.recentIncidents.length ? (
                <Stack spacing={1} divider={<Divider flexItem />}>
                  {data.recentIncidents.map((incident) => (
                    <Box key={incident.id}>
                      <Typography variant="caption" color="text.secondary">
                        {time(incident.createdAt)} · {incident.session?.auction.title}
                      </Typography>
                      <Typography variant="body2">{incident.message}</Typography>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Інцидентів немає
                </Typography>
              )}
            </Section>
          </Grid>

          {data.admin && (
            <Grid size={12}>
              <AdminFieldsSection key={JSON.stringify(data.admin)} userId={id} initial={data.admin} />
            </Grid>
          )}
        </Grid>
      )}

      {isStatusOpen && data && (
        <UserStatusDialog
          user={{
            id: data.profile.id,
            firstName: data.profile.firstName,
            lastName: data.profile.lastName,
            accessStatus: data.status.accessStatus,
            isBlocked: data.status.isBlocked,
          }}
          onClose={() => setIsStatusOpen(false)}
        />
      )}
    </BaseModal>
  );
};
