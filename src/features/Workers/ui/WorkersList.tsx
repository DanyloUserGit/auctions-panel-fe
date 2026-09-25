import { Assessment, History } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Chip,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  type ChipProps,
} from '@mui/material';
import { statusLabel, type User, type UserRole } from '../../auth/model/user-schema';
import { UserActionsMenu } from './UserActionsMenu';
const time = (value?: string | Date | null) => (value ? dayjs(value).format('DD.MM.YYYY HH:mm') : '-');

const SESSION_STATUS = { active: 'активна', ended: 'завершена', error: 'помилка' } as const;

const roleColors: Record<UserRole, ChipProps['color']> = {
  SuperAdmin: 'error',
  Admin: 'primary',
  User: 'default',
};
interface Props {
  users: User[];
  handleChangeWorker: (id: string) => void;
  OpenEditUser: () => void;
  OpenControlCard: () => void;
  OpenUserAccess: () => void;
}
export default function WorkersList({
  users,
  handleChangeWorker,
  OpenControlCard,
  OpenEditUser,
  OpenUserAccess,
}: Props) {
  const navigate = useNavigate();
  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: '15px',
        overflow: 'scroll',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      }}
    >
      <Table>
        <TableHead sx={{ bgcolor: '#f8fafc' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Користувач</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Роль</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Статус</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Останній вхід / активність</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Остання сесія</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700 }}>
              Дії
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users && users?.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600 }}
                    >{`${user.firstName} ${user.lastName}`}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    size="small"
                    color={roleColors[user.role] || 'default'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={statusLabel(user)}
                    size="small"
                    sx={{
                      bgcolor: user.isBlocked ? '#ffebee' : '#e1f5fe',
                      color: user.isBlocked ? '#b71c1c' : '#01579b',
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{time(user.lastLogin)}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    активність: {time(user.lastActivity)}
                  </Typography>
                </TableCell>
                <TableCell>
                  {user.lastSession ? (
                    <>
                      <Typography variant="body2">{user.lastSession.auction}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {time(user.lastSession.startedAt)} · {SESSION_STATUS[user.lastSession.status]}
                      </Typography>
                    </>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Tooltip
                      title="Картка контролю"
                      onClick={() => {
                        handleChangeWorker(String(user.id));
                        OpenControlCard();
                      }}
                    >
                      <IconButton size="small" color="primary">
                        <Assessment />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Перейти в лог">
                      <IconButton size="small" onClick={() => navigate(`/logs?userId=${user.id}`)}>
                        <History />
                      </IconButton>
                    </Tooltip>
                    <UserActionsMenu
                      openEdit={() => {
                        handleChangeWorker(String(user.id));
                        OpenEditUser();
                      }}
                      openAccess={() => {
                        handleChangeWorker(String(user.id));
                        OpenUserAccess();
                      }}
                      user={user}
                    />
                  </Stack>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                <Typography color="text.secondary">
                  Працівників ще немає
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
