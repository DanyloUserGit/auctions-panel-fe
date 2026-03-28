import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Stack,
  Button,
  Card,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
// types.ts
export type OrderStatus = 'new' | 'processing' | 'completed' | 'cancelled';

export interface Order {
  id: number;
  date: string;
  carName: string;
  chassis: string;
  clientName: string;
  price: number;
  status: OrderStatus;
  manager: string;
}

const MOCK_ORDERS: Order[] = [
  {
    id: 1812,
    date: '2026-03-20',
    carName: 'BMW 520d G30',
    chassis: 'WBA1234567890',
    clientName: 'Михайло',
    price: 24500,
    status: 'processing',
    manager: 'Олександр',
  },
  {
    id: 1813,
    date: '2026-03-22',
    carName: 'Audi A6 C8',
    chassis: 'TRU9876543210',
    clientName: 'Іван',
    price: 28000,
    status: 'new',
    manager: 'Марія',
  },
  {
    id: 1814,
    date: '2026-03-25',
    carName: 'Mercedes E220',
    chassis: 'WDD5554443332',
    clientName: 'Олена',
    price: 31200,
    status: 'completed',
    manager: 'Олександр',
  },
];
const OrdersPage: React.FC = () => {
  const [search, setSearch] = useState('');

  // Функція для мапінгу статусів (аналог PHP логіки в tpl)
  const getStatusChip = (status: OrderStatus) => {
    const config: Record<
      OrderStatus,
      {
        label: string;
        color:
          | 'default'
          | 'primary'
          | 'secondary'
          | 'error'
          | 'info'
          | 'success'
          | 'warning';
      }
    > = {
      new: { label: 'Новий', color: 'info' },
      processing: { label: 'В роботі', color: 'warning' },
      completed: { label: 'Виконано', color: 'success' },
      cancelled: { label: 'Скасовано', color: 'error' },
    };
    const { label, color } = config[status];
    return <Chip label={label} color={color} size="small" variant="outlined" />;
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header сектор */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography variant="h4" fontWeight="800" sx={{ color: '#1e40af' }}>
            Замовлення
          </Typography>
          <Typography variant="body2" color="#64748b">
            Система управління запитами (Бюро)
          </Typography>
        </Box>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#1e40af',
            '&:hover': { backgroundColor: '#3b82f6' },
          }}
        >
          Додати замовлення
        </Button>
      </Stack>

      {/* Фільтрація */}
      <Card
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Пошук за VIN або клієнтом..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#64748b' }} />
              </InputAdornment>
            ),
          }}
        />
      </Card>

      {/* Таблиця на нативних компонентах MUI */}
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
      >
        <Table sx={{ minWidth: 700 }}>
          <TableHead sx={{ backgroundColor: '#dbeafe' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: '#1e40af' }}>
                ID
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#1e40af' }}>
                Дата
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#1e40af' }}>
                Автомобіль / VIN
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#1e40af' }}>
                Клієнт
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#1e40af' }}>
                Сума
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#1e40af' }}>
                Статус
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: 'bold', color: '#1e40af' }}
              >
                Дії
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {MOCK_ORDERS.filter((o) =>
              o.carName.toLowerCase().includes(search.toLowerCase()),
            ).map((order) => (
              <TableRow
                key={order.id}
                sx={{
                  '&:hover': { backgroundColor: '#f1f5f9' },
                  transition: '0.2s',
                }}
              >
                <TableCell>#{order.id}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="600">
                    {order.carName}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: '#3b82f6', fontFamily: 'monospace' }}
                  >
                    {order.chassis}
                  </Typography>
                </TableCell>
                <TableCell>{order.clientName}</TableCell>
                <TableCell>€ {order.price.toLocaleString()}</TableCell>
                <TableCell>{getStatusChip(order.status)}</TableCell>
                <TableCell align="right">
                  <IconButton size="small">
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OrdersPage;
