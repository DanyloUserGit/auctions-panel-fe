import { Box, Paper, Typography } from '@mui/material';
import type { BarSeriesType, LineSeriesType } from '@mui/x-charts';
import {
  BarPlot,
  ChartContainer,
  ChartsGrid,
  ChartsTooltip,
  ChartsXAxis,
  ChartsYAxis,
  LinePlot,
  MarkPlot,
} from '@mui/x-charts';
import React, { useMemo } from 'react';
import type { CarMarketRow } from '../../model/api';


interface GraphProps {
  data: CarMarketRow[];
}

// Хелпер для розрахунку перцентилів
const getPercentile = (arr: number[], percentile: number) => {
  if (arr.length === 0) return 0;
  const index = (percentile / 100) * (arr.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  if (upper >= arr.length) return arr[lower];
  return arr[lower] * (1 - weight) + arr[upper] * weight;
};

// Дні тижня у JS (0 = Неділя). Ми створимо порядок відображення з Понеділка.
const JS_DAYS = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця", 'Субота'];
const DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Пн, Вт, Ср, Чт, Пт, Сб, Нд

export const GraphDaysOfWeek: React.FC<GraphProps> = ({ data }) => {
  // --- ОБЧИСЛЕННЯ РЕАЛЬНИХ ДАНИХ ---
  const calculatedData = useMemo(() => {
    if (!data || data.length === 0) return null;

    // 1. Групуємо ціни за днем тижня
    const groupedPrices: Record<number, number[]> = {
      0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []
    };

    data.forEach((row) => {
      if (row.price > 0 && row.countdown_ts) {
        // Перевіряємо чи timestamp у секундах (10 цифр) чи мілісекундах (13 цифр)
        const ts = row.countdown_ts < 1e12 ? row.countdown_ts * 1000 : row.countdown_ts;
        const date = new Date(ts);
        const day = date.getDay(); // 0-6
        groupedPrices[day].push(row.price);
      }
    });

    // 2. Розраховуємо статистику для кожного дня (у порядку з Понеділка по Неділю)
    const stats = DISPLAY_ORDER.map((dayIndex) => {
      const prices = groupedPrices[dayIndex];
      const sortedPrices = prices.sort((a, b) => a - b);
      const count = sortedPrices.length;

      let min = null, p25 = null, avg = null, p75 = null, max = null;

      if (count > 0) {
        if (count < 4) {
          // Мало даних - беремо як є
          min = sortedPrices[0];
          p25 = sortedPrices[0];
          avg = Math.round(sortedPrices.reduce((a, b) => a + b, 0) / count);
          p75 = sortedPrices[count - 1];
          max = sortedPrices[count - 1];
        } else {
          // Багато даних - очищаємо від викидів (IQR)
          const q1 = getPercentile(sortedPrices, 25);
          const q3 = getPercentile(sortedPrices, 75);
          const iqr = q3 - q1;
          const lowerBound = q1 - 1.5 * iqr;
          const upperBound = q3 + 1.5 * iqr;

          const cleaned = sortedPrices.filter(p => p >= lowerBound && p <= upperBound);

          if (cleaned.length > 0) {
            min = cleaned[0];
            p25 = getPercentile(cleaned, 25);
            avg = Math.round(cleaned.reduce((a, b) => a + b, 0) / cleaned.length);
            p75 = getPercentile(cleaned, 75);
            max = cleaned[cleaned.length - 1];
          } else {
            min = sortedPrices[0]; p25 = q1;
            avg = Math.round(sortedPrices.reduce((a, b) => a + b, 0) / count);
            p75 = q3; max = sortedPrices[count - 1];
          }
        }
      }

      return {
        label: JS_DAYS[dayIndex],
        count,
        min, p25, avg, p75, max
      };
    });

    const xAxisLabels = stats.map(s => s.label);
    const volumes = stats.map(s => s.count);

    // Збираємо всі валідні ціни для визначення меж графіка
    const allCleanedPrices = [
      ...stats.map(s => s.min),
      ...stats.map(s => s.max)
    ].filter(p => p !== null) as number[];

    const minPrice = allCleanedPrices.length > 0 ? Math.min(...allCleanedPrices) : 0;
    const maxPrice = allCleanedPrices.length > 0 ? Math.max(...allCleanedPrices) : 20000;
    const maxVolume = Math.max(...volumes, 10);

    return {
      stats,
      xAxisLabels,
      volumes,
      yPriceMin: Math.floor(minPrice / 1000) * 1000 * 0.9,
      yPriceMax: Math.ceil(maxPrice / 1000) * 1000 * 1.1,
      yVolumeMax: Math.ceil(maxVolume * 1.2),
    };
  }, [data]);

  // --- ДИНАМІЧНА СТАТИСТИКА ДЛЯ ФУТЕРА ---
  const summary = useMemo(() => {
    if (!calculatedData) return null;
    const validDays = calculatedData.stats.filter(d => d.count > 0 && d.avg !== null && d.min !== null);

    if (validDays.length === 0) return null;

    const minAvgDay = validDays.reduce((prev, curr) => (curr.avg! < prev.avg! ? curr : prev));
    const minPriceDay = validDays.reduce((prev, curr) => (curr.min! < prev.min! ? curr : prev));
    const maxVolDay = validDays.reduce((prev, curr) => (curr.count > prev.count ? curr : prev));

    return { minAvgDay, minPriceDay, maxVolDay };
  }, [calculatedData]);

  const series: Array<LineSeriesType | BarSeriesType> = useMemo(() => {
    if (!calculatedData) return [];

    return [
      {
        type: 'bar',
        id: 'volume',
        data: calculatedData.volumes,
        xAxisId: 'x-axis-days',
        yAxisId: 'y-axis-volume',
        color: '#e2e8f0', // Світло-сірий
        valueFormatter: (v: number | null) => (v !== null ? `${v} лотів` : ''),
      },
      {
        type: 'line',
        id: 'minMarket',
        label: 'Низ ринку',
        data: calculatedData.stats.map(s => s.min),
        xAxisId: 'x-axis-days',
        yAxisId: 'y-axis-price',
        color: '#60a5fa', // Синій
        curve: 'linear',
        showMark: true,
        valueFormatter: (v: number | null) => v !== null ? `${v.toLocaleString('uk-UA')} €` : '',
      },
      {
        type: 'line',
        id: 'p25',
        label: 'P25',
        data: calculatedData.stats.map(s => s.p25),
        xAxisId: 'x-axis-days',
        yAxisId: 'y-axis-price',
        color: '#34d399', // Зелений
        curve: 'linear',
        showMark: true,
        valueFormatter: (v: number | null) => v !== null ? `${v.toLocaleString('uk-UA')} €` : '',
      },
      {
        type: 'line',
        id: 'avgPrice',
        label: 'Середня ціна',
        data: calculatedData.stats.map(s => s.avg),
        xAxisId: 'x-axis-days',
        yAxisId: 'y-axis-price',
        color: '#f59e0b', // Жовтий
        curve: 'linear',
        showMark: true,
        valueFormatter: (v: number | null) => v !== null ? `${v.toLocaleString('uk-UA')} €` : '',
      },
      {
        type: 'line',
        id: 'p75',
        label: 'P75',
        data: calculatedData.stats.map(s => s.p75),
        xAxisId: 'x-axis-days',
        yAxisId: 'y-axis-price',
        color: '#d97706', // Темно-оранжевий
        curve: 'linear',
        showMark: true,
        valueFormatter: (v: number | null) => v !== null ? `${v.toLocaleString('uk-UA')} €` : '',
      },
      {
        type: 'line',
        id: 'maxMarket',
        label: 'Верх ринку',
        data: calculatedData.stats.map(s => s.max),
        xAxisId: 'x-axis-days',
        yAxisId: 'y-axis-price',
        color: '#ef4444', // Червоний
        curve: 'linear',
        showMark: true,
        valueFormatter: (v: number | null) => v !== null ? `${v.toLocaleString('uk-UA')} €` : '',
      },
    ];
  }, [calculatedData]);

  if (!data || data.length === 0 || !calculatedData) {
    return (
      <Paper elevation={0} className="w-full p-6 border border-gray-200 rounded-lg text-center">
        <Typography color="textSecondary">Немає даних для побудови графіка по днях тижня</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} className="w-full p-4 border border-gray-200 rounded-lg">
      <div className="mb-4">
        <Typography variant="h6" className="text-gray-900 font-semibold text-base mb-1">
          Аналітика по днях тижня
        </Typography>
        <Typography variant="body2" className="text-gray-900 font-medium">
          Залежність середньої ціни та кількості лотів від дня тижня завершення аукціону.
        </Typography>
      </div>

      {/* Легенда */}
      <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mb-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-6 h-3 bg-slate-200 border border-slate-300"></div> К-сть лотів
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-0.5 bg-blue-400"></div> Низ ринку
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-0.5 border-b-2 border-dotted border-green-400"></div> P25
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-0.5 bg-yellow-500"></div> Середня ціна
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-0.5 border-b-2 border-dotted border-orange-600"></div> P75
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-0.5 bg-red-500"></div> Верх ринку
        </div>
      </div>

      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <Box sx={{ minWidth: 700 }}>
          <ChartContainer
            height={400}
            series={series}
            xAxis={[
              {
                id: 'x-axis-days',
                scaleType: 'band',
                data: calculatedData.xAxisLabels,
                position: 'bottom',
              },
            ]}
            yAxis={[
              {
                id: 'y-axis-price',
                scaleType: 'linear',
                min: calculatedData.yPriceMin,
                max: calculatedData.yPriceMax,
                position: 'left',
                valueFormatter: (v: number) => `${v.toLocaleString('uk-UA')} €`,
              },
              {
                id: 'y-axis-volume',
                scaleType: 'linear',
                min: 0,
                max: calculatedData.yVolumeMax,
                position: 'right',
                valueFormatter: (v: number) => `${v} шт.`,
              },
            ]}
            margin={{ top: 20, right: 70, bottom: 40, left: 70 }}
            sx={{
              '& .MuiLineElement-series-p25': { strokeDasharray: '5 5' },
              '& .MuiLineElement-series-p75': { strokeDasharray: '5 5' },
              '& .MuiLineElement-series-avgPrice': { strokeWidth: 3 },
            }}
          >
            <ChartsGrid horizontal />
            <BarPlot />
            <LinePlot />
            <MarkPlot />
            <ChartsXAxis tickLabelStyle={{ fontSize: 12 }} />
            <ChartsYAxis axisId="y-axis-price" label="Ринкові ціни, €" />
            <ChartsYAxis axisId="y-axis-volume" label="Кількість лотів" />
            <ChartsTooltip />
          </ChartContainer>
        </Box>
      </Box>

      {/* Динамічний футер */}
      <div className="mt-4 text-sm text-gray-800 leading-relaxed p-3 bg-gray-50 rounded-md border border-gray-100">
        <p className="font-medium mb-1">Ключові висновки на основі даних:</p>
        {summary ? (
          <ul className="list-disc pl-5 text-xs text-gray-700 space-y-1">
            <li>Найнижча середня ціна - у <strong>{summary.minAvgDay.label}</strong> (~<strong>{summary.minAvgDay.avg?.toLocaleString('uk-UA')} €</strong>).</li>
            <li>Найнижчі мінімальні ціни - у <strong>{summary.minPriceDay.label}</strong> (від <strong>{summary.minPriceDay.min?.toLocaleString('uk-UA')} €</strong>).</li>
            <li>Найбільший обсяг продажів - у <strong>{summary.maxVolDay.label}</strong> (<strong>{summary.maxVolDay.count} лотів</strong>).</li>
          </ul>
        ) : (
          <p className="text-xs text-gray-700">Немає достатньо даних для висновків.</p>
        )}
      </div>
    </Paper>
  );
};