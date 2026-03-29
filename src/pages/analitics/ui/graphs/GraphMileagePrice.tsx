import { Box, Paper, Typography } from '@mui/material';
import type { ScatterValueType } from '@mui/x-charts';
import {
  ChartContainer,
  ChartsGrid,
  ChartsReferenceLine,
  ChartsTooltip,
  ChartsXAxis,
  ChartsYAxis,
  LinePlot,
  ScatterPlot,
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

// Хелпер для розрахунку перцентилів (коридор ринку)
const getPercentile = (arr: number[], percentile: number) => {
  if (arr.length === 0) return 0;
  const index = (percentile / 100) * (arr.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  if (upper >= arr.length) return arr[lower];
  return arr[lower] * (1 - weight) + arr[upper] * weight;
};

export const GraphMileagePrice: React.FC<GraphProps> = ({ data, targetCar }) => {
  const calculatedData = useMemo(() => {
    if (!data || data.length === 0) return null;

    // Відфільтровуємо нульові значення
    const validData = data.filter((d) => d.price > 0 && d.mileage > 0);
    if (validData.length === 0) return null;

    // 1. Формуємо точки для діаграми розсіювання та збираємо суми для лінійної регресії
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    const n = validData.length;

    const scatterData: ScatterValueType[] = validData.map((d) => {
      sumX += d.mileage;
      sumY += d.price;
      sumXY += d.mileage * d.price;
      sumX2 += d.mileage * d.mileage;

      return {
        id: `point-${d.id}`,
        x: d.mileage,
        y: d.price,
      };
    });

    // 2. Розрахунок лінійної регресії (y = mx + b)
    const denominator = n * sumX2 - sumX * sumX;
    const m = denominator !== 0 ? (n * sumXY - sumX * sumY) / denominator : 0;
    const b = (sumY - m * sumX) / n;

    // 3. Розрахунок крайніх точок для лінії тренду
    const mileages = validData.map((d) => d.mileage).sort((a, b) => a - b);
    const minMileage = mileages[0];
    const maxMileage = mileages[mileages.length - 1];

    const trendLineData = [
      { x: minMileage, y: Math.round(m * minMileage + b) },
      { x: maxMileage, y: Math.round(m * maxMileage + b) },
    ];

    // 4. Падіння ціни за 10 000 км
    const dropPer10k = Math.round(Math.abs(m * 10000));

    // 5. Розрахунок коридору цін (P25 - P75)
    const prices = validData.map((d) => d.price).sort((a, b) => a - b);
    const p25Price = Math.round(getPercentile(prices, 25));
    const p75Price = Math.round(getPercentile(prices, 75));

    // Додаємо відступи для осей
    const xMin = Math.max(0, minMileage - 10000);
    const xMax = maxMileage + 10000;
    const yMin = Math.max(0, prices[0] - 2000);
    const yMax = prices[prices.length - 1] + 2000;

    return {
      scatterData,
      trendLineData,
      dropPer10k,
      p25Price,
      p75Price,
      xMin,
      xMax,
      yMin,
      yMax,
    };
  }, [data]);

  if (!data || data.length === 0 || !calculatedData) {
    return (
      <Paper elevation={0} className="w-full p-6 border border-gray-200 rounded-lg text-center">
        <Typography color="textSecondary">Немає даних для побудови графіка залежності ціни від пробігу</Typography>
      </Paper>
    );
  }

  const {
    scatterData,
    trendLineData,
    dropPer10k,
    p25Price,
    p75Price,
    xMin,
    xMax,
    yMin,
    yMax,
  } = calculatedData;

  return (
    <Paper elevation={0} className="w-full p-4 border border-gray-200 rounded-lg">
      <div className="mb-4">
        <Typography variant="h6" className="text-gray-900 font-semibold text-base mb-1">
          Залежність ціни від пробігу
        </Typography>
        <Typography variant="body2" className="text-gray-900 font-medium">
          Аналіз втрати вартості автомобіля в залежності від пройдених кілометрів (з лінією тренду).
        </Typography>
      </div>

      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <Box sx={{ minWidth: 700 }}>
          <ChartContainer
            height={400}
            series={[
              {
                type: 'line',
                id: 'trend',
                data: trendLineData.map((d) => d.y),
                color: '#94a3b8',
                curve: 'linear',
                label: 'Лінія тренду',
              },
              {
                type: 'scatter',
                id: 'cars',
                data: scatterData,
                color: '#3b82f6',
                label: 'Продані лоти',
                valueFormatter: (v: any) => v ? `Пробіг: ${v.x.toLocaleString('uk-UA')} км, Ціна: ${v.y.toLocaleString('uk-UA')} €` : '',
              },
            ]}
            xAxis={[
              {
                id: 'x-axis-mileage',
                scaleType: 'linear',
                data: trendLineData.map((d) => d.x),
                min: xMin,
                max: xMax,
                valueFormatter: (v: number) => `${v.toLocaleString('uk-UA')} км`,
              },
            ]}
            yAxis={[
              {
                id: 'y-axis-price',
                scaleType: 'linear',
                min: yMin,
                max: yMax,
                valueFormatter: (v: number) => `${v.toLocaleString('uk-UA')} €`,
              },
            ]}
            margin={{ top: 20, right: 30, bottom: 40, left: 70 }}
            sx={{
              '& .MuiLineElement-series-trend': { strokeDasharray: '5 5', strokeWidth: 2 },
              '& .MuiScatterElement-root': { fillOpacity: 0.6 },
            }}
          >
            <ChartsGrid horizontal vertical />

            {/* Референсні лінії для поточного авто, якщо воно є */}
            {targetCar && targetCar.price > 0 && (
              <ChartsReferenceLine
                y={targetCar.price}
                lineStyle={{ stroke: '#ef4444', strokeWidth: 2 }}
                label="Ціна авто"
              />
            )}
            {targetCar && targetCar.mileage > 0 && (
              <ChartsReferenceLine
                x={targetCar.mileage}
                lineStyle={{ stroke: '#ef4444', strokeWidth: 2 }}
                label="Пробіг авто"
              />
            )}

            <ScatterPlot />
            <LinePlot />
            <ChartsXAxis label="Пробіг, км" />
            <ChartsYAxis label="Ціна, €" />
            <ChartsTooltip />
          </ChartContainer>
        </Box>
      </Box>

      {/* Динамічний футер */}
      <div className="mt-4 text-sm text-gray-800 leading-relaxed p-3 bg-gray-50 rounded-md border border-gray-100">
        <p className="font-medium mb-1">Ключові показники вибірки:</p>
        <ul className="list-disc pl-5 text-xs text-gray-700 space-y-1">
          {targetCar && (
            <li>
              Поточне авто: <strong>{targetCar.mileage.toLocaleString('uk-UA')} км</strong> за <strong>{targetCar.price.toLocaleString('uk-UA')} €</strong>.
            </li>
          )}
          <li>
            Ринковий коридор (основна маса продажів): <strong>{p25Price.toLocaleString('uk-UA')} € – {p75Price.toLocaleString('uk-UA')} €</strong>.
          </li>
          <li>
            На основі лінії тренду, ціна в середньому падає на <strong>{dropPer10k.toLocaleString('uk-UA')} €</strong> за кожні 10 000 км пробігу.
          </li>
        </ul>
      </div>
    </Paper>
  );
};