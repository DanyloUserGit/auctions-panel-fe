import {
  Autocomplete,
  Box,
  Chip,
  Divider,
  FormControlLabel,
  Paper,
  Slider,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useAutoComplete } from '../../../../shared/hooks/useAutoComplete';
import { useAutoCompleteWithQuery } from '../../../../shared/hooks/useAutoCompleteWithQuery';
import { fetchAuctionsByQuery } from '../../../auctions/model/api-auctions';
import type { Auction } from '../../../auctions/model/types';
import { fetchUsersByQuery } from '../../../auth/model/api-user';
import { authKeys } from '../../../auth/model/useAuth';
import type { User } from '../../../auth/model/user-schema';
import { Can } from '../../../auth/ui/Can';
import { useGroupById, useEditGroup } from '../../../groups/model/useGroups';
import { useAddAuctionToGroup, useRemoveAuctionFromGroup, useRevokeAccountAccess, useGrantAccountAccess } from '../../model/useGroupSettigs';



interface Props {
  groupId: string;
}

export default function SelectedGroupSettings({ groupId }: Props) {
  const [showAccounts, setShowAccounts] = useState(true);
  const [canGaManageAccounts, setCanGaManageAccounts] = useState(false);

  const { data, isLoading } = useGroupById(groupId);
  const group = data?.[0] || null;

  const auctionsSearch = useAutoComplete<Auction>({
    fetchFn: fetchAuctionsByQuery,
  });

  const usersSearch = useAutoCompleteWithQuery<User>({
    fetchFn: fetchUsersByQuery,
    queryKey: authKeys.users,
    debounceTime: 400,
  });

  useEffect(() => {
    if (group?.auctions) {
      auctionsSearch.setOptions(group.auctions);
    }
  }, [group?.id]);

  const { mutate: updateGroup } = useEditGroup();
  const { mutate: addAuction } = useAddAuctionToGroup(groupId);
  const { mutate: removeAuction } = useRemoveAuctionFromGroup(groupId);
  const { mutate: revokeAccount } = useRevokeAccountAccess(groupId);
  const { mutate: addAccount } = useGrantAccountAccess(groupId);

  if (isLoading)
    return (
      <Typography sx={{ p: 3 }}>Завантаження налаштувань групи...</Typography>
    );
  if (!group) return <Typography sx={{ p: 3 }}>Групу не знайдено</Typography>;

  return (
    <Stack spacing={3}>
      <Typography variant="h5" sx={{ fontWeight: 800, px: 1 }}>
        Налаштування групи: {group.title}
      </Typography>

      {/* 1. ЛІМІТИ СЕСІЙ */}
      <Paper sx={{ p: 3, borderRadius: '20px' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          Ліміти активних сесій
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Максимальна кількість одночасних WebRTC з'єднань для всієї групи.
        </Typography>
        <Box sx={{ px: 2 }}>
          <Slider
            key={group.sessionLimit} // Важливо для оновлення початкового значення
            defaultValue={group.sessionLimit || 1}
            onChangeCommitted={(_, value) => {
              updateGroup({
                id: group.id,
                group: { sessionLimit: value as number },
              });
            }}
            step={1}
            marks
            min={1}
            max={50}
            valueLabelDisplay="auto"
          />
        </Box>
      </Paper>

      {/* 2. ДОСТУПНІ АУКЦІОНИ */}
      <Paper sx={{ p: 3, borderRadius: '20px' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Доступні аукціони групи
        </Typography>
        <Autocomplete
          multiple
          // ВАЖЛИВО: options повинні містити те, що є у value + те, що знайшли
          options={auctionsSearch.options || []}
          value={group?.auctions}
          loading={auctionsSearch.isLoading}
          // НЕ передаємо group.auctions у debouncedFetch, щоб не було конфліктів фільтрації
          onInputChange={(_, val) => auctionsSearch.debouncedFetch(val, null)}
          getOptionLabel={(o) => o.title || ''}
          isOptionEqualToValue={(o, v) => o.id === v.id}
          onChange={(_, __, reason, details) => {
            if (reason === 'selectOption' && details?.option) {
              addAuction({ auctionId: details.option.id });
            }
            if (reason === 'removeOption' && details?.option) {
              removeAuction({ auctionId: details.option.id });
            }
          }}
          renderInput={(params) => <TextField {...params} label="Аукціони" />}
        />
      </Paper>

      {/* 3. ПРАВИЛА ТА ПРАВА */}
      <Paper sx={{ p: 3, borderRadius: '20px' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Правила та права керування
        </Typography>
        <Stack spacing={2}>
          <Can roles={['SuperAdmin']}>
            <Box
              sx={{
                p: 2,
                bgcolor: 'action.hover',
                borderRadius: '12px',
                mb: 1,
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={canGaManageAccounts}
                    onChange={() => {
                      setCanGaManageAccounts(!canGaManageAccounts);
                      updateGroup({
                        id: groupId,
                        group: { canGaManageAccounts: canGaManageAccounts },
                      });
                    }}
                    color="secondary"
                    value={group.canGaManageAccounts}
                  />
                }
                label={
                  <strong>Дозволити GA керувати акаунтами аукціонів</strong>
                }
              />
              <Typography
                variant="caption"
                display="block"
                color="text.secondary"
                sx={{ ml: 4 }}
              >
                * Визначає, чи зможе адміністратор групи самостійно
                додавати/видаляти логіни.
              </Typography>
            </Box>
          </Can>

          <Stack spacing={1}>
            <FormControlLabel
              control={
                <Switch
                  checked={showAccounts}
                  onChange={(e) => setShowAccounts(e.target.checked)}
                />
              }
              label="Відображати список акаунтів для учасників"
            />
            {/* <FormControlLabel
              control={<Switch defaultChecked color="error" />}
              label="Заборонити зміну конфігурації термінала"
            /> */}
          </Stack>
        </Stack>
      </Paper>

      {/* 4. СПИСОК ДОСТУПНИХ АКАУНТІВ */}
      {showAccounts && (
        <Paper
          sx={{
            p: 3,
            borderRadius: '20px',
            borderLeft: '6px solid',
            borderColor: 'primary.main',
          }}
        >
          <Box
            sx={{
              mb: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Акаунти аукціонів
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Кому доступні: всі учасники групи {group.title}
              </Typography>
            </Box>
            <Chip
              label={`${group.accounts?.length || 0} активних`}
              color="primary"
              size="small"
            />
          </Box>
          <Divider sx={{ mb: 2 }} />

          <Autocomplete
            options={usersSearch.getFilteredOptions(group.accounts || [])}
            loading={usersSearch.isLoading}
            onInputChange={(_, val) => usersSearch.onInputChange(val)}
            getOptionLabel={(o) => `${o.firstName} ${o.lastName} (${o.email})`}
            filterOptions={(x) => x}
            value={null} // Завжди скидаємо після вибору
            onChange={(_, user, reason) => {
              if (reason === 'selectOption' && user) {
                addAccount(user.id); // Виправлено: передаємо тільки ID або те, що очікує мутація
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Надати доступ користувачу"
                placeholder="Пошук за ім'ям або email..."
              />
            )}
          />

          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {group.accounts?.map((user: User) => (
              <Chip
                key={user.id}
                label={`${user.firstName} ${user.lastName}`}
                onDelete={() => revokeAccount(user.id)} // Виправлено: userId
                color="secondary"
                variant="outlined"
              />
            ))}
          </Box>
        </Paper>
      )}
    </Stack>
  );
}
