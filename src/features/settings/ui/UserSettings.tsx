import { Button, Paper, Stack, TextField, Typography } from '@mui/material';

export function UserSettings() {
    return (
        <Stack spacing={3}>
            <Paper sx={{ p: 3, borderRadius: '20px' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Дані профілю</Typography>
                <Stack spacing={2}>
                    <Stack direction="row" spacing={2}>
                        <TextField label="Ім'я" fullWidth defaultValue="Misha" />
                        <TextField label="Прізвище" fullWidth />
                    </Stack>
                    <TextField label="Email" fullWidth disabled defaultValue="user@example.com" />
                    <Button variant="contained" sx={{ width: 'fit-content' }}>Зберегти зміни</Button>
                </Stack>
            </Paper>

            <Paper sx={{ p: 3, borderRadius: '20px' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Безпека</Typography>
                <Stack spacing={2} sx={{ maxWidth: 400 }}>
                    <TextField type="password" label="Поточний пароль" fullWidth />
                    <TextField type="password" label="Новий пароль" fullWidth />
                    <Button variant="outlined" color="error">Оновити пароль</Button>
                </Stack>
            </Paper>
        </Stack>
    );
}