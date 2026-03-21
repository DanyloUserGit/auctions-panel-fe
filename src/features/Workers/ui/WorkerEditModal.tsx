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
import { useEffect } from 'react';
import {
  Controller,
  useForm,
  useWatch,
  type FieldErrors,
} from 'react-hook-form';
import BaseModal from '../../../shared/ui/Modal';
import { useAuth, useUpdateUser } from '../../auth/model/useAuth';
import {
  ROLES,
  updateUserSchema,
  type UpdateUser,
  type User,
} from '../../auth/model/user-schema';
import type { Group } from '../../groups/model/types';
import { useGroups } from '../../groups/model/useGroups';

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
  const { data: groups, isLoading: isLoadingGroups } = useGroups();

  const isSA = currentUser?.role === 'SuperAdmin';

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UpdateUser>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      city: user.city,
      phone: user.phone,
      role: user.role,
      rights: user.rights,
      auctionGroupId: user.auctionGroupId,
    },
  });

  const currentGroupId = useWatch({
    control,
    name: 'auctionGroupId',
  });

  const selectedGroup =
    groups?.find((g: Group) => g.id === currentGroupId) || null;

  useEffect(() => {
    if (open) {
      reset({ ...user, auctionGroupId: user.auctionGroupId || '' });
    }
  }, [user, open, reset]);

  const onInvalid = (errors: FieldErrors<UpdateUser>) => {
    console.error('Помилки валідації Zod:', errors);
  };

  const onSubmit = (data: UpdateUser) => {
    console.log(data);
    const payload = {
      ...data,
      auctionGroupId: selectedGroup?.id || null,
    };

    updateUser(
      { id: user.id, data: payload },
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
          {/* Пошук Групи (тільки для SA) */}
          {isSA && (
            <Grid size={12}>
              <Autocomplete
                filterOptions={(x) => x}
                value={selectedGroup}
                options={groups || []}
                loading={isLoadingGroups}
                onChange={(_, val) => {
                  setValue('auctionGroupId', val?.id || '');
                }}
                getOptionLabel={(o) => o.title || ''}
                isOptionEqualToValue={(o, v) => o.id === v.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Група аукціонів"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isLoadingGroups ? (
                            <CircularProgress size={20} />
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
