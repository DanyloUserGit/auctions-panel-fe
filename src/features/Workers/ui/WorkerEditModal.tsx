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
  TextField
} from '@mui/material';
import { useEffect } from 'react';
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
import { fetchGroupByQuery } from '../../groups/model/api-groups';
import type { Group } from '../../groups/model/types';
import { RIGHTS, RIGHTS_LABELS } from '../model/types';

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

  const GroupSearch = useAutoComplete<Group>({
    fetchFn: fetchGroupByQuery,
    initialSelected: user.managedGroup
      ? [user.managedGroup]
      : user.auctionGroup
        ? [user.auctionGroup]
        : [],
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, dirtyFields },
  } = useForm<UpdateUser>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      city: user.city || '',
      phone: user.phone || '',
      role: user.role,
      rights: user.rights,
      managedGroup: user.managedGroup?.id || '',
      auctionGroupId: user.auctionGroupId || '',
    },
  });

  const selectedRole = watch('role');

  const canManageGroup = selectedRole === 'Admin';
  const isAuctionMember =
    selectedRole === 'User' || selectedRole === 'SuperAdmin';

  useEffect(() => {
    if (canManageGroup) {
      setValue('auctionGroupId', '');
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
      if (user.auctionGroup) {
        groupsToSet.push(user.auctionGroup);
      }
      if (groupsToSet.length > 0) {
        GroupSearch.setOptions(groupsToSet);
      }

      reset({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        city: user.city || '',
        phone: user.phone || '',
        role: user.role,
        rights: user.rights,
        auctionGroupId: user.auctionGroupId || '',
        managedGroup: user.managedGroup?.id || '',
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, open, reset]);

  const onInvalid = (errors: FieldErrors<UpdateUser>) => {
    console.log('Dirty fields:', dirtyFields);
    console.error('Помилки валідації Zod:', errors);
  };

  const onSubmit = (data: UpdateUser) => {
    const payload: Partial<UpdateUser> = { ...data };

    if (!payload.managedGroup || payload.managedGroup.trim() == '') {
      delete payload.managedGroup;
    }
    if (!payload.auctionGroupId || payload.auctionGroupId.trim() == '') {
      delete payload.auctionGroupId;
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
                {error.message || 'Сталася помилка при оновленні'}
              </Alert>
            </Grid>
          )}

          {/* 1. Ім'я та Прізвище */}
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

          {/* 2. Email */}
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
                render={({ field: { onChange } }) => {
                  const currentSelected = user.managedGroup || null;
                  return (
                    <Autocomplete
                      options={GroupSearch.getFilteredOptions(currentSelected)}
                      loading={GroupSearch.isLoading}
                      value={currentSelected}
                      onInputChange={(_, val) =>
                        GroupSearch.debouncedFetch(val, currentSelected)
                      }
                      onChange={(_, val) => onChange(val?.id || '')}
                      getOptionLabel={(o) => o.title || ''}
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
                name="auctionGroupId"
                control={control}
                render={({ field: { onChange } }) => {
                  const currentSelected = user.auctionGroup || null;
                  return (
                    <Autocomplete
                      options={GroupSearch.getFilteredOptions(currentSelected)}
                      loading={GroupSearch.isLoading}
                      value={currentSelected}
                      onInputChange={(_, val) =>
                        GroupSearch.debouncedFetch(val, currentSelected)
                      }
                      onChange={(_, val) => onChange(val?.id || '')}
                      getOptionLabel={(o) => o.title || ''}
                      isOptionEqualToValue={(o, v) => o.id === v.id}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Прив'язати до групи  "
                          error={!!errors.auctionGroupId}
                          helperText={errors.auctionGroupId?.message}
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
                        {RIGHTS_LABELS[right]}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.rights && (
                <FormHelperText>{errors.rights.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* 8. Кнопка */}
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
    </BaseModal>
  );
};
