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
    MarkPlot,
} from '@mui/x-charts';
import type {
    LineSeriesType,
    ScatterSeriesType,
    ScatterValueType,
} from '@mui/x-charts';

// --- Дані для графіка ---
const mileageXData: number[] = [
    20500, 30000, 50000, 65000, 80000, 95000, 109401, 120000, 135000, 150000, 165000, 180000, 200000, 215000, 229500
];

const maxPrices: number[] = [
    20500, 18000, 19500, 17500, 16000, 16800, 14800, 14900, 11800, 14500, 11800, 13000, 12200, 11000, 9300
];

const avgPrices: number[] = [
    17300, 16200, 17400, 15500, 14500, 14600, 14200, 14200, 11600, 13500, 11200, 12500, 11000, 10500, 9300
];

const minPrices: number[] = [
    15500, 14000, 15400, 13700, 12200, 11500, 13500, 12800, 11500, 12000, 10800, 12000, 9700, 10200, 9300
];

// Точки перетину (маркери)
const intersectionsData: ScatterValueType[] = [
    { id: 'cross-current', x: 109401, y: 11000 },
    { id: 'cross-min', x: 109401, y: minPrices[6] },
    { id: 'cross-avg', x: 109401, y: avgPrices[6] },
    { id: 'cross-max', x: 109401, y: maxPrices[6] },
];

export const GraphTrendMileage: React.FC = () => {

    const series: Array<LineSeriesType | ScatterSeriesType> = useMemo(() => [
        {
            type: 'line',
            id: 'minPrice',
            data: minPrices, // Тільки Y-дані!
            color: '#3b82f6',
            curve: 'linear',
            showMark: true,
            valueFormatter: (v: number | null) => v !== null ? `${v.toLocaleString('uk-UA')} €` : '',
        },
        {
            type: 'line',
            id: 'avgPrice',
            data: avgPrices, // Тільки Y-дані!
            color: '#22c55e',
            curve: 'linear',
            showMark: true,
            valueFormatter: (v: number | null) => v !== null ? `${v.toLocaleString('uk-UA')} €` : '',
        },
        {
            type: 'line',
            id: 'maxPrice',
            data: maxPrices, // Тільки Y-дані!
            color: '#f59e0b',
            curve: 'linear',
            showMark: true,
            valueFormatter: (v: number | null) => v !== null ? `${v.toLocaleString('uk-UA')} €` : '',
        },
        {
            type: 'scatter',
            id: 'intersections',
            data: intersectionsData, // Скаттер має свої {x, y}, йому вісь X допомагає лише з масштабом
            color: '#dc2626',
            markerSize: 7,
            valueFormatter: (v: ScatterValueType | null) => v ? `Точка перетину: ${v.y.toLocaleString('uk-UA')} €` : '',
        }
    ], []);

    return (
        <Paper elevation={0} className="w-full p-4 border border-gray-200 rounded-lg">

            <div className="mb-4">
                <Typography variant="h6" className="text-gray-900 font-semibold text-base mb-1">
                    Типи аукціону
                </Typography>
                <Typography variant="body2" className="text-gray-900 font-medium">
                    Що показує цей графік: <span className="font-normal text-[--color-muted]">мінімальна, середня та максимальна ціна по діапазонах пробігу. Червоні лінії — пробіг та ціна поточного авто, точки перетину з кривими — орієнтири "дорого/дешево".</span>
                </Typography>

                <button className="text-[--color-accent] text-sm font-medium mt-1 hover:underline">
                    Збільшити графік
                </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-xs text-gray-600">
                <div className="flex items-center gap-1"><div className="w-6 h-0.5 bg-blue-500"></div> Мінімальна ціна</div>
                <div className="flex items-center gap-1"><div className="w-6 h-0.5 bg-green-500"></div> Середня ціна</div>
                <div className="flex items-center gap-1"><div className="w-6 h-0.5 bg-amber-500"></div> Максимальна ціна</div>
                <div className="flex items-center gap-1"><div className="w-6 h-0.5 border-b-2 border-dotted border-blue-300"></div> Пробіг поточного авто</div>
                <div className="flex items-center gap-1"><div className="w-6 h-0.5 bg-red-500"></div> Поточне авто</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-600 rounded-full"></div> Точки перетину</div>
            </div>

            <Box sx={{ width: '100%', overflowX: 'auto' }}>
                <Box sx={{ minWidth: 800 }}>
                    <ChartContainer
                        height={400}
                        series={series}
                        xAxis={[
                            {
                                id: 'x-axis-mileage',
                                scaleType: 'linear',
                                data: mileageXData, // ВИПРАВЛЕНО: X-координати для ліній передаються сюди!
                                position: 'bottom',
                                min: 20000,
                                max: 230000,
                                valueFormatter: (v: number) => v.toLocaleString('uk-UA'),
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
                        ]}
                        margin={{ top: 20, right: 20, bottom: 40, left: 60 }}
                    >
                        <ChartsGrid horizontal vertical />

                        <ChartsReferenceLine x={109401} lineStyle={{ stroke: '#93c5fd', strokeDasharray: '4 4', strokeWidth: 2 }} />
                        <ChartsReferenceLine y={11000} lineStyle={{ stroke: '#ef4444', strokeWidth: 2 }} />

                        <LinePlot />
                        <MarkPlot />
                        <ScatterPlot />

                        <ChartsXAxis label="Пробіг, км" />
                        <ChartsYAxis label="Ціна, €" />
                        <ChartsTooltip />
                    </ChartContainer>
                </Box>
            </Box>

            <div className="mt-4 text-sm text-gray-800 leading-relaxed">
                <p>Пробіг: <strong>109 401 км</strong> | Поточна ціна: <strong>11 000 €</strong> | мінімальна, середня та максимальна ціна по діапазонах пробігу. Червоні лінії — пробіг та ціна поточного авто, точки перетину з кривими — орієнтири "дорого/дешево".</p>
                <p className="text-[--color-muted] mt-1">Допомагає зрозуміти, в якому ціновому коридорі зазвичай продають авто з таким пробігом, і чи є сенс опускати/піднімати ціну для кращого попадання...</p>
            </div>

        </Paper>
    );
};