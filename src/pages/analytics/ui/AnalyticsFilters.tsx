import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  type SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { COUNTRY_MAP } from '../model/countries';

const DEFAULT_AUCTION_TYPES = [0, 1, 2, 3]; 

interface AnalyticsFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onlyCheaper: boolean;
  setOnlyCheaper: (val: boolean) => void;
  selectedCountries: number[];
  setSelectedCountries: (val: number[]) => void;
  selectedAuctionTypes: number[];
  setSelectedAuctionTypes: (val: number[]) => void;
  onResetFilters: () => void;
  activeFiltersCount: number;
  availableCountries?: number[];
  availableAuctionTypes?: number[];
}

// const FilterLabel = ({ text }: { text: string }) => (
//   <Typography variant="caption" color="text.secondary" fontWeight="600" sx={{ mb: 0.5, display: 'block' }}>
//     {text}
//   </Typography>
// );

const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  onlyCheaper,
  setOnlyCheaper,
  selectedCountries,
  setSelectedCountries,
  selectedAuctionTypes,
  setSelectedAuctionTypes,
  onResetFilters,
  activeFiltersCount,
  availableCountries,
  availableAuctionTypes,
}) => {
  const handleCountryChange = (event: SelectChangeEvent<number[]>) => {
    setSelectedCountries(event.target.value as number[]);
  };

  const handleAuctionChange = (event: SelectChangeEvent<number[]>) => {
    setSelectedAuctionTypes(event.target.value as number[]);
  };

  const countriesToRender = availableCountries?.length ? availableCountries : Object.keys(COUNTRY_MAP).map(Number);
  const auctionsToRender = availableAuctionTypes?.length ? availableAuctionTypes : DEFAULT_AUCTION_TYPES;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Фільтри та пошук
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2, border: '1px solid #e5e7eb', boxShadow: 'none' }}>
        {activeFiltersCount > 0 ? (
          <Alert severity="info" sx={{ borderRadius: 2, py: 0, fontSize: '13px' }}>
            Активно фільтрів: {activeFiltersCount}. Відображаються відфільтровані дані.
          </Alert>
        ) : (
          <Alert severity="success" sx={{ borderRadius: 2, py: 0, fontSize: '13px' }}>
            Відображаються всі доступні дані для цього авто.
          </Alert>
        )}
      </Paper>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
        <Button
          size="small"
          variant="outlined"
          onClick={onResetFilters}
          disabled={activeFiltersCount === 0}
          sx={{ borderRadius: 2, color: 'text.primary', borderColor: '#e5e7eb', px: 3, height: '40px' }}
        >
          Скинути
        </Button>

        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={onlyCheaper}
              onChange={(e) => setOnlyCheaper(e.target.checked)}
            />
          }
          label={<Typography variant="body2" fontWeight="600">тільки дешевше поточного</Typography>}
        />

        <TextField
          size="small"
          placeholder="Пошук по VIN / характеристиці..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} fontSize="small" />
            ),
          }}
        />

        <Stack direction="row" spacing={2} sx={{ minWidth: { xs: '100%', md: '400px' } }}>
          <Box flex={1}>
            <FormControl fullWidth size="small">
              <InputLabel>Країна</InputLabel>
              <Select
                multiple
                value={selectedCountries}
                onChange={handleCountryChange}
                input={<OutlinedInput label="Країна" sx={{ borderRadius: 2 }} />}
              >
                {countriesToRender.map((id) => (
                  <MenuItem key={id} value={id}>
                    {COUNTRY_MAP[id] || `Країна ID: ${id}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box flex={1}>
            <FormControl fullWidth size="small">
              <InputLabel>Тип аукціону</InputLabel>
              <Select
                multiple
                value={selectedAuctionTypes}
                onChange={handleAuctionChange}
                input={<OutlinedInput label="Тип аукціону" sx={{ borderRadius: 2 }} />}
              >
                {auctionsToRender.map((type) => (
                  <MenuItem key={type} value={type}>
                    Тип: {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AnalyticsFilters;