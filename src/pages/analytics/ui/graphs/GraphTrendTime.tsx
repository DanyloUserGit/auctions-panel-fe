import {
  Box,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import type {
  BarSeriesType,
  LineSeriesType,
  ScatterSeriesType,
} from '@mui/x-charts';
import {
  BarPlot,
  ChartContainer,
  ChartsGrid,
  ChartsReferenceLine,
  ChartsTooltip,
  ChartsXAxis,
  ChartsYAxis,
  LinePlot,
  MarkPlot,
  ScatterPlot,
} from '@mui/x-charts';
import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';
import type { CarMarketRow } from '../../model/api';

interface GraphProps {
  data: CarMarketRow[];
  vinSales?: CarMarketRow[];
  targetCar?: {
    price: number;
    chassis: string;
  };
}

const getMedian = (arr: number[]) => {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
};

export const GraphTrendTime: React.FC<GraphProps> = ({ data, vinSales = [], targetCar }) => {
  const [viewMode, setViewMode] = useState('all'); // 'all' або 'vin'

  const calculatedData = useMemo(() => {
    // Обираємо масив даних залежно від радіокнопки
    const sourceData = viewMode === 'all' ? data : vinSales;

    if (!sourceData || sourceData.length === 0) return null;

    // Групуємо дані по тижнях
    const grouped: Record<string, { volume: number; prices: number[]; timestamp: number }> = {};

    sourceData.forEach((row) => {
      if (row.price > 0 && row.countdown_ts) {
        const ts = row.countdown_ts < 1e12 ? row.countdown_ts * 1000 : row.countdown_ts;
        const weekStart = dayjs(ts).startOf('week');
        const key = weekStart.format('YYYY-MM-DD');

        if (!grouped[key]) {
          grouped[key] = { volume: 0, prices: [], timestamp: weekStart.valueOf() };
        }
        grouped[key].volume += 1;
        grouped[key].prices.push(row.price);
      }
    });

    const sortedKeys = Object.keys(grouped).sort(
      (a, b) => grouped[a].timestamp - grouped[b].timestamp
    );

    if (sortedKeys.length === 0) return null;

    const timestamps = sortedKeys.map((k) => grouped[k].timestamp);
    const volumes = sortedKeys.map((k) => grouped[k].volume);

    const minPrices = sortedKeys.map((k) => Math.min(...grouped[k].prices));
    const maxPrices = sortedKeys.map((k) => Math.max(...grouped[k].prices));
    const medians = sortedKeys.map((k) => getMedian(grouped[k].prices));

    const maxVolume = Math.max(...volumes, 5);
    const allPrices = [...minPrices, ...maxPrices];
    const overallMin = Math.min(...allPrices);
    const overallMax = Math.max(...allPrices);

    // Розраховуємо загальну медіану для футера (за весь період)
    const allValidPrices = sourceData.map(d => d.price).filter(p => p > 0);
    const overallMedian = getMedian(allValidPrices);

    // Точки для ScatterPlot (продажі конкретного VIN)
    const vinScatterData = vinSales
      .filter((d) => d.price > 0 && d.countdown_ts > 0)
      .map((d, i) => {
        const ts = d.countdown_ts < 1e12 ? d.countdown_ts * 1000 : d.countdown_ts;
        return {
          id: `vin-${i}`,
          x: dayjs(ts).startOf('week').valueOf(),
          y: d.price,
        };
      });

    return {
      dates: timestamps.map((ts) => new Date(ts)),
      minPrices,
      medians,
      maxPrices,
      volumes,
      vinScatterData,
      yVolumeMax: Math.ceil(maxVolume * 1.2),
      yPriceMin: Math.max(0, overallMin - 2000),
      yPriceMax: overallMax + 2000,
      overallMin,
      overallMax,
      overallMedian,
    };
  }, [data, vinSales, viewMode]);

  if (!data || data.length === 0) {
    return (
      <Paper elevation={0} className="w-full p-6 border border-gray-200 rounded-lg text-center">
        <Typography color="textSecondary">Немає даних для побудови часового тренду</Typography>
      </Paper>
    );
  }

  // Якщо перемкнули на "Тільки цей VIN", але історія порожня
  if (viewMode === 'vin' && (!vinSales || vinSales.length === 0)) {
    return (
      <Paper elevation={0} className="w-full p-4 border border-gray-200 rounded-lg">
        <Box sx={{ mb: 2 }}>
          <RadioGroup
            row
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
          >
            <FormControlLabel value="all" control={<Radio size="small" />} label="Усі продажі" />
            <FormControlLabel value="vin" control={<Radio size="small" />} label="Тільки цей VIN" />
          </RadioGroup>
        </Box>
        <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
          В базі немає історії попередніх продажів для цього VIN-коду.
        </Typography>
      </Paper>
    );
  }

  const chartSeries: Array<LineSeriesType | BarSeriesType | ScatterSeriesType> = [];

  if (calculatedData) {
    chartSeries.push(
      {
        type: 'bar',
        id: 'volumeBar',
        data: calculatedData.volumes,
        yAxisId: 'y-axis-volume',
        color: '#e2e8f0',
        valueFormatter: (v: number | null) => (v !== null ? `${v} лотів` : ''),
      },
      {
        type: 'line',
        id: 'maxPrice',
        label: 'Верх ринку',
        data: calculatedData.maxPrices,
        yAxisId: 'y-axis-price',
        color: '#ef4444',
        showMark: true,
        valueFormatter: (v: number | null) => v ? `${v.toLocaleString('uk-UA')} €` : '',
      },
      {
        type: 'line',
        id: 'medianPrice',
        label: 'Медіана',
        data: calculatedData.medians,
        yAxisId: 'y-axis-price',
        color: '#eab308',
        showMark: true,
        valueFormatter: (v: number | null) => v ? `${v.toLocaleString('uk-UA')} €` : '',
      },
      {
        type: 'line',
        id: 'minPrice',
        label: 'Низ ринку',
        data: calculatedData.minPrices,
        yAxisId: 'y-axis-price',
        color: '#22c55e',
        showMark: true,
        valueFormatter: (v: number | null) => v ? `${v.toLocaleString('uk-UA')} €` : '',
      }
    );

    // Додаємо точки продажів VIN (якщо вони є)
    if (calculatedData.vinScatterData.length > 0) {
      chartSeries.push({
        type: 'scatter',
        id: 'vinSales',
        label: 'Продажі цього VIN',
        data: calculatedData.vinScatterData,
        yAxisId: 'y-axis-price',
        color: '#dc2626',
        valueFormatter: (v) => v ? `Ціна: ${v.y.toLocaleString('uk-UA')} €` : '',
      });
    }
  }

  return (
    <Paper elevation={0} className="w-full p-4 border border-gray-200 rounded-lg">
      <div className="mb-4">
        <Typography variant="h6" className="text-gray-900 font-semibold text-base mb-1">
          Часовий тренд ринку
        </Typography>
        <Typography variant="body2" className="text-gray-900 font-medium mb-3">
          Криві мінімальної, медіанної та максимальної ціни за тижнями.
        </Typography>

        <RadioGroup
          row
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value)}
        >
          <FormControlLabel
            value="all"
            control={<Radio size="small" />}
            label={<Typography variant="body2">Усі продажі</Typography>}
          />
          <FormControlLabel
            value="vin"
            control={<Radio size="small" />}
            label={<Typography variant="body2">Тільки цей VIN ({vinSales?.length || 0})</Typography>}
            disabled={!vinSales || vinSales.length === 0}
          />
        </RadioGroup>
      </div>

      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <Box sx={{ minWidth: 700 }}>
          {calculatedData && (
            <ChartContainer
              height={400}
              series={chartSeries}
              xAxis={[
                {
                  id: 'x-axis',
                  scaleType: 'time',
                  data: calculatedData.dates,
                  valueFormatter: (date: Date) => dayjs(date).format('DD.MM.YY'),
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
              margin={{ top: 20, right: 60, bottom: 60, left: 70 }}
              sx={{
                '& .MuiLineElement-series-medianPrice': { strokeWidth: 3 },
                '& .MuiScatterElement-root': { scale: '1.5' },
              }}
            >
              <ChartsGrid horizontal />

              {/* Поточна ціна авто (якщо є) */}
              {targetCar && targetCar.price > 0 && (
                <ChartsReferenceLine
                  y={targetCar.price}
                  lineStyle={{ stroke: '#ef4444', strokeWidth: 2, strokeDasharray: '4 4' }}
                  label="Поточна ціна"
                />
              )}

              <BarPlot />
              <LinePlot />
              <MarkPlot />
              <ScatterPlot />

              <ChartsXAxis
                tickLabelStyle={{ angle: -35, textAnchor: 'end', fontSize: 11 }}
              />
              <ChartsYAxis axisId="y-axis-price" label="Ціна, €" />
              <ChartsYAxis axisId="y-axis-volume" label="Кількість лотів" />
              <ChartsTooltip />
            </ChartContainer>
          )}
        </Box>
      </Box>

      <div className="mt-4 text-sm text-gray-800 leading-relaxed p-3 bg-gray-50 rounded-md border border-gray-100">
        <ul className="list-disc pl-5 text-xs text-gray-700 space-y-1">
          {targetCar && (
            <li>Поточна ціна авто: <strong>{targetCar.price.toLocaleString('uk-UA')} €</strong></li>
          )}
          {calculatedData && (
            <>
              <li>
                Актуальна медіана (для обраного вигляду):{' '}
                <strong>{calculatedData.overallMedian.toLocaleString('uk-UA')} €</strong>
              </li>
              <li>
                Діапазон мін/макс за весь період:{' '}
                <strong>{calculatedData.overallMin.toLocaleString('uk-UA')}–{calculatedData.overallMax.toLocaleString('uk-UA')} €</strong>
              </li>
            </>
          )}
        </ul>
        <p className="text-xs text-gray-700 mt-2">
          Використовуйте цей графік, щоб бачити, коли ринок був найактивнішим і в які періоди ціни були найкращими.
          Червоні крапки показують історію аукціонів конкретно цього автомобіля.
        </p>
      </div>
    </Paper>
  );
};