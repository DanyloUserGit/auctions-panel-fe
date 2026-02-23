import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Alert,
} from "@mui/material";
import axios from "axios";

// 1. Ваша схема (firstname та lastname обов'язкові!)
const formDataSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type User = z.infer<typeof formDataSchema>;

export default function RegistrationForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<User>({
    resolver: zodResolver(formDataSchema),
  });

  const onSubmit: SubmitHandler<User> = async (data) => {
    try {
      const responce = await axios.post(
        "http://155.117.43.95:8000/users/",
        data,
      );
      console.log("Success:", responce);
    } catch (error) {
      setError("root", {
        message: "Server error. Please try again later.",
      });
    }
  };

  return (
    // Використовуємо sx для надійності відступів, або !mt-10 у className
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          sx={{ color: "var(--color-primary)", fontWeight: "bold" }}
        >
          Login
        </Typography>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            fullWidth
            label="Password"
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
            {isSubmitting ? "Processing..." : "Register"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
