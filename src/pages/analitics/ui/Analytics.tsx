import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import AnalyticsFilters from './AnalyticsFilters';
import AnalyticsTabs from './AnalyticsTabs';

const AnalyticsPage = () => {
  const [vin, setVin] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event);
    setActiveTab(newValue);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}
    >
      {/* 1. СЕКЦІЯ ПОШУКУ */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              boxShadow: '0 4px 20px rgba(15, 23, 42, 0.06)',
              border: '1px solid #e5e7eb',
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 9 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Введіть VIN код для аналізу (напр. WAUZZZ...)"
                  value={vin}
                  onChange={(e) => setVin(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 3, bgcolor: '#fff' },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{
                    height: 56,
                    borderRadius: 3,
                    bgcolor: '#1e40af',
                    fontWeight: 700,
                  }}
                >
                  Пошук
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Stack spacing={3}>
        {/* 2. ІНФОРМАЦІЯ ПРО АВТО (Horizontal Card style) */}
        <Stack spacing={3}>
          {/* Блок: Продажі цього VIN */}
          <Paper
            sx={{
              p: 2,
              bgcolor: '#fff7ed',
              border: '1px solid #fed7aa',
              borderRadius: 3,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label="VIN"
                size="small"
                sx={{
                  bgcolor: '#4b5563',
                  color: 'white',
                  fontWeight: 800,
                  borderRadius: 1,
                }}
              />
              <Typography variant="subtitle2" fontWeight="700">
                Продажі цього VIN у вибраних даних
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ mt: 1, color: '#444' }}>
              11.03.2026 — <strong>14 500 €</strong> — 109 401 км — type 2
              [France]
            </Typography>
          </Paper>

          {/* Головний блок: Ринковий коридор */}
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              border: '1px solid #e5e7eb',
              boxShadow: 'none',
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.5 }}>
              <Chip
                label="Ринковий коридор"
                size="small"
                color="primary"
                sx={{ mr: 1, fontWeight: 800 }}
              />
              по схожих авто (загальний рівень)
            </Typography>
            <Typography
              variant="caption"
              color="textSecondary"
              display="block"
              sx={{ mb: 3 }}
            >
              На основі очищеної вибірки проданих лотів із застосованими
              фільтрами.
            </Typography>

            <Grid container spacing={4}>
              {/* Ліва колонка: Перцентилі */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={2}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Chip
                      label="25-й перцентиль"
                      variant="outlined"
                      sx={{
                        borderColor: '#38bdf8',
                        bgcolor: '#e0f2fe',
                        fontWeight: 700,
                      }}
                    />
                    <Typography variant="body2">
                      +25% від нижньої ціни: <strong>14 195 €</strong>
                    </Typography>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Chip
                      label="Середня ринкова ціна"
                      variant="outlined"
                      sx={{
                        borderColor: '#22c55e',
                        bgcolor: '#dcfce7',
                        fontWeight: 700,
                      }}
                    />
                    <Typography variant="body2">
                      Медіана: <strong>15 400 €</strong>
                    </Typography>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Chip
                      label="75-й перцентиль"
                      variant="outlined"
                      sx={{
                        borderColor: '#f97316',
                        bgcolor: '#ffedd5',
                        fontWeight: 700,
                      }}
                    />
                    <Typography variant="body2">
                      -25% від верхньої ціни: <strong>16 529 €</strong>
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              {/* Права колонка: Поточне авто */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={1} sx={{ textAlign: { md: 'right' } }}>
                  <Typography variant="body2" color="textSecondary">
                    Мінімальна ціна: <strong>10 166 €</strong>
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Середня ціна: <strong>15 352 €</strong>
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Максимальна ціна: <strong>20 584 €</strong>
                  </Typography>

                  <Box
                    sx={{
                      mt: 2,
                      p: 1.5,
                      bgcolor: '#fee2e2',
                      borderRadius: 2,
                      border: '1px solid #fecaca',
                    }}
                  >
                    <Chip
                      label="Поточне авто"
                      size="small"
                      color="error"
                      sx={{ mb: 1, fontWeight: 800 }}
                    />
                    <Typography variant="h6" fontWeight="800">
                      11 000 €
                    </Typography>
                    <Typography
                      variant="caption"
                      display="block"
                      color="error"
                      fontWeight="600"
                    >
                      Позиція відносно ринку: нижче типового діапазону, -28.6%
                      до медіани
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Блок: Рекомендована ціна */}
            <Box>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <Chip
                  label="Рекомендована ціна покупки"
                  color="success"
                  sx={{ fontWeight: 800 }}
                />
                <Typography variant="h6" fontWeight="800" color="success.main">
                  11 550 – 13 860 €
                </Typography>
              </Stack>
              <Typography variant="body2">
                <strong>На перепродаж:</strong> 10 780 – 13 090 €
              </Typography>
              <Typography variant="body2">
                <strong>Для власного користування:</strong> 14 630 – 16 170 €
              </Typography>
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ mt: 1, display: 'block' }}
              >
                Розраховано за 158 проданими лотами за обраний період.
              </Typography>
            </Box>

            {/* Пояснення та виключення (Викиди) */}
            <Box sx={{ mt: 3, p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
              <Typography variant="body2" fontWeight="700" gutterBottom>
                Ігноровані значення при розрахунку (викиди):
              </Typography>
              <Typography
                variant="caption"
                display="block"
                color="textSecondary"
              >
                • type 0: 9 687 € — виключено як нижній викид
              </Typography>
              <Typography
                variant="caption"
                display="block"
                color="textSecondary"
              >
                • type 0: 18 089 € — виключено як верхній викид
              </Typography>
              <Typography
                variant="caption"
                display="block"
                color="textSecondary"
              >
                • type 3: 9 339 € — видалено через можливу аномалію
              </Typography>
            </Box>
          </Paper>
        </Stack>

        {/* 3. ФІЛЬТРИ (Аналог панелі зі скріншотів) */}
        <AnalyticsFilters />
        {/* 4. ГРАФІКИ ТА ТАБЛИЦЯ */}
        <AnalyticsTabs
          activeTab={activeTab}
          handleTabChange={handleTabChange}
        />
      </Stack>
    </Container>
  );
};

export default AnalyticsPage;
