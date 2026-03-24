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
import { useMobile } from '../../../shared/hooks/useMobile';
import { Loader } from '../../../shared/ui/Loader';
import { SEVERITY_OPTIONS, type GlobalSettingsDTO } from '../model/types';
import {
  useGlobalSettings,
  useUpdateGlobalSettings,
} from '../model/useGlobalSettings';

export default function GlobalSettings() {
  const { data, isLoading } = useGlobalSettings();

  if (isLoading || !data) {
    return <Loader />;
  }

  return <GlobalSettingsForm initialData={data} />;
}

function GlobalSettingsForm({
  initialData,
}: {
  initialData: GlobalSettingsDTO;
}) {
  const isMobile = useMobile();
  const { mutate: update } = useUpdateGlobalSettings();
  const [localSettings, setLocalSettings] =
    useState<GlobalSettingsDTO>(initialData);

  const handleChange = (
    field: keyof GlobalSettingsDTO,
    value: string | number | boolean,
  ) => {
    let finalValue = value;

    if (field === 'inactivityTimeout' || field === 'globalSessionLimit') {
      finalValue = value === '' ? '' : Number(value);
    }

    setLocalSettings({
      ...localSettings,
      [field]: finalValue,
    });
  };

  const handleSave = () => {
    update(localSettings);
  };

  const handleCancel = () => {
    setLocalSettings(initialData);
  };

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
          {/* Секція Тайм-ауту */}
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
              value={localSettings.inactivityTimeout ?? ''}
              onChange={(e) =>
                handleChange('inactivityTimeout', e.target.value)
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">хв</InputAdornment>
                ),
              }}
              helperText="Автоматичне розлогування користувача після періоду бездіяльності."
            />
          </Box>

          <Divider />

          {/* Секція Ліміту сесій */}
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
              value={localSettings.globalSessionLimit ?? ''}
              onChange={(e) =>
                handleChange('globalSessionLimit', e.target.value)
              }
              helperText="Обмеження загальної кількості активних підключень до системи."
            />
          </Box>

          <Divider />

          {/* Секція Прав доступу */}
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
                  checked={localSettings.gaCanAssignGa ?? false}
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

          {/* Секція Логування */}
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
              value={localSettings.loggingPolicy ?? 'Info'}
              onChange={(e) => handleChange('loggingPolicy', e.target.value)}
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
