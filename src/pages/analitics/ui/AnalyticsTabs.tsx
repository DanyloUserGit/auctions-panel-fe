import { Box, Paper, Tab, Tabs, Typography } from '@mui/material';
import React from 'react';
import type { CarMarketRow } from '../model/api';
import AnalyticsTable from './AnalyticsTable';
import { GraphAuctionTypes } from './graphs/GraphAuctionsType';
import { GraphCountries } from './graphs/GraphCountries';
import { GraphDaysOfWeek } from './graphs/GraphDaysOfWeak';
import { GraphMileagePrice } from './graphs/GraphMileagePrice';
import { GraphPriceDistribution } from './graphs/GraphPriceDestribution';
import { GraphSalesVolume } from './graphs/GraphSalesVolume';
import { GraphTimePrice } from './graphs/GraphTimePrice';
import { GraphTrendMileage } from './graphs/GraphTrendMileage';
import { GraphTrendTime } from './graphs/GraphTrendTime';

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

// Розширюємо інтерфейс пропсів
interface AnalyticsTabsProps {
  activeTab: number;
  handleTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  pricesList: CarMarketRow[];
  targetVin: string;
  targetCar: {
    chassis: string;
    price: number;
    mileage: number;
    brand_name: string;
    model_name: string;
  };
  vinSales: CarMarketRow[];
}

// Функція генерує таби і прокидає відповідні пропси у кожен графік
const getAnalyticsTabs = (
  pricesList: CarMarketRow[],
  targetVin: string,
  targetCar: AnalyticsTabsProps['targetCar'],
  vinSales: CarMarketRow[]
) => [
    {
      id: 'table',
      label: 'Таблиця',
      component: <AnalyticsTable rows={pricesList} targetVin={targetVin} />,
    },
    {
      id: 'time',
      label: 'Графік: час → ціна',
      component: <GraphTimePrice data={pricesList} targetPrice={targetCar?.price} />,
    },
    {
      id: 'mileage',
      label: 'Графік: пробіг → ціна',
      component: <GraphMileagePrice data={pricesList} targetCar={targetCar} />,
    },
    {
      id: 'trend_time',
      label: 'Графік: тренд (час)',
      component: <GraphTrendTime data={pricesList} vinSales={vinSales} targetCar={targetCar} />,
    },
    {
      id: 'trend_mileage',
      label: 'Графік: тренд (пробіг)',
      component: <GraphTrendMileage data={pricesList} targetCar={targetCar} />,
    },
    {
      id: 'weekday',
      label: 'Графік: дні тижня',
      component: <GraphDaysOfWeek data={pricesList} />,
    },
    {
      id: 'volume',
      label: 'Графік: об’єм продажів',
      component: <GraphSalesVolume data={pricesList} />,
    },
    {
      id: 'distribution',
      label: 'Розподіл цін',
      component: <GraphPriceDistribution data={pricesList} />,
    },
    {
      id: 'countries',
      label: 'Країни',
      component: <GraphCountries data={pricesList} />,
    },
    {
      id: 'auctions',
      label: 'Аукціони',
      component: <GraphAuctionTypes data={pricesList} />,
    },
  ];

const AnalyticsTabs = ({
  activeTab = 0,
  handleTabChange,
  pricesList,
  targetVin,
  targetCar,
  vinSales,
}: AnalyticsTabsProps) => {
  const tabs = getAnalyticsTabs(pricesList, targetVin, targetCar, vinSales);

  return (
    <Paper sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: 'none' }}>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          bgcolor: '#f1f5f9',
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTab-root': { minHeight: 50, fontWeight: 600, textTransform: 'none' },
        }}
      >
        {tabs.map((tab, index) => (
          <Tab key={tab.id} label={tab.label} value={index} />
        ))}
      </Tabs>

      <Box sx={{ p: { xs: 2, md: 4 }, minHeight: 500, bgcolor: 'white' }}>
        {tabs[activeTab]?.component || (
          <Box sx={chartPlaceholderStyle}>
            <Typography color="textSecondary">В розробці</Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default AnalyticsTabs;