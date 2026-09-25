import {
  CheckCircleOutline,
  LockOutlined,
  MouseOutlined,
} from '@mui/icons-material';
import {
  Alert,
  Autocomplete,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Loader } from '../../../../shared/ui/Loader';
import { getErrorMessage } from '../../../../shared/utils';
import { useAuction } from '../../../auctions/model/useAuctions';
import type { Path, Selector } from '../../model/types';
import {
  useAllowedPaths,
  useForbiddenPaths,
  useForbiddenSelectors,
  useAddAllowedPath,
  useRemoveAllowedPath,
  useAddForbiddenPath,
  useRemoveForbiddenPath,
  useAddAuctionSelector,
  useRemoveForbiddenSelector,
} from '../../model/useAuctionSettings';

export default function SelectedAuctionSettings({
  selectedAuction,
}: {
  selectedAuction: string;
}) {
  const { data: allowedPaths, isLoading: isLoadingPath } =
    useAllowedPaths(selectedAuction);
  const { data: forbiddenPaths } = useForbiddenPaths(selectedAuction);
  const { data: selectors } = useForbiddenSelectors(selectedAuction);
  const { data: auction, isLoading } = useAuction(selectedAuction);

  const addAllowed = useAddAllowedPath();
  const removeAllowed = useRemoveAllowedPath();
  const addForbidden = useAddForbiddenPath();
  const removeForbidden = useRemoveForbiddenPath();
  const addSelector = useAddAuctionSelector();
  const removeSelector = useRemoveForbiddenSelector();
  if (isLoading || !auction) return <Loader />;
  return (
    <Stack spacing={3} key={selectedAuction}>
      <Paper sx={{ p: 3, borderRadius: '20px' }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
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
                    item &&
                    removeAllowed.mutate({
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

      <Paper sx={{ p: 3, borderRadius: '20px' }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
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
              const { key, ...tagProps } = getTagProps({ index });
              const item = forbiddenPaths?.find((p: Path) => p.path === path);

              return (
                <Chip
                  key={key}
                  label={path}
                  {...tagProps}
                  onDelete={() =>
                    item &&
                    removeForbidden.mutate({
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
            <TextField
              {...params}
              label="Адреса, шлях або шаблон для блокування"
              helperText="Повна адреса (https://site.com/orders/ - сторінка й усе нижче), шлях (/orders/ - на будь-якій сторінці сайту) або шаблон з * (*/orders/*). Enter - додати."
            />
          )}
        />
        {addForbidden.isError && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {getErrorMessage(addForbidden.error, 'Не вдалося додати правило')}
          </Alert>
        )}
      </Paper>

      <Paper sx={{ p: 3, borderRadius: '20px' }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
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
              const { key, ...tagProps } = getTagProps({ index });
              const item = selectors?.find(
                (s: Selector) => s.selector === selector,
              );

              return (
                <Chip
                  key={key}
                  label={selector}
                  {...tagProps}
                  onDelete={() =>
                    item &&
                    removeSelector.mutate({
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
  );
  return <div>{selectedAuction}</div>;
}
