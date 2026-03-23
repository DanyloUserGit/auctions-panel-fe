import { Search } from '@mui/icons-material';
import {
  Autocomplete,
  CircularProgress,
  Paper,
  Stack,
  TextField,
} from '@mui/material';
import { useAutoCompleteWithQuery } from '../../../../shared/hooks/useAutoCompleteWithQuery';
import { fetchAuctionsByQuery, fetchAuctionsById } from '../../../auctions/model/api-auctions';
import type { Auction } from '../../../auctions/model/types';
import { useAuction } from '../../../auctions/model/useAuctions';

interface Props {
  selectedAuction: string;
  setSelectedAuction: (id: string) => void;
}

export default function SelectAuction({
  selectedAuction,
  setSelectedAuction,
}: Props) {
  const auctionsSearch = useAutoCompleteWithQuery<Auction>({
    queryKey: ['search'],
    fetchFn: fetchAuctionsByQuery,
  });

  const { data: auction } = useAuction(selectedAuction);

  const handleChange = async (data: Auction | null) => {
    if (!data) {
      setSelectedAuction('');
      return;
    }

    try {
      const fullAuction = await fetchAuctionsById(data.id);
      setSelectedAuction(fullAuction.id);
    } catch (error) {
      console.error('Failed to fetch auction details:', error);
    }
  };

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: '20px',
        border: '2px solid',
        borderColor: 'primary.main',
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Search color="primary" />
        <Autocomplete
          fullWidth
          forcePopupIcon={false}
          options={auctionsSearch.getFilteredOptions(auction ?? null)}
          loading={auctionsSearch.isLoading}
          value={auction ?? null}
          onChange={(_, newValue) => {
            handleChange(newValue);
          }}
          onInputChange={(_, val) => auctionsSearch.onInputChange(val)}
          getOptionLabel={(option) => `${option.title} (${option.url})`}
          filterOptions={(x) => x}
          // 5. Додано перевірку на наявність об'єктів перед порівнянням id
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Виберіть аукціон"
              variant="standard"
              placeholder="Введіть назву для пошуку..."
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {auctionsSearch.isLoading ? (
                      <CircularProgress size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      </Stack>
    </Paper>
  );
}
