import { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Stack,
  Switch,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Button,
  TextField,
  Autocomplete,
  Alert,
  Grid,
} from '@mui/material';
import {
  Person,
  Key,
  CheckCircleOutline,
  Block,
  Save,
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function UserAccessSettings() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', py: 4 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Налаштування доступів користувача
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Персональні правила та обмеження для конкретного акаунта
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Save />}
          sx={{ borderRadius: '8px' }}
        >
          Зберегти правила
        </Button>
      </Stack>

      <Paper
        sx={{
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ bgcolor: '#f8fafc', borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            icon={<Person fontSize="small" />}
            label="Дані клієнта"
            iconPosition="start"
          />
          <Tab
            icon={<Key fontSize="small" />}
            label="Авторизація"
            iconPosition="start"
          />
          <Tab
            icon={<CheckCircleOutline fontSize="small" />}
            label="Дозволені дії"
            iconPosition="start"
          />
          <Tab
            icon={<Block fontSize="small" />}
            label="Заборони"
            iconPosition="start"
          />
        </Tabs>

        {/* 1. Дані клієнта */}
        <CustomTabPanel value={tabValue} index={0}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            Прив’язка до замовників
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Виберіть клієнтів, дані яких будуть доступні цьому користувачу.
          </Typography>
          <Autocomplete
            multiple
            options={[
              'Client Alpha',
              'Client Beta',
              'Global Motors',
              'Logistics Pro',
            ]}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Доступні клієнти"
                placeholder="Виберіть зі списку"
              />
            )}
            sx={{ mb: 3 }}
          />
        </CustomTabPanel>

        {/* 2. Дані для авторизації */}
        <CustomTabPanel value={tabValue} index={1}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            Дозволені акаунти та винятки
          </Typography>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Дозволені IP адреси"
              placeholder="Наприклад: 192.168.1.1, 10.0.0.5"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Дозволити вхід через мобільний додаток"
            />
            <Alert severity="info">
              Користувач зможе авторизуватися лише з вказаних пристроїв або
              мереж.
            </Alert>
          </Stack>
        </CustomTabPanel>

        {/* 3. Список дозволених дій */}
        <CustomTabPanel value={tabValue} index={2}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            Функціональні дозволи
          </Typography>
          <FormGroup>
            <Grid container>
              {[
                'Створення лотів',
                'Перегляд аналітики',
                'Експорт звітів',
                'Чат з підтримкою',
              ].map((action) => (
                <Grid size={{ xs: 12, sm: 6 }} key={action}>
                  <FormControlLabel control={<Checkbox />} label={action} />
                </Grid>
              ))}
            </Grid>
          </FormGroup>
        </CustomTabPanel>

        {/* 4. Список заборонених дій */}
        <CustomTabPanel value={tabValue} index={3}>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ fontWeight: 600, color: 'error.main' }}
          >
            Блокування дій та кнопок
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Позначте дії, які будуть приховані або деактивовані для користувача.
          </Typography>
          <FormGroup>
            <Stack spacing={1}>
              <FormControlLabel
                control={<Switch color="error" />}
                label="Блокувати кнопку 'Видалити лот'"
              />
              <FormControlLabel
                control={<Switch color="error" />}
                label="Заборонити зміну ціни після початку торгів"
              />
              <FormControlLabel
                control={<Switch color="error" />}
                label="Приховати контактні дані продавців"
              />
            </Stack>
          </FormGroup>
        </CustomTabPanel>
      </Paper>
    </Box>
  );
}
