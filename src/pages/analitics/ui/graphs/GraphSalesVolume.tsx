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
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import type { CarMarketRow } from '../../model/api';

interface GraphProps {
  data: CarMarketRow[];
}

export const GraphSalesVolume: React.FC<GraphProps> = ({ data }) => {
  const calculatedData = useMemo(() => {
    if (!data || data.length === 0) return null;

    // 1. Групуємо дані по тижнях
    const grouped: Record<string, { volume: number; prices: number[]; timestamp: number }> = {};

    data.forEach((row) => {
      if (row.price > 0 && row.countdown_ts) {
        const ts = row.countdown_ts < 1e12 ? row.countdown_ts * 1000 : row.countdown_ts;
        // Беремо початок тижня для уніфікації
        const date = dayjs(ts).startOf('week');
        const key = date.format('YYYY-MM-DD');

        if (!grouped[key]) {
          grouped[key] = { volume: 0, prices: [], timestamp: date.valueOf() };
        }
        grouped[key].volume += 1;
        grouped[key].prices.push(row.price);
      }
    });

    // 2. Сортуємо хронологічно
    const sortedKeys = Object.keys(grouped).sort(
      (a, b) => grouped[a].timestamp - grouped[b].timestamp
    );

    if (sortedKeys.length === 0) return null;

    const xAxisLabels = sortedKeys.map((k) => dayjs(grouped[k].timestamp).format('DD.MM.YYYY'));
    const volumes = sortedKeys.map((k) => grouped[k].volume);

    // Рахуємо медіанну ціну для кожного тижня
    const medians = sortedKeys.map((k) => {
      const prices = grouped[k].prices.sort((a, b) => a - b);
      const mid = Math.floor(prices.length / 2);
      return prices.length % 2 !== 0
        ? prices[mid]
        : Math.round((prices[mid - 1] + prices[mid]) / 2);
    });

    // 3. Знаходимо піковий тиждень для футера
    let peakIndex = 0;
    let maxVol = -1;
    volumes.forEach((v, i) => {
      if (v > maxVol) {
        maxVol = v;
        peakIndex = i;
      }
    });

    const maxVolume = Math.max(...volumes);
    const validMedians = medians.filter((m) => m > 0);
    const minPrice = validMedians.length > 0 ? Math.min(...validMedians) : 0;
    const maxPrice = validMedians.length > 0 ? Math.max(...validMedians) : 20000;

    return {
      xAxisLabels,
      volumes,
      medians,
      yVolumeMax: Math.ceil(maxVolume * 1.2), // +20% зверху для краси
      yPriceMin: Math.floor(minPrice / 1000) * 1000 * 0.9,
      yPriceMax: Math.ceil(maxPrice / 1000) * 1000 * 1.1,
      peak: {
        date: xAxisLabels[peakIndex],
        volume: maxVol,
        medianPrice: medians[peakIndex],
      },
    };
  }, [data]);

  const series: Array<LineSeriesType | BarSeriesType> = useMemo(() => {
    if (!calculatedData) return [];

    return [
      {
        type: 'bar',
        id: 'volumeBar',
        data: calculatedData.volumes,
        xAxisId: 'x-axis-weeks',
        yAxisId: 'y-axis-volume', // Права вісь
        color: '#e2e8f0', // Світло-сірі стовпчики
        valueFormatter: (v: number | null) => (v !== null ? `${v} лотів` : ''),
      },
      {
        type: 'line',
        id: 'medianPrice',
        label: 'Медіанна ціна',
        data: calculatedData.medians,
        xAxisId: 'x-axis-weeks',
        yAxisId: 'y-axis-price', // Ліва вісь
        color: '#3b82f6', // Класичний синій
        curve: 'linear',
        showMark: true,
        valueFormatter: (v: number | null) =>
          v !== null ? `${v.toLocaleString('uk-UA')} €` : '',
      },
    ];
  }, [calculatedData]);

  if (!data || data.length === 0 || !calculatedData) {
    return (
      <Paper elevation={0} className="w-full p-6 border border-gray-200 rounded-lg text-center">
        <Typography color="textSecondary">Немає даних для побудови графіка об'єму продажів</Typography>
      </Paper>
    );
  }

  const { xAxisLabels, yVolumeMax, yPriceMin, yPriceMax, peak } = calculatedData;

  return (
    <Paper elevation={0} className="w-full p-4 border border-gray-200 rounded-lg">
      <div className="mb-4">
        <Typography variant="h6" className="text-gray-900 font-semibold text-base mb-1">
          Динаміка об'єму продажів та цін (по тижнях)
        </Typography>
        <Typography variant="body2" className="text-gray-900 font-medium">
          Аналіз кількості проданих лотів та їх медіанної вартості у розрізі часу.
        </Typography>
      </div>

      {/* Легенда */}
      <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mb-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-6 h-3 bg-slate-200 border border-slate-300"></div> К-сть лотів
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-0.5 bg-blue-500"></div> Медіанна ціна
        </div>
      </div>

      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        {/* Задаємо мінімальну ширину, щоб графік можна було скролити при великій кількості тижнів */}
        <Box sx={{ minWidth: Math.max(700, xAxisLabels.length * 40) }}>
          <ChartContainer
            height={400}
            series={series}
            xAxis={[
              {
                id: 'x-axis-weeks',
                scaleType: 'band',
                data: xAxisLabels,
                position: 'bottom',
              },
            ]}
            yAxis={[
              {
                id: 'y-axis-price',
                scaleType: 'linear',
                min: yPriceMin,
                max: yPriceMax,
                position: 'left',
                valueFormatter: (v: number) => `${v.toLocaleString('uk-UA')} €`,
              },
              {
                id: 'y-axis-volume',
                scaleType: 'linear',
                min: 0,
                max: yVolumeMax,
                position: 'right',
                valueFormatter: (v: number) => `${v} шт.`,
              },
            ]}
            margin={{ top: 20, right: 60, bottom: 60, left: 70 }} // Відступи під осі
            sx={{
              '& .MuiLineElement-series-medianPrice': { strokeWidth: 3 },
            }}
          >
            <ChartsGrid horizontal />

            {/* Стовпчики рендеряться знизу */}
            <BarPlot />

            {/* Лінія та маркери рендеряться поверх стовпчиків */}
            <LinePlot />
            <MarkPlot />

            {/* Осі */}
            <ChartsXAxis
              tickLabelStyle={{ angle: -35, textAnchor: 'end', fontSize: 11 }}
            />
            <ChartsYAxis axisId="y-axis-price" label="Медіанна ціна, €" />
            <ChartsYAxis axisId="y-axis-volume" label="Кількість лотів" />

            <ChartsTooltip />
          </ChartContainer>
        </Box>
      </Box>

      {/* Футер графіка */}
      <div className="mt-4 text-sm text-gray-800 leading-relaxed p-3 bg-gray-50 rounded-md border border-gray-100">
        <p className="font-medium mb-1">Аналіз пікового періоду:</p>
        <ul className="list-disc pl-5 text-xs text-gray-700 space-y-1">
          <li>
            Найбільша кількість лотів (<strong>{peak.volume} шт.</strong>) припадає на тиждень з{' '}
            <strong>{peak.date}</strong>.
          </li>
          <li>
            Медіанна ціна в цей період становила{' '}
            <strong>{peak.medianPrice.toLocaleString('uk-UA')} €</strong>.
          </li>
        </ul>
        <p className="text-xs text-gray-700 mt-2">
          Цей графік показує сезонність або періоди найбільшої активності (розпродажу лізингів), і як цей об'єм впливав на середню ціну на ринку.
        </p>
      </div>
    </Paper>
  );
};