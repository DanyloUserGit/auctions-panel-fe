import {
  AdminPanelSettings,
  Assignment,
  GroupWork,
  HistoryToggleOff,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { SEVERITY_OPTIONS, type GlobalSettingsDTO } from '../model/types';
import { useMobile } from '../../../shared/hooks/useMobile';
import {
  useGlobalSettings,
  useUpdateGlobalSettings,
} from '../model/useGlobalSettings';
import { Loader } from '../../../shared/ui/Loader';

const NUMERIC_FIELDS: (keyof GlobalSettingsDTO)[] = [
  'inactivityTimeout',
  'globalSessionLimit',
  'sessionMaxConnections',
  'sessionRetentionDays',
  'streamFps',
  'streamQuality',
  'streamBitrateKbps',
];

export default function GlobalSettings() {
  const isMobile = useMobile();
  const { data, isLoading } = useGlobalSettings();
  const { mutate: update } = useUpdateGlobalSettings();

  const [settings, setLocalSettings] = useState<GlobalSettingsDTO | null>(null);

  if (data && !settings && !isLoading) {
    setLocalSettings(data);
  }

  const handleChange = (
    field: keyof GlobalSettingsDTO,
    value: string | number | boolean,
  ) => {
    if (!settings) return;

    setLocalSettings({
      ...settings,
      [field]:
        NUMERIC_FIELDS.includes(field)
          ? value === ''
            ? ''
            : Number(value)
          : value,
    });
  };

  const handleSave = () => {
    if (settings) {
      update(settings);
    }
  };

  const handleCancel = () => {
    setLocalSettings(data || null);
  };
  // Показуємо завантаження, щоб уникнути помилок доступу до undefined
  if (isLoading) return <Loader />;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, mx: 'auto' }}>
      {!isMobile && (
        <>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 800 }}>
            Системні налаштування
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Конфігурація глобальних лімітів та політики безпеки сесій.
          </Typography>
        </>
      )}

      <Paper
        sx={{
          p: 3,
          borderRadius: '16px',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack spacing={4}>
          <Box>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <HistoryToggleOff color="primary" fontSize="small" />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Тайм-аут бездіяльності
              </Typography>
            </Stack>
            <TextField
              fullWidth
              type="number"
              label="Час до завершення сесії"
              // Використовуємо ?? '' щоб уникнути відображення 0 коли дані ще не завантажені
              value={settings?.inactivityTimeout ?? ''}
              onChange={(e) =>
                handleChange('inactivityTimeout', e.target.value)
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">хв</InputAdornment>
                ),
              }}
              helperText="Сесія завершується автоматично, якщо стільки хвилин у ній не було жодної дії користувачів."
            />
          </Box>

          <Divider />

          <Box>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <GroupWork color="primary" fontSize="small" />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Глобальний ліміт сесій
              </Typography>
            </Stack>
            <TextField
              fullWidth
              type="number"
              label="Максимальна кількість одночасних сесій"
              value={settings?.globalSessionLimit ?? ''}
              onChange={(e) =>
                handleChange('globalSessionLimit', e.target.value)
              }
              helperText="Скільки сесій (браузерів) може працювати на сервері одночасно. 0 - без ліміту."
            />
            <TextField
              fullWidth
              type="number"
              sx={{ mt: 2 }}
              label="Користувачів в одній сесії"
              value={settings?.sessionMaxConnections ?? ''}
              onChange={(e) =>
                handleChange('sessionMaxConnections', e.target.value)
              }
              helperText="Коли сесію акаунта заповнено, наступний користувач автоматично отримує нову сесію."
            />
            <TextField
              fullWidth
              type="number"
              sx={{ mt: 2 }}
              label="Зберігати історію сесій і журнали, днів"
              value={settings?.sessionRetentionDays ?? ''}
              onChange={(e) =>
                handleChange('sessionRetentionDays', e.target.value)
              }
              helperText="Завершені сесії, їхні журнали, заборонені дії та інциденти старші за цей термін видаляються. 0 - зберігати завжди."
            />
          </Box>

          <Divider />

          {/* Якість трансляції (ТЗ 7.6): діє для нових сесій */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              Якість трансляції
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                type="number"
                label="Кадрів за секунду"
                value={settings?.streamFps ?? ''}
                onChange={(e) => handleChange('streamFps', e.target.value)}
                helperText="5-30; погоджено 15"
              />
              <TextField
                fullWidth
                type="number"
                label="Якість кадру, %"
                value={settings?.streamQuality ?? ''}
                onChange={(e) => handleChange('streamQuality', e.target.value)}
                helperText="30-100; вища - чіткіше фото авто"
              />
              <TextField
                fullWidth
                type="number"
                label="Бітрейт, кбіт/с"
                value={settings?.streamBitrateKbps ?? ''}
                onChange={(e) => handleChange('streamBitrateKbps', e.target.value)}
                helperText="500-20000; вищий - чіткіше, але більше навантаження"
              />
            </Stack>
            <Typography variant="caption" color="text.secondary">
              Нові значення застосовуються до сесій, запущених після збереження.
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <AdminPanelSettings color="primary" fontSize="small" />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Права адміністраторів (GA)
              </Typography>
            </Stack>
            <FormControlLabel
              control={
                <Switch
                  checked={settings?.gaCanAssignGa ?? false}
                  onChange={(e) =>
                    handleChange('gaCanAssignGa', e.target.checked)
                  }
                />
              }
              label={
                <Box>
                  <Typography variant="body2">
                    Дозволити GA призначати інших GA
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Якщо вимкнено, тільки SuperAdmin може керувати ролями
                    адміністраторів.
                  </Typography>
                </Box>
              }
            />
          </Box>

          <Divider />

          <Box>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Assignment color="primary" fontSize="small" />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Політика логування
              </Typography>
            </Stack>
            <TextField
              select
              fullWidth
              label="Рівень деталізації логів"
              value={settings?.loggingPolicy ?? 'Info'}
              onChange={(e) => handleChange('loggingPolicy', e.target.value)}
              helperText="Мінімальна важливість службових подій сесій, які записуються в журнал. Дії користувачів (переходи, натискання, введення) і заборонені дії записуються завжди."
            >
              {SEVERITY_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box
            sx={{ pt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}
          >
            <Button variant="outlined" color="inherit" onClick={handleCancel}>
              Скасувати
            </Button>
            <Button variant="contained" onClick={handleSave} sx={{ px: 4 }}>
              Зберегти зміни
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
