import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Button,
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
import { Controller, useForm, type FieldErrors } from 'react-hook-form';
import BaseModal from '../../../shared/ui/Modal';
import { useAuth, useUpdateUser } from '../../auth/model/useAuth';
import {
  ROLES,
  updateUserSchema,
  type UpdateUser,
  type User,
} from '../../auth/model/user-schema';

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

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UpdateUser>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      city: user.city,
      phone: user.phone,
      role: user.role,
      rights: user.rights,
      auctionGroupId: user.auctionGroupId,
    },
  });
  const onInvalid = (errors: FieldErrors<UpdateUser>) => {
    console.error('Помилки валідації Zod:', errors);
  };

  const onSubmit = (formData: UpdateUser) => {
    console.log(formData);
    if (!currentUser?.id) return;
    try {
      updateUser(
        { id: user.id, data: formData },
        {
          onSuccess: () => {
            reset();
            onClose();
          },
        },
      );
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (user && open) {
      reset({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        city: user.city || '',
        phone: user.phone || '',
        role: user.role,
        rights: user.rights,
        auctionGroupId: user.auctionGroupId || '',
      });
    }
  }, [user, open, reset]);
  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Редагування працівника"
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <Grid container spacing={2.5}>
          {error && (
            <Grid size={12}>
              <Alert severity="error">Помилка створення: {error.message}</Alert>
            </Grid>
          )}

          <Grid size={12}>
            <TextField
              fullWidth
              label="Ім'я"
              {...register('firstName')}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              label="Прізвище"
              {...register('lastName')}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
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

          <Grid size={{ xs: 12, sm: isSA ? 6 : 12 }}>
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

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Група (Тільки для SA)"
              {...register('auctionGroupId')}
              error={!!errors.auctionGroupId}
              helperText={errors.auctionGroupId?.message}
            />
          </Grid>

          <Grid size={12}>
            <Paper
              variant="outlined"
              sx={{ p: 2, bgcolor: 'action.hover', borderStyle: 'dashed' }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Статус доступу:
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, color: 'primary.main' }}
              >
                Тільки перегляд (Read Only)
              </Typography>
            </Paper>
          </Grid>

          <Grid size={12} sx={{ mt: 2 }}>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={isPending}
            >
              {isPending ? 'Створення...' : 'Створити працівника'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </BaseModal>
  );
};
