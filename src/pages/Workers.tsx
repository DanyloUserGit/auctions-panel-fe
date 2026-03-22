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
  TablePagination,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useSearchUsers, useUsers } from '../features/auth/model/useAuth';
import { ROLES } from '../features/auth/model/user-schema';
import { WorkerControlModal } from '../features/Workers/ui/WorkerControlModal';
import { WorkerEditModal } from '../features/Workers/ui/WorkerEditModal';
import { WorkerCreateModal } from '../features/Workers/ui/WorkerCreateModal';
import WorkersList from '../features/Workers/ui/WorkersList';
import { useModal } from '../shared/hooks/useModal';
import { useMobile } from '../shared/hooks/useMobile';

export default function EmployeesSection() {
  const isMobile = useMobile();

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Дані
  const { users } = useUsers();
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);

  const { data: searchResults } = useSearchUsers(
    debouncedSearch,
    page + 1,
    rowsPerPage,
  );

  // Debounce пошуку
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  // Фільтрація
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

  // Пагінація
  const showUsers = useMemo(() => {
    if (debouncedSearch.trim()) {
      return filteredUsers;
    }

    const start = page * rowsPerPage;
    return filteredUsers.slice(start, start + rowsPerPage);
  }, [filteredUsers, page, rowsPerPage, debouncedSearch]);

  // Загальна кількість
  const totalCount = useMemo(() => {
    if (debouncedSearch.trim()) {
      return searchResults?.meta?.total || 0;
    }
    return filteredUsers.length;
  }, [debouncedSearch, searchResults, filteredUsers]);

  const effectiveId = selectedWorkerId || users?.[0]?.id || '';

  const handleChangeWorker = (id: string) => {
    setSelectedWorkerId(id);
  };

  const currentUser = users?.find((u) => u.id === effectiveId);

  // Модалки
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

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: { xs: 0, sm: 3 } }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          flexWrap: 'wrap',
          gap: 2,
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
          fullWidth={isMobile}
          sx={{ borderRadius: '10px', px: 3, height: 45 }}
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
          boxShadow: 'none',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <TextField
          size="small"
          placeholder="Пошук за email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: 300 }, maxWidth: 400 }}
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

        <FormControl
          size="small"
          sx={{ minWidth: { xs: '47%', sm: 150 }, flexGrow: { xs: 1, sm: 0 } }}
        >
          <InputLabel>Роль</InputLabel>
          <Select
            value={roleFilter}
            label="Роль"
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(0);
            }}
          >
            <MenuItem value="All">Всі ролі</MenuItem>
            {ROLES.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          size="small"
          sx={{ minWidth: { xs: '47%', sm: 150 }, flexGrow: { xs: 1, sm: 0 } }}
        >
          <InputLabel>Статус</InputLabel>
          <Select
            value={statusFilter}
            label="Статус"
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
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

      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={isMobile ? '' : 'Рядків на сторінці:'}
        sx={{ mt: 2 }}
      />

      {/* Модалки */}
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
