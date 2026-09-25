import { Box, Paper, Typography } from '@mui/material';
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
import type { BarSeriesType, LineSeriesType } from '@mui/x-charts';
import type { CarMarketRow } from '../../model/api';

const auctionTypeNames: Record<number, string> = {
  0: 'Відкрита ціна (Type 0)',
  2: 'Фіксована ціна (Type 2)',
  3: 'Стартова ціна (Type 3)',
};

interface GraphProps {
  data: CarMarketRow[];
}

// Хелпер для розрахунку перцентилів (масив має бути відсортований)
const getPercentile = (arr: number[], percentile: number) => {
  if (arr.length === 0) return 0;
  const index = (percentile / 100) * (arr.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  if (upper >= arr.length) return arr[lower];
  return arr[lower] * (1 - weight) + arr[upper] * weight;
};

export const GraphAuctionTypes: React.FC<GraphProps> = ({ data }) => {
  const calculatedData = useMemo(() => {
    if (!data || data.length === 0) return null;

    // Групуємо ціни за типами аукціонів
    const groupedPrices: Record<number, number[]> = { 0: [], 2: [], 3: [] };
    data.forEach((row) => {
      if (row.price > 0 && groupedPrices[row.auction_type] !== undefined) {
        groupedPrices[row.auction_type].push(row.price);
      }
    });

    const xAxisLabels: string[] = [];
    const volumes: number[] = [];
    const mins: number[] = [];
    const p25s: number[] = [];
    const medians: number[] = [];
    const p75s: number[] = [];
    const maxs: number[] = [];

    // Обробимо типи в фіксованому порядку для стабільності графіка
    [2, 3, 0].forEach((type) => {
      const prices = groupedPrices[type].sort((a, b) => a - b);
      const count = prices.length;

      // Додаємо тип на вісь, навіть якщо немає даних
      xAxisLabels.push(auctionTypeNames[type]);
      volumes.push(count);

      if (count < 4) {
        // Занадто мало даних для статистики
        mins.push(count > 0 ? prices[0] : 0);
        p25s.push(count > 0 ? prices[0] : 0);
        medians.push(count > 0 ? getPercentile(prices, 50) : 0);
        p75s.push(count > 0 ? prices[count - 1] : 0);
        maxs.push(count > 0 ? prices[count - 1] : 0);
      } else {
        // ОЧИЩЕННЯ ВІД ВИКИДІВ (Метод IQR)
        const q1 = getPercentile(prices, 25);
        const q3 = getPercentile(prices, 75);
        const iqr = q3 - q1;
        // Класичні межі: Q1 - 1.5*IQR та Q3 + 1.5*IQR
        const lowerBound = q1 - 1.5 * iqr;
        const upperBound = q3 + 1.5 * iqr;

        const cleanedPrices = prices.filter(p => p >= lowerBound && p <= upperBound);

        if (cleanedPrices.length > 0) {
          mins.push(cleanedPrices[0]);
          p25s.push(getPercentile(cleanedPrices, 25));
          medians.push(getPercentile(cleanedPrices, 50));
          p75s.push(getPercentile(cleanedPrices, 75));
          maxs.push(cleanedPrices[cleanedPrices.length - 1]);
        } else {
          // Якщо після очистки нічого не залишилось (аномалія)
          mins.push(prices[0]); p25s.push(q1); medians.push(getPercentile(prices, 50)); p75s.push(q3); maxs.push(prices[prices.length - 1]);
        }
      }
    });

    const allCleanedPrices = [...mins, ...maxs].filter(p => p > 0);
    const maxPrice = allCleanedPrices.length > 0 ? Math.max(...allCleanedPrices) : 20000;
    const minPrice = allCleanedPrices.length > 0 ? Math.min(...allCleanedPrices) : 0;
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
        xAxisId: 'x-axis-types',
        yAxisId: 'y-axis-volume',
        color: '#e2e8f0',
        valueFormatter: (v: number | null) => (v !== null ? `${v} авто` : ''),
      },
      {
        type: 'line',
        id: 'bottomMarket',
        label: 'Низ ринку',
        data: calculatedData.mins,
        xAxisId: 'x-axis-types',
        yAxisId: 'y-axis-price',
        color: '#60a5fa',
        curve: 'linear',
        showMark: true,
        valueFormatter: (v: number | null) =>
          v !== null ? `${v.toLocaleString('uk-UA')} €` : '',
      },
      {
        type: 'line',
        id: 'p25',
        label: 'P25',
        data: calculatedData.p25s,
        xAxisId: 'x-axis-types',
        yAxisId: 'y-axis-price',
        color: '#34d399',
        curve: 'linear',
        showMark: true,
        valueFormatter: (v: number | null) =>
          v !== null ? `${v.toLocaleString('uk-UA')} €` : '',
      },
      {
        type: 'line',
        id: 'median',
        label: 'Медіана',
        data: calculatedData.medians,
        xAxisId: 'x-axis-types',
        yAxisId: 'y-axis-price',
        color: '#f59e0b',
        curve: 'linear',
        showMark: true,
        valueFormatter: (v: number | null) =>
          v !== null ? `${v.toLocaleString('uk-UA')} €` : '',
      },
      {
        type: 'line',
        id: 'p75',
        label: 'P75',
        data: calculatedData.p75s,
        xAxisId: 'x-axis-types',
        yAxisId: 'y-axis-price',
        color: '#d97706',
        curve: 'linear',
        showMark: true,
        valueFormatter: (v: number | null) =>
          v !== null ? `${v.toLocaleString('uk-UA')} €` : '',
      },
      {
        type: 'line',
        id: 'topMarket',
        label: 'Верх ринку',
        data: calculatedData.maxs,
        xAxisId: 'x-axis-types',
        yAxisId: 'y-axis-price',
        color: '#ef4444',
        curve: 'linear',
        showMark: true,
        valueFormatter: (v: number | null) =>
          v !== null ? `${v.toLocaleString('uk-UA')} €` : '',
      },
    ];
  }, [calculatedData]);

  if (!data || data.length === 0) {
    return (
      <Paper elevation={0} className="w-full p-6 border border-gray-200 rounded-lg text-center">
        <Typography color="textSecondary">Немає даних для побудови графіка по типах аукціонів</Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      className="w-full p-4 border border-gray-200 rounded-lg"
    >
      <div className="mb-4">
        <Typography
          variant="h6"
          className="text-gray-900 font-semibold text-base mb-1"
        >
          Типи аукціону
        </Typography>
        <Typography variant="body2" className="text-gray-900 font-medium">
          Порівняння по типах аукціону{' '}
          <span className="font-normal text-[--color-muted]">
            показує, як тип продажу впливає на підсумкову ціну та де формується
            дешевший або дорожчий сегмент ринку. Стовпчики - кількість авто, лінії - ціни (після очистки від викидів).
          </span>
        </Typography>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mb-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-6 h-3 bg-slate-200 border border-slate-300"></div>{' '}
          К-сть авто
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-0.5 bg-blue-400"></div> Низ ринку
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-0.5 border-b-2 border-dotted border-green-400"></div>{' '}
          P25
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-0.5 bg-yellow-500"></div> Медіана
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-0.5 border-b-2 border-dotted border-orange-600"></div>{' '}
          P75
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-0.5 bg-red-500"></div> Верх ринку
        </div>
      </div>

      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <Box sx={{ minWidth: 600 }}>
          <ChartContainer
            height={400}
            series={series}
            xAxis={[
              {
                id: 'x-axis-types',
                scaleType: 'band',
                data: calculatedData?.xAxisLabels || [],
                position: 'bottom',
              },
            ]}
            yAxis={[
              {
                id: 'y-axis-price',
                scaleType: 'linear',
                min: calculatedData?.yPriceMin || 0,
                max: calculatedData?.yPriceMax || 25000,
                position: 'left',
                valueFormatter: (v: number) => `${v.toLocaleString('uk-UA')} €`,
              },
              {
                id: 'y-axis-volume',
                scaleType: 'linear',
                min: 0,
                max: calculatedData?.yVolumeMax || 100,
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
          Сірі стовпчики показують, скільки угод відбулося за кожним типом аукціону (права шкала). Лінії показують ціновий розподіл (ліва шкала).
          <strong> Медіана (жовта лінія)</strong> - це типова ціна. Простір між пунктирними лініями
          <strong> (P25 та P75)</strong> - це "здоровий" центр ринку (50% всіх продажів). Лінії
          <strong> Низу</strong> та <strong>Верху</strong> ринку показують межі типових цін після видалення поодиноких аномально дешевих або дорогих продажів.
        </p>
      </div>
    </Paper>
  );
};