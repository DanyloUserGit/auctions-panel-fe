import { ArrowBack, Category, DeviceHub, Settings } from '@mui/icons-material';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SpeedIcon from '@mui/icons-material/Speed';
import {
  Alert,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  FormControl,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { RoleMap } from '../../features/auth/model/types';
import { useAuth } from '../../features/auth/model/useAuth';
import { Loader } from '../../shared/ui/Loader';
import type { Car } from './model/api';
import { usePurchasesData } from './model/useData';

const Purchases = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === RoleMap.Admin; // Або ваша логіка перевірки
  const currentDbName = 'caddylc2_caddycombca';
  const navigate = useNavigate();

  // Логіка залишається без змін
  const { cars, stats, isLoading, isError, updateStatus } = usePurchasesData(currentDbName);

  const handleStatusChange = async (carId: number, newStatus: number) => {
    try {
      await updateStatus({ carId, status: newStatus, dbName: currentDbName });
    } catch (error) {
      console.error('Помилка оновлення:', error);
      alert('Не вдалося оновити статус автомобіля.');
    }
  };

  // Рендер статусів через MUI компоненти
  const renderStatus = (car: Car) => {
    if (isAdmin) {
      return (
        <FormControl size="small">
          <Select
            value={car.status}
            onChange={(e) => handleStatusChange(car.id, Number(e.target.value))}
            sx={{
              minWidth: 140,
              bgcolor: 'background.paper',
              '& .MuiSelect-select': { py: 1 }
            }}
          >
            <MenuItem value={2}>Очікує</MenuItem>
            <MenuItem value={3}>Розподілено</MenuItem>
            <MenuItem value={4}>Відхилено</MenuItem>
          </Select>
        </FormControl>
      );
    }

    // Для звичайних користувачів використовуємо MUI Chip
    switch (car.status) {
      case 2:
        return <Chip label="В очікуванні" color="warning" variant="outlined" />;
      case 3:
        return <Chip label="Розподілено" color="success" />;
      case 4:
        return <Chip label="Відхилено" color="error" />;
      default:
        return <Chip label="Невідомо" color="default" />;
    }
  };

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <Box className="p-4 max-w-4xl mx-auto mt-10">
        <Alert severity="error">
          Помилка завантаження даних. Будь ласка, спробуйте пізніше.
        </Alert>
      </Box>
    );
  }

  return (
    <Box className="container mx-auto p-4 max-w-7xl mt-4">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Покупки
        </Typography>
      </Box>

      <Box className="flex flex-col gap-6">
        {/* Ліва панель: Статистика (MUI Paper) */}
        <Box sx={{ width: '100%', md: { width: '25%' } }}>
          <Paper elevation={2} sx={{ p: "5px", top: "4px", position: "sticky", borderRadius: "12px" }}>
            <Typography variant="h6" className="font-bold mb-4">
              Статистика
            </Typography>
            <Divider sx={{ marginBottom: "4px" }} />

            {stats ? (
              <Box className="flex gap-4">
                <Box>
                  <Typography variant="body2" color="text.secondary">Всього авто</Typography>
                  <Typography variant="h6" className="font-bold">{stats.total_count}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Розподілено</Typography>
                  <Typography variant="h6" className="font-bold text-green-600">{stats.distributed_count}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Загальна сума</Typography>
                  <Typography variant="h6" className="font-bold text-blue-600">€{stats.total_amount || 0}</Typography>
                </Box>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Статистика недоступна
              </Typography>
            )}
          </Paper>
        </Box>

        {/* Права панель: Список авто */}
        <Box className="w-full md:w-3/4 flex flex-col gap-4">
          {cars.length === 0 ? (
            <Alert severity="info" className="rounded-xl">
              Автомобілів не знайдено.
            </Alert>
          ) : (
            cars.map((car) => (
              <Card key={car.id} elevation={2} className="flex flex-col md:flex-row rounded-xl hover:shadow-lg transition-shadow duration-300 overflow-hidden">

                {/* Зображення */}
                <CardMedia
                  component="img"
                  image={car.image}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full md:w-1/3 object-cover h-64 md:h-auto"
                />

                {/* Інформація */}
                <CardContent className="w-full md:w-2/3 flex flex-col justify-between p-5">
                  <Box>
                    <Typography variant="overline" color="text.secondary" className="leading-none">
                      {car.auction_name}
                    </Typography>
                    <Typography variant="h5" component="h3" className="font-bold text-gray-800 mt-1 mb-3">
                      {car.brand} {car.model}
                    </Typography>

                    <Box className="flex flex-wrap gap-4 text-gray-600 mt-2">
                      <Box className="flex items-center gap-1">
                        <LocalGasStationIcon fontSize="small" />
                        <Typography variant="body2">{car.fuel}</Typography>
                      </Box>
                      <Box className="flex items-center gap-1">
                        <SpeedIcon fontSize="small" />
                        <Typography variant="body2">{car.mileage} км</Typography>
                      </Box>
                      <Box className="flex flex-row items-center gap-1">
                        <Settings fontSize="small" />
                        <Typography variant="body2"><b className='font-bold'>Характеристики:</b> {car.characteristics}</Typography>
                      </Box>
                      <Box className="flex items-center gap-1">
                        <Category fontSize="small" />
                        <Typography variant="body2"><b className='font-bold'>Тип аукціону:</b> {car.auction_type}</Typography>
                      </Box>
                      <Box className="flex items-center gap-1">
                        <DeviceHub fontSize="small" />
                        <Typography variant="body2"> {car.transmission}</Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Нижня частина блоку: Ціна та Статус */}
                  <Box className="flex flex-wrap justify-between items-end mt-6 pt-4 border-t border-gray-100 gap-4">
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Фінальна ціна
                      </Typography>
                      <Typography variant="h5" className="font-bold text-blue-600 leading-none">
                        €{car.max_bet || car.price}
                      </Typography>
                    </Box>
                    <Box>
                      {renderStatus(car)}
                    </Box>
                  </Box>

                </CardContent>
              </Card>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Purchases;