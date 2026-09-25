
import { ArrowBack } from '@mui/icons-material';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import SpeedIcon from '@mui/icons-material/Speed';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage, resolveFileUrl } from '../../shared/utils';
import type { Car, CarFilters, CarStatus } from './model/api';
import { useInStockCars, useSellCar } from './model/useData';
import CarDetailsDialog from './ui/CarDetailsDialog';
import CarFormDialog from './ui/CarFormDialog';

const NO_PHOTO = '/images/no-photo.jpg';

const InStockpage: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<CarFilters>({ search: '', status: '', priceFrom: '', priceTo: '' });
  // undefined - форма закрита, null - нове авто, Car - редагування.
  const [editingCar, setEditingCar] = useState<Car | null | undefined>(undefined);
  const [viewedCar, setViewedCar] = useState<Car | null>(null);

  const { data, isLoading, isError, error } = useInStockCars(filters);
  const cars = data?.cars ?? [];
  const sellCarMutation = useSellCar();

  const setFilter = <K extends keyof CarFilters>(key: K, value: CarFilters[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const handleSellCar = (car: Car) => {
    if (window.confirm(`Позначити ${car.brand} ${car.model} як продане?`)) {
      sellCarMutation.mutate(car.id);
    }
  };

  const getStatusChip = (status: CarStatus) => {
    const config = {
      available: { label: 'В наявності', color: '#16a34a', bg: '#dcfce7' },
      reserved: { label: 'Резерв', color: '#d97706', bg: '#fef3c7' },
      sold: { label: 'Продано', color: '#dc2626', bg: '#fee2e2' },
    };
    const current = config[status] || config.available;

    return (
      <Chip
        label={current.label}
        size="small"
        sx={{
          color: current.color,
          bgcolor: current.bg,
          fontWeight: 'bold',
          borderRadius: 1,
        }}
      />
    );
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4, flexWrap: 'wrap', gap: 2 }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" fontWeight="800" sx={{ color: '#1e40af' }}>
              Авто в наявності
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Каталог автомобілів, доступних для продажу
          </Typography>
        </Box>
        {data?.canAdd && (
          <Button
            onClick={() => setEditingCar(null)}
            variant="contained"
            sx={{ bgcolor: '#1e40af', '&:hover': { bgcolor: '#3b82f6' } }}
          >
            + Додати авто
          </Button>
        )}
      </Stack>

      <Box
        sx={{
          bgcolor: 'white',
          p: 2,
          borderRadius: 2,
          mb: 4,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Пошук за маркою, моделлю або VIN..."
              value={filters.search}
              onChange={(e) => setFilter('search', e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#64748b' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4, md: 2 }}>
            <TextField select fullWidth size="small" label="Статус" value={filters.status} onChange={(e) => setFilter('status', e.target.value as CarFilters['status'])}>
              <MenuItem value="">Усі</MenuItem>
              <MenuItem value="available">В наявності</MenuItem>
              <MenuItem value="reserved">Резерв</MenuItem>
              <MenuItem value="sold">Продано</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <TextField fullWidth size="small" type="number" label="Ціна від (€)" value={filters.priceFrom} onChange={(e) => setFilter('priceFrom', e.target.value === '' ? '' : Number(e.target.value))} />
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <TextField fullWidth size="small" type="number" label="Ціна до (€)" value={filters.priceTo} onChange={(e) => setFilter('priceTo', e.target.value === '' ? '' : Number(e.target.value))} />
          </Grid>
        </Grid>
      </Box>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Alert severity="error" sx={{ mb: 4 }}>
          Помилка завантаження даних: {getErrorMessage(error)}
        </Alert>
      )}

      {!isLoading && !isError && (
        <Grid container spacing={3}>
          {cars.map((car) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={car.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <Box sx={{ position: 'relative', cursor: 'pointer' }} onClick={() => setViewedCar(car)}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={car.imageUrl ? resolveFileUrl(car.imageUrl) : NO_PHOTO}
                    alt={`${car.brand} ${car.model}`}
                    sx={{ objectFit: 'cover' }}
                  />
                  <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                    {getStatusChip(car.status)}
                  </Box>
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ color: '#0f172a', mb: 0.5 }}
                  >
                    {car.brand} {car.model}{' '}
                    <Typography component="span" color="text.secondary">
                      ({car.year ?? '-'})
                    </Typography>
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#3b82f6',
                      fontFamily: 'monospace',
                      display: 'block',
                      mb: 2,
                    }}
                  >
                    VIN: {car.chassis || 'Не вказано'}
                  </Typography>

                  <Stack spacing={1.5} sx={{ mb: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <SpeedIcon sx={{ fontSize: 18, color: '#64748b' }} />
                      <Typography variant="body2" sx={{ color: '#475569' }}>
                        {Number(car.mileage).toLocaleString()} км
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <LocalGasStationIcon sx={{ fontSize: 18, color: '#64748b' }} />
                      <Typography variant="body2" sx={{ color: '#475569' }}>
                        {car.engine}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <SettingsIcon sx={{ fontSize: 18, color: '#64748b' }} />
                      <Typography variant="body2" sx={{ color: '#475569' }}>
                        {car.transmission}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Divider sx={{ my: 1.5 }} />

                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{ color: '#1e40af' }}
                  >
                    € {Number(car.price).toLocaleString()}
                  </Typography>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0, gap: 1, flexWrap: 'wrap' }}>
                  <Button fullWidth variant="text" onClick={() => setViewedCar(car)}>
                    Детальніше
                  </Button>
                  {car.canEdit && (
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => setEditingCar(car)}
                      sx={{
                        borderColor: '#dbeafe',
                        color: '#1e40af',
                        '&:hover': { bgcolor: '#f1f5f9' },
                      }}
                    >
                      Редагувати
                    </Button>
                  )}
                  {car.canSell && (
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ bgcolor: '#3b82f6' }}
                      onClick={() => handleSellCar(car)}
                      disabled={sellCarMutation.isPending}
                    >
                      Продати
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}

          {cars.length === 0 && (
            <Grid size={{ xs: 12 }}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" sx={{ color: '#64748b' }}>
                  Автомобілів не знайдено
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      )}
      {sellCarMutation.isError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {getErrorMessage(sellCarMutation.error, 'Не вдалося продати авто')}
        </Alert>
      )}
      {editingCar !== undefined && (
        <CarFormDialog car={editingCar} onClose={() => setEditingCar(undefined)} />
      )}
      {viewedCar && <CarDetailsDialog car={viewedCar} onClose={() => setViewedCar(null)} />}
    </Box>
  );
};

export default InStockpage;