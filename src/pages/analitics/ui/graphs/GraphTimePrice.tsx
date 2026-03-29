import { Box, Paper, Typography } from '@mui/material';
import type { LineSeriesType, ScatterSeriesType } from '@mui/x-charts';
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
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import type { CarMarketRow } from '../../model/api';

interface GraphProps {
  data: CarMarketRow[];
  targetPrice?: number; // Опціонально: ціна поточного авто (для червоної лінії)
}

export const GraphTimePrice: React.FC<GraphProps> = ({ data, targetPrice }) => {
  const calculatedData = useMemo(() => {
    if (!data || data.length === 0) return null;

    // 1. Фільтруємо валідні дані та нормалізуємо timestamp
    const validData = data
      .filter((d) => d.price > 0 && d.countdown_ts > 0)
      .map((d) => ({
        ...d,
        ts: d.countdown_ts < 1e12 ? d.countdown_ts * 1000 : d.countdown_ts,
      }))
      .sort((a, b) => a.ts - b.ts);

    if (validData.length === 0) return null;

    // 2. Рахуємо перцентилі (коридор ринку)
    const sortedPrices = [...validData].map((d) => d.price).sort((a, b) => a - b);
    const p25 = sortedPrices[Math.floor(sortedPrices.length * 0.25)];
    const median = sortedPrices[Math.floor(sortedPrices.length * 0.5)];
    const p75 = sortedPrices[Math.floor(sortedPrices.length * 0.75)];

    // 3. Розділяємо дані для Scatter Plot по типах аукціону
    // x тепер явно залишається number (timestamp), як вимагає ScatterValueType
    const mapToScatter = (arr: typeof validData, prefix: string) =>
      arr.map((d, i) => ({
        id: `${prefix}-${i}`,
        x: d.ts,
        y: d.price,
        vin: d.chassis,
      }));

    const type0 = mapToScatter(validData.filter((d) => d.auction_type === 0), 't0');
    const type2 = mapToScatter(validData.filter((d) => d.auction_type === 2), 't2');
    const type3 = mapToScatter(validData.filter((d) => d.auction_type === 3), 't3');
    const typeOther = mapToScatter(
      validData.filter((d) => ![0, 2, 3].includes(d.auction_type)),
      'tother'
    );

    // 4. Будуємо лінію тренду (Лінійна регресія: y = mx + b)
    const n = validData.length;
    const sumX = validData.reduce((acc, d) => acc + d.ts, 0);
    const sumY = validData.reduce((acc, d) => acc + d.price, 0);
    const sumXY = validData.reduce((acc, d) => acc + d.ts * d.price, 0);
    const sumXX = validData.reduce((acc, d) => acc + d.ts * d.ts, 0);

    const denominator = n * sumXX - sumX * sumX;
    let trendData: { x: number; y: number }[] = [];
    let trendDiff = 0;

    const minTs = validData[0].ts;
    const maxTs = validData[validData.length - 1].ts;

    if (denominator === 0) {
      const avgPrice = sumY / n;
      trendData = [
        { x: minTs, y: avgPrice },
        { x: maxTs, y: avgPrice },
      ];
    } else {
      const slope = (n * sumXY - sumX * sumY) / denominator;
      const intercept = (sumY - slope * sumX) / n;
      const yStart = minTs * slope + intercept;
      const yEnd = maxTs * slope + intercept;

      trendData = [
        { x: minTs, y: yStart },
        { x: maxTs, y: yEnd },
      ];
      trendDiff = yEnd - yStart;
    }

    // 5. Визначаємо напрям тренду для футера
    let trendText = 'залишаються відносно стабільними';
    if (trendDiff <= -150) trendText = 'поступово знижуються';
    if (trendDiff >= 150) trendText = 'показують зростання';

    return {
      series: { type0, type2, type3, typeOther, trendData },
      stats: { p25, median, p75, minPrice: sortedPrices[0] },
      trendText,
      trendDiff: Math.abs(trendDiff),
    };
  }, [data]);

  if (!data || data.length === 0 || !calculatedData) {
    return (
      <Paper elevation={0} className="w-full p-6 border border-gray-200 rounded-lg text-center">
        <Typography color="textSecondary">Немає даних для графіка "Час → Ціна"</Typography>
      </Paper>
    );
  }

  const { series, stats, trendText, trendDiff } = calculatedData;

  // Формуємо масив серій для графіка
  const chartSeries: Array<ScatterSeriesType | LineSeriesType> = [];

  // Додали типізацію (v: any) та перевірку на null: `v ? ... : ''`
  if (series.type0.length) chartSeries.push({ type: 'scatter', id: 'type0', data: series.type0, color: '#f97316', label: 'Type 0', valueFormatter: (v: any) => v ? `${v.y.toLocaleString('uk-UA')} €` : '' });
  if (series.type2.length) chartSeries.push({ type: 'scatter', id: 'type2', data: series.type2, color: '#22c55e', label: 'Type 2', valueFormatter: (v: any) => v ? `${v.y.toLocaleString('uk-UA')} €` : '' });
  if (series.type3.length) chartSeries.push({ type: 'scatter', id: 'type3', data: series.type3, color: '#a855f7', label: 'Type 3', valueFormatter: (v: any) => v ? `${v.y.toLocaleString('uk-UA')} €` : '' });
  if (series.typeOther.length) chartSeries.push({ type: 'scatter', id: 'typeOther', data: series.typeOther, color: '#94a3b8', label: 'Інші', valueFormatter: (v: any) => v ? `${v.y.toLocaleString('uk-UA')} €` : '' });

  chartSeries.push({
    type: 'line',
    id: 'trend',
    data: series.trendData.map(d => d.y),
    color: '#3b82f6',
    label: 'Загальний тренд',
    showMark: false,
  });

  // Перетворюємо timestamps на об'єкти Date лише для осі X
  const trendDates = series.trendData.map(d => new Date(d.x));

  return (
    <Paper elevation={0} className="w-full p-4 border border-gray-200 rounded-lg">
      <div className="mb-4">
        <Typography variant="h6" className="text-gray-900 font-semibold text-base mb-1">
          Залежність ціни від часу
        </Typography>
        <Typography variant="body2" className="text-gray-900 font-medium">
          Аналіз ціноутворення в часі з урахуванням типів аукціону та загального тренду.
        </Typography>
      </div>

      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <Box sx={{ minWidth: 700 }}>
          <ChartContainer
            height={450}
            series={chartSeries}
            xAxis={[
              {
                id: 'x-axis',
                scaleType: 'time', // Вісь X розуміє об'єкти Date
                data: trendDates, // Базові точки Date для осі X
                valueFormatter: (date: Date) => dayjs(date).format('DD.MM.YY'),
              },
            ]}
            yAxis={[
              {
                id: 'y-axis',
                min: Math.max(0, stats.minPrice - 2000),
                // Явно вказали тип (v: number)
                valueFormatter: (v: number) => `${v.toLocaleString('uk-UA')} €`,
              },
            ]}
            margin={{ top: 20, right: 20, bottom: 40, left: 60 }}
          >
            <ChartsGrid horizontal vertical />

            {/* Коридор 75% (Верхня межа) */}
            <ChartsReferenceLine
              y={stats.p75}
              lineStyle={{ stroke: '#4ade80', strokeDasharray: '3 3', strokeWidth: 2 }}
            />

            {/* Медіана */}
            <ChartsReferenceLine
              y={stats.median}
              lineStyle={{ stroke: '#22d3ee', strokeDasharray: '3 3', strokeWidth: 2 }}
            />

            {/* Коридор 25% (Нижня межа) */}
            <ChartsReferenceLine
              y={stats.p25}
              lineStyle={{ stroke: '#4ade80', strokeDasharray: '3 3', strokeWidth: 2 }}
            />

            {/* Опціональна лінія ціни поточного авто */}
            {targetPrice && (
              <ChartsReferenceLine
                y={targetPrice}
                lineStyle={{ stroke: '#ef4444', strokeWidth: 2 }}
              />
            )}

            <ScatterPlot />
            <LinePlot />

            <ChartsXAxis label="Час продажу (Дата)" />
            <ChartsYAxis label="Ціна, €" />
            <ChartsTooltip />
          </ChartContainer>
        </Box>
      </Box>

      {/* Аналітичний футер */}
      <div className="mt-4 text-sm text-gray-800 leading-relaxed p-3 bg-gray-50 rounded-md border border-gray-100">
        <p className="font-medium mb-1">Аналіз ринкового коридору та тренду:</p>
        <ul className="list-disc pl-5 text-xs text-gray-700 space-y-1">
          {targetPrice && (
            <li>Поточна ціна авто: <strong>{targetPrice.toLocaleString('uk-UA')} €</strong></li>
          )}
          <li>
            Коридор найчастіших цін (25–75%): <strong>{stats.p25.toLocaleString('uk-UA')} – {stats.p75.toLocaleString('uk-UA')} €</strong>
          </li>
          <li>Медіанна ціна по ринку: <strong>{stats.median.toLocaleString('uk-UA')} €</strong></li>
          <li>
            Загальний тренд: ціни з часом <strong>{trendText}</strong>
            {trendDiff > 150 && ` (зміна близько ${Math.round(trendDiff)} € на всьому проміжку)`}.
          </li>
        </ul>
      </div>
    </Paper>
  );
};