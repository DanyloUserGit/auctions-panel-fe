import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { api } from '../../../shared/http';
import { authKeys } from '../model/useAuth';
import { loginSchema, type LoginInput } from '../model/login-schema';

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });
  const queryClient = useQueryClient();

  const onSubmit: SubmitHandler<LoginInput> = async (data) => {
    try {
      const response = await api.post('/auth/login', data, {
        withCredentials: true,
      });
      console.log('Успішний вхід:', response);
      await queryClient.invalidateQueries({ queryKey: authKeys.me });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Axios Error:', error.message);
        setError('root', {
          type: 'server',
          message: 'Користувача не знайдено',
        });
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          sx={{ color: 'var(--color-primary)', fontWeight: 'bold' }}
        >
          Вхід
        </Typography>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <TextField
            fullWidth
            label="Пошта"
            type="email"
            variant="outlined"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            fullWidth
            label="Пароль"
            type="password"
            variant="outlined"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          {errors.root && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {errors.root.message}
            </Alert>
          )}

          <Button
            disabled={isSubmitting}
            type="submit"
            variant="contained"
            size="large"
            sx={{
              mt: 2,
              backgroundColor: 'var(--color-primary)',
              '&:hover': { backgroundColor: 'var(--color-accent)' },
              py: 1.5,
            }}
          >
            {isSubmitting ? 'Обробка...' : 'Увійти'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
