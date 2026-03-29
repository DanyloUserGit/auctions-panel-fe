import { Box, Paper, Typography } from '@mui/material';
import {
  BarPlot,
  ChartContainer,
  ChartsGrid,
  ChartsTooltip,
  ChartsXAxis,
  ChartsYAxis,
} from '@mui/x-charts';
import React, { useMemo } from 'react';
import type { CarMarketRow } from '../../model/api';


interface GraphProps {
  data: CarMarketRow[];
}

export const GraphPriceDistribution: React.FC<GraphProps> = ({ data }) => {
  const calculatedData = useMemo(() => {
    if (!data || data.length === 0) return null;

    // Відфільтровуємо некоректні ціни
    const validPrices = data.map((d) => d.price).filter((p) => p > 0);
    if (validPrices.length === 0) return null;

    const minPrice = Math.min(...validPrices);
    const maxPrice = Math.max(...validPrices);

    // Якщо раптом всі авто у вибірці коштують абсолютно однаково
    if (minPrice === maxPrice) {
      return {
        priceRanges: [`${minPrice.toLocaleString('uk-UA')} €`],
        volumeData: [validPrices.length],
        maxVolume: validPrices.length,
        peakRange: `${minPrice.toLocaleString('uk-UA')} €`,
      };
    }

    // Розбиваємо весь діапазон на 12 кошиків (як було у мокових даних)
    const BINS_COUNT = 12;
    // Крок для одного кошика. Округлюємо до більшого цілого.
    const step = Math.ceil((maxPrice - minPrice) / BINS_COUNT);

    // Створюємо порожні кошики
    const bins = Array.from({ length: BINS_COUNT }, (_, i) => {
      const start = minPrice + i * step;
      // Останній кошик закриває діапазон до maxPrice включно
      const end = i === BINS_COUNT - 1 ? maxPrice : start + step - 1;
      return {
        start,
        end,
        count: 0,
        label: `${start.toLocaleString('uk-UA')}–${end.toLocaleString('uk-UA')} €`,
      };
    });

    // Розподіляємо ціни по створених кошиках
    validPrices.forEach((price) => {
      // Знаходимо індекс потрібного кошика
      let binIndex = Math.floor((price - minPrice) / step);
      // Захист від виходу за межі масиву (якщо price === maxPrice)
      if (binIndex >= BINS_COUNT) binIndex = BINS_COUNT - 1;

      bins[binIndex].count += 1;
    });

    const priceRanges = bins.map((b) => b.label);
    const volumeData = bins.map((b) => b.count);
    const maxVolume = Math.max(...volumeData);

    // Знаходимо діапазон з найбільшою кількістю авто (Пік)
    const peakBin = bins.find((b) => b.count === maxVolume);

    return {
      priceRanges,
      volumeData,
      maxVolume,
      peakRange: peakBin?.label || '',
    };
  }, [data]);

  if (!data || data.length === 0 || !calculatedData) {
    return (
      <Paper elevation={0} className="w-full p-6 border border-gray-200 rounded-lg text-center">
        <Typography color="textSecondary">Немає даних для побудови графіка розподілу цін</Typography>
      </Paper>
    );
  }

  const { priceRanges, volumeData, maxVolume, peakRange } = calculatedData;

  // Додаємо запас 20% зверху по осі Y, щоб стовпчики не впиралися в край графіка
  const yAxisMax = Math.ceil(maxVolume * 1.2);

  return (
    <Paper elevation={0} className="w-full p-4 border border-gray-200 rounded-lg">
      <div className="mb-4">
        <Typography variant="h6" className="text-gray-900 font-semibold text-base mb-1">
          Розподіл ринку за ціною (Гістограма)
        </Typography>
        <Typography variant="body2" className="text-gray-900 font-medium">
          Кількість проданих автомобілів у різних цінових сегментах.
        </Typography>
      </div>

      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <Box sx={{ minWidth: 700 }}>
          <ChartContainer
            height={400}
            series={[
              {
                type: 'bar',
                id: 'volume',
                data: volumeData,
                color: '#3b82f6', // Класичний синій колір
                valueFormatter: (v: number | null) => (v !== null ? `${v} лотів` : ''),
              },
            ]}
            xAxis={[
              {
                id: 'x-axis-price',
                scaleType: 'band',
                data: priceRanges,
                position: 'bottom',
              },
            ]}
            yAxis={[
              {
                id: 'y-axis-volume',
                scaleType: 'linear',
                min: 0,
                max: yAxisMax,
                position: 'left',
              },
            ]}
            margin={{ top: 20, right: 20, bottom: 80, left: 60 }} // Збільшений bottom для діагональних підписів
          >
            <ChartsGrid horizontal />

            <BarPlot />

            {/* Осі */}
            <ChartsXAxis
              tickLabelStyle={{ angle: -30, textAnchor: 'end', fontSize: 11 }}
            />
            <ChartsYAxis axisId="y-axis-volume" label="Кількість лотів" />

            <ChartsTooltip />
          </ChartContainer>
        </Box>
      </Box>

      {/* Динамічний футер графіка */}
      <div className="mt-4 text-sm text-gray-800 leading-relaxed p-3 bg-gray-50 rounded-md border border-gray-100">
        <p className="font-medium mb-1">Ключові показники вибірки:</p>
        <ul className="list-disc pl-5 text-xs text-gray-700 space-y-1">
          <li>
            Пік ринку: <strong>{peakRange}</strong>. Цей діапазон показує, де зосереджена найбільша кількість продажів.
          </li>
          <li>
            Цей графік допомагає швидко побачити найщільнішу зону ринку. Якщо поточна ціна авто знаходиться лівіше від піку — це, ймовірно, вигідна пропозиція.
          </li>
        </ul>
      </div>
    </Paper>
  );
};