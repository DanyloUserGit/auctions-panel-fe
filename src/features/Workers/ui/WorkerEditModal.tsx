import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Autocomplete,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Controller, useForm, type FieldErrors } from 'react-hook-form';
import { useAutoComplete } from '../../../shared/hooks/useAutoComplete';
import BaseModal from '../../../shared/ui/Modal';
import { useAuth, useUpdateUser } from '../../auth/model/useAuth';
import {
  ROLES,
  updateUserSchema,
  type UpdateUser,
  type User,
} from '../../auth/model/user-schema';

import { fetchUserGroupsByQuery } from '../../user-groups/model/api';
import type { UserGroup } from '../../user-groups/model/types';
import UserStatusDialog from './UserStatusDialog';
import { statusLabel } from '../../auth/model/user-schema';
import { getErrorMessage } from '../../../shared/utils';

interface CreateUserModalProps {
  open: boolean;
  user: User;
  onClose: () => void;
}

export const WorkerEditModal = ({
  user,
  open,
  onClose,
}: CreateUserModalProps) => {
  const { user: currentUser } = useAuth();
  const { mutate: updateUser, isPending, error } = useUpdateUser();
  const isSA = currentUser?.role === 'SuperAdmin';
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const GroupSearch = useAutoComplete<UserGroup>({
    fetchFn: fetchUserGroupsByQuery,
    initialSelected: user.managedGroup
      ? [user.managedGroup]
      : user.userGroup
        ? [user.userGroup]
        : [],
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
  } = useForm<UpdateUser>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      middleName: user?.middleName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      city: user.city || '',
      phone: user.phone || '',
      role: user.role,
      sessionLimit: user.sessionLimit ?? 0,
      managedGroup: user.managedGroup?.id || '',
      userGroupId: user.userGroupId || '',
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

  useEffect(() => {
    if (open) {
      const groupsToSet = [];
      if (user.managedGroup) {
        groupsToSet.push(user.managedGroup);
      }
      if (user.userGroup) {
        groupsToSet.push(user.userGroup);
      }
      if (groupsToSet.length > 0) {
        GroupSearch.setOptions(groupsToSet);
      }

      reset({
        firstName: user?.firstName || '',
        middleName: user?.middleName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        city: user.city || '',
        phone: user.phone || '',
        role: user.role,
        sessionLimit: user.sessionLimit ?? 0,
        userGroupId: user.userGroupId || '',
        managedGroup: user.managedGroup?.id || '',
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, open, reset]);

  const onInvalid = (errors: FieldErrors<UpdateUser>) => {
    console.error('Помилки валідації Zod:', errors);
  };

  const onSubmit = (data: UpdateUser) => {
    if (isSA && data.role === 'User' && !data.userGroupId) {
      setError('userGroupId', { message: 'Оберіть групу для користувача' });
      return;
    }

    const payload: Partial<UpdateUser> = { ...data };

    if (!payload.managedGroup || payload.managedGroup.trim() == '') {
      delete payload.managedGroup;
    }
    if (!payload.userGroupId || payload.userGroupId.trim() == '') {
      delete payload.userGroupId;
    }

    if (isAuctionMember) {
      delete payload.managedGroup;
    }

    updateUser(
      { id: user.id, data: payload as UpdateUser },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      },
    );
  };

  return (
    <BaseModal
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      title="Редагування працівника"
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <Grid container spacing={2.5}>
          {error && (
            <Grid size={12}>
              <Alert severity="error" sx={{ borderRadius: '8px' }}>
                {getErrorMessage(error, 'Сталася помилка при оновленні')}
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
              label="По батькові"
              {...register('middleName')}
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
            <FormControl fullWidth error={!!errors.role}>
              <InputLabel>Роль</InputLabel>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Роль" disabled={!isSA}>
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
              {errors.role && (
                <FormHelperText>{errors.role.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          {canManageGroup && (
            <Grid size={12}>
              <Controller
                name="managedGroup"
                control={control}
                render={({ field: { onChange, value } }) => {
                  const currentSelected =
                    GroupSearch.options.find((g) => g.id === value) || null;
                  return (
                    <Autocomplete
                      disabled={!isSA}
                      options={GroupSearch.getFilteredOptions(currentSelected)}
                      loading={GroupSearch.isLoading}
                      value={currentSelected}
                      onInputChange={(_, val) =>
                        GroupSearch.debouncedFetch(val, currentSelected)
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

          {isAuctionMember && (
            <Grid size={12}>
              <Controller
                name="userGroupId"
                control={control}
                render={({ field: { onChange, value } }) => {
                  const currentSelected =
                    GroupSearch.options.find((g) => g.id === value) || null;
                  return (
                    <Autocomplete
                      disabled={!isSA}
                      options={GroupSearch.getFilteredOptions(currentSelected)}
                      loading={GroupSearch.isLoading}
                      value={currentSelected}
                      onInputChange={(_, val) =>
                        GroupSearch.debouncedFetch(val, currentSelected)
                      }
                      onChange={(_, val) => onChange(val?.id || '')}
                      getOptionLabel={(o) => o.name || ''}
                      isOptionEqualToValue={(o, v) => o.id === v.id}
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
            <TextField
              fullWidth
              type="number"
              label="Особистий ліміт одночасних сесій"
              {...register('sessionLimit', { valueAsNumber: true })}
              helperText="0 - без особистого ліміту (діють ліміти групи та системи)"
              slotProps={{ htmlInput: { min: 0 } }}
            />
          </Grid>

          {/* Статус доступу змінюється окремо, з причиною (записується в журнал). */}
          <Grid size={12}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
              <Typography variant="body2">
                Статус доступу: <strong>{statusLabel(user)}</strong>
              </Typography>
              <Button variant="outlined" size="small" onClick={() => setIsStatusOpen(true)}>
                Змінити статус
              </Button>
            </Stack>
          </Grid>

          <Grid size={12}>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={isPending}
              sx={{ py: 1.5, borderRadius: '10px', fontWeight: 700 }}
            >
              {isPending ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Зберегти зміни'
              )}
            </Button>
          </Grid>
        </Grid>
      </form>
      {isStatusOpen && <UserStatusDialog user={user} onClose={() => setIsStatusOpen(false)} />}
    </BaseModal>
  );
};