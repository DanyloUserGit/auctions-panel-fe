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

// --- Генерація мокових даних пробігу ---
// Дані тепер мають x як число (пробіг)
const generateScatterDataMileage = (count: number, minMileage: number, maxMileage: number, minPrice: number, maxPrice: number): ScatterValueType[] => {
    return Array.from({ length: count }).map((_, i) => ({
        id: `point-m-${i}-${Math.random()}`,
        x: Math.floor(Math.random() * (maxMileage - minMileage + 1)) + minMileage,
        y: Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice,
    }));
};

// Генерація даних для лінійної тенденції (спадна лінія)
const generateTrendLineData = (minMileage: number, maxMileage: number, startPrice: number, endPrice: number): { x: number; y: number }[] => {
    // Всього 2 точки для ідеально прямої лінії
    return [
        { x: minMileage, y: startPrice },
        { x: maxMileage, y: endPrice }
    ];
};

const mileageDataRange = { min: 0, max: 250000 };
// const priceDataRange = { min: 8000, max: 22000 };

const type0DataM = generateScatterDataMileage(35, mileageDataRange.min, mileageDataRange.max, 10000, 18000);
const type2DataM = generateScatterDataMileage(30, mileageDataRange.min, mileageDataRange.max, 12000, 20000);
const type3DataM = generateScatterDataMileage(25, mileageDataRange.min, mileageDataRange.max, 12000, 19000);

// Дані лінії тенденції (від 0 км до 250к км, ціна падає від 17.5к до 9.5к)
const trendLineDataPoints = generateTrendLineData(0, 250000, 17500, 9500);
// Окремі масиви для series
const trendLinePrices: number[] = trendLineDataPoints.map(p => p.y);
const trendLineMileages: number[] = trendLineDataPoints.map(p => p.x);

