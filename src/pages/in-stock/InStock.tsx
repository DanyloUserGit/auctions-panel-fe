
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import { Can } from '../../features/auth/ui/Can';
import type { Car, CarStatus } from './model/api';
import { useCreateCar, useInStockCars, useUpdateCar } from './model/useData';


const initialFormState: Partial<Car> = {
  brand: '', model: '', year: 2020, mileage: 0,
  engine: '',
  transmission: 'Automatic',
  price: 0, chassis: '',
  imageUrl: '', status: 'available', location: ''
};

const InStockpage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCarId, setEditingCarId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Car>>(initialFormState);

  const { data: cars = [], isLoading, isError, error } = useInStockCars();
  const createCarMutation = useCreateCar();
  const updateCarMutation = useUpdateCar();

  const handleOpenDialog = (car?: Car) => {
    if (car) {
      setEditingCarId(car.id);
      setFormData(car);
    } else {
      setEditingCarId(null);
      setFormData(initialFormState);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setFormData(initialFormState);
    setEditingCarId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Валідація форми: не дозволяємо зберегти "порожнє" авто,
  // а нове авто не може одразу мати статус "Продано"
  const getFormError = (): string | null => {
    if (!formData.brand?.trim()) return 'Вкажіть марку авто';
    if (!formData.model?.trim()) return 'Вкажіть модель авто';
    if (!formData.price || Number(formData.price) <= 0) return 'Вкажіть коректну ціну';
    if (!editingCarId && formData.status === 'sold') {
      return 'Неможливо створити нове авто одразу зі статусом "Продано"';
    }
    return null;
  };

  const formError = getFormError();

  const handleSubmit = () => {
    if (formError) return;

    if (editingCarId) {
      updateCarMutation.mutate({ id: editingCarId, carData: formData }, {
        onSuccess: handleCloseDialog
      });
    } else {
      createCarMutation.mutate(formData, {
        onSuccess: handleCloseDialog
      });
    }
  };

  // Обробник кнопки "Продати" - переводить авто у статус "Продано"
  const handleSellCar = (car: Car) => {
    updateCarMutation.mutate({ id: car.id, carData: { ...car, status: 'sold' } });
  };

  const getStatusChip = (status: CarStatus) => {
    const config = {
      available: { label: 'В наявності', color: '#16a34a', bg: '#dcfce7' },
      reserved: { label: 'Резерв', color: '#d97706', bg: '#fef3c7' },
      sold: { label: 'Продано', color: '#dc2626', bg: '#fee2e2' },
    };
    const current = config[status] || config.available; // fallback

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

  // Фільтрація авто (застосовується до cars, які прийшли з API)
  const filteredCars = cars.filter((car) =>
    `${car.brand} ${car.model} ${car.chassis}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

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
        <Can roles={['SuperAdmin', 'Admin']}>
          <Button
            onClick={() => handleOpenDialog()}
            variant="contained"
            sx={{ bgcolor: '#1e40af', '&:hover': { bgcolor: '#3b82f6' } }}
          >
            + Додати авто
          </Button>
        </Can>
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

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Alert severity="error" sx={{ mb: 4 }}>
          Помилка завантаження даних: {error?.message}
        </Alert>
      )}

      {!isLoading && !isError && (
        <Grid container spacing={3}>
          {filteredCars.map((car) => (
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
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={car.imageUrl}
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
                      ({car.year})
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

                <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                  <Can roles={['SuperAdmin', 'Admin']}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => handleOpenDialog(car)}
                      sx={{
                        borderColor: '#dbeafe',
                        color: '#1e40af',
                        '&:hover': { bgcolor: '#f1f5f9' },
                      }}
                    >
                      Редагувати
                    </Button>
                  </Can>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ bgcolor: '#3b82f6' }}
                    onClick={() => handleSellCar(car)}
                    disabled={car.status === 'sold' || updateCarMutation.isPending}
                  >
                    Продати
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}

          {filteredCars.length === 0 && (
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
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingCarId ? 'Редагувати авто' : 'Додати нове авто'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth label="Марка" name="brand" value={formData.brand || ''} onChange={handleChange} size="small" />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth label="Модель" name="model" value={formData.model || ''} onChange={handleChange} size="small" />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth type="number" label="Рік" name="year" value={formData.year || ''} onChange={handleChange} size="small" />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth type="number" label="Ціна (€)" name="price" value={formData.price || ''} onChange={handleChange} size="small" />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth type="number" label="Пробіг (км)" name="mileage" value={formData.mileage || ''} onChange={handleChange} size="small" />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth label="Двигун (напр. 2.0 Diesel)" name="engine" value={formData.engine || ''} onChange={handleChange} size="small" />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth label="VIN / Шасі" name="chassis" value={formData.chassis || ''} onChange={handleChange} size="small" />
            </Grid>
            <Grid size={{ xs: 6 }}>
              {/* ОНОВЛЕНЕ ПОЛЕ ТРАНСМІСІЇ */}
              <TextField select fullWidth label="Трансмісія" name="transmission" value={formData.transmission || 'Automatic'} onChange={handleChange} size="small">
                <MenuItem value="Automatic">Automatic</MenuItem>
                <MenuItem value="Mechanic">Mechanic</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField select fullWidth label="Статус" name="status" value={formData.status || 'available'} onChange={handleChange} size="small">
                <MenuItem value="available">В наявності</MenuItem>
                <MenuItem value="reserved">Резерв</MenuItem>
                {/* "Продано" доступне лише при редагуванні існуючого авто,
                    щоб не можна було одразу створити продане авто */}
                {editingCarId && <MenuItem value="sold">Продано</MenuItem>}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="URL зображення" name="imageUrl" value={formData.imageUrl || ''} onChange={handleChange} size="small" />
            </Grid>
            {formError && (
              <Grid size={{ xs: 12 }}>
                <Alert severity="warning">{formError}</Alert>
              </Grid>
            )}
            {(createCarMutation.isError || updateCarMutation.isError) && (
              <Grid size={{ xs: 12 }}>
                <Alert severity="error">
                  {(createCarMutation.error || updateCarMutation.error)?.message || 'Не вдалося зберегти авто'}
                </Alert>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} color="inherit">Скасувати</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!!formError || createCarMutation.isPending || updateCarMutation.isPending}
          >
            {createCarMutation.isPending || updateCarMutation.isPending ? 'Збереження...' : 'Зберегти'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InStockpage;