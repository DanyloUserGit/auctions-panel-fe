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

// --- Мокові дані по країнах ---
const countries = [
    'Belgium',
    'Spain',
    'Netherlands',
    'France',
    'Romania',
    'Italy',
    'Denmark',
    'Germany' // На скріншоті було Belgium вдруге, замінено для унікальності
];

// Кількість авто (права шкала)
const volumeData = [48, 80, 20, 15, 30, 20, 10, 5];

// Цінові межі (ліва шкала)
const bottomMarketData = [11800, 9200, 9500, 11800, 13700, 11500, 11000, 10200];
const p25Data = [14500, 14500, 14000, 13800, 14200, 12000, 11200, 10200];
const medianData = [16500, 15500, 15000, 14800, 14800, 12500, 12000, 10200];
const p75Data = [18200, 16000, 16500, 16600, 15500, 14000, 13500, 10200];
const topMarketData = [19500, 17200, 18000, 20600, 16000, 15500, 15500, 10200];

export const GraphCountries: React.FC = () => {

    const series: Array<LineSeriesType | BarSeriesType> = useMemo(() => [
        {
            type: 'bar',
            id: 'volume',
            data: volumeData,
            xAxisId: 'x-axis-countries',
            yAxisId: 'y-axis-volume', // Права вісь
            color: '#e2e8f0', // Світло-сірий
            valueFormatter: (v: number | null) => v !== null ? `${v} авто` : '',
        },
        {
            type: 'line',
            id: 'bottomMarket',
            data: bottomMarketData,
            xAxisId: 'x-axis-countries',
            yAxisId: 'y-axis-price', // Ліва вісь
            color: '#60a5fa', // Світло-синій
            curve: 'linear',
            showMark: true,
            valueFormatter: (v: number | null) => v !== null ? `${v.toLocaleString('uk-UA')} €` : '',
        },
        {
            type: 'line',
            id: 'p25',
            data: p25Data,
            xAxisId: 'x-axis-countries',
            yAxisId: 'y-axis-price',
            color: '#34d399', // Світло-зелений
            curve: 'linear',
            showMark: true,
            valueFormatter: (v: number | null) => v !== null ? `${v.toLocaleString('uk-UA')} €` : '',
        },
        {
            type: 'line',
            id: 'median',
            data: medianData,
            xAxisId: 'x-axis-countries',
            yAxisId: 'y-axis-price',
            color: '#f59e0b', // Жовтий/Помаранчевий
            curve: 'linear',
            showMark: true,
            valueFormatter: (v: number | null) => v !== null ? `${v.toLocaleString('uk-UA')} €` : '',
        },
        {
            type: 'line',
            id: 'p75',
            data: p75Data,
            xAxisId: 'x-axis-countries',
            yAxisId: 'y-axis-price',
            color: '#d97706', // Темно-помаранчевий
            curve: 'linear',
            showMark: true,
            valueFormatter: (v: number | null) => v !== null ? `${v.toLocaleString('uk-UA')} €` : '',
        },
        {
            type: 'line',
            id: 'topMarket',
            data: topMarketData,
            xAxisId: 'x-axis-countries',
            yAxisId: 'y-axis-price',
            color: '#ef4444', // Червоний
            curve: 'linear',
            showMark: true,
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
                    Порівняння по країнах <span className="font-normal text-[--color-muted]">показує, у яких країнах ринок цієї моделі дешевший або дорожчий та наскільки стабільний розкид цін.</span>
                </Typography>
                <button className="text-[--color-accent] text-sm font-medium mt-1 hover:underline">
                    Збільшити графік
                </button>
            </div>

            {/* Кастомна легенда */}
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mb-4 text-xs text-gray-600">
                <div className="flex items-center gap-1"><div className="w-6 h-3 bg-slate-200 border border-slate-300"></div> К-сть авто</div>
                <div className="flex items-center gap-1"><div className="w-6 h-0.5 bg-blue-400"></div> Низ ринку</div>
                <div className="flex items-center gap-1"><div className="w-6 h-0.5 border-b-2 border-dotted border-green-400"></div> P25</div>
                <div className="flex items-center gap-1"><div className="w-6 h-0.5 bg-yellow-500"></div> Медіана</div>
                <div className="flex items-center gap-1"><div className="w-6 h-0.5 border-b-2 border-dotted border-orange-600"></div> P75</div>
                <div className="flex items-center gap-1"><div className="w-6 h-0.5 bg-red-500"></div> Верх ринку</div>
            </div>

            {/* Графік */}
            <Box sx={{ width: '100%', overflowX: 'auto' }}>
                <Box sx={{ minWidth: 800 }}>
                    <ChartContainer
                        height={400}
                        series={series}
                        xAxis={[
                            {
                                id: 'x-axis-countries',
                                scaleType: 'band',
                                data: countries,
                                position: 'bottom',
                            },
                        ]}
                        yAxis={[
                            {
                                id: 'y-axis-price',
                                scaleType: 'linear',
                                min: 8000,
                                max: 23000,
                                position: 'left',
                                valueFormatter: (v: number) => v.toLocaleString('uk-UA'),
                            },
                            {
                                id: 'y-axis-volume',
                                scaleType: 'linear',
                                min: 0,
                                max: 90,
                                position: 'right',
                            },
                        ]}
                        margin={{ top: 20, right: 60, bottom: 40, left: 60 }}
                        sx={{
                            // Робимо P25 та P75 пунктирними
                            '& .MuiLineElement-series-p25': { strokeDasharray: '5 5' },
                            '& .MuiLineElement-series-p75': { strokeDasharray: '5 5' },
                            // Трохи збільшуємо товщину медіани
                            '& .MuiLineElement-series-median': { strokeWidth: 3 },
                        }}
                    >
                        <ChartsGrid horizontal />

                        <BarPlot />
                        <LinePlot />
                        <MarkPlot />

                        <ChartsXAxis
                            tickLabelStyle={{ fontSize: 12 }}
                        />
                        <ChartsYAxis
                            axisId="y-axis-price"
                            label="Ринкові ціни, €"
                        />
                        <ChartsYAxis
                            axisId="y-axis-volume"
                            label="К-сть авто"
                        />

                        <ChartsTooltip />
                    </ChartContainer>
                </Box>
            </Box>

            {/* Футер графіка */}
            <div className="mt-4 text-sm text-gray-800 leading-relaxed">
                <p>Для кожної країни відображається повний ринковий профіль: нижня ціна ринку, P25, медіана, P75, верх ринку та кількість авто. Це допомагає зрозуміти не лише типовий рівень ціни, а й ширину ринку та надійність статистики.</p>
                <p className="text-[--color-muted] mt-1 text-xs">Цей графік потрібен для пошуку ринків, де ця модель продається дешевше або дорожче. Низ ринку — це орієнтир для пошуку вигідної покупки, медіана — типовий ринок, верх ринку — зона дорогих продажів. Перцентилі 25/75 допомагають відсікти крайні значення та побачити стабільний коридор по кожній країні.</p>
            </div>

        </Paper>
    );
};