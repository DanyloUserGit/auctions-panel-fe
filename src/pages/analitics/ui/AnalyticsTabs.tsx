import React from 'react';
import { Box, Paper, Tab, Tabs, Typography } from '@mui/material';
import AnalyticsTable from './AnalyticsTable';
import { GraphMileagePrice } from './graphs/GraphMileagePrice';
import { GraphTimePrice } from './graphs/GraphTimePrice';
import { GraphTrendTime } from './graphs/GraphTrendTime';
import { GraphTrendMileage } from './graphs/GraphTrendMileage';
import { GraphDaysOfWeek } from './graphs/GraphDaysOfWeak';
import { GraphSalesVolume } from './graphs/GraphSalesVolume';
import { GraphPriceDistribution } from './graphs/GraphPriceDestribution';
import { GraphAuctionTypes } from './graphs/GraphAuctionsType';
import { GraphCountries } from './graphs/GraphCountries';

// 1. Виносимо стилі за межі компонента
const chartPlaceholderStyle = {
  height: 450,
  width: '100%',
  bgcolor: '#f8fafc',
  borderRadius: 4,
  border: '2px dashed #cbd5e1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

// 2. Об'єкт табів (компоненти-заглушки для наочності)
const ANALYTICS_TABS = [
  { id: 'table', label: 'Таблиця', component: <AnalyticsTable /> },
  { id: 'time', label: 'Графік: час → ціна', component: <GraphTimePrice /> },
  {
    id: 'mileage',
    label: 'Графік: пробіг → ціна',
    component: <GraphMileagePrice />,
  },
  {
    id: 'trend_time',
    label: 'Графік: тренд (час)',
    component: <GraphTrendTime />,
  },
  {
    id: 'trend_mileage',
    label: 'Графік: тренд (пробіг)',
    component: <GraphTrendMileage />,
  },
  { id: 'weekday', label: 'Графік: дні тижня', component: <GraphDaysOfWeek /> },
  {
    id: 'volume',
    label: 'Графік: об’єм продажів',
    component: <GraphSalesVolume />,
  },
  {
    id: 'distribution',
    label: 'Розподіл цін',
    component: <GraphPriceDistribution />,
  },
  { id: 'countries', label: 'Країни', component: <GraphCountries /> },
  { id: 'auctions', label: 'Аукціони', component: <GraphAuctionTypes /> },
];

interface AnalyticsTabsProps {
  activeTab: number;
  handleTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const AnalyticsTabs = ({
  activeTab = 0,
  handleTabChange,
}: AnalyticsTabsProps) => {
  return (
    <Paper
      sx={{
        borderRadius: 4,
        overflow: 'hidden',
        border: '1px solid #e5e7eb',
        boxShadow: 'none',
      }}
    >
      <Tabs
        value={activeTab} // Тут має бути число
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          bgcolor: '#f1f5f9',
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTab-root': {
            minHeight: 50,
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '14px',
            color: '#64748b',
          },
          '& .Mui-selected': {
            color: '#1e40af !important',
            bgcolor: 'white',
          },
        }}
      >
        {ANALYTICS_TABS.map((tab, index) => (
          <Tab
            key={tab.id}
            label={tab.label}
            value={index} // Вказуємо індекс як значення
            iconPosition="start"
          />
        ))}
      </Tabs>

      <Box sx={{ p: { xs: 2, md: 4 }, minHeight: 500, bgcolor: 'white' }}>
        {/* Рендеримо компонент за індексом */}
        {ANALYTICS_TABS[activeTab]?.component || (
          <Box sx={chartPlaceholderStyle}>
            <Typography color="textSecondary">В розробці</Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default AnalyticsTabs;
