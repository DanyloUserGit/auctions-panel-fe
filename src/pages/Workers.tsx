import { Add, Search } from '@mui/icons-material';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useSearchUsers, useUsers } from '../features/auth/model/useAuth';
import { ROLES } from '../features/auth/model/user-schema';
import { WorkerControlModal } from '../features/Workers/ui/WorkerControlModal';
import { WorkerEditModal } from '../features/Workers/ui/WorkerEditModal';
import { useModal } from '../shared/hooks/useModal';

import { WorkerCreateModal } from '../features/Workers/ui/WorkerCreateModal';
import WorkersList from '../features/Workers/ui/WorkersList';
import { useMobile } from '../shared/hooks/useMobile';

export default function EmployeesSection() {
  const isMobile = useMobile();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const { users } = useUsers();
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
  const { data: searchResults } = useSearchUsers(debouncedSearch);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);
  const filteredUsers = useMemo(() => {
    const baseList = debouncedSearch.trim()
      ? searchResults?.data || []
      : users || [];

    return baseList.filter((user) => {
      const matchesRole = roleFilter === 'All' || user.role === roleFilter;
      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Blocked' ? user.isBlocked : !user.isBlocked);

      return matchesRole && matchesStatus;
    });
  }, [users, searchResults, debouncedSearch, roleFilter, statusFilter]);
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
    <Box sx={{ p: { xs: 0, sm: 3 } }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        {!isMobile && (
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Працівники
          </Typography>
        )}
        <Button
          onClick={OpenAddUser}
          variant="contained"
          startIcon={<Add />}
          sx={{ borderRadius: '10px', px: 3 }}
        >
          Додати працівника
        </Button>
      </Box>

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
          placeholder="Пошук за email"
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
      <WorkersList
        users={showUsers}
        handleChangeWorker={handleChangeWorker}
        OpenControlCard={OpenControlCard}
        OpenEditUser={OpenEditUser}
      />

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
    </Box>
  );
}
