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
import { fetchUsersByQuery } from '../../auth/model/api-user';
import type { User } from '../../auth/model/user-schema';
import { useCreateAuction } from '../model/useAuctions';

// interface Auction {
//     id: string;
//     title: string;
//     url: string;
// }

interface AddGroupModalProps {
  isModalOpen: boolean;
  handleClose: () => void;
  modal_title: string;
  currentGroupId: string;
}

export default function AuctionAddModal({
  isModalOpen,
  handleClose,
  modal_title,
  currentGroupId,
}: AddGroupModalProps) {
  const { mutate, isPending } = useCreateAuction();
  const [title, setTitle] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [addedAcounts, setAddedAcounts] = useState<User[]>([]);

  const { isLoading, options, setOptions, debouncedFetch } =
    useAutoComplete<User>({
      fetchFn: fetchUsersByQuery,
    });

  const handleSubmit = () => {
    if (!title.trim()) return;

    console.log(addedAcounts);
    mutate(
      {
        title,
        url,
        auctionGroupId: currentGroupId,
        users: addedAcounts.map((a) => String(a.id)),
      },
      {
        onSuccess: () => {
          setTitle('');
          setUrl('');
          setAddedAcounts([]);
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
            disabled={!title.trim() || isPending}
          >
            {isPending ? <CircularProgress size={24} /> : 'Створити'}
          </Button>
        </>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
        <TextField
          label="Назва аукціону"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Посилання"
          fullWidth
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <Autocomplete
          multiple
          id="async-auctions-select"
          filterSelectedOptions
          value={addedAcounts}
          options={options}
          loading={isLoading}
          onInputChange={(_, newInputValue) => {
            debouncedFetch(newInputValue, addedAcounts);
          }}
          onChange={(_, newValue) => {
            setAddedAcounts(newValue);
            setOptions((prev) => {
              const combined = [...newValue, ...prev];
              return Array.from(
                new Map(combined.map((item) => [item.id, item])).values(),
              );
            });
          }}
          getOptionLabel={(option) => option.email}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Пошук користувачів"
              placeholder="Введіть назву..."
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isLoading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      </Box>
    </BaseModal>
  );
}
