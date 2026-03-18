import { Search } from '@mui/icons-material';
import { Autocomplete, CircularProgress, Paper, Stack, TextField } from '@mui/material';
import { useAutoCompleteWithQuery } from '../../../shared/hooks/useAutoCompleteWithQuery';
import { fetchAuctionsById, fetchAuctionsByQuery } from '../../auctions/model/api-auctions';
import type { Auction } from '../../auctions/model/types';
import { useAuction } from '../../auctions/model/useAuctions';
interface Props {
    selectedAuction: string | "",
    setSelectedAuction: (auction: string | "") => void
}
export default function SelectAuction({ selectedAuction, setSelectedAuction }: Props) {
    const auctionsSearch = useAutoCompleteWithQuery<Auction>({
        queryKey: ['search'],
        fetchFn: fetchAuctionsByQuery,
    });
    const { data: auction } = useAuction(selectedAuction)
    const handleChange = async (data: Auction) => {
        if (!data) return
        console.log(data)
        const auction = await fetchAuctionsById(data.id)
        console.log(auction)
        setSelectedAuction(auction.id)
    }
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
                    options={auctionsSearch.getFilteredOptions(auction)}
                    loading={auctionsSearch.isLoading}
                    value={auction}
                    onChange={(_, newValue, reason) => {
                        if (reason === 'selectOption') handleChange(newValue)
                        else if (reason === 'removeOption') setSelectedAuction('')
                    }
                    }

                    onInputChange={(_, val) => auctionsSearch.onInputChange(val)}
                    getOptionLabel={(option) => `${option.title} (${option.url})`}
                    filterOptions={(x) => x}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
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
                                        {auctionsSearch.isLoading ? <CircularProgress size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                            }}
                        />
                    )}
                />
            </Stack>
        </Paper>
    )
}
