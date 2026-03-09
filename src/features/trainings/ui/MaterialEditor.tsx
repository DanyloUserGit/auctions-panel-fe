import {
  Paper,
  TextField,
  Switch,
  FormControlLabel,
  Stack,
  Box,
  Button,
  Typography,
  Divider,
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

export const MaterialEditor = () => {
  return (
    <Paper sx={{ p: 3, borderRadius: '12px' }}>
      <Stack spacing={3}>
        <TextField label="Заголовок матеріалу" fullWidth variant="outlined" />

        {/* Тут інтегруємо редактор (напр. React-Quill або MUI-Tiptap) */}
        <Box
          sx={{
            minHeight: 400,
            border: '1px solid #ddd',
            p: 2,
            borderRadius: '8px',
          }}
        >
          <Typography color="text.secondary">
            Поле для Rich Text Editor...
          </Typography>
        </Box>

        <Box>
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUpload />}
          >
            Завантажити головне фото
            <input type="file" hidden accept="image/*" />
          </Button>
        </Box>

        <Divider />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <FormControlLabel
            control={<Switch defaultChecked color="success" />}
            label="Опублікувати відразу"
          />

          <Stack direction="row" spacing={2}>
            <Button variant="text">Зберегти як чернетку</Button>
            <Button variant="contained" size="large">
              Зберегти матеріал
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
};
