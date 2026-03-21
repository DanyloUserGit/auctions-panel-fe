import { useMemo, useState } from 'react';
import type { Car } from './model/types';
import { useProcessesData } from './model/useData';

import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';

export const Processes = () => {
  const [filterActive, setFilterActive] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, isError, error } = useProcessesData('ALL_KEY');

  const filteredCars = useMemo(() => {
    if (!data?.cars) return [];

    return data.cars.filter((car: Car) => {
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

      const searchLower = searchQuery.toLowerCase();
      const textToSearch =
        `${car.zamovnyk} ${car.marka_model} ${car.numer_rej} ${car.numer_vin}`.toLowerCase();
      const matchSearch = textToSearch.includes(searchLower);

      return matchFilter && matchSearch;
    });
  }, [data, filterActive, searchQuery]);

  if (isLoading) {
    return (
      <Box className="flex justify-center items-center min-h-[50vh]">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box className="p-4 text-red-500 text-center">
        <Typography variant="h6">Помилка завантаження даних</Typography>
        <Typography>{error?.message}</Typography>
      </Box>
    );
  }

  if (!data) return null;

  const statsConfig = [
    { key: 'all', label: 'Показано авто', val: data.stats.total },
    { key: 'wait_pay', label: 'Очікує оплати', val: data.stats.wait_pay },
    { key: 'wait_perm', label: 'Очікує дозволу', val: data.stats.wait_perm },
    { key: 'wait_trsp', label: 'Очікує транспорт', val: data.stats.wait_trsp },
    { key: 'wait_dauto', label: 'Очікує авто', val: data.stats.wait_dauto },
    { key: 'wait_cmr', label: 'Очікує CMR', val: data.stats.wait_cmr },
    { key: 'wait_docs', label: 'Очікує док-ти', val: data.stats.wait_docs },
    { key: 'realized', label: 'Реалізовано', val: data.stats.realized },
  ];

  return (
    <Box className="max-w-[1400px] mx-auto p-4 md:p-6 bg-white min-h-screen flex flex-col gap-4">
      <Box className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <Box>
          <Typography
            variant="h4"
            component="h1"
            className="font-bold text-gray-800"
          >
            Процеси
          </Typography>
        </Box>
        <Box className="text-left md:text-right text-gray-500">
          <Typography variant="body2">
            Дата: {new Date().toISOString().split('T')[0]}
          </Typography>
          <Typography variant="body2">
            Клієнт:{' '}
            <span className="font-bold text-gray-800">
              {data.clientInfo.name}
            </span>
          </Typography>
        </Box>
      </Box>

      <Box className="flex flex-col sm:flex-row justify-between items-center my-6 gap-4">
        <TextField
          variant="outlined"
          size="small"
          placeholder="Пошук (клієнт / модель / реєстрація / VIN)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-96 bg-gray-50"
        />
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={() => window.print()}
          className="w-full sm:w-auto shadow-none hover:shadow-md"
        >
          Друк / PDF
        </Button>
      </Box>

      <Box className="flex flex-wrap gap-2 mb-6">
        {statsConfig.map((chip) => (
          <Chip
            key={chip.key}
            label={
              <span>
                {chip.label}: <b>{chip.val}</b>
              </span>
            }
            onClick={() => setFilterActive(chip.key)}
            color={filterActive === chip.key ? 'primary' : 'default'}
            variant={filterActive === chip.key ? 'filled' : 'outlined'}
            className="cursor-pointer transition-all duration-200"
          />
        ))}
      </Box>

      <TableContainer
        component={Paper}
        className="shadow-sm border border-gray-200 rounded-lg overflow-hidden"
      >
        <Table size="medium" aria-label="processes table">
          <TableHead className="bg-gray-50">
            <TableRow>
              <TableCell className="font-semibold text-gray-600">№</TableCell>
              <TableCell className="font-semibold text-gray-600">
                Клієнт
              </TableCell>
              <TableCell className="font-semibold text-gray-600">
                Авто
              </TableCell>
              <TableCell className="font-semibold text-gray-600">
                Фактура (продаж)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCars.map((car: Car, index: number) => {
              const st = car.statuses;

              return (
                <TableRow key={car.id} hover className="transition-colors">
                  <TableCell>
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-xs font-medium">
                      {filteredCars.length - index}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-800 font-medium">
                    {car.zamovnyk}
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      className="font-bold text-gray-800"
                    >
                      {car.marka_model}
                    </Typography>
                    <Typography variant="caption" className="text-gray-500">
                      {car.numer_rej} • {car.numer_vin}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {st.doneOplata && car.data_oplaty ? (
                      <Chip
                        label={car.data_oplaty.split('T')[0]}
                        color="success"
                        size="small"
                        className="font-medium"
                      />
                    ) : (
                      <Typography variant="body2" className="text-gray-400">
                        —
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredCars.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  align="center"
                  className="py-8 text-gray-500"
                >
                  Нічого не знайдено за вашим запитом.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
