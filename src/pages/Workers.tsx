import { Add, Assessment, Search } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useUsers } from '../features/auth/model/useAuth';
import { ROLES, type UserRole } from '../features/auth/model/user-schema';
import { UserActionsMenu } from '../features/Workers/ui/UserActionsMenu';
import { WorkerControlModal } from '../features/Workers/ui/WorkerControlModal';
import { WorkerEditModal } from '../features/Workers/ui/WorkerEditModal';
import { useModal } from '../shared/hooks/useModal';

import { type ChipProps } from '@mui/material';
import { WorkerCreateModal } from '../features/Workers/ui/WorkerCreateModal';

const roleColors: Record<UserRole, ChipProps['color']> = {
  SuperAdmin: 'error',
  GroupAdmin: 'primary',
  User: 'default',
};

export default function EmployeesSection() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const { users } = useUsers();
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
  const filteredUsers = useMemo(() => {
    if (!users) return [];

    return users.filter((user) => {
      const searchTerm = search.toLowerCase();
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const email = user.email.toLowerCase();

      const matchesSearch =
        fullName.includes(searchTerm) || email.includes(searchTerm);

      const matchesRole = roleFilter === 'All' || user.role === roleFilter;

      // 2. Логіка фільтрації за статусом
      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Blocked' ? user.isBlocked : !user.isBlocked);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const showUsers = filteredUsers;
  const effectiveId = selectedWorkerId || users?.[0]?.id || '';
  const handleChangeWorker = (id: string) => {
    setSelectedWorkerId(id);
  };
  const currentUser = users?.find((u) => u.id === effectiveId);

  const {
    isOpen: isControlCardOpen,
    open: OpenControlCard,
    close: CloseControlCard,
  } = useModal(false);
  const {
    isOpen: isAddUserOpen,
    open: OpenAddUser,
    close: CloseAddUser,
  } = useModal(false);
  const {
    isOpen: isEditUserOpen,
    open: OpenEditUser,
    close: CloseEditUser,
  } = useModal(false);

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Працівники
        </Typography>
        <Button
          onClick={OpenAddUser}
          variant="contained"
          startIcon={<Add />}
          sx={{ borderRadius: '10px', px: 3 }}
        >
          Додати працівника
        </Button>
      </Box>

      {/* Фільтри та Пошук */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: '15px',
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <TextField
          size="small"
          placeholder="Пошук за іменем або email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flexGrow: 1, maxWidth: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: search && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearch('')}>
                  <Add sx={{ transform: 'rotate(45deg)' }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Роль</InputLabel>
          <Select
            value={roleFilter}
            label="Роль"
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            {ROLES.map((role) => (
              <MenuItem value={role}>{role}</MenuItem>
            ))}
            <MenuItem value="All">All</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Статус</InputLabel>
          <Select
            value={statusFilter}
            label="Статус"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="All">Всі статуси</MenuItem>
            <MenuItem value="Active">Активні</MenuItem>
            <MenuItem value="Blocked">Заблоковані</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      <TableContainer
        component={Paper}
        sx={{ borderRadius: '15px', overflow: 'hidden' }}
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
            {showUsers && showUsers?.length > 0 ? (
              showUsers.map((user) => (
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
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="flex-end"
                    >
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

        <WorkerControlModal
          id={String(effectiveId)}
          open={isControlCardOpen}
          onClose={CloseControlCard}
          isLoading={false}
        />
        <WorkerCreateModal open={isAddUserOpen} onClose={CloseAddUser} />
        {currentUser && (
          <WorkerEditModal
            key={effectiveId}
            open={isEditUserOpen}
            onClose={CloseEditUser}
            user={currentUser}
          />
        )}
      </TableContainer>
    </Box>
  );
}
