import {
    ArrowBack,
    CheckCircle,
    LockReset,
    Visibility,
    VisibilityOff,
} from "@mui/icons-material";
import {
    Alert,
    Box,
    Button,
    Grid,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useChangePassword } from "../features/profile/model/useProfile";

export default function ResetPassword() {
    const navigate = useNavigate();

    const { id: token } = useParams()
    const { mutate, isPending } = useChangePassword()
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const passwordsMatch = formData.password === formData.confirmPassword;
    const isFormValid = formData.password.length >= 6 && passwordsMatch;


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isFormValid && token) {
            console.log("Відправка нового пароля:", formData.password);
            mutate({ password: formData.password, token: token })
            setIsSuccess(true);
        }
    };
    useEffect(() => { console.log(formData) }, [formData])


    if (isSuccess) {
        return (
            <Box sx={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", px: 2 }}>
                <Paper elevation={0} sx={{ p: 4, maxWidth: 400, textAlign: "center", borderRadius: "24px", border: "1px solid #e2e8f0" }}>
                    <CheckCircle sx={{ fontSize: 64, color: "success.main", mb: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>Пароль змінено!</Typography>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>Тепер ви можете увійти в систему з новим паролем.</Typography>
                    <Button fullWidth variant="contained" size="large" onClick={() => navigate("/login")} sx={{ borderRadius: "12px", py: 1.5, textTransform: "none", fontWeight: 700 }}>
                        Перейти до входу
                    </Button>
                </Paper>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 450, mx: "auto", py: { xs: 4, sm: 8 }, px: 2 }}>
            <Box sx={{ mb: 4, textAlign: "center" }}>
                <Box sx={{ bgcolor: "primary.main", width: 56, height: 56, borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2, color: "white", boxShadow: "0 8px 16px rgba(25, 118, 210, 0.2)" }}>
                    <LockReset fontSize="large" />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Новий пароль</Typography>
                <Typography color="text.secondary">Встановіть надійний пароль для доступу до вашого акаунта</Typography>
            </Box>

            <Paper variant="outlined" sx={{ p: { xs: 3, sm: 4 }, borderRadius: "20px", border: "1px solid #e2e8f0" }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Новий пароль"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                                required
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Підтвердіть пароль"
                                name="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                error={formData.confirmPassword !== "" && !passwordsMatch}
                                helperText={formData.confirmPassword !== "" && !passwordsMatch ? "Паролі не збігаються" : ""}
                            />
                        </Grid>

                        {formData.password && formData.password.length < 6 && (
                            <Grid size={{ xs: 12 }}>
                                <Alert severity="info" sx={{ borderRadius: "10px" }}>
                                    Пароль повинен містити не менше 6 символів
                                </Alert>
                            </Grid>
                        )}

                        <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={!isFormValid || isPending}
                                size="large"
                                sx={{
                                    borderRadius: "12px",
                                    py: 1.5,
                                    textTransform: "none",
                                    fontWeight: 700,
                                    fontSize: "1rem",
                                    boxShadow: "none",
                                    "&:hover": { boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)" }
                                }}
                            >
                                Оновити пароль
                            </Button>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Button
                                fullWidth
                                variant="text"
                                disabled={isPending}
                                startIcon={<ArrowBack />}
                                onClick={() => navigate("/login")}
                                sx={{ textTransform: "none", color: "text.secondary" }}
                            >
                                Скасувати
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
}