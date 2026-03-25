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
import type {
    LineSeriesType,
    BarSeriesType,
} from '@mui/x-charts';

// --- Мокові дані по днях тижня ---
const daysOfWeek = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота'];

// Дані (довжина кожного масиву = 7, відповідно до днів)
const volumeData = [2, 39, 29, 23, 19, 15, 12];
const maxPriceData = [15800, 19000, 20500, 19500, 16300, 19800, 20600];
const p75Data = [15800, 16000, 16300, 17500, 16000, 16800, 18100];
const avgPriceData = [15800, 15000, 14800, 15800, 14700, 15200, 16700];
const p25Data = [15800, 13800, 13200, 14500, 14300, 13500, 15500];
const minPriceData = [15800, 10000, 9300, 12000, 9600, 10200, 13000];

export const GraphDaysOfWeek: React.FC = () => {

    const series: Array<LineSeriesType | BarSeriesType> = useMemo(() => [
        {
            type: 'bar',
            id: 'volume',
            data: volumeData,
            xAxisId: 'x-axis-days',
            yAxisId: 'y-axis-volume', // Права вісь
            color: '#e2e8f0', // Світло-сірий (Tailwind slate-200)
            valueFormatter: (v: number | null) => v !== null ? `${v} лотів` : '',
        },
        {
            type: 'line',
            id: 'minPrice',
            data: minPriceData,
            xAxisId: 'x-axis-days',
            yAxisId: 'y-axis-price', // Ліва вісь
            color: '#93c5fd', // Світло-синій
            curve: 'linear',
            showMark: false,
            valueFormatter: (v: number | null) => v !== null ? `${v.toLocaleString('uk-UA')} €` : '',
        },
        {
            type: 'line',
            id: 'p25',
            data: p25Data,
            xAxisId: 'x-axis-days',
            yAxisId: 'y-axis-price',
            color: '#22c55e', // Зелений
            curve: 'linear',
            showMark: true,
            valueFormatter: (v: number | null) => v !== null ? `${v.toLocaleString('uk-UA')} €` : '',
        },
        {
            type: 'line',
            id: 'avgPrice',
            data: avgPriceData,
            xAxisId: 'x-axis-days',
            yAxisId: 'y-axis-price',
            color: '#3b82f6', // Синій основний
            curve: 'linear',
            showMark: true,
            valueFormatter: (v: number | null) => v !== null ? `${v.toLocaleString('uk-UA')} €` : '',
        },
        {
            type: 'line',
            id: 'p75',
            data: p75Data,
            xAxisId: 'x-axis-days',
            yAxisId: 'y-axis-price',
            color: '#fbbf24', // Жовтий
            curve: 'linear',
            showMark: true,
            valueFormatter: (v: number | null) => v !== null ? `${v.toLocaleString('uk-UA')} €` : '',
        },
        {
            type: 'line',
            id: 'maxPrice',
            data: maxPriceData,
            xAxisId: 'x-axis-days',
            yAxisId: 'y-axis-price',
            color: '#f87171', // Світло-червоний
            curve: 'linear',
            showMark: false,
            valueFormatter: (v: number | null) => v !== null ? `${v.toLocaleString('uk-UA')} €` : '',
        }
    ], []);

    return (
        <Paper elevation={0} className="w-full p-4 border border-gray-200 rounded-lg">

            {/* Заголовок */}
            <div className="mb-4">
                <Typography variant="h6" className="text-gray-900 font-semibold text-base mb-1">
                    Типи аукціону
                </Typography>
                <Typography variant="body2" className="text-gray-900 font-medium">
                    Що показує цей графік: <span className="font-normal text-[--color-muted]">середня ціна та кількість лотів по днях тижня. Допомагає вибрати день, коли ринок активніший або ціни нижчі.</span>
                </Typography>
                <button className="text-[--color-accent] text-sm font-medium mt-1 hover:underline">
                    Збільшити графік
                </button>
            </div>

            {/* Кастомна легенда */}
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mb-4 text-xs text-gray-600">
                <div className="flex items-center gap-1"><div className="w-6 h-3 bg-slate-200 border border-slate-300"></div> Кількість лотів</div>
                <div className="flex items-center gap-1"><div className="w-6 h-0.5 bg-blue-500"></div> Середня ціна, €</div>
                <div className="flex items-center gap-1"><div className="w-6 h-0.5 border-b-2 border-dotted border-green-500"></div> P25</div>
                <div className="flex items-center gap-1"><div className="w-6 h-0.5 border-b-2 border-dotted border-yellow-400"></div> P75</div>
                <div className="flex items-center gap-1"><div className="w-6 h-0.5 bg-blue-300"></div> Мінімальна ціна</div>
                <div className="flex items-center gap-1"><div className="w-6 h-0.5 bg-red-400"></div> Максимальна ціна</div>
            </div>

            {/* Графік */}
            <Box sx={{ width: '100%', overflowX: 'auto' }}>
                <Box sx={{ minWidth: 800 }}>
                    <ChartContainer
                        height={400}
                        series={series}
                        xAxis={[
                            {
                                id: 'x-axis-days',
                                scaleType: 'band', // Для текстових категорій (дні тижня) обов'язково band
                                data: daysOfWeek,
                                position: 'bottom',
                            },
                        ]}
                        yAxis={[
                            {
                                id: 'y-axis-price',
                                scaleType: 'linear',
                                min: 8000,
                                max: 23000, // Збільшено максимум, щоб вмістити всі лінії
                                position: 'left',
                                valueFormatter: (v: number) => v.toLocaleString('uk-UA'),
                            },
                            {
                                id: 'y-axis-volume',
                                scaleType: 'linear',
                                min: 0,
                                max: 45, // Запас для правої осі (макс 39)
                                position: 'right',
                            },
                        ]}
                        margin={{ top: 20, right: 50, bottom: 40, left: 60 }}
                        // Стилізуємо лінії через sx, оскільки MUI Line series не підтримує strokeDasharray напряму
                        sx={{
                            '& .MuiLineElement-series-p25': { strokeDasharray: '5 5' },
                            '& .MuiLineElement-series-p75': { strokeDasharray: '5 5' },
                            // Робимо центральну лінію трохи жирнішою
                            '& .MuiLineElement-series-avgPrice': { strokeWidth: 3 },
                        }}
                    >
                        <ChartsGrid horizontal />

                        {/* Рендеримо стовпчики під лініями */}
                        <BarPlot />

                        <LinePlot />
                        <MarkPlot /> {/* Додає точки на зламах ліній */}

                        {/* Осі */}
                        <ChartsXAxis />
                        <ChartsYAxis axisId="y-axis-price" label="Середня ціна, €" />
                        <ChartsYAxis axisId="y-axis-volume" label="Кількість лотів" />

                        <ChartsTooltip />
                    </ChartContainer>
                </Box>
            </Box>

            {/* Футер графіка */}
            <div className="mt-4 text-sm text-gray-800 leading-relaxed">
                <p>Найнижча середня ціна — у Четвер (~<strong>14 739 €</strong>). Найнижчі мінімальні ціни — у Вівторок (від <strong>9 339 €</strong>). Найбільший обсяг продажів — у Понеділок (<strong>39 лотів</strong>).</p>
                <p className="text-[--color-muted]">Можна використати, щоб планувати, у які дні краще виставляти або коригувати ціну — де більше угод та нижчі середні ціни.</p>
            </div>

        </Paper>
    );
};