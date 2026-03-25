import React, { useMemo, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Radio,
    RadioGroup,
    FormControlLabel,
} from '@mui/material';
import {
    ChartContainer,
    LinePlot,
    BarPlot,
    ScatterPlot,
    ChartsXAxis,
    ChartsYAxis,
    ChartsGrid,
    ChartsTooltip,
    ChartsReferenceLine,
} from '@mui/x-charts';
import type {
    LineSeriesType,
    BarSeriesType,
    ScatterSeriesType,
    ScatterValueType,
} from '@mui/x-charts';
import dayjs from 'dayjs';

// --- Генерація мокових даних ---
const generateTrendData = (weeksCount: number) => {
    const dates: number[] = [];
    const minPrices: number[] = [];
    const medianPrices: number[] = [];
    const maxPrices: number[] = [];
    const volumes: number[] = [];

    let currentBasePrice = 14000;

    for (let i = 0; i < weeksCount; i++) {
        dates.push(dayjs('2025-09-28').add(i, 'week').valueOf());

        currentBasePrice = currentBasePrice + (Math.random() * 2000 - 1000);
        if (currentBasePrice < 10000) currentBasePrice = 10000;
        if (currentBasePrice > 18000) currentBasePrice = 18000;

        minPrices.push(Math.floor(currentBasePrice - 1500 - Math.random() * 1000));
        medianPrices.push(Math.floor(currentBasePrice));
        maxPrices.push(Math.floor(currentBasePrice + 1500 + Math.random() * 1000));

        volumes.push(Math.floor(Math.random() * 15) + 1);
    }

    return { dates, minPrices, medianPrices, maxPrices, volumes };
};

const data = generateTrendData(26);

// Маркер конкретного продажу VIN
const vinSaleData: ScatterValueType[] = [
    { id: 'vin-sale-1', x: data.dates[22], y: 14500 }
];

