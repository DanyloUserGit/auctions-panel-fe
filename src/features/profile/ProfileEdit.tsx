import { AdminPanelSettings, ArrowBack, Badge, Security } from "@mui/icons-material";
import {
    Box,
    Button,
    Chip,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Paper,
    Select,
    TextField,
    Typography,
    type SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../auth/model/useAuth";
import { RIGHTS, ROLES, type UpdateUser, type UserRights, type UserRole } from "../auth/model/user-schema";

export default function ProfileEdit() {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Ініціалізація стану згідно з UpdateUser типом
    const [formData, setFormData] = useState<UpdateUser>({
        id: user?.id || 0,
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        role: user?.role || "User",
        rights: Array.isArray(user?.rights) ? user.rights : [],
    });

    // Обробник для звичайних полів
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Обробник для Select (Role)
    const handleRoleChange = (e: SelectChangeEvent<string>) => {
        setFormData((prev) => ({ ...prev, role: e.target.value as UserRole }));
    };

    // Обробник для Multi-Select (Rights)
    const handleRightsChange = (e: SelectChangeEvent<UserRights[]>) => {
        const { value } = e.target;
        setFormData((prev) => ({
            ...prev,
            rights: typeof value === "string"
                ? (value.split(",") as UserRights[])
                : value,
        }));
    };

    const handleSave = () => {
        console.log("Дані для відправки на API:", formData);
        // Тут буде твій mutation.mutate(formData)
        alert("Дані збережено (дивіться консоль)");
    };

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", py: { xs: 2, sm: 4 }, px: 2 }}>
            {/* Шапка */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 1 }}>
                <IconButton onClick={() => navigate(-1)} sx={{ color: "text.secondary" }}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: "-0.5px" }}>
                    Налаштування профілю
                </Typography>
            </Box>

            <Paper
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
                            name="firstName"
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
                        <Button
                            type="submit"
                            variant="outlined"
                            size="medium"
                            onClick={() => navigate("/reset-password")}
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

                    {/* Секція: Доступ */}
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
                        <FormControl fullWidth>
                            <InputLabel id="role-label">Роль в системі</InputLabel>
                            <Select
                                labelId="role-label"
                                value={formData.role || ""}
                                label="Роль в системі"
                                onChange={handleRoleChange}
                                startAdornment={<AdminPanelSettings sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />}
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
                                labelId="rights-label"
                                multiple
                                value={formData.rights || []}
                                onChange={handleRightsChange}
                                input={<OutlinedInput label="Додаткові права" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                        {(selected as string[]).map((value) => (
                                            <Chip
                                                key={value}
                                                label={value}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                                sx={{ fontWeight: 600, borderRadius: '6px' }}
                                            />
                                        ))}
                                    </Box>
                                )}
                            >
                                {RIGHTS.map((right) => (
                                    <MenuItem key={right} value={right}>
                                        {right}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                </Grid>

                {/* Дії */}
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 6 }}>
                    <Button
                        type="submit"
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
                        onClick={handleSave}
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