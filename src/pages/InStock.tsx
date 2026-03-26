import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  Stack,
  TextField,
  InputAdornment,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SpeedIcon from '@mui/icons-material/Speed';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SettingsIcon from '@mui/icons-material/Settings';
export type CarStatus = 'available' | 'reserved' | 'sold';

export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  engine: string;
  transmission: 'Автомат' | 'Механіка';
  price: number;
  chassis: string;
  imageUrl: string;
  status: CarStatus;
  location: string;
}

const MOCK_CARS: Car[] = [
  {
    id: 1,
    brand: 'BMW',
    model: '530d xDrive',
    year: 2020,
    mileage: 85000,
    engine: '3.0 Дизель',
    transmission: 'Автомат',
    price: 38500,
    chassis: 'WBA530...890',
    imageUrl: 'https://via.placeholder.com/400x250?text=BMW+530d',
    status: 'available',
    location: 'Львів'
  },
  {
    id: 2,
    brand: 'Audi',
    model: 'Q7 S-line',
    year: 2021,
    mileage: 62000,
    engine: '3.0 Дизель',
    transmission: 'Автомат',
    price: 52000,
    chassis: 'WAUZZZ...321',
    imageUrl: 'https://via.placeholder.com/400x250?text=Audi+Q7',
    status: 'reserved',
    location: 'Київ'
  },
  {
    id: 3,
    brand: 'Volkswagen',
    model: 'Passat B8',
    year: 2019,
    mileage: 145000,
    engine: '2.0 Дизель',
    transmission: 'Автомат',
    price: 19200,
    chassis: 'WVWZZZ...444',
    imageUrl: 'https://via.placeholder.com/400x250?text=VW+Passat',
    status: 'available',
    location: 'Рівне'
  }
];
const InStockpage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Логіка для кольорів статусів
  const getStatusChip = (status: CarStatus) => {
    const config = {
      available: { label: 'В наявності', color: '#16a34a', bg: '#dcfce7' },
      reserved: { label: 'Резерв', color: '#d97706', bg: '#fef3c7' },
      sold: { label: 'Продано', color: '#dc2626', bg: '#fee2e2' },
    };
    const current = config[status];

    return (
      <Chip
        label={current.label}
        size="small"
        sx={{
          color: current.color,
          bgcolor: current.bg,
          fontWeight: 'bold',
          borderRadius: 1
        }}
      />
    );
  };

  // Фільтрація авто
  const filteredCars = MOCK_CARS.filter(car =>
    `${car.brand} ${car.model} ${car.chassis}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>

      {/* Заголовок */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="800" sx={{ color: '#1e40af' }}>
            Авто в наявності
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Каталог автомобілів, доступних для продажу
          </Typography>
        </Box>
        <Button
          variant="contained"
          sx={{ bgcolor: '#1e40af', '&:hover': { bgcolor: '#3b82f6' } }}
        >
          + Додати авто
        </Button>
      </Stack>

      {/* Панель пошуку */}
      <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 2, mb: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Пошук за маркою, моделлю або VIN..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#64748b' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Сітка автомобілів */}
      <Grid container spacing={3}>
        {filteredCars.map((car) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={car.id}>

            <Card sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }
            }}>

              {/* Зображення авто */}
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={car.imageUrl}
                  alt={`${car.brand} ${car.model}`}
                />
                <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                  {getStatusChip(car.status)}
                </Box>
              </Box>

              <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#0f172a', mb: 0.5 }}>
                  {car.brand} {car.model} <Typography component="span" color="text.secondary">({car.year})</Typography>
                </Typography>
                <Typography variant="caption" sx={{ color: '#3b82f6', fontFamily: 'monospace', display: 'block', mb: 2 }}>
                  VIN: {car.chassis}
                </Typography>

                {/* Характеристики з іконками */}
                <Stack spacing={1.5} sx={{ mb: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <SpeedIcon sx={{ fontSize: 18, color: '#64748b' }} />
                    <Typography variant="body2" sx={{ color: '#475569' }}>{car.mileage.toLocaleString()} км</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <LocalGasStationIcon sx={{ fontSize: 18, color: '#64748b' }} />
                    <Typography variant="body2" sx={{ color: '#475569' }}>{car.engine}</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <SettingsIcon sx={{ fontSize: 18, color: '#64748b' }} />
                    <Typography variant="body2" sx={{ color: '#475569' }}>{car.transmission}</Typography>
                  </Stack>
                </Stack>

                <Divider sx={{ my: 1.5 }} />

                <Typography variant="h5" fontWeight="bold" sx={{ color: '#1e40af' }}>
                  € {car.price.toLocaleString()}
                </Typography>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ borderColor: '#dbeafe', color: '#1e40af', '&:hover': { bgcolor: '#f1f5f9' } }}
                >
                  Редагувати
                </Button>
                <Button fullWidth variant="contained" sx={{ bgcolor: '#3b82f6' }}>
                  Продати
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}

        {filteredCars.length === 0 && (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" sx={{ color: '#64748b' }}>Автомобілів не знайдено</Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
export default InStockpage