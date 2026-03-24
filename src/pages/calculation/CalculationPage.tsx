import { ArrowBack } from '@mui/icons-material';
import {
  Box,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Paper,
  type SelectChangeEvent,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getBrands, getEstimate, getModels } from './model/api';
import type { ICalculationForm, ICalculationResult } from './model/types';

const CalculationPage: React.FC = () => {
  const [db] = useState<string>('table_extourcars1');
  const [tables] = useState<string[]>(['27031', '27032', '27033']);

  const navigate = useNavigate();

  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<ICalculationForm>({
    table: '27031',
    marka: '',
    model: '',
    year: '2018',
    auctionPrice: 5000,
    engineVolume: 2000,
    fuelType: 'petrol',
    road: 0,
    cert: 0,
    border: 0,
    towing: 0,
  });

  const [result, setResult] = useState<ICalculationResult | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getBrands(db, form.table);
      setBrands(res.data);
    };
    fetchData();
  }, [form.table, db]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getModels(db, form.table, form.marka);
      setModels(res.data);
    };
    if (form.marka) {
      fetchData();
    }
  }, [form.marka, form.table, db]);

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name as string]: value }));
  };

  const calculate = async () => {
    setLoading(true);
    try {
      const response = await getEstimate(db, form);
      setResult(response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', my: 3, gap: 1 }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{ color: 'text.secondary' }}
        >
          <ArrowBack />
        </IconButton>
        <Typography
          variant="h5"
          sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}
        >
          Розрахунок
        </Typography>
      </Box>

      <div className="grid grid-cols-2 gap-5" style={{ marginBottom: '15px' }}>
        {/* Вибір таблиці */}
        <FormControl fullWidth>
          <InputLabel id="table-select-label">Тип авто (Таблиця)</InputLabel>
          <Select
            labelId="table-select-label"
            name="table"
            value={form.table}
            label="Тип авто (Таблиця)"
            onChange={handleInputChange}
          >
            {tables.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Вибір Марки */}
        <FormControl fullWidth>
          <InputLabel id="marka-select-label">Марка</InputLabel>
          <Select
            labelId="marka-select-label"
            name="marka"
            value={form.marka}
            label="Марка"
            onChange={handleInputChange}
          >
            <MenuItem value="">
              <em>Оберіть марку</em>
            </MenuItem>
            {brands.map((b) => (
              <MenuItem key={b} value={b}>
                {b}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Вибір Моделі */}
        <FormControl fullWidth>
          <InputLabel id="model-select-label">Модель</InputLabel>
          <Select
            labelId="model-select-label"
            name="model"
            value={form.model}
            label="Модель"
            onChange={handleInputChange}
            disabled={!form.marka}
          >
            <MenuItem value="">
              <em>Оберіть модель</em>
            </MenuItem>
            {models.map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Рік випуску */}
        <TextField
          fullWidth
          label="Рік"
          type="number"
          name="year"
          value={form.year}
          onChange={handleInputChange}
        />

        {/* Об'єм двигуна */}
        <TextField
          fullWidth
          label="Об'єм двигуна (см³)"
          type="number"
          name="engineVolume"
          value={form.engineVolume}
          onChange={handleInputChange}
        />

        {/* Тип палива */}
        <FormControl fullWidth>
          <InputLabel id="fuel-type-label">Тип палива</InputLabel>
          <Select
            labelId="fuel-type-label"
            name="fuelType"
            value={form.fuelType}
            label="Тип палива"
            onChange={handleInputChange}
          >
            <MenuItem value="petrol">Бензин</MenuItem>
            <MenuItem value="diesel">Дизель</MenuItem>
          </Select>
        </FormControl>

        {/* Ціна на аукціоні */}
        <TextField
          fullWidth
          label="Ціна на аукціоні (USD)"
          type="number"
          name="auctionPrice"
          value={form.auctionPrice}
          onChange={handleInputChange}
        />
      </div>

      <Button
        variant="contained"
        onClick={calculate}
        disabled={loading}
        size="large"
        className="mt-8 w-full py-3"
        sx={{ fontWeight: 'bold' }}
      >
        {loading ? 'Рахуємо...' : 'Розрахувати вартість'}
      </Button>

      {result && (
        <Paper
          elevation={0}
          className="mt-8 p-6 bg-blue-50 border border-blue-200"
          sx={{ borderRadius: '12px' }}
        >
          <Typography variant="h6" className="font-bold mb-4">
            Результати розрахунку:
          </Typography>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Оціночна вартість (БД):</span>
              <span className="font-bold">{result.basePriceFromDb} USD</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>Мито:</span>
              <span>+{result.details.importDuty} USD</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>Акциз:</span>
              <span>+{result.details.excise} USD</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>ПДВ (20%):</span>
              <span>+{result.details.vat} USD</span>
            </div>
            <div className="flex justify-between font-bold pt-3 border-t border-blue-200">
              <span>Всього розмитнення:</span>
              <span>{result.details.totalCustoms} USD</span>
            </div>
            <div className="flex justify-between text-green-700 text-2xl font-black pt-4">
              <span>РАЗОМ В УКРАЇНІ:</span>
              <span>{result.totalInUkraine} USD</span>
            </div>
          </div>
        </Paper>
      )}
    </>
  );
};

export default CalculationPage;
