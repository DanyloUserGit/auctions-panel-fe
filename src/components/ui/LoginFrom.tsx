import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import { loginSchema, type LoginInput } from "../../shemas/schemas";
import axios from "axios";
import { useNavigate } from "react-router";
import { api } from "../../http";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginInput> = async (data) => {
    try {
      const response = await api.post(
        "/auth/login",
        data,
        {
          withCredentials: true,
        },
      );
      console.log("Успішний вхід:", response);
      navigate("/auctions");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.message);
        setError("root", {
          type: "server",
          message: "Користувача не знайдено",
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
          sx={{ color: "var(--color-primary)", fontWeight: "bold" }}
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
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            fullWidth
            label="Пароль"
            type="password"
            variant="outlined"
            {...register("password")}
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
              backgroundColor: "var(--color-primary)",
              "&:hover": { backgroundColor: "var(--color-accent)" },
              py: 1.5,
            }}
          >
            {isSubmitting ? "Обробка..." : "Увійти"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
