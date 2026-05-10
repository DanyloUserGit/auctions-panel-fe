import LinkIcon from '@mui/icons-material/Link';
import PrintIcon from '@mui/icons-material/Print';
import PublicIcon from '@mui/icons-material/Public'; // Замінив Earth на Public
import {
  Autocomplete,
  Box,
  Button,
  Container,
  createTheme,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ThemeProvider,
  Typography,
} from '@mui/material';
import { useState, type SyntheticEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { BalanceRecord } from './model/types';
import { useBalanceClients, useBalanceData } from './model/useBalances';
import { Row } from './ui/BalanceRow';
import { ArrowBack } from '@mui/icons-material';

const theme = createTheme({
  palette: {
    primary: { main: '#1e40af', light: '#dbeafe' },
    secondary: { main: '#3b82f6' },
    text: { secondary: '#64748b' },
  },
});

export default function BalanceSheet() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedClient = searchParams.get('client') || '';
  const navigate = useNavigate();

  const [db] = useState<string>('table_extourcars1');

  const { clients } = useBalanceClients(db);
  const { balances } = useBalanceData(db, selectedClient);

  // Стан для дати (формат YYYY-MM-DD з інпуту type="date")
  const [date, setDate] = useState('');

  const handleClientChange = (
    _event: SyntheticEvent,
    newValue: string | null,
  ) => {
    if (newValue) {
      setSearchParams({ client: newValue });
    } else {
      searchParams.delete('client');
      setSearchParams(searchParams);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Посилання скопійовано у буфер обміну!');
  };

  const handlePrint = () => {
    window.print();
  };
  // Функція для повернення на сайт
  const handleReturnToSite = () => {
    // Вкажіть тут потрібний URL вашого сайту
    navigate("/")
  };

  // 1. Отримуємо всі записи
  const rawRecords = balances?.at(0)?.records || [];

  // 2. Фільтруємо записи за датою (якщо дата обрана)
  const filteredRecords = rawRecords.filter((record: BalanceRecord) => {
    if (!date) return true; // Якщо дата не обрана, показуємо все

    // Припускаємо, що в record є поле date.
    // Встановлюємо час на кінець обраного дня, щоб включити всі записи за цей день
    const recordDate = new Date(record.date); // Змініть record.date на ваше поле, якщо воно інше
    const selectedDate = new Date(date);
    selectedDate.setHours(23, 59, 59, 999);

    return recordDate <= selectedDate;
  });

  // 3. Рахуємо баланс вже з ВІДФІЛЬТРОВАНИХ записів для ВСІХ валют
  const currentBalances = filteredRecords.reduce(
    (acc, curr) => {
      const eur = Math.abs(curr.effectEur || 0);
      const usd = Math.abs(curr.effectUsd || 0);
      const pln = Math.abs(curr.effectPln || 0);
      const uah = Math.abs(curr.effectUah || 0);

      return {
        eur: curr.isPlus ? acc.eur + eur : acc.eur - eur,
        usd: curr.isPlus ? acc.usd + usd : acc.usd - usd,
        pln: curr.isPlus ? acc.pln + pln : acc.pln - pln,
        uah: curr.isPlus ? acc.uah + uah : acc.uah - uah,
      };
    },
    { eur: 0, usd: 0, pln: 0, uah: 0 } // Початковий стан для всіх валют
  );

  return (
    <ThemeProvider theme={theme}>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Баланси
          </Typography>
        </Box>
        {/* Header */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 4 }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 'bold', color: 'primary.main' }}
            >
              Caddyluck Solution
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ul. Ofiar Katynia 19, 37-700 Przemyśl
            </Typography>
          </Box>
          <Box sx={{ textAlign: { md: 'right' } }}>
            <Typography variant="body2">
              Дата: {new Date().toLocaleDateString()}
            </Typography>
            <Typography variant="body1">
              Поточний вибір: <strong>{selectedClient || 'Всі клієнти'}</strong>
            </Typography>
          </Box>
        </Stack>

        {/* Toolbar */}
        <Stack
          direction="row"
          spacing={2}
          sx={{ mb: 3 }}
          flexWrap="wrap"
          alignItems="center"
        >
          <Autocomplete
            options={clients || []}
            value={selectedClient}
            onChange={handleClientChange}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Пошук клієнта"
                size="small"
                placeholder="Введіть ім'я..."
              />
            )}
          />

          <TextField
            label="Станом на"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)} // Додано обробник зміни дати
            size="small"
            InputLabelProps={{ shrink: true }}
          />

          <Box sx={{ flexGrow: 1 }} />

          <Button
            startIcon={<PrintIcon />}
            variant="outlined"
            onClick={handlePrint}
          >
            Друк
          </Button>
          <Button
            startIcon={<LinkIcon />}
            variant="outlined"
            onClick={handleCopyLink}
          >
            Копіювати лінк
          </Button>
          <Button
            startIcon={<PublicIcon />} // Використано PublicIcon
            variant="outlined"
            onClick={handleReturnToSite} // Змінено обробник
          >
            Повернутися на сайт
          </Button>
        </Stack>

        {/* Table */}
        <TableContainer
          component={Paper}
          sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell style={{ width: 40 }} />
                <TableCell>Дата</TableCell>
                <TableCell>Опис (Модель/Нотатки)</TableCell>
                <TableCell>VIN/Кузов</TableCell>
                <TableCell align="right">Ефект (EUR)</TableCell>
                <TableCell align="right">USD</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record: BalanceRecord) => (
                  <Row key={record.id} record={record} />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Typography color="text.secondary">
                      {selectedClient
                        ? 'Для цього клієнта немає записів на обрану дату'
                        : 'Оберіть клієнта для перегляду балансу'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Total */}
        {selectedClient && (
          <Box
            sx={{
              mt: 3,
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography variant="h6">Поточний баланс:</Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: currentBalances.uah >= 0 ? '#009999' : '#2f58cd',
              }}
            >
              {(currentBalances.uah * 0.023 + currentBalances.pln * 0.27 + currentBalances.eur * 1.15 + currentBalances.usd).toLocaleString()} $
            </Typography>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
}
