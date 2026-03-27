import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useOrdersList } from './model/useOrders';


// const getStatusChip = (status: OrderStatus) => {
//   const statusConfig: Record<OrderStatus, { label: string; color: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" }> = {
//     new: { label: 'Нове', color: 'info' },
//     selection: { label: 'Підбір', color: 'warning' },
//     completed: { label: 'Завершено', color: 'success' },
//     paused: { label: 'Пауза', color: 'default' },
//     cancelled: { label: 'Скасовано', color: 'error' },
//   };

//   const config = statusConfig[status] || { label: 'Невідомо', color: 'default' };

//   return <Chip label={config.label} color={config.color} size="small" sx={{ fontWeight: 600 }} />;
// };

export default function Orders() {
  const [search, setSearch] = useState('');

  // Використовуємо наш винесений хук
  const { data: orders = [], isLoading, isError, error } = useOrdersList();

  const filteredOrders = orders.filter((order) => {
    const carFullName = `${order.brand_names || ''} ${order.model_names || ''}`.trim().toLowerCase();
    const query = search.toLowerCase();
    return carFullName.includes(query) || order.id.toString().includes(query);
  });

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: '#1e293b' }}>
          Замовлення
        </Typography>
        <Button variant="contained" color="primary" sx={{ textTransform: 'none', fontWeight: 600 }}>
          + Створити замовлення
        </Button>
      </Stack>

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
            sx: { borderRadius: 2, backgroundColor: '#f8fafc' }
          }}
        />
      </Card>

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
                {/* <TableCell sx={{ fontWeight: 'bold', color: '#1e40af' }}>Статус</TableCell> */}
                <TableCell align="right" sx={{ fontWeight: 'bold', color: '#1e40af' }}>Дії</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3, color: '#64748b' }}>
                    Замовлень не знайдено
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id} sx={{ '&:hover': { backgroundColor: '#f1f5f9' }, transition: '0.2s' }}>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>{dayjs(order.created_at).format("YYYY-MM-DD HH:mm") || '—'}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="600">
                        {`${order.brand_names || ''} ${order.model_names || ''}`.trim() || 'Не вказано'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#3b82f6', fontFamily: 'monospace' }}>
                        {order.internal_id || 'ID не вказано'}
                      </Typography>
                    </TableCell>
                    <TableCell>{order.first_name + " " + order.last_name || 'Невідомий'}</TableCell>
                    <TableCell>
                      {(order.price_from && order.price_to) ? `${order.price_from}-${order.price_to}` : '—'}
                    </TableCell>
                    {/* <TableCell>{getStatusChip(order.)}</TableCell> */}
                    <TableCell align="right">
                      <IconButton size="small">
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
    </Box>
  );
}