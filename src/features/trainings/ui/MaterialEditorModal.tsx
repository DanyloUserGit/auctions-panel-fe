import { Dialog, DialogTitle, DialogContent, DialogActions, Stack, Switch, FormControlLabel, TextField, Box, Typography, Button } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

export function MaterialEditorModal({ open, onClose }: { open: boolean, onClose: () => void }) {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle sx={{ fontWeight: 800 }}>Створення навчального матеріалу</DialogTitle>
            <DialogContent dividers>
                <Stack spacing={3} sx={{ mt: 1 }}>
                    <TextField label="Заголовок" fullWidth />

                    {/* Заглушка під Rich Text Editor */}
                    <Box sx={{
                        height: 300,
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: '#fafafa'
                    }}>
                        <Typography color="text.disabled">Тут буде Rich Text Editor (Tiptap / Quill)</Typography>
                    </Box>

                    {/* Завантаження фото */}
                    <Button variant="outlined" component="label" startIcon={<CloudUpload />}>
                        Завантажити зображення
                        <input type="file" hidden accept="image/*" />
                    </Button>

                    <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="Опублікувати відразу (Visible for all)"
                    />
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="inherit">Скасувати</Button>
                <Button variant="contained">Зберегти матеріал</Button>
            </DialogActions>
        </Dialog>
    );
}