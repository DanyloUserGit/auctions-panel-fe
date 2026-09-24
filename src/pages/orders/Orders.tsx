import { ArrowBack } from '@mui/icons-material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CreateOrderPayload, OrderResponse } from './model/api';
import { useCreateOrder, useDeleteOrder, useOrdersList, useUpdateOrder } from './model/useOrders';

const initialFormState: CreateOrderPayload = {
  first_name: '',
  last_name: '',
  phone: '',
  internal_id: '',
  brand_names: '',
  brand_ids_csv: '',
  model_names: '',
  fuel_names: '',
  gearbox_names: '',
  engine_cc: null,
  year_from_ts: 0,
  year_to_ts: 0,
  price_from: '',
  price_to: '',
  mileage_from: 0,
  mileage_to: 0,
  options_txt: '',
  extra_info: '',
  updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  engine_cc_from: 0,
  engine_cc_to: 0,
};

export default function Orders() {
  const [search, setSearch] = useState('');

  // Стани модальних вікон
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // <--- Новий стан для модалки видалення

  const [formData, setFormData] = useState<CreateOrderPayload>(initialFormState);
  const navigate = useNavigate();

  // Стан для роботи з меню дій
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Хуки запитів
  const { data: orders = [], isLoading, isError, error } = useOrdersList();
  const createOrderMutation = useCreateOrder();
  const updateOrderMutation = useUpdateOrder();
  const deleteOrderMutation = useDeleteOrder();

  const filteredOrders = orders.filter((order) => {
    const carFullName = `${order.brand_names || ''} ${order.model_names || ''}`
      .trim()
      .toLowerCase();
    const query = search.toLowerCase();
    return carFullName.includes(query) || order.id.toString().includes(query);
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- ЛОГІКА МЕНЮ ДІЙ ---
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, order: OrderResponse) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCreateNewClick = () => {
    setIsEditMode(false);
    setFormData({ ...initialFormState, updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss') });
    setIsDialogOpen(true);
  };

  const handleEditClick = () => {
    if (selectedOrder) {
      setIsEditMode(true);
      const { id, created_at, ...rest } = selectedOrder;
      setFormData({
        ...rest,
        updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      });
      setIsDialogOpen(true);
    }
    handleMenuClose();
  };

  // Відкриваємо модалку видалення замість window.confirm
  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
    handleMenuClose();
  };

  // --- ЛОГІКА ВИДАЛЕННЯ ---
  const confirmDelete = () => {
    if (selectedOrder) {
      deleteOrderMutation.mutate(selectedOrder.id, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setSelectedOrder(null);
        }
      });
    }
  };

  // --- ЛОГІКА ЗБЕРЕЖЕННЯ ---
  const handleSaveOrder = () => {
    if (isEditMode && selectedOrder) {
      updateOrderMutation.mutate(
        { id: selectedOrder.id, payload: formData },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            setFormData(initialFormState);
            setSelectedOrder(null);
          },
        }
      );
    } else {
      createOrderMutation.mutate(formData, {
        onSuccess: () => {
          setIsDialogOpen(false);
          setFormData(initialFormState);
        },
      });
    }
  };

  const isPending = createOrderMutation.isPending || updateOrderMutation.isPending;

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#1e293b' }}>
            Замовлення
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateNewClick}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          + Створити замовлення
        </Button>
      </Stack>

      {/* Пошук */}
      <Card sx={{ p: 2, mb: 3, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', borderRadius: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Пошук за маркою, моделлю або номером..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#94a3b8' }} />
              </InputAdornment>
            ),
            sx: { borderRadius: 2, backgroundColor: '#f8fafc' },
          }}
        />
      </Card>

      {/* Завантаження та помилки */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      )}
      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Помилка при завантаженні замовлень: {(error as Error).message}
        </Alert>
      )}

      {/* Таблиця */}
      {!isLoading && !isError && (
        <TableContainer component={Paper} sx={{ boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: '#1e40af' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1e40af' }}>Дата</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1e40af' }}>Автомобіль</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1e40af' }}>Клієнт</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1e40af' }}>Бюджет</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', color: '#1e40af' }}>Дії</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3, color: '#64748b' }}>
                    Замовлень не знайдено
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id} sx={{ '&:hover': { backgroundColor: '#f1f5f9' }, transition: '0.2s' }}>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>
                      {dayjs(order.created_at).format('YYYY-MM-DD HH:mm') || '-'}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="600">
                        {`${order.brand_names || ''} ${order.model_names || ''}`.trim() || 'Не вказано'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#3b82f6', fontFamily: 'monospace' }}>
                        {order.internal_id || 'ID не вказано'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {order.first_name + ' ' + order.last_name || 'Невідомий'}
                    </TableCell>
                    <TableCell>
                      {order.price_from && order.price_to ? `${order.price_from}-${order.price_to}` : '-'}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={(e) => handleMenuOpen(e, order)}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* МЕНЮ ДІЙ */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', borderRadius: 2 }
        }}
      >
        <MenuItem onClick={handleEditClick}>Редагувати</MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          Видалити
        </MenuItem>
      </Menu>

      {/* --- МОДАЛКА ПІДТВЕРДЖЕННЯ ВИДАЛЕННЯ --- */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: '#ef4444' }}>
          Видалити замовлення?
        </DialogTitle>
        <DialogContent dividers>
          <Typography>
            Ви дійсно хочете видалити замовлення <b>#{selectedOrder?.id}</b>? Цю дію неможливо буде скасувати.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setIsDeleteDialogOpen(false)}
            color="inherit"
            disabled={deleteOrderMutation.isPending}
          >
            Скасувати
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
            disabled={deleteOrderMutation.isPending}
          >
            {deleteOrderMutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Видалити'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Спільне модальне вікно для створення та редагування замовлення */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditMode ? 'Редагувати замовлення' : 'Створити нове замовлення'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Ім'я" name="first_name" value={formData.first_name} onChange={handleInputChange} size="small" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Прізвище" name="last_name" value={formData.last_name} onChange={handleInputChange} size="small" />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Телефон" name="phone" value={formData.phone} onChange={handleInputChange} size="small" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Марка авто" name="brand_names" value={formData.brand_names} onChange={handleInputChange} size="small" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Модель авто" name="model_names" value={formData.model_names} onChange={handleInputChange} size="small" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Ціна від" name="price_from" value={formData.price_from} onChange={handleInputChange} size="small" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Ціна до" name="price_to" value={formData.price_to} onChange={handleInputChange} size="small" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="inherit" disabled={isPending}>
            Скасувати
          </Button>
          <Button onClick={handleSaveOrder} variant="contained" color="primary" disabled={isPending}>
            {isPending ? <CircularProgress size={24} color="inherit" /> : 'Зберегти'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}