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
import dayjs from 'dayjs';

// --- Мокові дані ---
// Значення об'єму продажів, наближені до тих, що на картинці
const volumeData = [
    8, 10, 2, 1, 3, 1, 3, 3, 7, 9, 5, 4, 2, 4, 8, 6, 6, 16, 8, 10, 8, 13, 3, 3, 6, 8, 4
];

// Генеруємо дати (тижні) відповідно до кількості точок даних
const datesData = volumeData.map((_, i) =>
    dayjs('2025-09-28').add(i, 'week').valueOf()
);

export const GraphSalesVolume: React.FC = () => {

    // Типізація масиву серій
    const series: Array<LineSeriesType | BarSeriesType> = useMemo(() => [
        {
            type: 'bar',
            id: 'volumeBar',
            data: volumeData,
            yAxisId: 'y-axis-volume', // Прив'язка до єдиної осі Y
            color: '#cbd5e1', // Світло-сірий (Tailwind slate-300), щоб лінія краще виділялась
            valueFormatter: (v: number | null) => v !== null ? `${v} лотів` : '',
        },
        {
            type: 'line',
            id: 'volumeLine',
            data: volumeData,
            yAxisId: 'y-axis-volume', // Та сама вісь Y
            color: '#3b82f6', // Синій основний
            curve: 'linear',
            showMark: true,
            valueFormatter: (v: number | null) => v !== null ? `${v} лотів` : '',
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
                    Що показує цей графік: <span className="font-normal text-[--color-muted]">кількість проданих лотів по тижнях / місяцях із урахуванням фільтрів.</span>
                </Typography>
                <button className="text-[--color-accent] text-sm font-medium mt-1 hover:underline">
                    Збільшити графік
                </button>
            </div>

            {/* Легенда */}
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mb-4 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                    <div className="w-6 h-3 bg-slate-300 border border-slate-300"></div> Кількість лотів
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-6 h-0.5 bg-blue-500 relative flex justify-center items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full absolute"></div>
                    </div>
                    Лінія об'єму продажів
                </div>
            </div>

            {/* Графік */}
            <Box sx={{ width: '100%', overflowX: 'auto' }}>
                <Box sx={{ minWidth: 800 }}>
                    <ChartContainer
                        height={400}
                        series={series}
                        xAxis={[
                            {
                                id: 'x-axis-dates',
                                scaleType: 'band', // Обов'язково band для стовпчиків
                                data: datesData,
                                position: 'bottom',
                                valueFormatter: (date: number) => dayjs(date).format('MMM D, YYYY'),
                            },
                        ]}
                        yAxis={[
                            {
                                id: 'y-axis-volume',
                                scaleType: 'linear',
                                min: 0,
                                max: 18, // Трохи більше максимуму (16), щоб графік дихав
                                position: 'left',
                            },
                        ]}
                        margin={{ top: 20, right: 20, bottom: 60, left: 60 }} // Великий bottom для повернутих дат
                    >
                        <ChartsGrid horizontal />

                        {/* Стовпчики рендеряться знизу */}
                        <BarPlot />

                        {/* Лінія та маркери рендеряться поверх стовпчиків */}
                        <LinePlot />
                        <MarkPlot />

                        {/* Осі */}
                        <ChartsXAxis
                            label="Тижні"
                            tickLabelStyle={{ angle: -35, textAnchor: 'end', fontSize: 11 }}
                        />
                        <ChartsYAxis
                            axisId="y-axis-volume"
                            label="Кількість лотів"
                        />

                        <ChartsTooltip />
                    </ChartContainer>
                </Box>
            </Box>

            {/* Футер графіка */}
            <div className="mt-4 text-sm text-gray-800 leading-relaxed">
                <p>Найбільша кількість лотів (<strong>16</strong>) припадає приблизно на <strong>19.01.2026</strong>, де медіанна ціна становила <strong>15 662 €</strong>.</p>
                <p className="text-[--color-muted] mt-1">Цей графік показує, коли ринок був найбільш "живий" за кількістю продажів. У поєднанні з цінами зручно вибирати періоди для виставлення авто.</p>
            </div>

        </Paper>
    );
};