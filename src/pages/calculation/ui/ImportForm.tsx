import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
import { useEffect, useMemo, useState } from 'react';
import {
  DB_NAME,
  TABLE_LABELS,
  TABLES,
} from '../../../shared/constants/tables';
import { TabPanel } from '../../../shared/ui/TabPanel';
import {
  formatMoney,
  parseNumberish,
  safeToFixed,
} from '../../../shared/utils';
import {
  getRozrahunokBrands,
  getRozrahunokEstimate,
  getRozrahunokModels,
  getRozrahunokTypes,
  getRozrahunokYears,
} from '../model/api';
import type {
  CalculationTab,
  CustomsTableId,
  ICalculationResult,
  IRozmitnenniaForm,
} from '../model/types';

export default function ImportForm({ tab }: { tab: CalculationTab }) {
  const defaultRozForm: IRozmitnenniaForm = {
    table: '',
    marka: '',
    model: '',
    typ: '',
    year: '',
    param: '',
    delivery: '',
    fx: '1.17',
  };

  const [rozForm, setRozForm] = useState<IRozmitnenniaForm>(defaultRozForm);
  const [rozBrands, setRozBrands] = useState<string[]>([]);
  const [rozModels, setRozModels] = useState<string[]>([]);
  const [rozTypes, setRozTypes] = useState<string[]>([]);
  const [rozYears, setRozYears] = useState<string[]>([]);
  const [rozHint, setRozHint] = useState('Оберіть таблицю для початку.');
  const [rozLoading, setRozLoading] = useState(false);
  const [rozError, setRozError] = useState('');
  const [rozResult, setRozResult] = useState<ICalculationResult | null>(null);

  useEffect(() => {
    if (!rozForm.table) return;
    setRozLoading(true);
    setRozHint('Завантаження марок...');
    getRozrahunokBrands(DB_NAME, rozForm.table)
      .then((res) => {
        setRozBrands(res.data.items ?? []);
        setRozHint('Оберіть марку.');
      })
      .catch((error) => {
        setRozError(error?.message || 'Не вдалося завантажити марки');
        setRozHint('Сталася помилка.');
      })
      .finally(() => setRozLoading(false));
  }, [rozForm.table]);

  useEffect(() => {
    if (!rozForm.table || !rozForm.marka) return;
    setRozLoading(true);
    setRozHint('Завантаження моделей...');
    getRozrahunokModels(DB_NAME, rozForm.table, rozForm.marka)
      .then((res) => {
        setRozModels(res.data.items ?? []);
        setRozHint('Оберіть модель.');
      })
      .catch((error) => {
        setRozError(error?.message || 'Не вдалося завантажити моделі');
        setRozHint('Сталася помилка.');
      })
      .finally(() => setRozLoading(false));
  }, [rozForm.table, rozForm.marka]);

  useEffect(() => {
    if (!rozForm.table || !rozForm.marka || !rozForm.model) return;
    setRozLoading(true);
    setRozHint('Завантаження типів палива...');
    getRozrahunokTypes(DB_NAME, rozForm.table, rozForm.marka, rozForm.model)
      .then((res) => {
        setRozTypes(res.data.items ?? []);
        setRozHint('Оберіть тип палива.');
      })
      .catch((error) => {
        setRozError(error?.message || 'Не вдалося завантажити типи');
        setRozHint('Сталася помилка.');
      })
      .finally(() => setRozLoading(false));
  }, [rozForm.table, rozForm.marka, rozForm.model]);

  useEffect(() => {
    if (!rozForm.table || !rozForm.marka || !rozForm.model || !rozForm.typ)
      return;
    setRozLoading(true);
    setRozHint('Завантаження років...');
    getRozrahunokYears(
      DB_NAME,
      rozForm.table,
      rozForm.marka,
      rozForm.model,
      rozForm.typ,
    )
      .then((res) => {
        setRozYears(res.data.items ?? []);
        setRozHint(
          res.data.items?.length
            ? 'Оберіть рік.'
            : 'Для цього авто немає років.',
        );
      })
      .catch((error) => {
        setRozError(error?.message || 'Не вдалося завантажити роки');
        setRozHint('Сталася помилка.');
      })
      .finally(() => setRozLoading(false));
  }, [rozForm.table, rozForm.marka, rozForm.model, rozForm.typ]);

  const handleRozSelect = (field: keyof IRozmitnenniaForm, value: string) => {
    setRozError('');
    setRozResult(null);

    if (field === 'table') {
      setRozForm((prev) => ({
        ...prev,
        table: value as CustomsTableId,
        marka: '',
        model: '',
        typ: '',
        year: '',
      }));
      setRozBrands([]);
      setRozModels([]);
      setRozTypes([]);
      setRozYears([]);
      setRozHint(
        value ? 'Завантаження марок...' : 'Оберіть таблицю для початку.',
      );
      return;
    }
    if (field === 'marka') {
      setRozForm((prev) => ({
        ...prev,
        marka: value,
        model: '',
        typ: '',
        year: '',
      }));
      setRozModels([]);
      setRozTypes([]);
      setRozYears([]);
      setRozHint(value ? 'Завантаження моделей...' : 'Оберіть марку.');
      return;
    }
    if (field === 'model') {
      setRozForm((prev) => ({ ...prev, model: value, typ: '', year: '' }));
      setRozTypes([]);
      setRozYears([]);
      setRozHint(value ? 'Завантаження типів...' : 'Оберіть модель.');
      return;
    }
    if (field === 'typ') {
      setRozForm((prev) => ({ ...prev, typ: value, year: '' }));
      setRozYears([]);
      setRozHint(value ? 'Завантаження років...' : 'Оберіть тип.');
      return;
    }
    setRozForm((prev) => ({ ...prev, [field]: value }));
  };

  const canCalculateRoz = useMemo(() => {
    return Boolean(
      rozForm.table &&
      rozForm.marka &&
      rozForm.model &&
      rozForm.typ &&
      rozForm.year &&
      parseNumberish(rozForm.param) > 0 &&
      parseNumberish(rozForm.fx) > 0,
    );
  }, [rozForm]);

  const runRozrahunok = async () => {
    if (!rozForm.table) return;
    setRozLoading(true);
    setRozError('');
    setRozResult(null);
    try {
      const response = await getRozrahunokEstimate(DB_NAME, {
        table: rozForm.table,
        marka: rozForm.marka,
        model: rozForm.model,
        typ: rozForm.typ,
        year: rozForm.year,
        param: parseNumberish(rozForm.param),
        delivery: parseNumberish(rozForm.delivery),
        fx: parseNumberish(rozForm.fx),
      });
      setRozResult(response.data);
      setRozHint('Розрахунок виконано.');
    } catch (error) {
      setRozError(
        (error as Error)?.message || 'Не вдалося виконати розрахунок',
      );
      setRozHint('Сталася помилка.');
    } finally {
      setRozLoading(false);
    }
  };
  return (
    <TabPanel current={tab} value="customs">
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            Розрахунок розмитнення
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Тип авто (таблиця)</InputLabel>
                <Select
                  value={rozForm.table}
                  label="Тип авто (таблиця)"
                  onChange={(e) =>
                    handleRozSelect('table', String(e.target.value))
                  }
                >
                  <MenuItem value="">
                    <em>Оберіть</em>
                  </MenuItem>
                  {TABLES.map((item) => (
                    <MenuItem key={item} value={item}>
                      {TABLE_LABELS[item]} ({item})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth disabled={!rozForm.table}>
                <InputLabel>Марка</InputLabel>
                <Select
                  value={rozForm.marka}
                  label="Марка"
                  onChange={(e) =>
                    handleRozSelect('marka', String(e.target.value))
                  }
                >
                  <MenuItem value="">
                    <em>Оберіть</em>
                  </MenuItem>
                  {rozBrands.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth disabled={!rozForm.marka}>
                <InputLabel>Модель</InputLabel>
                <Select
                  value={rozForm.model}
                  label="Модель"
                  onChange={(e) =>
                    handleRozSelect('model', String(e.target.value))
                  }
                >
                  <MenuItem value="">
                    <em>Оберіть</em>
                  </MenuItem>
                  {rozModels.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth disabled={!rozForm.model}>
                <InputLabel>Тип палива</InputLabel>
                <Select
                  value={rozForm.typ}
                  label="Тип палива"
                  onChange={(e) =>
                    handleRozSelect('typ', String(e.target.value))
                  }
                >
                  <MenuItem value="">
                    <em>Оберіть</em>
                  </MenuItem>
                  {rozTypes.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth disabled={!rozForm.typ}>
                <InputLabel>Рік</InputLabel>
                <Select
                  value={rozForm.year}
                  label="Рік"
                  onChange={(e) =>
                    handleRozSelect('year', String(e.target.value))
                  }
                >
                  <MenuItem value="">
                    <em>Оберіть</em>
                  </MenuItem>
                  {rozYears.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label={
                  rozForm.table === '27033'
                    ? 'Ємність батареї (kWh)'
                    : "Об'єм двигуна (см³)"
                }
                value={rozForm.param}
                onChange={(e) => handleRozSelect('param', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Доставка (EUR)"
                value={rozForm.delivery}
                onChange={(e) => handleRozSelect('delivery', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Курс EUR → USD"
                value={rozForm.fx}
                onChange={(e) => handleRozSelect('fx', e.target.value)}
              />
            </Grid>
          </Grid>

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{ mt: 2, alignItems: 'center' }}
          >
            <Button
              variant="contained"
              onClick={runRozrahunok}
              disabled={!canCalculateRoz || rozLoading}
            >
              {rozLoading ? 'Рахуємо...' : 'Показати розрахунок'}
            </Button>
            <Typography color="text.secondary">{rozHint}</Typography>
          </Stack>

          {rozError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {rozError}
            </Alert>
          )}

          {rozResult && (
            <Box sx={{ mt: 3 }}>
              <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Базова ціна
                    </Typography>
                    <Typography variant="h6">
                      {formatMoney(rozResult.basePriceFromDb, 'USD')}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Митна вартість
                    </Typography>
                    <Typography variant="h6">
                      {formatMoney(rozResult.details.importDuty, 'USD')}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Курс
                    </Typography>
                    <Typography variant="h6">{safeToFixed(1.17, 4)}</Typography>
                  </Grid>
                </Grid>
              </Paper>

              {Array.isArray(rozResult.cards) &&
                rozResult.cards.map((card) => (
                  <Accordion key={card.code} defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{ width: '100%' }}>
                        <Typography sx={{ fontWeight: 700 }}>
                          {card.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="success.main"
                          sx={{ mt: 0.5 }}
                        >
                          Разом: {formatMoney(card.totalUSD, 'USD')}
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Показник</TableCell>
                              <TableCell>EUR</TableCell>
                              <TableCell>USD</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>Мито</TableCell>
                              <TableCell>
                                {formatMoney(card.dutyEUR, 'EUR')}
                              </TableCell>
                              <TableCell>
                                {formatMoney(card.dutyUSD, 'USD')}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Акциз</TableCell>
                              <TableCell>
                                {formatMoney(card.exciseEUR, 'EUR')}
                              </TableCell>
                              <TableCell>
                                {formatMoney(card.exciseUSD, 'USD')}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>ПДВ 20%</TableCell>
                              <TableCell>
                                {formatMoney(card.vatEUR, 'EUR')}
                              </TableCell>
                              <TableCell>
                                {formatMoney(card.vatUSD, 'USD')}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Митні платежі</TableCell>
                              <TableCell>
                                {formatMoney(card.customsPaymentsEUR, 'EUR')}
                              </TableCell>
                              <TableCell>
                                {formatMoney(card.customsPaymentsUSD, 'USD')}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Брокер</TableCell>
                              <TableCell>—</TableCell>
                              <TableCell>
                                {formatMoney(card.brokerUSD, 'USD')}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 700 }}>
                                Разом
                              </TableCell>
                              <TableCell>—</TableCell>
                              <TableCell sx={{ fontWeight: 700 }}>
                                {formatMoney(card.totalUSD, 'USD')}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </AccordionDetails>
                  </Accordion>
                ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </TabPanel>
  );
}
