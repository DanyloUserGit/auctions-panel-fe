import React, { useMemo } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import {
    ChartContainer,
    BarPlot,
    ChartsXAxis,
    ChartsYAxis,
    ChartsGrid,
    ChartsTooltip,
} from '@mui/x-charts';
// Суворий імпорт типів
import type { BarSeriesType } from '@mui/x-charts';

// --- Мокові дані ---
// Діапазони цін (категорії для осі X)
const priceRanges = [
    '9 339–10 276 €',
    '10 277–11 214 €',
    '11 215–12 152 €',
    '12 153–13 090 €',
    '13 091–14 028 €',
    '14 029–14 966 €',
    '14 967–15 904 €', // Пік
    '15 905–16 842 €',
    '16 843–17 780 €',
    '17 781–18 718 €',
    '18 719–19 656 €',
    '19 657–20 594 €',
];

// Кількість лотів у кожному діапазоні
const volumeData = [
    5, 3, 8, 11, 14, 28, 33, 21, 15, 14, 7, 2
];

export const GraphPriceDistribution: React.FC = () => {

    // Типізація масиву серій (тут лише одна серія - Bar)
    const series: Array<BarSeriesType> = useMemo(() => [
        {
            type: 'bar',
            id: 'distributionBar',
            data: volumeData,
            xAxisId: 'x-axis-ranges',
            yAxisId: 'y-axis-volume',
            color: '#93c5fd', // Світло-синій (Tailwind blue-300) як на зображенні
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
                    Розподіл цін <span className="font-normal text-[--color-muted]">показує, де знаходиться основна маса ринкових продажів.</span>
                </Typography>
                <button className="text-[--color-accent] text-sm font-medium mt-1 hover:underline">
                    Збільшити графік
                </button>
            </div>

            {/* Кастомна легенда */}
            <div className="flex justify-center items-center mb-4 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                    <div className="w-6 h-3 bg-blue-300 border border-blue-400"></div> Кількість лотів
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
                                id: 'x-axis-ranges',
                                scaleType: 'band', // Для строкових діапазонів
                                data: priceRanges,
                                position: 'bottom',
                            },
                        ]}
                        yAxis={[
                            {
                                id: 'y-axis-volume',
                                scaleType: 'linear',
                                min: 0,
                                max: 40, // Трохи більше за максимум (33)
                                position: 'left',
                            },
                        ]}
                        margin={{ top: 20, right: 20, bottom: 80, left: 60 }} // Великий bottom для повернутих довгих підписів
                    >
                        <ChartsGrid horizontal />

                        <BarPlot />

                        {/* Осі */}
                        <ChartsXAxis
                            tickLabelStyle={{ angle: -30, textAnchor: 'end', fontSize: 11 }}
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
                <p>Пік ринку: <strong>14 967–15 904 €</strong>. Цей діапазон показує, де зосереджена найбільша кількість продажів.</p>
                <p className="text-[--color-muted] mt-1">Цей графік потрібен, щоб швидко побачити найщільнішу зону ринку. Якщо поточна ціна авто знаходиться лівіше основного піку — це потенційно вигідна покупка. Якщо правіше — авто може бути переоцінене.</p>
            </div>

        </Paper>
    );
};