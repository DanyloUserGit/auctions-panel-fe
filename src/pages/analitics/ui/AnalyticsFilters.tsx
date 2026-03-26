import SearchIcon from '@mui/icons-material/Search';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

// Стиль для синіх заголовків фільтрів
const FilterLabel = ({ text }: { text: string }) => (
  <Typography
    variant="caption"
    sx={{
      bgcolor: '#1d4ed8',
      color: 'white',
      px: 1.5,
      py: 0.5,
      borderRadius: '999px',
      fontWeight: 700,
      fontSize: '11px',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      display: 'inline-flex',
      mb: 1,
    }}
  >
    {text}
  </Typography>
);

const AnalyticsFilters = () => {
  return (
    <Stack spacing={2}>
      {/* Основна панель фільтрів */}
      <Paper
        sx={{
          p: 2.5,
          borderRadius: 4,
          border: '1px solid #e5e7eb',
          boxShadow: 'none',
          background:
            'radial-gradient(circle at top left, #eff6ff 0, #f9fafb 45%, #ffffff 100%)',
        }}
      >
        {/* Фільтр типів */}
        <Box sx={{ mb: 2 }}>
          <FilterLabel text="ФІЛЬТР ТИПІВ:" />
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {[
              'Аукціон з відкритою ціною (Type 0)',
              'Аукціон з фіксованою ціною (Type 2)',
              'Аукціон зі стартовою ціною (Type 3)',
            ].map((type) => (
              <Chip
                key={type}
                label={type}
                variant="outlined"
                icon={<Checkbox size="small" checked sx={{ p: 0, ml: 1 }} />}
                sx={{
                  borderRadius: '999px',
                  bgcolor: '#dbeafe',
                  borderColor: '#2563eb',
                  fontWeight: 600,
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* Фільтр країн */}
        <Box sx={{ mb: 2 }}>
          <FilterLabel text="ФІЛЬТР КРАЇН:" />
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {[
              'Italy',
              'Netherlands',
              'Denmark',
              'Belgium',
              'Belgium',
              'France',
              'Romania',
              'Spain',
            ].map((country, idx) => (
              <Chip
                key={idx}
                label={country}
                variant="outlined"
                icon={<Checkbox size="small" checked sx={{ p: 0, ml: 1 }} />}
                sx={{
                  borderRadius: '999px',
                  bgcolor: '#dbeafe',
                  borderColor: '#2563eb',
                  fontWeight: 600,
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* Фільтр періоду */}
        <Box sx={{ mb: 2 }}>
          <FilterLabel text="ФІЛЬТР ПЕРІОДУ:" />
          <Stack direction="row" spacing={0.5} flexWrap="wrap">
            {[
              'Всі',
              '5 місяців',
              '4 місяці',
              '3 місяці',
              '2 місяці',
              '1 місяць',
              '2 тижня',
              '1 тиждень',
            ].map((p, idx) => (
              <Button
                key={p}
                size="small"
                variant={idx === 0 ? 'contained' : 'text'}
                sx={{
                  borderRadius: '999px',
                  minWidth: 'auto',
                  px: 2,
                  fontSize: '13px',
                  fontWeight: 600,
                  bgcolor: idx === 0 ? '#2563eb' : 'transparent',
                  color: idx === 0 ? 'white' : 'text.primary',
                }}
              >
                {p}
              </Button>
            ))}
          </Stack>
        </Box>

        {/* Режим ринкового коридору */}
        <Box sx={{ mb: 2 }}>
          <FilterLabel text="РЕЖИМ РИНКОВОГО КОРИДОРУ:" />
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="contained"
              sx={{ borderRadius: '999px', bgcolor: '#38bdf8' }}
            >
              Загальний
            </Button>
            <Button
              size="small"
              variant="text"
              sx={{
                borderRadius: '999px',
                color: 'text.primary',
                fontWeight: 600,
              }}
            >
              Реальний
            </Button>
          </Stack>
        </Box>

        {/* Активні фільтри (Summary) */}
        <Alert
          icon={false}
          sx={{
            bgcolor: '#e0f2fe',
            color: '#111827',
            borderRadius: 2,
            borderLeft: '4px solid #0ea5e9',
            fontSize: '13px',
          }}
        >
          <strong>🔍 Активні фільтри:</strong> обрані типи: type 0, type 2, type
          3; країни: Italy, Belgium, France... період: весь доступний період;
          режим коридору: загальний.
        </Alert>
      </Paper>

      {/* Пошук та додаткові дії */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        alignItems="center"
      >
        <Button
          size="small"
          variant="outlined"
          sx={{
            borderRadius: 2,
            color: 'text.primary',
            borderColor: '#e5e7eb',
            px: 3,
          }}
        >
          Скинути
        </Button>
        <FormControlLabel
          control={<Checkbox size="small" />}
          label={
            <Typography variant="body2" fontWeight="600">
              тільки дешевше поточного
            </Typography>
          }
        />
        <TextField
          size="small"
          placeholder="Пошук по VIN / характеристиці / моделі"
          sx={{ flexGrow: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
            ),
          }}
        />
      </Stack>
    </Stack>
  );
};

export default AnalyticsFilters;