export const GraphTrendTime: React.FC = () => {
    const [aggregation, setAggregation] = useState<'weeks' | 'months'>('weeks');

    const series: Array<LineSeriesType | BarSeriesType | ScatterSeriesType> = useMemo(() => [
        {
            type: 'bar',
            id: 'volume',
            data: data.volumes,
            xAxisId: 'x-axis-dates', // Явно прив'язуємо до осі X
            yAxisId: 'y-axis-volume', // ВИПРАВЛЕНО: Було yAxisKey. Тепер стовпчики будуть на своїй осі!
            color: '#cbd5e1', // Трохи темніший сірий, щоб стовпчики було краще видно
            valueFormatter: (v: number | null) => v !== null ? `${v} лотів` : '',
        },
        {
            type: 'line',
            id: 'minPrice',
            data: data.minPrices,
            xAxisId: 'x-axis-dates',
            yAxisId: 'y-axis-price', // ВИПРАВЛЕНО: Було yAxisKey
            color: '#3b82f6',
            curve: 'linear',
            valueFormatter: (v: number | null) => v !== null ? `${v.toLocaleString('uk-UA')} €` : '',
        },
        {
            type: 'line',
            id: 'medianPrice',
            data: data.medianPrices,
            xAxisId: 'x-axis-dates',
            yAxisId: 'y-axis-price', // ВИПРАВЛЕНО: Було yAxisKey
            color: '#22c55e',
            curve: 'linear',
            valueFormatter: (v: number | null) => v !== null ? `${v.toLocaleString('uk-UA')} €` : '',
        },
        {
            type: 'line',
            id: 'maxPrice',
            data: data.maxPrices,
            xAxisId: 'x-axis-dates',
            yAxisId: 'y-axis-price', // ВИПРАВЛЕНО: Було yAxisKey
            color: '#f59e0b',
            curve: 'linear',
            valueFormatter: (v: number | null) => v !== null ? `${v.toLocaleString('uk-UA')} €` : '',
        },
        {
            type: 'scatter',
            id: 'vinSale',
            data: vinSaleData,
            xAxisId: 'x-axis-dates',
            yAxisId: 'y-axis-price', // ВИПРАВЛЕНО: Було yAxisKey
            color: '#dc2626',
            markerSize: 6,
            valueFormatter: (v: ScatterValueType | null) => v ? `Продаж VIN: ${v.y.toLocaleString('uk-UA')} €` : '',
        }
    ], []);

    return (
        <Paper elevation={0} className="w-full p-4 border border-gray-200 rounded-lg">

            <div className="mb-4">
                <Typography variant="h6" className="text-gray-900 font-semibold text-base mb-1">
                    Що показує цей графік: <span className="font-normal text-[--color-muted]">мінімальна, медіанна та максимальна ціна по тижнях/місяцях + об'єм продажів.</span>
                </Typography>

                <div className="flex items-center gap-2 mt-2">
                    <Typography variant="body2" className="text-gray-700 font-medium">
                        Агрегація:
                    </Typography>
                    <RadioGroup
                        row
                        value={aggregation}
                        onChange={(e) => setAggregation(e.target.value as 'weeks' | 'months')}
                        className="gap-4"
                    >
                        <FormControlLabel
                            value="weeks"
                            control={<Radio size="small" sx={{ color: 'var(--color-accent)', '&.Mui-checked': { color: 'var(--color-accent)' } }} />}
                            label={<span className="text-sm">Тижні</span>}
                        />
                        <FormControlLabel
                            value="months"
                            control={<Radio size="small" sx={{ color: 'var(--color-accent)', '&.Mui-checked': { color: 'var(--color-accent)' } }} />}
                            label={<span className="text-sm">Місяці</span>}
                        />
                    </RadioGroup>
                </div>

                <button className="text-[--color-accent] text-sm font-medium mt-1 hover:underline">
                    Збільшити графік
                </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-xs text-gray-600">
                <div className="flex items-center gap-1"><div className="w-6 h-0.5 bg-blue-500"></div> Мінімальна ціна за {aggregation === 'weeks' ? 'Тижні' : 'Місяці'}</div>
                <div className="flex items-center gap-1"><div className="w-6 h-0.5 bg-green-500"></div> Медіанна ціна за {aggregation === 'weeks' ? 'Тижні' : 'Місяці'}</div>
                <div className="flex items-center gap-1"><div className="w-6 h-0.5 bg-amber-500"></div> Максимальна ціна за {aggregation === 'weeks' ? 'Тижні' : 'Місяці'}</div>
                <div className="flex items-center gap-1"><div className="w-4 h-4 bg-slate-200 border border-slate-300 rounded-sm"></div> Кількість лотів</div>
                <div className="flex items-center gap-1"><div className="w-6 h-0.5 bg-red-500"></div> Поточне авто</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-600 rotate-45"></div> Продажі цього VIN у вибраних даних</div>
            </div>

            <Box sx={{ width: '100%', overflowX: 'auto' }}>
                <Box sx={{ minWidth: 800 }}>
                    <ChartContainer
                        height={400}
                        series={series}
                        xAxis={[
                            {
                                id: 'x-axis-dates',
                                scaleType: 'band',
                                data: data.dates,
                                position: 'bottom',
                                valueFormatter: (date: number) => dayjs(date).format('MMM D, YYYY'),
                            },
                        ]}
                        yAxis={[
                            {
                                id: 'y-axis-price',
                                scaleType: 'linear',
                                min: 8000,
                                max: 22000,
                                position: 'left',
                                valueFormatter: (v: number) => v.toLocaleString('uk-UA'),
                            },
                            {
                                id: 'y-axis-volume',
                                scaleType: 'linear',
                                min: 0,
                                max: 18, // Права шкала (кількість лотів)
                                position: 'right',
                            },
                        ]}
                        margin={{ top: 20, right: 50, bottom: 60, left: 60 }}
                    >
                        <ChartsGrid horizontal />

                        <BarPlot />

                        <ChartsReferenceLine y={11000} axisId="y-axis-price" lineStyle={{ stroke: '#ef4444', strokeWidth: 2 }} />

                        <LinePlot />
                        <ScatterPlot />

                        <ChartsXAxis
                            label="Дата (тиждень)"
                            tickLabelStyle={{ angle: -35, textAnchor: 'end', fontSize: 11 }}
                        />
                        <ChartsYAxis
                            axisId="y-axis-price"
                            label="Ціна, €"
                        />
                        <ChartsYAxis
                            axisId="y-axis-volume"
                            label="Кількість лотів"
                        />
                        <ChartsTooltip />
                    </ChartContainer>
                </Box>
            </Box>

            <div className="mt-4 text-sm text-gray-800 leading-relaxed">
                <p>Криві мінімальної, медіанної та максимальної ціни за період. Стовпчики показують кількість проданих лотів. Червона лінія — поточна ціна авто, червоні маркери — продажі цього VIN.</p>
                <p>Поточна ціна: <strong>11 000 €</strong> | Актуальна медіана: <strong>14 271 €</strong> | Діапазон мін/макс: <strong>9 339–15 620 €</strong> | Використовуйте цей графік, щоб бачити, коли ринок був найактивнішим і в які періоди ціни були найкращими. Це допомагає обрати момент для продажу та цільовий діапазон ціни.</p>
                <p className="text-[--color-muted] mt-1 text-xs">Використовуйте цей графік, щоб бачити, коли ринок був найактивнішим і в які періоди ціни були найкращими. Це допомагає обрати момент для продажу та цільовий діапазон ціни.</p>
            </div>

        </Paper>
    );
};