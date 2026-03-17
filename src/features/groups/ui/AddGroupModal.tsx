import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { useAutoComplete } from '../../../shared/hooks/useAutoComplete';
import BaseModal from '../../../shared/ui/Modal';
import { fetchAuctionsByQuery } from '../../auctions/model/api-auctions';
import type { Auction } from '../../auctions/model/types';
import { fetchUsersByQuery } from '../../auth/model/api-user';
import type { User } from '../../auth/model/user-schema';
import { useGroups } from '../model/useGroups';

interface AddGroupModalProps {
  handleClose: () => void;
  isModalOpen: boolean;
  modal_title: string;
}

export default function AddGroupModal({
  isModalOpen,
  handleClose,
  modal_title,
}: AddGroupModalProps) {
  const { GroupCreation } = useGroups();

  const [title, setTitle] = useState<string>('');
  const [addedAuctions, setAddedAuctions] = useState<Auction[]>([]);
  const [groupAdmin, setGroupAdmin] = useState<User | null>(null);
  const [addedWorkers, setAddedWorkers] = useState<User[]>([]);

  const auctionsSearch = useAutoComplete<Auction>({
    fetchFn: fetchAuctionsByQuery,
  });
  const groupAdminSearch = useAutoComplete<User>({
    fetchFn: fetchUsersByQuery,
  });
  const workersSearch = useAutoComplete<User>({
    fetchFn: fetchUsersByQuery,
  });
  const handleSubmit = () => {
    if (!title.trim()) return;
    console.log(groupAdmin);
    GroupCreation.mutate(
      {
        title,
        auctions: addedAuctions.map((a) => a.id),
        AdminId: groupAdmin ? groupAdmin?.id : null,
        users: addedWorkers.map((w) => w.id),
      },
      {
        onSuccess: () => {
          setTitle('');
          setAddedAuctions([]);
          setGroupAdmin(null);
          handleClose();
        },
      },
    );
  };

  return (
    <BaseModal
      open={isModalOpen}
      onClose={handleClose}
      title={modal_title}
      actions={
        <>
          <Button onClick={handleClose} color="inherit">
            Скасувати
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!title.trim() || GroupCreation.isPending}
          >
            {GroupCreation.isPending ? (
              <CircularProgress size={24} />
            ) : (
              'Створити'
            )}
          </Button>
        </>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
        <TextField
          label="Назва групи"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Autocomplete
          multiple
          options={auctionsSearch.getFilteredOptions(addedAuctions)}
          loading={auctionsSearch.isLoading}
          onInputChange={(_, val) =>
            auctionsSearch.debouncedFetch(val, addedAuctions)
          }
          onChange={(_, val) => setAddedAuctions(val)}
          getOptionLabel={(o) => o.title}
          isOptionEqualToValue={(o, v) => o?.id === v?.id}
          renderInput={(params) => (
            <TextField {...params} label="Аукціони групи" />
          )}
        />

        <Autocomplete
          options={groupAdminSearch.getFilteredOptions(groupAdmin)}
          loading={groupAdminSearch.isLoading}
          onInputChange={(_, val) =>
            groupAdminSearch.debouncedFetch(val, groupAdmin)
          }
          onChange={(_, val) => setGroupAdmin(val)}
          getOptionLabel={(o) => `${o.firstName} ${o.lastName} (${o.email})`}
          isOptionEqualToValue={(o, v) => o?.id === v?.id}
          renderInput={(params) => (
            <TextField {...params} label="Адмін групи" />
          )}
        />
        <Autocomplete
          multiple
          options={workersSearch.getFilteredOptions(addedWorkers)}
          loading={workersSearch.isLoading}
          onInputChange={(_, val) =>
            workersSearch.debouncedFetch(val, addedWorkers)
          }
          onChange={(_, val) => setAddedWorkers(val)}
          getOptionLabel={(o) => `${o.firstName} ${o.lastName} (${o.email})`}
          isOptionEqualToValue={(o, v) => o?.id === v?.id}
          renderInput={(params) => (
            <TextField {...params} label="Учасники групи" />
          )}
        />
      </Box>
    </BaseModal>
  );
}
