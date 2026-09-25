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


const COUNTRY_MAP: Record<number, string> = {
  1: 'Німеччина',
  2: 'Франція',
  3: 'Італія',
  4: 'Іспанія',
  5: 'Нідерланди',
  6: 'Бельгія',
  7: 'Швеція',
  8: 'Польща',
  9: 'Румунія',
  10: 'Данія',
};

interface GraphProps {
  data: CarMarketRow[];
}

const getPercentile = (arr: number[], percentile: number) => {
  if (arr.length === 0) return 0;
  const index = (percentile / 100) * (arr.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  if (upper >= arr.length) return arr[lower];
  return arr[lower] * (1 - weight) + arr[upper] * weight;
};

export const GraphCountries: React.FC<GraphProps> = ({ data }) => {
  const calculatedData = useMemo(() => {
    if (!data || data.length === 0) return null;

    // Групуємо ціни за ID країни
    const groupedPrices: Record<number, number[]> = {};
    data.forEach((row) => {
      if (row.price > 0 && row.country_id !== null && row.country_id !== undefined) {
        if (!groupedPrices[row.country_id]) {
          groupedPrices[row.country_id] = [];
        }
        groupedPrices[row.country_id].push(row.price);
      }
    });

    // Розраховуємо статистику для кожної країни
    const stats = Object.entries(groupedPrices).map(([countryIdStr, prices]) => {
      const countryId = parseInt(countryIdStr, 10);
      const sortedPrices = prices.sort((a, b) => a - b);
      const count = sortedPrices.length;

      let min = 0, p25 = 0, median = 0, p75 = 0, max = 0;

      if (count > 0) {
        if (count < 4) {
          // Мало даних - беремо як є
          min = sortedPrices[0];
          p25 = sortedPrices[0];
          median = getPercentile(sortedPrices, 50);
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
            median = getPercentile(cleaned, 50);
            p75 = getPercentile(cleaned, 75);
            max = cleaned[cleaned.length - 1];
          } else {
            min = sortedPrices[0]; p25 = q1; median = getPercentile(sortedPrices, 50); p75 = q3; max = sortedPrices[count - 1];
          }
        }
      }

      return {
        label: COUNTRY_MAP[countryId] || `Країна ID ${countryId}`,
        count,
        min, p25, median, p75, max
      };
    });

    // Фільтруємо і сортуємо (показуємо найпопулярніші країни зліва)
    const validStats = stats.filter(s => s.count > 0).sort((a, b) => b.count - a.count);

    if (validStats.length === 0) return null;

    const xAxisLabels = validStats.map(s => s.label);
    const volumes = validStats.map(s => s.count);
    const mins = validStats.map(s => s.min);
    const p25s = validStats.map(s => s.p25);
    const medians = validStats.map(s => s.median);
    const p75s = validStats.map(s => s.p75);
    const maxs = validStats.map(s => s.max);

    const allCleanedPrices = [...mins, ...maxs].filter(p => p > 0);
    const minPrice = allCleanedPrices.length > 0 ? Math.min(...allCleanedPrices) : 0;
    const maxPrice = allCleanedPrices.length > 0 ? Math.max(...allCleanedPrices) : 20000;
    const maxVolume = Math.max(...volumes, 10);

    return {
      xAxisLabels,
      volumes,
      mins,
      p25s,
      medians,
      p75s,
      maxs,
      yPriceMin: Math.floor(minPrice / 1000) * 1000 * 0.9,
      yPriceMax: Math.ceil(maxPrice / 1000) * 1000 * 1.1,
      yVolumeMax: Math.ceil(maxVolume * 1.2),
    };
  }, [data]);

  const series: Array<LineSeriesType | BarSeriesType> = useMemo(() => {
    if (!calculatedData) return [];

    return [
      {
        type: 'bar',
        id: 'volume',
        data: calculatedData.volumes,
        xAxisId: 'x-axis-countries',
        yAxisId: 'y-axis-volume',
        color: '#e2e8f0',
        valueFormatter: (v: number | null) => (v !== null ? `${v} авто` : ''),
      },
      {
        type: 'line',
        id: 'bottomMarket',
        label: 'Низ ринку',
        data: calculatedData.mins,
        xAxisId: 'x-axis-countries',
        yAxisId: 'y-axis-price',
        color: '#60a5fa',
        curve: 'linear',
        showMark: true,
        valueFormatter: (v: number | null) => v !== null ? `${v.toLocaleString('uk-UA')} €` : '',
      },
      {
        type: 'line',
        id: 'p25',
        label: 'P25',
        data: calculatedData.p25s,
        xAxisId: 'x-axis-countries',
        yAxisId: 'y-axis-price',
        color: '#34d399',
        curve: 'linear',
        showMark: true,
        valueFormatter: (v: number | null) => v !== null ? `${v.toLocaleString('uk-UA')} €` : '',
      },
      {
        type: 'line',
        id: 'median',
        label: 'Медіана',
        data: calculatedData.medians,
        xAxisId: 'x-axis-countries',
        yAxisId: 'y-axis-price',
        color: '#f59e0b',
        curve: 'linear',
        showMark: true,
        valueFormatter: (v: number | null) => v !== null ? `${v.toLocaleString('uk-UA')} €` : '',
      },
      {
        type: 'line',
        id: 'p75',
        label: 'P75',
        data: calculatedData.p75s,
        xAxisId: 'x-axis-countries',
        yAxisId: 'y-axis-price',
        color: '#d97706',
        curve: 'linear',
        showMark: true,
        valueFormatter: (v: number | null) => v !== null ? `${v.toLocaleString('uk-UA')} €` : '',
      },
      {
        type: 'line',
        id: 'topMarket',
        label: 'Верх ринку',
        data: calculatedData.maxs,
        xAxisId: 'x-axis-countries',
        yAxisId: 'y-axis-price',
        color: '#ef4444',
        curve: 'linear',
        showMark: true,
        valueFormatter: (v: number | null) => v !== null ? `${v.toLocaleString('uk-UA')} €` : '',
      },
    ];
  }, [calculatedData]);

  if (!data || data.length === 0 || !calculatedData) {
    return (
      <Paper elevation={0} className="w-full p-6 border border-gray-200 rounded-lg text-center">
        <Typography color="textSecondary">Немає даних для побудови графіка по країнах</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} className="w-full p-4 border border-gray-200 rounded-lg">
      <div className="mb-4">
        <Typography variant="h6" className="text-gray-900 font-semibold text-base mb-1">
          Аналітика по країнах
        </Typography>
        <Typography variant="body2" className="text-gray-900 font-medium">
          Порівняння ринкових цін залежно від країни походження.{' '}
          <span className="font-normal text-[--color-muted]">
            Країни відсортовані за кількістю знайдених лотів.
          </span>
        </Typography>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mb-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-6 h-3 bg-slate-200 border border-slate-300"></div> К-сть авто
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-0.5 bg-blue-400"></div> Низ ринку
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-0.5 border-b-2 border-dotted border-green-400"></div> P25
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-0.5 bg-yellow-500"></div> Медіана
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
                id: 'x-axis-countries',
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
              '& .MuiLineElement-series-median': { strokeWidth: 3 },
            }}
          >
            <ChartsGrid horizontal />
            <BarPlot />
            <LinePlot />
            <MarkPlot />
            <ChartsXAxis tickLabelStyle={{ fontSize: 12 }} />
            <ChartsYAxis axisId="y-axis-price" label="Ринкові ціни" />
            <ChartsYAxis axisId="y-axis-volume" label="Кількість авто" />
            <ChartsTooltip />
          </ChartContainer>
        </Box>
      </Box>

      <div className="mt-4 text-sm text-gray-800 leading-relaxed p-3 bg-gray-50 rounded-md border border-gray-100">
        <p className="font-medium mb-1">Як читати цей графік:</p>
        <p className="text-xs text-gray-700">
          Для кожної країни відображається повний ринковий профіль: нижня ціна
          ринку, P25, медіана, P75, верх ринку та кількість авто (сірі стовпчики). Це допомагає
          зрозуміти не лише типовий рівень ціни (Медіана), а й ширину розкиду цін на локальному ринку.
        </p>
      </div>
    </Paper>
  );
};