export const GraphMileagePrice: React.FC = () => {
    // Явно вказуємо тип масиву серій
    const series: Array<ScatterSeriesType | LineSeriesType> = useMemo(() => [
        {
            type: 'scatter',
            id: 'type0-m',
            data: type0DataM,
            color: '#fbbf24', // Жовтий
            markerSize: 5,
            valueFormatter: (v: ScatterValueType | null) => v ? `${v.y.toLocaleString('uk-UA')} € (${v.x.toLocaleString('uk-UA')} км)` : '',
        },
        {
            type: 'scatter',
            id: 'type2-m',
            data: type2DataM,
            color: '#22c55e', // Зелений
            markerSize: 5,
            valueFormatter: (v: ScatterValueType | null) => v ? `${v.y.toLocaleString('uk-UA')} € (${v.x.toLocaleString('uk-UA')} км)` : '',
        },
        {
            type: 'scatter',
            id: 'type3-m',
            data: type3DataM,
            color: '#a855f7', // Фіолетовий
            markerSize: 5,
            valueFormatter: (v: ScatterValueType | null) => v ? `${v.y.toLocaleString('uk-UA')} € (${v.x.toLocaleString('uk-UA')} км)` : '',
        },
        {
            type: 'line',
            id: 'trendLine-m',
            data: trendLinePrices,
            color: 'var(--color-accent)', // Синій з ваших CSS змінних
            curve: 'linear',
            // Обов'язково вказуємо x дані для лінії, якщо вісь X лінійна (не часова)
            dataX: trendLineMileages,
            valueFormatter: (v: number | null) => (v !== null && v !== undefined) ? `${v.toLocaleString('uk-UA')} €` : '',
        },
    ], []);

    // Поточне авто як окрема серія для виділення маркера
    const currentCarData: ScatterValueType[] = [{ id: 'current-car-m', x: 109401, y: 11000 }];
    const currentCarSeries: ScatterSeriesType = {
        type: 'scatter',
        id: 'current-car-marker',
        data: currentCarData,
        color: '#ef4444', // Червоний
        markerSize: 8, // Більший маркер
        valueFormatter: (v: ScatterValueType | null) => v ? `Поточне авто: ${v.y.toLocaleString('uk-UA')} €, ${v.x.toLocaleString('uk-UA')} км` : '',
    };

    // Об'єднуємо всі серії
    const allSeries = [...series, currentCarSeries];

    return (
        <Paper elevation={0} className="w-full p-4 border border-gray-200 rounded-lg">
            <div className="mb-4">
                <Typography variant="h6" className="text-gray-900 font-semibold text-base mb-1">
                    Пробіг та ціна
                </Typography>
                <Typography variant="body2" className="text-[--color-muted]">
                    <strong>Що показує цей графік:</strong> точки – ціна в залежності від пробігу, синя лінія – середня тенденція. Червоні лінії показують пробіг і ціну поточного авто.
                </Typography>
                <button className="text-[--color-accent] text-sm font-medium mt-1 hover:underline">
                    Збільшити графік
                </button>
            </div>

            {/* Кастомна легенда (розширена відповідно до зображення) */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-xs text-gray-600">
                <div className="flex items-center gap-1"><div className="w-4 h-4 bg-[#fbbf24] rounded-sm"></div> type 0</div>
                <div className="flex items-center gap-1"><div className="w-4 h-4 bg-[#22c55e] rounded-sm"></div> type 2</div>
                <div className="flex items-center gap-1"><div className="w-4 h-4 bg-[#a855f7] rounded-sm"></div> type 3</div>
                <div className="flex items-center gap-1"><div className="w-6 h-0.5 bg-[--color-accent]"></div> Середня тенденція ціни від пробігу</div>
                <div className="flex items-center gap-1"><div className="w-0.5 h-4 bg-red-500"></div> Пробіг поточного авто</div>
                <div className="flex items-center gap-1"><div className="w-6 h-0.5 bg-red-500"></div> Поточне авто</div>
                <div className="flex items-center gap-1"><div className="w-6 h-0.5 border-b-2 border-dotted border-cyan-400"></div> Ринковий коридор 25% (низ)</div>
                <div className="flex items-center gap-1"><div className="w-6 h-0.5 border-b-2 border-dotted border-cyan-400"></div> Ринковий коридор 75% (верх)</div>
                <div className="flex items-center gap-1"><div className="w-6 h-0.5 border-b-2 border-dotted border-green-400"></div> Середня ринкова ціна</div>
                <div className="flex items-center gap-1"><div className="w-6 h-0.5 border-b-2 border-dotted border-black/30"></div> Середня ціна</div>
                {/* The red dot itself is part of the legend, but it is implicitly handled by the reference lines descriptions. Confusing legend structure in image. I'll stick to making the lines and a distinct point.*/}
            </div>

            {/* Графік */}
            <Box sx={{ width: '100%', overflowX: 'auto' }}>
                <Box sx={{ minWidth: 600 }}>
                    <ChartContainer
                        height={400}
                        series={allSeries}
                        xAxis={[
                            {
                                id: 'x-axis-mileage',
                                // ВИПРАВЛЕНО: Використовуємо лінійну шкалу для чисел (пробіг)
                                scaleType: 'linear',
                                label: 'Пробіг, км',
                                min: 0,
                                max: 250000,
                                // data: [...] // Не потрібно передавати data прямо в xAxis для linear scale, діапазон визначається даними серій та min/max. Але щоб уникнути помилок типізації MUI, якщо він вимагає dataX для LinePlot, ми передали dataX прямо в LinePlot. Для ChartContainer xAxis data можна не передавати.
                                valueFormatter: (v: number) => v.toLocaleString('uk-UA'),
                            },
                        ]}
                        yAxis={[
                            {
                                id: 'y-axis-price-m',
                                scaleType: 'linear',
                                min: 8000,
                                max: 22000,
                                valueFormatter: (v: number) => v.toLocaleString('uk-UA'),
                            },
                        ]}
                        margin={{ top: 20, right: 20, bottom: 40, left: 60 }}
                    >
                        <ChartsGrid horizontal vertical />

                        {/* Референсні лінії (Коридори та поточне авто) */}
                        <ChartsReferenceLine y={16529} lineStyle={{ stroke: '#22d3ee', strokeDasharray: '3 3', strokeWidth: 2 }} /> {/* 75% */}
                        <ChartsReferenceLine y={15400} lineStyle={{ stroke: '#4ade80', strokeDasharray: '3 3', strokeWidth: 2 }} /> {/* Market Avg */}
                        <ChartsReferenceLine y={14195} lineStyle={{ stroke: '#22d3ee', strokeDasharray: '3 3', strokeWidth: 2 }} /> {/* 25% */}
                        <ChartsReferenceLine y={15200} lineStyle={{ stroke: '#000000', strokeDasharray: '3 3', strokeWidth: 1, strokeOpacity: 0.3 }} /> {/* Середня ціна (Dotted gray/black) */}

                        {/* Референсна лінія ціни поточного авто (Горизонтальна червона суцільна) */}
                        <ChartsReferenceLine y={11000} lineStyle={{ stroke: '#ef4444', strokeWidth: 2 }} /> {/* Current Auto Price */}
                        {/* Референсна лінія пробігу поточного авто (Вертикальна червона суцільна) */}
                        <ChartsReferenceLine x={109401} lineStyle={{ stroke: '#ef4444', strokeWidth: 2 }} /> {/* Current Auto Mileage */}

                        <ScatterPlot />
                        <LinePlot />

                        <ChartsXAxis label="Ціна, €" />
                        <ChartsYAxis label='Пробіг' />
                        <ChartsTooltip />
                    </ChartContainer>
                </Box>
            </Box>

            {/* Футер графіка (специфічний для пробігу) */}
            <div className="mt-4 text-sm text-gray-800">
                <p>Пробіг: <strong>109 401 км</strong> | Поточна ціна: <strong>11 000 €</strong> | Ринковий коридор <strong>14 195–16 529 €</strong> (25–75 перцентилів).</p>
                <p className="mt-1">Ціна в середньому падає на <strong>410 €</strong> за кожні 10 000 км пробігу</p>
                <p className="text-[--color-muted] text-xs mt-1">Цей графік допомагає зрозуміти, наскільки ваш пробіг виглядає привабливо відносно типового падіння ціни за 10 000 км.</p>
            </div>

        </Paper>
    );
};