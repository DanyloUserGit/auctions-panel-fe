import { ArrowBack, Search } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { DB_NAME, TABLE_LABELS, TABLES } from '../../shared/constants/tables';
import { TabPanel } from '../../shared/ui/TabPanel';
import {
  getSoldMeta,
  getSoldRows,
  getTableMeta,
  getTableRows,
} from './model/api';
import type {
  CalculationTab,
  CustomsTableId,
  ISoldRow,
  ITableMeta,
  ITableRow,
} from './model/types';
import FullForm from './ui/FullForm';
import ImportForm from './ui/ImportForm';

const CalculationPage: React.FC = () => {
  const navigate = useNavigate();

  const [tab, setTab] = useState<CalculationTab>('customs');

  const [tableId, setTableId] = useState<CustomsTableId>('27031');
  const [tableMeta, setTableMeta] = useState<ITableMeta | null>(null);
  const [tableRows, setTableRows] = useState<ITableRow[]>([]);
  const [tableFilters, setTableFilters] = useState({
    qmarka: '',
    qmodel: '',
    qtyp: '',
  });
  const [tableLoading, setTableLoading] = useState(false);
  const [tableError, setTableError] = useState('');

  const [soldQuery, setSoldQuery] = useState('');
  const [soldYear, setSoldYear] = useState('');
  const [soldYears, setSoldYears] = useState<string[]>([]);
  const [soldAvailableMonths, setSoldAvailableMonths] = useState<string[]>([]);
  const [soldActiveMonths, setSoldActiveMonths] = useState<string[]>([]);
  const [soldRows, setSoldRows] = useState<ISoldRow[]>([]);
  const [soldSort, setSoldSort] = useState('sale_date');
  const [soldDir, setSoldDir] = useState<'ASC' | 'DESC'>('DESC');
  const [soldLoading, setSoldLoading] = useState(false);
  const [soldError, setSoldError] = useState('');

  const loadTableData = useCallback(async () => {
    setTableLoading(true);
    setTableError('');
    try {
      const [metaResponse, rowsResponse] = await Promise.all([
        getTableMeta(DB_NAME, tableId),
        getTableRows(
          DB_NAME,
          tableId,
          tableFilters.qmarka,
          tableFilters.qmodel,
          tableFilters.qtyp,
        ),
      ]);
      setTableMeta(metaResponse.data);
      setTableRows(rowsResponse.data.rows ?? []);
    } catch (error) {
      setTableError(
        (error as Error)?.message || 'Не вдалося завантажити таблицю',
      );
    } finally {
      setTableLoading(false);
    }
  }, [tableId, tableFilters]);

  useEffect(() => {
    loadTableData();
  }, [loadTableData]);

  const loadSoldMetaAndRows = useCallback(
    async (keepMonths: boolean) => {
      setSoldLoading(true);
      setSoldError('');
      try {
        const metaResponse = await getSoldMeta(DB_NAME, soldYear);
        const meta = metaResponse.data;
        setSoldYears(meta.years ?? []);
        const nextYear = meta.activeYear || '';
        setSoldYear(nextYear);
        setSoldAvailableMonths(meta.months ?? []);

        let monthsToUse = soldActiveMonths;
        if (!keepMonths) {
          monthsToUse = soldActiveMonths.filter((month) =>
            meta.months.includes(month),
          );
          setSoldActiveMonths(monthsToUse);
        }

        const rowsResponse = await getSoldRows(DB_NAME, {
          q: soldQuery,
          year: nextYear,
          months: monthsToUse.join(','),
          sort: soldSort,
          dir: soldDir,
          limit: 500,
          offset: 0,
        });
        setSoldRows(rowsResponse.data.rows ?? []);
      } catch (error) {
        setSoldError(
          (error as Error)?.message || 'Не вдалося завантажити продані авто',
        );
      } finally {
        setSoldLoading(false);
      }
    },
    [soldActiveMonths, soldDir, soldQuery, soldSort, soldYear],
  );

  // useEffect(() => {
  //   loadSoldMetaAndRows(false);
  // }, [loadSoldMetaAndRows]);

  const toggleSoldSort = (field: string) => {
    setSoldSort((prev) => {
      if (prev === field) {
        setSoldDir((dir) => (dir === 'ASC' ? 'DESC' : 'ASC'));
        return prev;
      }
      setSoldDir('DESC');
      return field;
    });
  };

  useEffect(() => {
    if (tab === 'sold') {
      loadSoldMetaAndRows(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Розрахунок
        </Typography>
      </Box>

      <Paper sx={{ p: 1.5, borderRadius: 3 }}>
        <Tabs
          value={tab}
          onChange={(_, value: CalculationTab) => setTab(value)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab value="customs" label="Розрахунок розмитнення" />
          <Tab value="finalCost" label="Кінцева вартість" />
          <Tab value="tables" label="Таблиці" />
          <Tab value="sold" label="Продані авто" />
        </Tabs>
      </Paper>

      <ImportForm tab={tab} />

      <FullForm tab={tab} />

      <TabPanel current={tab} value="tables">
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              Таблиці
            </Typography>

            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={1}
              sx={{ mb: 2 }}
            >
              {TABLES.map((item) => (
                <Chip
                  key={item}
                  label={`${TABLE_LABELS[item]} (${item})`}
                  color={tableId === item ? 'primary' : 'default'}
                  onClick={() => setTableId(item)}
                />
              ))}
            </Stack>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Марка"
                  value={tableFilters.qmarka}
                  onChange={(e) =>
                    setTableFilters((prev) => ({
                      ...prev,
                      qmarka: e.target.value,
                    }))
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Модель"
                  value={tableFilters.qmodel}
                  onChange={(e) =>
                    setTableFilters((prev) => ({
                      ...prev,
                      qmodel: e.target.value,
                    }))
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Тип палива"
                  value={tableFilters.qtyp}
                  onChange={(e) =>
                    setTableFilters((prev) => ({
                      ...prev,
                      qtyp: e.target.value,
                    }))
                  }
                />
              </Grid>
            </Grid>

            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={1.5}
              sx={{ mt: 2 }}
            >
              <Button
                variant="contained"
                startIcon={<Search />}
                onClick={loadTableData}
              >
                Пошук
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setTableFilters({ qmarka: '', qmodel: '', qtyp: '' });
                }}
              >
                Очистити
              </Button>
            </Stack>

            {tableError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {tableError}
              </Alert>
            )}

            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{ mt: 2, maxHeight: 680 }}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ minWidth: 260 }}>Авто</TableCell>
                    {tableMeta?.years.map((year) => (
                      <TableCell key={year} sx={{ minWidth: 90 }}>
                        {year}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableLoading ? (
                    <TableRow>
                      <TableCell colSpan={(tableMeta?.years.length || 0) + 1}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            py: 3,
                          }}
                        >
                          <CircularProgress size={28} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : tableRows.length ? (
                    tableRows.map((row, index) => (
                      <TableRow
                        key={`${row.marka}-${row.model}-${row.typ}-${index}`}
                      >
                        <TableCell>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 700 }}
                            >
                              {row.marka}
                            </Typography>
                            <Typography variant="body2">{row.model}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {row.typ}
                            </Typography>
                          </Box>
                        </TableCell>
                        {tableMeta?.years.map((year) => (
                          <TableCell key={year}>{row[year] ?? ''}</TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={(tableMeta?.years.length || 0) + 1}>
                        Дані не знайдено.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel current={tab} value="sold">
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              Продані авто
            </Typography>

            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Пошук"
                  value={soldQuery}
                  onChange={(e) => setSoldQuery(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Рік</InputLabel>
                  <Select
                    value={soldYear}
                    label="Рік"
                    onChange={(e) => setSoldYear(String(e.target.value))}
                  >
                    {soldYears.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    onClick={() => loadSoldMetaAndRows(true)}
                  >
                    Пошук
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSoldQuery('');
                      setSoldActiveMonths([]);
                      loadSoldMetaAndRows(false);
                    }}
                  >
                    Очистити
                  </Button>
                </Stack>
              </Grid>
            </Grid>

            <Stack
              direction="row"
              spacing={1}
              sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}
            >
              <Chip
                label="Всі місяці"
                color={soldActiveMonths.length === 0 ? 'primary' : 'default'}
                onClick={() => setSoldActiveMonths([])}
              />
              {[
                '01',
                '02',
                '03',
                '04',
                '05',
                '06',
                '07',
                '08',
                '09',
                '10',
                '11',
                '12',
              ].map((month) => {
                const enabled = soldAvailableMonths.includes(month);
                const active = soldActiveMonths.includes(month);
                return (
                  <Chip
                    key={month}
                    label={month}
                    disabled={!enabled}
                    color={active ? 'primary' : 'default'}
                    onClick={() => {
                      if (!enabled) return;
                      setSoldActiveMonths((prev) =>
                        prev.includes(month)
                          ? prev.filter((item) => item !== month)
                          : [...prev, month].sort(),
                      );
                    }}
                  />
                );
              })}
            </Stack>

            {soldError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {soldError}
              </Alert>
            )}

            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{ mt: 2, maxHeight: 680 }}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    {[
                      ['country', 'Країна'],
                      ['brand', 'Марка'],
                      ['model', 'Модель'],
                      ['detail', 'Опис'],
                      ['mileage_km', 'Пробіг'],
                      ['first_reg_date', 'Перша реєстрація'],
                      ['sale_price', 'Ціна продажу'],
                      ['sale_month', 'Місяць продажу'],
                    ].map(([field, label]) => (
                      <TableCell
                        key={field}
                        onClick={() => toggleSoldSort(field)}
                        sx={{ cursor: 'pointer', userSelect: 'none' }}
                      >
                        {label}
                        {soldSort === field
                          ? ` ${soldDir === 'ASC' ? '▲' : '▼'}`
                          : ''}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {soldLoading ? (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            py: 3,
                          }}
                        >
                          <CircularProgress size={28} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : soldRows.length ? (
                    soldRows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.country}</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>
                          {row.brand}
                        </TableCell>
                        <TableCell>{row.model}</TableCell>
                        <TableCell sx={{ maxWidth: 420 }}>
                          {row.detail}
                        </TableCell>
                        <TableCell>{row.mileage_km ?? ''}</TableCell>
                        <TableCell>{row.first_reg_fmt ?? ''}</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>
                          {row.sale_price ?? ''}
                        </TableCell>
                        <TableCell>{row.sale_month ?? ''}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8}>Дані не знайдено.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </TabPanel>
    </Box>
  );
};

export default CalculationPage;
