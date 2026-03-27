import { useEffect, useMemo, useState } from 'react';
import type { Car } from './model/types';
import { useProcessesData } from './model/useData';

import {
  ArrowBack,
  Check as CheckIcon,
  Launch as LaunchIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import PrintIcon from '@mui/icons-material/Print';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
  InputAdornment,
} from '@mui/material';
import { useNavigate } from 'react-router';

export const Processes = () => {
  const [filterActive, setFilterActive] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [asOfDate, setAsOfDate] = useState('');
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const navigate = useNavigate();

  // Затримка пошуку (дебаунс)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Викликаємо хук. Додали isFetching для відображення фонового завантаження
  const { data, isLoading, isError, error, isFetching } = useProcessesData({
    search: debouncedSearch,
    asof: asOfDate,
    open: showOpenOnly,
  });

  const filteredCars = useMemo(() => {
    if (!data?.data) return [];

    return data.data.filter((car: Car) => {
      const st = car.statuses;
      let matchFilter = false;

      switch (filterActive) {
        case 'all':
          matchFilter = true;
          break;
        case 'wait_pay':
          matchFilter = !st.doneOplata;
          break;
        case 'wait_perm':
          matchFilter =
            st.doneOplata && !st.hasZezEff && !st.hasTrspEff && !st.doneDauto;
          break;
        case 'wait_trsp':
          matchFilter =
            st.doneOplata && st.hasZezEff && !st.hasTrspEff && !st.doneDauto;
          break;
        case 'wait_dauto':
          matchFilter =
            st.doneOplata && st.hasZezEff && st.hasTrspEff && !st.doneDauto;
          break;
        case 'wait_cmr':
          matchFilter = st.doneDauto && !st.hasCmrEff;
          break;
        case 'wait_docs':
          matchFilter = !st.doneDocs;
          break;
        case 'realized':
          matchFilter = st.isRealizedStrict;
          break;
        default:
          matchFilter = true;
      }

      return matchFilter;
    });
  }, [data, filterActive]);

  const filterButtons = [
    { label: 'Всі', value: 'all', count: data?.stats?.total || 0 },
    { label: 'Оплата', value: 'wait_pay', count: data?.stats?.wait_pay || 0 },
    { label: 'Дозвіл', value: 'wait_perm', count: data?.stats?.wait_perm || 0 },
    {
      label: 'Транспорт',
      value: 'wait_trsp',
      count: data?.stats?.wait_trsp || 0,
    },
    {
      label: 'В Польщі',
      value: 'wait_dauto',
      count: data?.stats?.wait_dauto || 0,
    },
    { label: 'CMR', value: 'wait_cmr', count: data?.stats?.wait_cmr || 0 },
    { label: 'Док-ти', value: 'wait_docs', count: data?.stats?.wait_docs || 0 },
    { label: 'Закриті', value: 'realized', count: data?.stats?.realized || 0 },
  ];

  const renderStatusCell = (
    isDone: boolean,
    isWaiting: boolean,
    dateString?: string | null,
  ) => {
    if (isWaiting) {
      return (
        <TableCell
          sx={{ backgroundColor: '#ffebee', borderRight: '1px solid #f0f0f0' }}
          align="center"
        />
      );
    }
    if (isDone) {
      return (
        <TableCell align="center" sx={{ borderRight: '1px solid #f0f0f0' }}>
          {dateString ? (
            <Chip
              label={dateString.split('T')[0]}
              color="success"
              size="small"
              sx={{ borderRadius: 1, fontWeight: 'bold' }}
            />
          ) : (
            <CheckIcon color="success" fontSize="small" />
          )}
        </TableCell>
      );
    }
    return <TableCell sx={{ borderRight: '1px solid #f0f0f0' }} />;
  };

  // ПРИБРАЛИ звідси жорсткий return для isLoading/isError

  return (
    <Box
      p={3}
      sx={{
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
        // Налаштування для друку: білий фон і примусовий друк кольорових елементів
        '@media print': {
          p: 0,
          backgroundColor: 'white',
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact',
        },
      }}
    >
      {/* --- ВЕРХНЯ ПАНЕЛЬ (Приховуємо при друку) --- */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        sx={{ '@media print': { display: 'none' } }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton onClick={() => navigate(-1)} size="small">
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" fontWeight="bold" sx={{ color: '#333' }}>
            Процеси
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={3}>
          {/* Додано обробник window.print() */}
          <Button
            startIcon={<PrintIcon />}
            variant="text"
            color="inherit"
            sx={{ fontWeight: 'bold' }}
            onClick={() => window.print()}
          >
            Друк
          </Button>
          <TextField
            type="date"
            label="Станом на"
            size="small"
            value={asOfDate}
            onChange={(e) => setAsOfDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ backgroundColor: 'white', width: 160 }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={showOpenOnly}
                onChange={(e) => setShowOpenOnly(e.target.checked)}
                color="primary"
              />
            }
            label={<Typography fontWeight="bold">Відкриті / Всі</Typography>}
          />
        </Box>
      </Box>

      {/* --- ФІЛЬТРИ ТА ПОШУК (Приховуємо при друку) --- */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        sx={{ '@media print': { display: 'none' } }}
      >
        <Box display="flex" gap={1} flexWrap="wrap">
          {filterButtons.map((btn) => (
            <Button
              key={btn.value}
              variant={filterActive === btn.value ? 'contained' : 'outlined'}
              onClick={() => setFilterActive(btn.value)}
              sx={{
                borderRadius: '20px',
                textTransform: 'none',
                fontWeight: 'bold',
                borderColor: '#e0e0e0',
                color: filterActive === btn.value ? 'white' : '#555',
                backgroundColor:
                  filterActive === btn.value ? '#343a40' : 'white',
                '&:hover': {
                  backgroundColor:
                    filterActive === btn.value ? '#23272b' : '#f8f9fa',
                },
              }}
            >
              {btn.label}{' '}
              <span style={{ marginLeft: '6px', opacity: 0.8 }}>
                {btn.count}
              </span>
            </Button>
          ))}
        </Box>

        <TextField
          size="small"
          placeholder="Пошук авто..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ backgroundColor: 'white', minWidth: 250 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {isFetching ? (
                  <CircularProgress size={20} />
                ) : (
                  <SearchIcon fontSize="small" />
                )}
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* --- ТАБЛИЦЯ АБО ЛОАДЕР --- */}
      {isLoading ? (
        <Box p={4} display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Box p={4} color="error.main">
          Помилка завантаження: {error?.message}
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ border: '1px solid #e0e0e0', position: 'relative' }}
        >
          {/* Напівпрозорий оверлей на таблицю під час фонового пошуку (опціонально для кращого UX) */}
          {isFetching && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(255,255,255,0.4)',
                zIndex: 1,
              }}
            />
          )}

          <Table size="small">
            <TableHead sx={{ backgroundColor: '#f4f6f8' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', width: '50px' }}>
                  #
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Замовник</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Автомобіль</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  Оплата
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  Дозвіл
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  Транспорт
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  В Польщі
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  CMR
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  Док-ти
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  Продаж
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCars.map((car: Car, index: number) => {
                const st = car.statuses;

                const isWaitingPay = !st.doneOplata;
                const isWaitingZez = st.doneOplata && !st.doneZez;
                const isWaitingTrsp =
                  st.doneOplata && st.doneZez && !st.doneTrsp;
                const isWaitingDauto =
                  st.doneOplata && st.doneZez && st.doneTrsp && !st.doneDauto;
                const isWaitingCmr =
                  st.doneOplata &&
                  st.doneZez &&
                  st.doneTrsp &&
                  st.doneDauto &&
                  !st.doneCmr;
                const isWaitingDocs =
                  st.doneOplata &&
                  st.doneZez &&
                  st.doneTrsp &&
                  st.doneDauto &&
                  st.doneCmr &&
                  !st.doneDocs;
                const isWaitingSale =
                  st.doneOplata &&
                  st.doneZez &&
                  st.doneTrsp &&
                  st.doneDauto &&
                  st.doneCmr &&
                  st.doneDocs &&
                  !st.doneSale;

                return (
                  <TableRow
                    key={car.id}
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell className="text-gray-500 font-medium">
                      {filteredCars.length - index}
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 'bold', color: '#444' }}
                      >
                        {car.zamovnyk}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 'bold', color: '#222' }}
                          >
                            {car.marka_model}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#888' }}>
                            {car.numer_rej} • {car.numer_vin}
                          </Typography>
                        </Box>
                        {car.techDocsUrls && car.techDocsUrls.length > 0 && (
                          <IconButton
                            size="small"
                            sx={{
                              backgroundColor: '#e3f2fd',
                              color: '#1976d2',
                              borderRadius: 1,
                              padding: '4px',
                            }}
                          >
                            <LaunchIcon fontSize="inherit" />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>

                    {renderStatusCell(
                      st.doneOplata,
                      isWaitingPay,
                      car.data_oplaty,
                    )}
                    {renderStatusCell(
                      st.doneZez,
                      isWaitingZez,
                      car.data_zezwolenia,
                    )}
                    {renderStatusCell(
                      st.doneTrsp,
                      isWaitingTrsp,
                      car.data_zamowienia_transportu,
                    )}
                    {renderStatusCell(
                      st.doneDauto,
                      isWaitingDauto,
                      car.data_dostarczenia_auta,
                    )}
                    {renderStatusCell(
                      st.doneCmr,
                      isWaitingCmr,
                      car.data_wysylki_cmr,
                    )}
                    {renderStatusCell(
                      st.doneDocs,
                      isWaitingDocs,
                      car.data_dostarczenia_dokumentow,
                    )}
                    {renderStatusCell(
                      st.doneSale,
                      isWaitingSale,
                      car.data_faktury_sprzedaz,
                    )}
                  </TableRow>
                );
              })}

              {filteredCars.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    align="center"
                    sx={{ py: 8, color: '#888' }}
                  >
                    Нічого не знайдено за вашим запитом.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};
