import { AdminPanelSettings, Badge, Security } from '@mui/icons-material';
import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  type SelectChangeEvent,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { sendResetLink } from '../../auth/model/api-user';
import { useAuth } from '../../auth/model/useAuth';
import {
  RIGHTS,
  ROLES,
  type UpdateUser,
  type UserRights,
  type UserRole,
} from '../../auth/model/user-schema';
import { Can } from '../../auth/ui/Can';
import { useChangeRole, useUpdateProfile } from '../model/useProfile';

export default function ProfileEdit() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { mutate: updateUserMutation, isPending: isPendingProfile } =
    useUpdateProfile(user?.id ?? '');
  const { mutate: changeRoleMutation, isPending: isPendingRole } =
    useChangeRole();
  const isAdmin = user?.role === 'SuperAdmin';

  useEffect(() => console.log(user), [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e: SelectChangeEvent<string>) => {
    setFormData((prev) => ({ ...prev, role: e.target.value as UserRole }));
  };
  const handleRightChange = (e: SelectChangeEvent<string>) => {
    setFormData((prev) => ({ ...prev, rights: e.target.value as UserRights }));
  };
  const [formData, setFormData] = useState<UpdateUser>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    role: user?.role || 'User',
    phone: user?.phone || '',
    rights: (Array.isArray(user?.rights)
      ? user.rights[0]
      : user?.rights) as UserRights,
  });
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        role: user.role || 'User',
        phone: user.phone,
        rights: (Array.isArray(user.rights)
          ? user.rights[0]
          : user.rights) as UserRights,
      });
    }
  }, [user]);
  const handleChangePassword = async () => {
    await sendResetLink();
  };
  const handleSave = async () => {
    await updateUserMutation(formData);
    if (isAdmin)
      await changeRoleMutation({
        id: String(user.id),
        role: formData.role as UserRole,
        rights: formData.rights as UserRights,
      });
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: { xs: 2, sm: 4 } }}>
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          border: '1px solid #e2e8f0',
        }}
      >
        <Grid container spacing={4}>
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}
            >
              <Badge color="primary" sx={{ color: 'primary.main' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Персональна інформація
              </Typography>
            </Box>
            <Divider />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Ім'я"
              name="firstName"
              disabled={isPendingProfile || isPendingRole}
              value={formData.firstName}
              onChange={handleChange}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Прізвище"
              name="lastName"
              disabled={isPendingProfile || isPendingRole}
              value={formData.lastName}
              onChange={handleChange}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={isPendingProfile || isPendingRole}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Button
              type="submit"
              variant="outlined"
              size="medium"
              onClick={handleChangePassword}
              sx={{
                mt: 2,
                mb: 3,
                backgroundColor: 'var(--color-primary)',
                '&:hover': { backgroundColor: 'var(--color-accent)' },
                py: 1.5,
                color: 'white',
                borderColor: 'divider',
              }}
            >
              Змінити пароль
            </Button>
          </Grid>

          <Can roles={['SuperAdmin']}>
            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}
              >
                <Security sx={{ color: 'primary.main' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Рівень доступу та права
                </Typography>
              </Box>
              <Divider />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel id="role-label">Роль в системі</InputLabel>
                <Select
                  labelId="role-label"
                  value={formData.role || ''}
                  label="Роль в системі"
                  disabled={isPendingProfile || isPendingRole}
                  onChange={handleRoleChange}
                  startAdornment={
                    <AdminPanelSettings
                      sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }}
                    />
                  }
                >
                  {ROLES.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel id="rights-label">Додаткові права</InputLabel>
                <Select
                  label="Роль в системі"
                  labelId="rights-label"
                  value={formData.rights}
                  disabled={isPendingProfile || isPendingRole}
                  onChange={handleRightChange}
                  startAdornment={
                    <AdminPanelSettings
                      sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }}
                    />
                  }
                >
                  {RIGHTS.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Can>
        </Grid>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            mt: 6,
            alignItems: 'center',
            '@media (max-width: 500px)': {
              flexDirection: 'column',
              alignItems: 'stretch',
            },
          }}
        >
          <Button
            type="submit"
            variant="contained"
            size="medium"
            onClick={handleSave}
            sx={{
              backgroundColor: 'var(--color-primary)',
              '&:hover': { backgroundColor: 'var(--color-accent)' },
              maxHeight: 'fit-content',
              py: 1.5,
              px: 4,
            }}
          >
            Зберегти зміни
          </Button>
          <Button
            type="reset"
            variant="outlined"
            size="medium"
            onClick={() => navigate(-1)}
            sx={{
              color: 'red',
              '&:hover': { backgroundColor: 'red', color: 'white' },
              py: 1.5,
              maxHeight: 'fit-content',
              borderColor: 'divider',
            }}
          >
            Скасувати
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
