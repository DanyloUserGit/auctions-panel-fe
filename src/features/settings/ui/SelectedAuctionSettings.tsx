import { CheckCircleOutline, LockOutlined, MouseOutlined, PersonAddOutlined } from '@mui/icons-material';
import { Autocomplete, Box, Chip, CircularProgress, Paper, Stack, TextField, Typography } from '@mui/material';
import { useAutoCompleteWithQuery } from '../../../shared/hooks/useAutoCompleteWithQuery';
import { Loader } from '../../../shared/ui/Loader';
import { useAuction } from '../../auctions/model/useAuctions';
import { fetchUsersByQuery } from '../../auth/model/api-user';
import { authKeys } from '../../auth/model/useAuth';
import type { User } from '../../auth/model/user-schema';
import { useAddAllowedPath, useAddAuctionSelector, useAddAuctionUser, useAddForbiddenPath, useAllowedPaths, useForbiddenPaths, useForbiddenSelectors, useRemoveAllowedPath, useRemoveAuctionUser, useRemoveForbiddenPath, useRemoveForbiddenSelector } from '../model/useAuctionSettings';
import type { Path, Selector } from '../model/types';

export default function SelectedAuctionSettings({ selectedAuction }: { selectedAuction: string }) {
    const usersSearch = useAutoCompleteWithQuery<User>({
        fetchFn: fetchUsersByQuery,
        queryKey: authKeys.users,
        debounceTime: 400,
    });


    const { data: allowedPaths, isLoading: isLoadingPath } = useAllowedPaths(selectedAuction);
    const { data: forbiddenPaths } = useForbiddenPaths(selectedAuction);
    const { data: selectors } = useForbiddenSelectors(selectedAuction);
    const { data: auction, isLoading } = useAuction(selectedAuction)


    const addAllowed = useAddAllowedPath();
    const removeAllowed = useRemoveAllowedPath();
    const addForbidden = useAddForbiddenPath();
    const removeForbidden = useRemoveForbiddenPath();
    const addSelector = useAddAuctionSelector();
    const removeSelector = useRemoveForbiddenSelector();
    const addUser = useAddAuctionUser();
    const removeUser = useRemoveAuctionUser();
    if (isLoading || !auction) return <Loader />
    return (

        <Stack spacing={3} key={selectedAuction}>
            <Paper sx={{ p: 3, borderRadius: '20px' }}>
                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 2 }}
                >
                    <PersonAddOutlined color="secondary" />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Дозволені користувачі
                    </Typography>
                </Stack>
                <Autocomplete
                    multiple
                    value={[]}
                    options={usersSearch.getFilteredOptions(auction.users || [])}
                    loading={usersSearch.isLoading}
                    onInputChange={(_, val) => usersSearch.onInputChange(val)}
                    getOptionLabel={(o) => `${o.firstName} ${o.lastName} (${o.email})`}
                    filterOptions={(x) => x}
                    onChange={(_, newValue, reason) => {
                        if (reason === 'selectOption') {
                            const lastSelected = newValue[newValue.length - 1];
                            if (lastSelected) {
                                addUser.mutate({ id: auction.id, userId: lastSelected.id });
                            }
                        }
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Пошук користувачів"
                            placeholder="Введіть ім'я або email..."
                        />
                    )}
                />
                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {auction?.users?.map((user: User) => (
                        <Chip
                            key={user.id}
                            label={`${user.firstName} ${user.lastName}`}
                            onDelete={() => removeUser.mutate({ id: auction.id, userId: user.id })}
                            color="secondary"
                            variant="outlined"
                        />
                    ))}
                </Box>
            </Paper>
            {/* Дозволені сторінки */}
            <Paper sx={{ p: 3, borderRadius: '20px' }}>
                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 2 }}
                >
                    <CheckCircleOutline color="success" />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Дозволені сторінки
                    </Typography>
                </Stack>
                <Autocomplete
                    multiple
                    freeSolo
                    options={[]}
                    value={allowedPaths?.map((p: Path) => p.path) || []}
                    onChange={(_, newValue, reason) => {
                        if (reason === 'createOption' || reason === 'selectOption') {
                            const val = newValue[newValue.length - 1];
                            addAllowed.mutate({ id: auction.id, path: val });
                        }
                    }}
                    renderTags={(value, getTagProps) =>
                        value.map((path: string, index: number) => {
                            const { key, ...tagProps } = getTagProps({ index });
                            const item = allowedPaths?.find((p: Path) => p.path === path);

                            return (
                                <Chip
                                    key={key}
                                    label={path}
                                    {...tagProps}
                                    onDelete={() =>
                                        item && removeAllowed.mutate({
                                            id: item.id,
                                            auctionId: auction.id,
                                        })
                                    }
                                    color="success"
                                    variant="outlined"
                                    size="small"
                                />
                            );
                        })
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
                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 2 }}
                >
                    <LockOutlined color="error" />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Заборонені переходи
                    </Typography>
                </Stack>
                <Autocomplete
                    multiple
                    freeSolo
                    options={[]}
                    value={forbiddenPaths?.map((p: Path) => p.path) || []}
                    onChange={(_, newValue, reason) => {
                        if (reason === 'createOption' || reason === 'selectOption') {
                            const val = newValue[newValue.length - 1];
                            if (val) {
                                addForbidden.mutate({
                                    id: auction.id,
                                    path: val,
                                });
                            }
                        }
                    }}
                    renderTags={(value, getTagProps) =>
                        value.map((path: string, index: number) => {
                            // Витягуємо key окремо від інших пропсів
                            const { key, ...tagProps } = getTagProps({ index });
                            const item = forbiddenPaths?.find((p: Path) => p.path === path);

                            return (
                                <Chip
                                    key={key} // Передаємо key явно
                                    label={path}
                                    {...tagProps}
                                    onDelete={() =>
                                        item && removeForbidden.mutate({
                                            id: item.id,
                                            auctionId: auction.id,
                                        })
                                    }
                                    color="error"
                                    variant="outlined"
                                    size="small"
                                />
                            );
                        })
                    }
                    renderInput={(params) => (
                        <TextField {...params} label="URL для блокування" />
                    )}
                />
            </Paper>

            {/* Заборонені дії */}
            <Paper sx={{ p: 3, borderRadius: '20px' }}>
                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 2 }}
                >
                    <MouseOutlined color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Заборонені дії
                    </Typography>
                </Stack>
                <Autocomplete
                    multiple
                    freeSolo
                    options={[]}
                    value={selectors?.map((s: Selector) => s.selector) || []}
                    onChange={(_, newValue, reason) => {
                        if (reason === 'createOption' || reason === 'selectOption') {
                            const val = newValue[newValue.length - 1];
                            if (val) {
                                addSelector.mutate({
                                    id: auction.id,
                                    selector: val,
                                });
                            }
                        }
                    }}
                    renderTags={(value, getTagProps) =>
                        value.map((selector: string, index: number) => {
                            // Витягуємо key окремо
                            const { key, ...tagProps } = getTagProps({ index });
                            const item = selectors?.find((s: Selector) => s.selector === selector);

                            return (
                                <Chip
                                    key={key}
                                    label={selector}
                                    {...tagProps}
                                    onDelete={() =>
                                        item && removeSelector.mutate({
                                            id: item.id,
                                            auctionId: auction.id,
                                        })
                                    }
                                    variant="filled"
                                    size="small"
                                />
                            );
                        })
                    }
                    renderInput={(params) => (
                        <TextField {...params} label="ID/Класи елементів" />
                    )}
                />
            </Paper>
        </Stack>
    )
    return <div>{selectedAuction}</div>
}
