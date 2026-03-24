import { zodResolver } from '@hookform/resolvers/zod';
import { Turnstile } from '@marsidev/react-turnstile';
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { loginSchema, type LoginInput } from '../model/login-schema';
import { useLogin } from '../model/useAuth';
export default function LoginForm() {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const { mutateAsync: login } = useLogin();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginInput> = async (data) => {
    if (!captchaToken) {
      setError('root', { message: 'Підтвердіть, що ви не робот' });
      return;
    }

    try {
      await login({ data, token: captchaToken });
      console.log('Успішний вхід');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log(error.response);
        setError('root', {
          type: 'server',
          message: error.response?.data?.message || 'Помилка авторизації',
        });
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography
          variant="h5"
          sx={{ color: 'var(--color-primary)', fontWeight: 'bold', mb: 2 }}
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
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            fullWidth
            label="Пароль"
            type="password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
            <Turnstile
              siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
              onSuccess={(token) => {
                setCaptchaToken(token);
                if (errors.root) setError('root', { message: '' });
              }}
              onExpire={() => setCaptchaToken(null)}
              options={{ theme: 'light', language: 'uk' }}
            />
          </Box>

          {errors.root?.message && (
            <Alert severity="error">{errors.root.message}</Alert>
          )}

          <Button
            // Блокуємо кнопку, якщо йде запит АБО якщо капча ще не пройдена
            disabled={isSubmitting || !captchaToken}
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
