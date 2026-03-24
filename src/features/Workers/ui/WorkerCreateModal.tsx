import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Autocomplete,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useAutoComplete } from '../../../shared/hooks/useAutoComplete';
import BaseModal from '../../../shared/ui/Modal';
import { useAuth, useCreateUser } from '../../auth/model/useAuth';
import {
  type CreateUser,
  createUserSchema,
  ROLES
} from '../../auth/model/user-schema';
import { fetchGroupByQuery } from '../../groups/model/api-groups';
import type { Group } from '../../groups/model/types';

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
}

export const WorkerCreateModal = ({ open, onClose }: CreateUserModalProps) => {
  const { user: currentUser } = useAuth();
  const { mutate: createUser, isPending, error } = useCreateUser();
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [adminGroup, setAdminGroup] = useState<Group | null>(null);
  const AdminGroupSearch = useAutoComplete<Group>({
    fetchFn: fetchGroupByQuery,
  });
  const {
    options: groupOptions,
    isLoading: isGroupsLoading,
    debouncedFetch: debouncedFetchGroups,
    setOptions: setGroupOptions,
  } = useAutoComplete<Group>({
    fetchFn: fetchGroupByQuery,
    debounceTime: 400,
  });

  const isSA = currentUser?.role === 'SuperAdmin';

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateUser>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      rights: 'Read',
      role: 'User',
      firstName: '',
      lastName: '',
      city: '',
      phone: '',
      email: '',
      password: '',
      auctionGroupId: '',
      auctionGroup: ""
    },
  });

  const onSubmit = async (data: CreateUser) => {
    const payload = {
      ...data,
      auctionGroupId: selectedGroup?.id || '',
      auctionGroup: adminGroup?.id || ""
    };
    if (selectedGroup?.id) {
      payload.auctionGroupId = selectedGroup.id
    }
    if (adminGroup?.id) {
      payload.auctionGroup = adminGroup.id
    }
    createUser(payload);


    reset();
    setSelectedGroup(null);
    setAdminGroup(null);
    setGroupOptions([]);
    onClose();
  };

  const handleClose = () => {
    reset();
    setSelectedGroup(null);
    setGroupOptions([]);
    onClose();
  };
  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      title="Створення нового працівника"
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2.5}>
          {error && (
            <Grid size={12}>
              <Alert severity="error">Помилка: {error.message}</Alert>
            </Grid>
          )}

          <Grid size={6}>
            <TextField
              fullWidth
              label="Ім'я"
              {...register('firstName')}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              fullWidth
              label="Прізвище"
              {...register('lastName')}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              label="Email"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              type="password"
              label="Пароль"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Місто"
              {...register('city')}
              error={!!errors.city}
              helperText={errors.city?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Телефон"
              {...register('phone')}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          </Grid>
          <Grid size={12}>

            <Autocomplete
              options={AdminGroupSearch.getFilteredOptions(adminGroup)}
              loading={AdminGroupSearch.isLoading}
              onInputChange={(_, val) => AdminGroupSearch.debouncedFetch(val, adminGroup)}
              onChange={(_, val) => setAdminGroup(val)}
              getOptionLabel={(o) => o.title || ''}

              isOptionEqualToValue={(o, v) => o?.id === v?.id}
              renderInput={(params) => (
                <TextField {...params} label="Адмін групи" />
              )}
            />
          </Grid>
          {isSA && (
            <Grid size={12}>
              <Autocomplete
                value={selectedGroup}
                options={groupOptions}
                loading={isGroupsLoading}
                onInputChange={(_, val) =>
                  debouncedFetchGroups(val, selectedGroup)
                }
                onChange={(_, val) => {
                  setSelectedGroup(val);
                  setValue('auctionGroupId', val?.id || '');
                }}
                getOptionLabel={(o) => o.title || ''}
                isOptionEqualToValue={(o, v) => o.id === v.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Прив'язати до групи"
                    error={!!errors.auctionGroupId}
                    helperText={errors.auctionGroupId?.message}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isGroupsLoading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
          )}

          <Grid size={isSA ? 12 : 12}>
            <FormControl fullWidth error={!!errors.role}>
              <InputLabel>Роль</InputLabel>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Роль">
                    {ROLES.filter((r) => r !== 'SuperAdmin' || isSA).map(
                      (role) => (
                        <MenuItem key={role} value={role}>
                          {role}
                        </MenuItem>
                      ),
                    )}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>

          <Grid size={12}>
            <Paper
              variant="outlined"
              sx={{ p: 2, bgcolor: 'action.hover', borderStyle: 'dashed' }}
            >
              <Typography variant="caption" color="text.secondary">
                Права доступу:
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, color: 'primary.main' }}
              >
                Тільки перегляд (Read Only)
              </Typography>
            </Paper>
          </Grid>

          <Grid size={12}>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={isPending}
            >
              {isPending ? (
                <CircularProgress size={24} />
              ) : (
                'Створити працівника'
              )}
            </Button>
          </Grid>
        </Grid>
      </form>
    </BaseModal>
  );
};
