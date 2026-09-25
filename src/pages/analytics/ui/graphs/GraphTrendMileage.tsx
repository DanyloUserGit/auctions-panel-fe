import { Box, Paper, Typography } from '@mui/material';
import {
  ChartContainer,
  ChartsGrid,
  ChartsReferenceLine,
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
  targetCar?: {
    price: number;
    mileage: number;
  };
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

export const GraphTrendMileage: React.FC<GraphProps> = ({ data, targetCar }) => {
  const calculatedData = useMemo(() => {
    if (!data || data.length === 0) return null;

    const validData = data.filter((d) => d.price > 0 && d.mileage > 0);
    if (validData.length === 0) return null;

    const minMileage = Math.min(...validData.map((d) => d.mileage));
    const maxMileage = Math.max(...validData.map((d) => d.mileage));

    // Розбиваємо весь пробіг на 10-12 діапазонів (кошиків)
    const BINS_COUNT = 10;
    // Крок мінімум 10 000 км, щоб не було занадто дрібно
    const step = Math.max(10000, Math.ceil((maxMileage - minMileage) / BINS_COUNT));

    const bins: Record<number, { mileages: number[]; prices: number[] }> = {};

    validData.forEach((d) => {
      const binIndex = Math.floor((d.mileage - minMileage) / step);
      if (!bins[binIndex]) bins[binIndex] = { mileages: [], prices: [] };
      bins[binIndex].mileages.push(d.mileage);
      bins[binIndex].prices.push(d.price);
    });

    const trendPoints: { x: number; min: number; avg: number; max: number }[] = [];

    for (let i = 0; i <= BINS_COUNT + 1; i++) {
      if (bins[i] && bins[i].prices.length > 0) {
        const prices = bins[i].prices.sort((a, b) => a - b);
        const count = prices.length;

        // X-координата - це середній пробіг авто в цьому кошику
        const avgMileage = Math.round(
          bins[i].mileages.reduce((a, b) => a + b, 0) / count
        );

        let min, avg, max;

        if (count < 4) {
          // Мало даних для статистики - беремо як є
          min = prices[0];
          avg = Math.round(prices.reduce((a, b) => a + b, 0) / count);
          max = prices[count - 1];
        } else {
          // Відсіюємо викиди (IQR метод)
          const q1 = getPercentile(prices, 25);
          const q3 = getPercentile(prices, 75);
          const iqr = q3 - q1;
          const lowerBound = q1 - 1.5 * iqr;
          const upperBound = q3 + 1.5 * iqr;

          const cleaned = prices.filter((p) => p >= lowerBound && p <= upperBound);
          if (cleaned.length > 0) {
            min = cleaned[0];
            avg = Math.round(cleaned.reduce((a, b) => a + b, 0) / cleaned.length);
            max = cleaned[cleaned.length - 1];
          } else {
            min = prices[0];
            avg = Math.round(prices.reduce((a, b) => a + b, 0) / count);
            max = prices[count - 1];
          }
        }

        trendPoints.push({ x: avgMileage, min, avg, max });
      }
    }

    trendPoints.sort((a, b) => a.x - b.x);

    if (trendPoints.length === 0) return null;

    const allPrices = [
      ...trendPoints.map((p) => p.min),
      ...trendPoints.map((p) => p.max),
    ];
    const yMin = Math.max(0, Math.min(...allPrices) - 2000);
    const yMax = Math.max(...allPrices) + 2000;

    return {
      xData: trendPoints.map((p) => p.x),
      minPrices: trendPoints.map((p) => p.min),
      avgPrices: trendPoints.map((p) => p.avg),
      maxPrices: trendPoints.map((p) => p.max),
      yMin,
      yMax,
      xMin: Math.max(0, minMileage - step / 2),
      xMax: maxMileage + step / 2,
    };
  }, [data]);

  if (!data || data.length === 0 || !calculatedData) {
    return (
      <Paper elevation={0} className="w-full p-6 border border-gray-200 rounded-lg text-center">
        <Typography color="textSecondary">Немає даних для побудови графіка тренду по пробігу</Typography>
      </Paper>
    );
  }

  const { xData, minPrices, avgPrices, maxPrices, yMin, yMax, xMin, xMax } = calculatedData;

  return (
    <Paper elevation={0} className="w-full p-4 border border-gray-200 rounded-lg">
      <div className="mb-4">
        <Typography variant="h6" className="text-gray-900 font-semibold text-base mb-1">
          Ціновий тренд відносно пробігу
        </Typography>
        <Typography variant="body2" className="text-gray-900 font-medium">
          Мінімальна, середня та максимальна ціни ринку згруповані по діапазонах пробігу.
        </Typography>
      </div>

      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <Box sx={{ minWidth: 700 }}>
          <ChartContainer
            height={400}
            series={[
              {
                type: 'line',
                id: 'maxPrices',
                label: 'Верх ринку',
                data: maxPrices,
                color: '#ef4444',
                showMark: true,
                valueFormatter: (v: number | null) => v ? `${v.toLocaleString('uk-UA')} €` : '',
              },
              {
                type: 'line',
                id: 'avgPrices',
                label: 'Середня ціна',
                data: avgPrices,
                color: '#eab308',
                showMark: true,
                valueFormatter: (v: number | null) => v ? `${v.toLocaleString('uk-UA')} €` : '',
              },
              {
                type: 'line',
                id: 'minPrices',
                label: 'Низ ринку',
                data: minPrices,
                color: '#22c55e',
                showMark: true,
                valueFormatter: (v: number | null) => v ? `${v.toLocaleString('uk-UA')} €` : '',
              },
            ]}
            xAxis={[
              {
                id: 'x-axis',
                scaleType: 'linear',
                data: xData,
                min: xMin,
                max: xMax,
                valueFormatter: (v: number) => `${v.toLocaleString('uk-UA')} км`,
              },
            ]}
            yAxis={[
              {
                id: 'y-axis',
                scaleType: 'linear',
                min: yMin,
                max: yMax,
                valueFormatter: (v: number) => `${v.toLocaleString('uk-UA')} €`,
              },
            ]}
            margin={{ top: 20, right: 30, bottom: 40, left: 60 }}
            sx={{
              '& .MuiLineElement-series-avgPrices': { strokeWidth: 3 },
            }}
          >
            <ChartsGrid horizontal vertical />

            {/* Референсні лінії для поточного авто, якщо воно є */}
            {targetCar && targetCar.mileage > 0 && (
              <ChartsReferenceLine
                x={targetCar.mileage}
                lineStyle={{
                  stroke: '#ef4444',
                  strokeDasharray: '4 4',
                  strokeWidth: 2,
                }}
                label="Пробіг"
              />
            )}
            {targetCar && targetCar.price > 0 && (
              <ChartsReferenceLine
                y={targetCar.price}
                lineStyle={{ stroke: '#ef4444', strokeWidth: 2 }}
                label="Ціна"
              />
            )}

            <LinePlot />
            <MarkPlot />

            <ChartsXAxis label="Пробіг, км" />
            <ChartsYAxis label="Ціна, €" />
            <ChartsTooltip />
          </ChartContainer>
        </Box>
      </Box>

      <div className="mt-4 text-sm text-gray-800 leading-relaxed p-3 bg-gray-50 rounded-md border border-gray-100">
        <p className="font-medium mb-1">Як інтерпретувати цей графік:</p>
        <ul className="list-disc pl-5 text-xs text-gray-700 space-y-1">
          {targetCar && (
            <li>
              Поточне авто: <strong>{targetCar.mileage.toLocaleString('uk-UA')} км</strong> за <strong>{targetCar.price.toLocaleString('uk-UA')} €</strong>.
              Точка перетину червоних ліній показує його місце на ринку.
            </li>
          )}
          <li>
            Якщо точка перетину знаходиться ближче до <strong>зеленої лінії (Низу ринку)</strong> - це потенційно вигідна ціна.
          </li>
          <li>
            Три лінії утворюють ринковий коридор. Звуження цього коридору в певних діапазонах пробігу свідчить про стабільність цін, а розширення - про сильний вплив комплектації або стану авто на ціну.
          </li>
        </ul>
      </div>
    </Paper>
  );
};