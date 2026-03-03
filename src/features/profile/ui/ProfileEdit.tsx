import { zodResolver } from "@hookform/resolvers/zod";
import { AdminPanelSettings, ArrowBack, Badge, Security } from "@mui/icons-material";
import {
    Box,
    Button,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { sendResetLink } from "../../auth/model/api-user";
import { useAuth } from "../../auth/model/useAuth";
import { RIGHTS, ROLES, updateUserSchema, type UpdateUser } from "../../auth/model/user-schema";
import { Can } from "../../auth/ui/Can";
import { useChangeRole, useUpdateProfile } from "../model/useProfile";

export default function ProfileEdit() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const { mutate: updateUserMutation, isPending: isPendingProfile } = useUpdateProfile()
    const { mutate: changeRoleMutation, isPending: isPendingRole } = useChangeRole()
    // Додай це всередині ProfileEdit
    const {
        register,
        reset,
        handleSubmit,
        control,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<UpdateUser>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            id: user?.id,
            email: user?.email,
            firstName: user?.firstName,
            lastName: user?.lastName,
            role: user?.role,
            rights: user?.rights
        }
    });



    const isAdmin = user?.role === "SuperAdmin"


    const handleChangePassword = async () => {
        await sendResetLink();

    }

    const onSubmit = async (data: UpdateUser) => {
        try {
            console.log("Валідовані дані форми:", data);

            // Емуляція виклику API (поки без реального виконання)
            /* await updateUserMutation(data);
            if (isAdmin) {
                await changeRoleMutation({
                    id: String(data.id),
                    role: data.role as UserRole,
                    rights: data.rights as UserRights
                });
            }
            navigate("/"); 
            */
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", py: { xs: 2, sm: 4 }, px: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 1 }}>
                <IconButton onClick={() => navigate(-1)} sx={{ color: "text.secondary" }}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: "-0.5px" }}>
                    Налаштування профілю
                </Typography>
            </Box>

            <Paper
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                variant="outlined"
                sx={{
                    p: { xs: 3, sm: 5 },
                    borderRadius: "20px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                    border: "1px solid #e2e8f0"
                }}
            >
                <Grid container spacing={4}>

                    {/* Секція: Особисті дані */}
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
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
                            {...register("firstName")}
                            disabled={isPendingProfile || isPendingRole}
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                            slotProps={{ inputLabel: { shrink: true } }}
                        />
                        {/* Вивід помилки валідації від Zod */}
                        {errors.firstName && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                                {errors.firstName.message}
                            </Typography>
                        )}
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Прізвище"
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                            disabled={isPendingProfile || isPendingRole}
                            {...register("lastName")}
                            slotProps={{ inputLabel: { shrink: true } }}
                        />
                        {/* Вивід помилки валідації від Zod */}
                        {errors.lastName && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                                {errors.lastName.message}
                            </Typography>
                        )}
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Email"
                            {...register("email")}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                        {/* Вивід помилки валідації від Zod */}
                        {errors.email && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                                {errors.email.message}
                            </Typography>
                        )}
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Button
                            variant="outlined"
                            size="medium"
                            sx={{
                                mt: 2,
                                mb: 3,
                                backgroundColor: "var(--color-primary)",
                                "&:hover": { backgroundColor: "var(--color-accent)" },
                                py: 1.5,
                                color: "white",
                                borderColor: 'divider'
                            }}
                        >
                            Змінити пароль
                        </Button>
                    </Grid>

                    <Can roles={["SuperAdmin"]}>

                        <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                <Security sx={{ color: 'primary.main' }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                    Рівень доступу та права
                                </Typography>
                            </Box>
                            <Divider />
                        </Grid>


                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth error={!!errors.role}>
                                <InputLabel id="role-select-label">Роль в системі</InputLabel>
                                <Controller
                                    name="role"
                                    control={control}
                                    // Значення за замовчуванням, якщо в user.role порожньо
                                    defaultValue={user?.role || "User"}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            labelId="role-select-label"
                                            label="Роль в системі"
                                            // Переконуємось, що значення не undefined для MUI
                                            value={field.value ?? ""}
                                            startAdornment={
                                                <AdminPanelSettings sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                                            }
                                        >
                                            {ROLES.map((role) => (
                                                <MenuItem key={role} value={role}>
                                                    {role}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                                {/* Вивід помилки валідації від Zod */}
                                {errors.role && (
                                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                                        {errors.role.message}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth error={!!errors.rights}>
                                <InputLabel id="rights-label">Доступні права</InputLabel>

                                <Controller
                                    name="rights"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            labelId="rights-label"
                                            label="Доступні права"
                                            value={field.value ?? ""}
                                            startAdornment={
                                                <Security sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                                            }
                                        >
                                            {RIGHTS.map((right) => (
                                                <MenuItem key={right} value={right}>
                                                    {right}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />

                                {/* Повідомлення про помилку від Zod */}
                                {errors.rights && (
                                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                                        {errors.rights.message}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>


                    </Can>

                </Grid>

                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 6 }}>
                    <Button
                        variant="outlined"
                        size="medium"
                        onClick={() => navigate(-1)}
                        sx={{
                            mt: 2,
                            mb: 3,
                            backgroundColor: "var(--color-primary)",
                            "&:hover": { backgroundColor: "var(--color-accent)" },
                            py: 1.5,
                            color: "white",
                            borderColor: 'divider'
                        }}
                    >
                        Скасувати
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        size="medium"
                        sx={{
                            mt: 2,
                            mb: 3,
                            backgroundColor: "var(--color-primary)",
                            "&:hover": { backgroundColor: "var(--color-accent)" },
                            py: 1.5,
                            px: 4
                        }}
                    >
                        Зберегти зміни

                    </Button>
                </Box>
            </Paper >
        </Box >
    );
}
