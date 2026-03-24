import { Assessment } from '@mui/icons-material';
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
import type { User, UserRole } from '../../auth/model/user-schema';
import { UserActionsMenu } from './UserActionsMenu';
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
}
export default function WorkersList({
  users,
  handleChangeWorker,
  OpenControlCard,
  OpenEditUser,
}: Props) {
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
                    label={user.isBlocked ? 'Заблокований' : 'Активний'}
                    size="small"
                    sx={{
                      bgcolor: user.isActive ? '#e1f5fe' : '#ffebee',
                      color: user.isActive ? '#01579b' : '#b71c1c',
                    }}
                  />
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
                    <UserActionsMenu
                      openEdit={() => {
                        handleChangeWorker(String(user.id));
                        OpenEditUser();
                      }}
                      user={user}
                    />
                  </Stack>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
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
