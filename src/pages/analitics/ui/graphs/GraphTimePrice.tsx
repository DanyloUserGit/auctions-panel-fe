import React, { useMemo } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import {
  ChartContainer,
  LinePlot,
  ScatterPlot,
  ChartsXAxis,
  ChartsYAxis,
  ChartsGrid,
  ChartsTooltip,
  ChartsReferenceLine,
  type ScatterSeriesType,
  type LineSeriesType,
  type ScatterValueType,
} from '@mui/x-charts';
import dayjs from 'dayjs';

// --- Генерація мокових даних ---
// Використовуємо .valueOf(), щоб отримати number (timestamp) замість Date
const generateScatterData = (
  count: number,
  minPrice: number,
  maxPrice: number,
): ScatterValueType[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `point-${i}-${Math.random()}`,
    x: dayjs('2025-09-28')
      .add(Math.floor(Math.random() * 170), 'day')
      .valueOf(),
    y: Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice,
  }));
};

const type0Data = generateScatterData(20, 10000, 18000);
const type2Data = generateScatterData(15, 12000, 20000);
const type3Data = generateScatterData(10, 12000, 19000);

// Дані для середньої лінії по місяцях (також обов'язково числа)
const averageLineDates: number[] = [
  dayjs('2025-09-28').valueOf(),
  dayjs('2025-10-26').valueOf(),
  dayjs('2025-11-23').valueOf(),
  dayjs('2025-12-21').valueOf(),
  dayjs('2026-01-18').valueOf(),
  dayjs('2026-02-15').valueOf(),
  dayjs('2026-03-22').valueOf(),
];
const averageLinePrices: number[] = [
  13500, 14200, 17500, 15800, 15400, 15600, 14000,
];

export const GraphTimePrice: React.FC = () => {
  // Явно вказуємо тип масиву серій, щоб уникнути помилок Union Type
  const series: Array<ScatterSeriesType | LineSeriesType> = useMemo(
    () => [
      {
        type: 'scatter',
        id: 'type0',
        data: type0Data,
        color: '#fbbf24', // Жовтий
        markerSize: 5,
        valueFormatter: (v: ScatterValueType | null) =>
          v ? `${v.y.toLocaleString('uk-UA')} €` : '',
      },
      {
        type: 'scatter',
        id: 'type2',
        data: type2Data,
        color: '#22c55e', // Зелений
        markerSize: 5,
        valueFormatter: (v: ScatterValueType | null) =>
          v ? `${v.y.toLocaleString('uk-UA')} €` : '',
      },
      {
        type: 'scatter',
        id: 'type3',
        data: type3Data,
        color: '#a855f7', // Фіолетовий
        markerSize: 5,
        valueFormatter: (v: ScatterValueType | null) =>
          v ? `${v.y.toLocaleString('uk-UA')} €` : '',
      },
      {
        type: 'line',
        id: 'averageLine',
        data: averageLinePrices,
        color: 'var(--color-accent)', // Синій з ваших CSS змінних
        curve: 'linear',
        valueFormatter: (v: number | null) =>
          v !== null && v !== undefined ? `${v.toLocaleString('uk-UA')} €` : '',
      },
    ],
    [],
  );

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
          Час та ціна
        </Typography>
        <Typography variant="body2" className="text-[--color-muted]">
          <strong>Що показує цей графік:</strong> точки – ціни продажів у часі,
          синя лінія – середня ціна по місяцях, червоні маркери – це ж VIN.
          Ринковий коридор показує, де "нормальний" ринок.
        </Typography>
        <button className="text-[--color-accent] text-sm font-medium mt-1 hover:underline">
          Збільшити графік
        </button>
      </div>

      {/* Кастомна легенда */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-[#fbbf24] rounded-sm"></div> type 0
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-[#22c55e] rounded-sm"></div> type 2
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-[#a855f7] rounded-sm"></div> type 3
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-0.5 bg-[--color-accent]"></div> Середня ціна по
          місяцях
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-0.5 border-b-2 border-dotted border-cyan-400"></div>{' '}
          Ринковий коридор 25% (низ)
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-0.5 border-b-2 border-dotted border-cyan-400"></div>{' '}
          Ринковий коридор 75% (верх)
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-0.5 border-b-2 border-dotted border-green-400"></div>{' '}
          Середня ринкова ціна
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-0.5 border-b-2 border-solid border-red-500"></div>{' '}
          Поточне авто
        </div>
      </div>

      {/* Графік */}
      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <Box sx={{ minWidth: 600 }}>
          <ChartContainer
            height={400}
            series={series}
            xAxis={[
              {
                id: 'x-axis',
                scaleType: 'time',
                data: averageLineDates,
                valueFormatter: (date: number) =>
                  dayjs(date).format('MMM D, YYYY'),
              },
            ]}
            yAxis={[
              {
                id: 'y-axis',
                min: 8000,
                max: 22000,
                valueFormatter: (v: number) => v.toLocaleString('uk-UA'),
              },
            ]}
            margin={{ top: 20, right: 20, bottom: 40, left: 60 }}
          >
            <ChartsGrid horizontal />
            {/* Референсні лінії (Коридори та поточне авто) */}
            <ChartsReferenceLine
              y={16529}
              lineStyle={{
                stroke: '#22d3ee',
                strokeDasharray: '3 3',
                strokeWidth: 2,
              }}
            />{' '}
            {/* 75% */}
            <ChartsReferenceLine
              y={15400}
              lineStyle={{
                stroke: '#4ade80',
                strokeDasharray: '3 3',
                strokeWidth: 2,
              }}
            />{' '}
            {/* Market Avg */}
            <ChartsReferenceLine
              y={14195}
              lineStyle={{
                stroke: '#22d3ee',
                strokeDasharray: '3 3',
                strokeWidth: 2,
              }}
            />{' '}
            {/* 25% */}
            <ChartsReferenceLine
              y={11000}
              lineStyle={{ stroke: '#ef4444', strokeWidth: 2 }}
            />{' '}
            {/* Current Auto */}
            <ScatterPlot />
            <LinePlot />
            <ChartsXAxis label="Дата (countdown)" />
            <ChartsYAxis label="Ціна, €" />
            <ChartsTooltip />
          </ChartContainer>
        </Box>
      </Box>

      {/* Футер графіка */}
      <div className="mt-4 text-sm text-gray-800">
        <p>
          Поточна ціна: <strong>11 000 €</strong> | Медіана ринку:{' '}
          <strong>15 400 €</strong> | Коридор 25–75%:{' '}
          <strong>14 195–16 529 €</strong>
        </p>
        <p className="text-[--color-muted] text-xs mt-1">
          Цей графік допомагає бачити, чи не виставлена ваша ціна занадто
          рано/пізно відносно ринку і в якому часовому коридорі ринок жвавіший.
        </p>
      </div>
    </Paper>
  );
};
