import {
  CheckCircleOutline,
  LockOutlined,
  MouseOutlined,
  PersonAddOutlined,
  Search
} from '@mui/icons-material';
import {
  Alert,
  Autocomplete,
  Box,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { useAutoComplete } from '../../../shared/hooks/useAutoComplete';
import { fetchAuctionsByQuery } from '../../auctions/model/api-auctions';
import type { Auction } from '../../auctions/model/types';
import { fetchUsersByQuery } from '../../auth/model/api-user';
import type { User } from '../../auth/model/user-schema';
import {
  useAddAllowedPath,
  useAddAuctionSelector,
  useAddAuctionUser,
  useAddForbiddenPath,
  useAllowedPaths,
  useForbiddenPaths,
  useForbiddenSelectors,
  useRemoveAllowedPath,
  useRemoveAuctionUser,
  useRemoveForbiddenPath,
  useRemoveForbiddenSelector
} from '../model/useAuctionSettings';

export function AuctionSettings() {
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const auctionsSearch = useAutoComplete<Auction>({
    fetchFn: fetchAuctionsByQuery,
    debounceTime: 400,
  });
  const usersSearch = useAutoComplete<User>({
    fetchFn: fetchUsersByQuery,
    debounceTime: 400,
  });


  const { data: allowedPaths, isLoading: isLoadingPath } = useAllowedPaths(selectedAuction?.id);
  const { data: forbiddenPaths } = useForbiddenPaths(selectedAuction?.id);
  const { data: selectors } = useForbiddenSelectors(selectedAuction?.id);

  // const activeAuction = useMemo(() => {
  //   if (!selectedAuction) return null;
  //   const freshData = auctionsSearch.options.find(a => a.id === selectedAuction.id);
  //   return freshData || selectedAuction;
  // }, [auctionsSearch.options, selectedAuction]);

  // useEffect(() => {
  //   if (selectedAuction && auctionsSearch.options.length > 0) {
  //     const freshData = auctionsSearch.options.find(a => a.id === selectedAuction.id);
  //     if (freshData) {
  //       setSelectedAuction(freshData);
  //     }
  //   }
  // }, [auctionsSearch.options]);
  const addAllowed = useAddAllowedPath();
  const removeAllowed = useRemoveAllowedPath();
  const addForbidden = useAddForbiddenPath();
  const removeForbidden = useRemoveForbiddenPath();
  const addSelector = useAddAuctionSelector();
  const removeSelector = useRemoveForbiddenSelector();
  const addUser = useAddAuctionUser();
  const removeUser = useRemoveAuctionUser();
  return (
    <Stack spacing={3}>
      {/* Селектор аукціону */}
      <Paper sx={{ p: 3, borderRadius: '20px', border: '2px solid', borderColor: 'primary.main' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Search color="primary" />
          <Autocomplete
            fullWidth
            options={auctionsSearch.getFilteredOptions(selectedAuction)}
            loading={auctionsSearch.isLoading}
            onChange={(_, newValue) => setSelectedAuction(newValue)}

            onInputChange={(_, newInputValue) => {
              auctionsSearch.debouncedFetch(newInputValue, selectedAuction);
            }}
            getOptionLabel={(option) => `${option.title} (${option.url})`}
            value={selectedAuction}
            filterOptions={(x) => x}
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

      {!selectedAuction ? (
        <Alert severity="info" sx={{ borderRadius: '15px' }}>
          Оберіть аукціон, щоб отримати доступ до його налаштувань.
        </Alert>
      ) : (
        <Stack spacing={3}>
          <Paper sx={{ p: 3, borderRadius: '20px' }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <PersonAddOutlined color="secondary" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Дозволені користувачі</Typography>
            </Stack>
            <Autocomplete
              multiple
              value={selectedAuction.users || []}

              isOptionEqualToValue={(option, value) => option.id === value.id}
              options={usersSearch.getFilteredOptions(selectedAuction.users || [])}
              loading={usersSearch.isLoading}
              onInputChange={(_, val) => usersSearch.debouncedFetch(val, selectedAuction.users || [])}
              getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.email})`}
              filterOptions={(x) => x}
              onChange={(_, newValue, reason, details) => {
                const lastSelected = newValue[newValue.length - 1];
                if (reason === 'selectOption' && selectedAuction) {
                  if (lastSelected) {
                    const isAlreadyAdded = selectedAuction.users?.some(
                      (u: User) => u.id === lastSelected.id
                    );
                    if (!isAlreadyAdded) {
                      addUser.mutate({
                        id: selectedAuction.id,
                        userId: lastSelected.id
                      });
                    }
                  }
                }
                if (reason === 'removeOption' && details?.option) {
                  const userToRemove = details.option
                  removeUser.mutate({ id: selectedAuction.id, userId: userToRemove.id })

                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Пошук користувача для додавання"
                  placeholder="Введіть email або ім'я..."
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {usersSearch.isLoading ? <CircularProgress size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            {/* Список вже доданих користувачів (чіпи) */}
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selectedAuction.users?.map((user: User) => (
                <Chip
                  key={user.id}
                  label={`${user.firstName} ${user.lastName}`}
                  onDelete={() => {
                    console.log(user.id);
                    removeUser.mutate({ id: selectedAuction.id, userId: user.id })
                  }}
                  color="secondary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Paper>
          {/* Дозволені сторінки */}
          <Paper sx={{ p: 3, borderRadius: '20px' }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <CheckCircleOutline color="success" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Дозволені сторінки</Typography>
            </Stack>
            <Autocomplete
              multiple freeSolo options={[]}
              value={allowedPaths?.map((p: { id: string, path: string }) => p.path) || []}
              onChange={(_, newValue, reason) => {
                if (reason === 'createOption' || reason === 'selectOption') {
                  const val = newValue[newValue.length - 1];
                  addAllowed.mutate({ id: selectedAuction.id, path: val });
                }
              }}

              renderTags={(_, getTagProps) =>
                allowedPaths?.map((item: { id: string, path: string }, index: number) => (
                  <Chip
                    label={item.path}
                    {...getTagProps({ index })}
                    onDelete={() => removeAllowed.mutate({ id: item.id, auctionId: selectedAuction.id })}
                    color="success" variant="outlined" size="small"
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="URL білого списку"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isLoadingPath ? <CircularProgress size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Paper>

          {/* Заборонені переходи */}
          <Paper sx={{ p: 3, borderRadius: '20px' }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <LockOutlined color="error" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Заборонені переходи</Typography>
            </Stack>
            <Autocomplete
              multiple freeSolo options={[]}
              value={forbiddenPaths?.map((p: { id: string, path: string }) => p.path) || []}
              onChange={(_, newValue, reason) => {
                if (reason === 'createOption') {
                  addForbidden.mutate({ id: selectedAuction.id, path: newValue[newValue.length - 1] });
                }
              }}
              renderTags={(_, getTagProps) =>
                forbiddenPaths?.map((item: { id: string, path: string }, index: number) => (
                  <Chip
                    label={item.path}
                    {...getTagProps({ index })}
                    onDelete={() => removeForbidden.mutate({ id: item.id, auctionId: selectedAuction.id })}
                    color="error" variant="outlined" size="small"
                  />
                ))
              }
              renderInput={(params) => <TextField {...params} label="URL для блокування" />}
            />
          </Paper>

          {/* Заборонені дії */}
          <Paper sx={{ p: 3, borderRadius: '20px' }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <MouseOutlined color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Заборонені дії</Typography>
            </Stack>
            <Autocomplete
              multiple freeSolo options={[]}
              value={selectors?.map((s: { id: string, selector: string }) => s.selector) || []}
              onChange={(_, newValue, reason) => {
                if (reason === 'createOption') {
                  addSelector.mutate({ id: selectedAuction.id, selector: newValue[newValue.length - 1] });
                }
              }}
              renderTags={(_, getTagProps) =>
                selectors?.map((item: { id: string, selector: string }, index: number) => (
                  <Chip
                    label={item.selector}
                    {...getTagProps({ index })}
                    onDelete={() => removeSelector.mutate({ id: item.id, auctionId: selectedAuction.id })}
                    variant="filled" size="small"
                  />
                ))
              }
              renderInput={(params) => <TextField {...params} label="ID/Класи елементів" />}
            />
          </Paper>
        </Stack>
      )}
    </Stack>
  );
}