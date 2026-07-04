import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  TextField,
} from '@mui/material';
import { useCallback, useState } from 'react';
import { useAutoComplete } from '../../../shared/hooks/useAutoComplete';
import BaseModal from '../../../shared/ui/Modal';
import { fetchAuctionsByQuery } from '../../auctions/model/api-auctions';
import type { Auction } from '../../auctions/model/types';
import { fetchUsersByQuery } from '../../auth/model/api-user';
import type { User } from '../../auth/model/user-schema';
import { useCreateGroup } from '../model/useGroups';

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
  const GroupCreation = useCreateGroup();
  const [title, setTitle] = useState<string>('');
  const [addedAuctions, setAddedAuctions] = useState<Auction[]>([]);
  const [Admin, setAdmin] = useState<User | null>(null);
  const [addedWorkers, setAddedWorkers] = useState<User[]>([]);
  const [isTitleTouched, setIsTitleTouched] = useState<boolean>(false);

  const fetchAdminsByQuery = useCallback(
    (query: string) => fetchUsersByQuery(query, 1, 10, 'Admin'),
    [],
  );

  const fetchWorkersByQuery = useCallback(
    (query: string) => fetchUsersByQuery(query, 1, 10, 'User'),
    [],
  );

  const auctionsSearch = useAutoComplete<Auction>({
    fetchFn: fetchAuctionsByQuery,
  });
  const AdminSearch = useAutoComplete<User>({
    fetchFn: fetchAdminsByQuery,
  });
  const workersSearch = useAutoComplete<User>({
    fetchFn: fetchWorkersByQuery,
  });
  const handleSubmit = () => {
    if (!title.trim()) {
      setIsTitleTouched(true);
      return;
    }

    GroupCreation.mutate(
      {
        title,
        auctions: addedAuctions,
        Admin: Admin ? Admin?.id : null,
        users: addedWorkers,
      },
      {
        onSuccess: () => {
          setTitle('');
          setAddedAuctions([]);
          setAdmin(null);
          setAddedWorkers([]);
          setIsTitleTouched(false);
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
          required
          value={title}
          onBlur={() => setIsTitleTouched(true)}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!isTitleTouched) setIsTitleTouched(true);
          }}
          error={isTitleTouched && !title.trim()}
          helperText={
            isTitleTouched && !title.trim()
              ? "Назва групи є обов'язковою"
              : " "
          }
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
          options={AdminSearch.getFilteredOptions(Admin)}
          loading={AdminSearch.isLoading}
          onInputChange={(_, val) => AdminSearch.debouncedFetch(val, Admin)}
          onChange={(_, val) => setAdmin(val)}
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
