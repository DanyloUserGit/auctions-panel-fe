import React, { useMemo } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import {
  ChartContainer,
  LinePlot,
  BarPlot,
  ChartsXAxis,
  ChartsYAxis,
  ChartsGrid,
  ChartsTooltip,
  MarkPlot,
} from '@mui/x-charts';
// Суворий імпорт типів
import type { LineSeriesType, BarSeriesType } from '@mui/x-charts';

// --- Мокові дані по типах аукціону ---
const auctionTypes = [
  'Аукціон з фіксованою ціною (type 2)',
  'Аукціон зі стартовою ціною (type 3)',
  'Аукціон з відкритою ціною (type 0)',
];

// Дані кількості авто (відповідають правій шкалі)
const volumeData = [50, 35, 75];

// Дані цінових меж (відповідають лівій шкалі)
const bottomMarketData = [10200, 9200, 9800];
const p25Data = [14500, 13800, 13900];
const medianData = [15800, 15400, 15000];
const p75Data = [18000, 17500, 16000];
const topMarketData = [20600, 19000, 18100];

export const GraphAuctionTypes: React.FC = () => {
  const series: Array<LineSeriesType | BarSeriesType> = useMemo(
    () => [
      {
        type: 'bar',
        id: 'volume',
        data: volumeData,
        xAxisId: 'x-axis-types',
        yAxisId: 'y-axis-volume', // Права вісь
        color: '#e2e8f0', // Світло-сірий
        valueFormatter: (v: number | null) => (v !== null ? `${v} авто` : ''),
      },
      {
        type: 'line',
        id: 'bottomMarket',
        data: bottomMarketData,
        xAxisId: 'x-axis-types',
        yAxisId: 'y-axis-price', // Ліва вісь
        color: '#60a5fa', // Світло-синій
        curve: 'linear',
        showMark: true,
        valueFormatter: (v: number | null) =>
          v !== null ? `${v.toLocaleString('uk-UA')} €` : '',
      },
      {
        type: 'line',
        id: 'p25',
        data: p25Data,
        xAxisId: 'x-axis-types',
        yAxisId: 'y-axis-price',
        color: '#34d399', // Світло-зелений
        curve: 'linear',
        showMark: true,
        valueFormatter: (v: number | null) =>
          v !== null ? `${v.toLocaleString('uk-UA')} €` : '',
      },
      {
        type: 'line',
        id: 'median',
        data: medianData,
        xAxisId: 'x-axis-types',
        yAxisId: 'y-axis-price',
        color: '#f59e0b', // Жовтий/Помаранчевий
        curve: 'linear',
        showMark: true,
        valueFormatter: (v: number | null) =>
          v !== null ? `${v.toLocaleString('uk-UA')} €` : '',
      },
      {
        type: 'line',
        id: 'p75',
        data: p75Data,
        xAxisId: 'x-axis-types',
        yAxisId: 'y-axis-price',
        color: '#d97706', // Темно-помаранчевий (коричнюватий)
        curve: 'linear',
        showMark: true,
        valueFormatter: (v: number | null) =>
          v !== null ? `${v.toLocaleString('uk-UA')} €` : '',
      },
      {
        type: 'line',
        id: 'topMarket',
        data: topMarketData,
        xAxisId: 'x-axis-types',
        yAxisId: 'y-axis-price',
        color: '#ef4444', // Червоний
        curve: 'linear',
        showMark: true,
        valueFormatter: (v: number | null) =>
          v !== null ? `${v.toLocaleString('uk-UA')} €` : '',
      },
    ],
    [],
  );

  return (
    <Paper
      elevation={0}
      className="w-full p-4 border border-gray-200 rounded-lg"
    >
      {/* Заголовок */}
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
            дешевший або дорожчий сегмент ринку.
          </span>
        </Typography>
        <button className="text-[--color-accent] text-sm font-medium mt-1 hover:underline">
          Збільшити графік
        </button>
      </div>

      {/* Кастомна легенда */}
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

      {/* Графік */}
      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <Box sx={{ minWidth: 800 }}>
          <ChartContainer
            height={400}
            series={series}
            xAxis={[
              {
                id: 'x-axis-types',
                scaleType: 'band',
                data: auctionTypes,
                position: 'bottom',
              },
            ]}
            yAxis={[
              {
                id: 'y-axis-price',
                scaleType: 'linear',
                min: 8000,
                max: 23000,
                position: 'left',
                valueFormatter: (v: number) => v.toLocaleString('uk-UA'),
              },
              {
                id: 'y-axis-volume',
                scaleType: 'linear',
                min: 0,
                max: 90, // Трохи більше за максимум (75), щоб графік не прилипав до верху
                position: 'right',
              },
            ]}
            margin={{ top: 20, right: 60, bottom: 40, left: 60 }}
            sx={{
              // Робимо P25 та P75 пунктирними
              '& .MuiLineElement-series-p25': { strokeDasharray: '5 5' },
              '& .MuiLineElement-series-p75': { strokeDasharray: '5 5' },
              // Трохи збільшуємо товщину медіани для акценту
              '& .MuiLineElement-series-median': { strokeWidth: 3 },
            }}
          >
            <ChartsGrid horizontal />
            <BarPlot />
            <LinePlot />
            <MarkPlot /> {/* Відображає кружечки на всіх лініях */}
            <ChartsXAxis tickLabelStyle={{ fontSize: 12 }} />
            <ChartsYAxis axisId="y-axis-price" label="Ринкові ціни, €" />
            <ChartsYAxis axisId="y-axis-volume" label="К-сть авто" />
            <ChartsTooltip />
          </ChartContainer>
        </Box>
      </Box>

      {/* Футер графіка */}
      <div className="mt-4 text-sm text-gray-800 leading-relaxed">
        <p>
          Графік показує повний ринковий профіль по кожному типу аукціону: нижня
          межа, перцентилі, медіана, верхня межа та кількість авто. Це дає змогу
          побачити, де є дешевший сегмент, а де просто ширший розкид цін.
        </p>
        <p className="text-[--color-muted] mt-1 text-xs">
          Графік показує, чи є системна різниця між лотами різних типів
          аукціону. Низ ринку підказує, де бувають найдешевші продажі, медіана
          показує типовий рівень, а верх ринку — де часто виникають дорогі
          продажі. Кількість авто показує, наскільки надійна статистика для
          кожного типу.
        </p>
      </div>
    </Paper>
  );
};
