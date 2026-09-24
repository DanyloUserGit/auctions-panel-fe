import { zodResolver } from '@hookform/resolvers/zod';
import { Refresh } from '@mui/icons-material';
import {
  Alert,
  Autocomplete,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useAutoComplete } from '../../../shared/hooks/useAutoComplete';
import BaseModal from '../../../shared/ui/Modal';
import { useAuth, useCreateUser } from '../../auth/model/useAuth';
import {
  type CreateUser,
  createUserSchema,
  ROLES,
} from '../../auth/model/user-schema';

import { fetchUserGroupsByQuery } from '../../user-groups/model/api';
import type { UserGroup } from '../../user-groups/model/types';
import { RIGHTS, RIGHTS_LABELS } from '../model/types';
interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
}

const generateSafePassword = (length = 12) => {
  const charset = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let password = '';
  const values = new Uint32Array(length);
  window.crypto.getRandomValues(values);
  for (let i = 0; i < length; i++) {
    password += charset[values[i] % charset.length];
  }
  return password;
};

export const WorkerCreateModal = ({ open, onClose }: CreateUserModalProps) => {
  const { user: currentUser } = useAuth();
  const { mutate: createUser, isPending, error } = useCreateUser();
  const isSA = currentUser?.role === 'SuperAdmin';

  const GroupSearch = useAutoComplete<UserGroup>({
    fetchFn: fetchUserGroupsByQuery,
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    setError,
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
      userGroupId: '',
      managedGroup: '',
    },
  });

  const selectedRole = watch('role');

  const canManageGroup = selectedRole === 'Admin';
  const isAuctionMember =
    selectedRole === 'User' || selectedRole === 'SuperAdmin';

  useEffect(() => {
    if (canManageGroup) {
      setValue('userGroupId', '');
    } else if (isAuctionMember) {
      setValue('managedGroup', '');
    }
  }, [selectedRole, canManageGroup, isAuctionMember, setValue]);

  const handleGeneratePassword = () => {
    const password = generateSafePassword(8);
    setValue('password', password, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    navigator.clipboard.writeText(password);
  };
  const handleClose = () => {
    reset();
    GroupSearch.setOptions([]);
    onClose();
  };


  const onSubmit = (data: CreateUser) => {
    // Користувач з роллю User завжди належить до групи (для Admin бекенд ставить його групу сам).
    if (isSA && data.role === 'User' && !data.userGroupId) {
      setError('userGroupId', { message: 'Оберіть групу для користувача' });
      return;
    }

    const payload: Partial<CreateUser> = { ...data };

    if (!payload.managedGroup || payload.managedGroup.trim() == '') {
      delete payload.managedGroup;
    }
    if (!payload.userGroupId || payload.userGroupId.trim() == '') {
      delete payload.userGroupId;
    }

    if (isAuctionMember) {
      delete payload.managedGroup;
    }

    createUser(payload as CreateUser, {
      onSuccess: () => handleClose(),
    });
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
              <Alert severity="error" sx={{ borderRadius: '8px' }}>
                Помилка: {error.message}
              </Alert>
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
              type="text"
              label="Пароль"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputLabelProps={{
                shrink: !!watch('password'),
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleGeneratePassword}
                      edge="end"
                      title="Згенерувати та копіювати"
                    >
                      <Refresh />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid size={12}>
            <FormControl fullWidth error={!!errors.role}>
              <InputLabel>Роль</InputLabel>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Роль">
                    {ROLES.filter((r) => isSA || r === 'User').map(
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

          {isSA && canManageGroup && (
            <Grid size={12}>
              <Controller
                name="managedGroup"
                control={control}
                render={({ field: { onChange, value } }) => {
                  const selected =
                    GroupSearch.options.find((g) => g.id === value) || null;
                  return (
                    <Autocomplete
                      options={GroupSearch.getFilteredOptions(selected)}
                      loading={GroupSearch.isLoading}
                      value={selected}
                      onInputChange={(_, val) =>
                        GroupSearch.debouncedFetch(val, selected)
                      }
                      onChange={(_, val) => onChange(val?.id || '')}
                      getOptionLabel={(o) => o.name || ''}
                      isOptionEqualToValue={(o, v) => o?.id === v?.id}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Керована група "
                          error={!!errors.managedGroup}
                          helperText={errors.managedGroup?.message}
                        />
                      )}
                    />
                  );
                }}
              />
            </Grid>
          )}

          {!isSA && (
            <Grid size={12}>
              <Typography variant="body2" color="text.secondary">
                Користувача буде додано до вашої групи.
              </Typography>
            </Grid>
          )}

          {isSA && isAuctionMember && (
            <Grid size={12}>
              <Controller
                name="userGroupId"
                control={control}
                render={({ field: { onChange, value } }) => {
                  const selected =
                    GroupSearch.options.find((g) => g.id === value) || null;
                  return (
                    <Autocomplete
                      options={GroupSearch.getFilteredOptions(selected)}
                      loading={GroupSearch.isLoading}
                      value={selected}
                      onInputChange={(_, val) =>
                        GroupSearch.debouncedFetch(val, selected)
                      }
                      onChange={(_, val) => onChange(val?.id || '')}
                      getOptionLabel={(o) => o.name || ''}
                      isOptionEqualToValue={(o, v) => o?.id === v?.id}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={
                            selectedRole === 'User'
                              ? 'Група користувача *'
                              : "Прив'язати до групи"
                          }
                          error={!!errors.userGroupId}
                          helperText={errors.userGroupId?.message}
                        />
                      )}
                    />
                  );
                }}
              />
            </Grid>
          )}

          <Grid size={12}>
            <FormControl fullWidth error={!!errors.rights}>
              <InputLabel>Права доступу</InputLabel>
              <Controller
                name="rights"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Права доступу">
                    {RIGHTS.map((right) => (
                      <MenuItem key={right} value={right}>
                        {RIGHTS_LABELS[right] || right}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.rights && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.rights.message}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid size={12}>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={isPending}
              sx={{ py: 1.5, fontWeight: 700, borderRadius: '10px' }}
            >
              {isPending ? (
                <CircularProgress size={24} color="inherit" />
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