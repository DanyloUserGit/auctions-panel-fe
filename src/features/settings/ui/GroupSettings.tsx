import { Box, FormControlLabel, Paper, Slider, Stack, Switch, Typography } from '@mui/material';

export function GroupSettings() {
    return (
        <Stack spacing={3}>
            <Paper sx={{ p: 3, borderRadius: '20px' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Ліміти сесій</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                    Максимальна кількість активних WebRTC сесій для вашої групи.
                </Typography>
                <Box sx={{ px: 2 }}>
                    <Slider defaultValue={5} step={1} marks min={1} max={20} valueLabelDisplay="auto" />
                </Box>
            </Paper>

            <Paper sx={{ p: 3, borderRadius: '20px' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Доступ та заборони</Typography>
                <Stack spacing={1}>
                    <FormControlLabel control={<Switch defaultChecked />} label="Дозволити перегляд списку акаунтів" />
                    <FormControlLabel control={<Switch />} label="Заборонити зміну налаштувань термінала" />
                    <FormControlLabel control={<Switch defaultChecked />} label="Автоматичне закриття сесії після закінчення аукціону" />
                </Stack>
            </Paper>
        </Stack>
    );
}