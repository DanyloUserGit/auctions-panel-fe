import SearchIcon from '@mui/icons-material/Search';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useAnalyticsData } from '../model/useData';
import AnalyticsFilters, { COUNTRY_MAP } from './AnalyticsFilters';
import AnalyticsTabs from './AnalyticsTabs';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AnalyticsPage = () => {
  const [vinInput, setVinInput] = useState('');
  const [searchVin, setSearchVin] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [onlyCheaper, setOnlyCheaper] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState<number[]>([]);
  const [selectedAuctionTypes, setSelectedAuctionTypes] = useState<number[]>([]);

  const navigate = useNavigate();

  const { data, isLoading, error } = useAnalyticsData(
    searchVin || '',
    'caddylc2_caddycombca'
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setOnlyCheaper(false);
    setSelectedCountries([]);
    setSelectedAuctionTypes([]);
  };

  const handleSearch = () => {
    if (vinInput.trim()) {
      setSearchVin(vinInput.trim());
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // 1. Агрегація статистики по аукціонах на фронті
  const auctionTypesStats = useMemo(() => {
    if (!data?.pricesList) return [];
    const stats: Record<number, { count: number; sum: number }> = {};

    data.pricesList.forEach((car: any) => {
      if (car.price > 0) {
        const type = car.auction_type || 0;
        if (!stats[type]) stats[type] = { count: 0, sum: 0 };
        stats[type].count += 1;
        stats[type].sum += car.price;
      }
    });

    return Object.entries(stats).map(([type, val]) => ({
      auction_type: Number(type),
      total_cars: val.count,
      avg_price: Math.round(val.sum / val.count)
    })).sort((a, b) => b.total_cars - a.total_cars);
  }, [data]);

  // 2. Агрегація статистики по країнах на фронті
  const countriesStats = useMemo(() => {
    if (!data?.pricesList) return [];
    const stats: Record<number, { count: number; sum: number }> = {};

    data.pricesList.forEach((car: any) => {
      if (car.price > 0 && car.country_id) {
        const cid = car.country_id;
        if (!stats[cid]) stats[cid] = { count: 0, sum: 0 };
        stats[cid].count += 1;
        stats[cid].sum += car.price;
      }
    });

    return Object.entries(stats).map(([cid, val]) => ({
      country_id: Number(cid),
      country_name: COUNTRY_MAP[Number(cid)] || `ID Країни: ${cid}`,
      total_cars: val.count,
      avg_price: Math.round(val.sum / val.count)
    })).sort((a, b) => b.total_cars - a.total_cars);
  }, [data]);

  // 3. Фільтрація списку для таблиці
  const filteredPricesList = useMemo(() => {
    if (!data?.pricesList) return [];
    return data.pricesList.filter((item: any) => {
      if (onlyCheaper && item.price >= data.targetCar.price) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchVin = item.chassis?.toLowerCase().includes(query);
        const matchChars = item.characteristics?.toLowerCase().includes(query);
        if (!matchVin && !matchChars) return false;
      }
      if (selectedCountries.length > 0 && !selectedCountries.includes(item.country_id)) return false;
      if (selectedAuctionTypes.length > 0 && !selectedAuctionTypes.includes(item.auction_type)) return false;
      return true;
    });
  }, [data, onlyCheaper, searchQuery, selectedCountries, selectedAuctionTypes]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Аналітика
        </Typography>
      </Box>
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <TextField
            fullWidth
            label="Введіть VIN-код"
            variant="outlined"
            value={vinInput}
            onChange={(e) => setVinInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            size="large"
            onClick={handleSearch}
            disabled={isLoading || !vinInput.trim()}
            sx={{ minWidth: '150px', height: '56px' }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Пошук'}
          </Button>
        </Stack>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

      {data && (
        <Stack spacing={4}>
          <Paper sx={{ p: 3, borderRadius: 2, borderLeft: '4px solid #1976d2' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 8 }}>
                <Typography variant="h5" fontWeight="bold">
                  {data.targetCar.brand_name} {data.targetCar.model_name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  VIN: {data.targetCar.chassis}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: { md: 'right' } }}>
                <Typography variant="h4" color="success.main" fontWeight="bold">
                  ${data.targetCar.price.toLocaleString('uk-UA')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Пробіг: {data.targetCar.mileage.toLocaleString('uk-UA')} км
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Grid container spacing={3}>
            {/* Статистика по аукціонах */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Статистика за типами аукціонів
                </Typography>
                {auctionTypesStats.length > 0 ? (
                  <Stack spacing={2}>
                    {auctionTypesStats.map((auction: any, idx: number) => (
                      <Box key={idx} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'grey.200' }}>
                        <Typography variant="subtitle1" fontWeight="bold" color="primary">
                          Тип аукціону: {auction.auction_type}
                        </Typography>
                        <Stack direction="row" justifyContent="space-between" mt={1}>
                          <Typography variant="body2" color="text.secondary">Кількість авто:</Typography>
                          <Typography variant="body2" fontWeight="bold">{auction.total_cars} шт.</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">Сер. ціна:</Typography>
                          <Typography variant="body2" color="success.main" fontWeight="bold">
                            ${auction.avg_price.toLocaleString('uk-UA')}
                          </Typography>
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">Дані відсутні</Typography>
                )}
              </Paper>
            </Grid>

            {/* Статистика по країнах */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Розподіл за країнами
                </Typography>
                {countriesStats.length > 0 ? (
                  <Grid container spacing={2}>
                    {countriesStats.map((country: any, idx: number) => (
                      <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'grey.200', height: '100%' }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {country.country_name}
                          </Typography>
                          <Stack direction="row" justifyContent="space-between" mt={1}>
                            <Typography variant="body2" color="text.secondary">Кількість:</Typography>
                            <Typography variant="body2" fontWeight="bold">{country.total_cars}</Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">Сер. ціна:</Typography>
                            <Typography variant="body2" color="success.main" fontWeight="bold">
                              ${country.avg_price.toLocaleString('uk-UA')}
                            </Typography>
                          </Stack>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body2" color="text.secondary">Дані відсутні</Typography>
                )}
              </Paper>
            </Grid>
          </Grid>

          {/* ФІЛЬТРИ */}
          <AnalyticsFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onlyCheaper={onlyCheaper}
            setOnlyCheaper={setOnlyCheaper}
            selectedCountries={selectedCountries}
            setSelectedCountries={setSelectedCountries}
            selectedAuctionTypes={selectedAuctionTypes}
            setSelectedAuctionTypes={setSelectedAuctionTypes}
            onResetFilters={handleResetFilters}
            activeFiltersCount={
              (onlyCheaper ? 1 : 0) +
              (searchQuery ? 1 : 0) +
              selectedCountries.length +
              selectedAuctionTypes.length
            }
            // Передаємо динамічні списки доступних опцій!
            availableCountries={countriesStats.map(c => c.country_id)}
            availableAuctionTypes={auctionTypesStats.map(a => a.auction_type)}
          />

          <AnalyticsTabs
            activeTab={activeTab}
            handleTabChange={handleTabChange}
            pricesList={filteredPricesList}
            targetVin={data.targetCar.chassis}
            targetCar={data.targetCar}
            vinSales={data.vinSales}
          />
        </Stack>
      )}
    </Container>
  );
};

export default AnalyticsPage;