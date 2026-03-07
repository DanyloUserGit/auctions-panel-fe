import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  debounce,
  TextField,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import BaseModal from '../../../shared/ui/Modal';
import { fetchAuctionsByQuery } from '../../auctions/model/api-auctions';
import type { Auction } from '../../auctions/model/types';
import type { Group } from '../model/types';
import { useGroups } from '../model/useGroups';
import type { User } from '../../auth/model/user-schema';
import { fetchUserById, fetchUsersByQuery } from '../../auth/model/api-user';
interface AddGroupModalProps {
  isModalOpen: boolean;
  handleClose: () => void;
  modal_title: string;
  current_group: Group;
}

export default function EditGroupModal({
  current_group,
  isModalOpen,
  handleClose,
  modal_title,
}: AddGroupModalProps) {
  const { EditGroupMutation } = useGroups();

  const [title, setTitle] = useState<string>(current_group?.title ?? '');
  const [addedAuctions, setAddedAuctions] = useState<Auction[]>(
    current_group?.auctions ?? [],
  );
  const [groupAdmin, setGroupAdmin] = useState<User | null>(null);

  const [adminOptions, setAdminOptions] = useState<User[]>([]);
  const [adminInput, setAdminInput] = useState('');
  const [isAdminsLoading, setIsAdminsLoading] = useState(false);

  useEffect(() => {
    if (!current_group?.groupAdminId || !isModalOpen) {
      setGroupAdmin(null);
      return;
    }

    let active = true;
    setIsAdminsLoading(true);

    fetchUserById(current_group.groupAdminId)
      .then((user) => {
        if (active && user) {
          setGroupAdmin(user);
          setAdminOptions((prev) => {
            const exists = prev.find((opt) => opt.id === user.id);
            return exists ? prev : [user, ...prev];
          });
        }
      })
      .catch((error) => {
        console.error('Помилка завантаження адміна:', error);
      })
      .finally(() => {
        if (active) setIsAdminsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [current_group?.groupAdminId, isModalOpen]);

  const [options, setOptions] = useState<Auction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log(current_group);
  }, [current_group]);

  useEffect(() => {}, [current_group]);

  const debouncedFetch = useMemo(
    () =>
      debounce(async (query: string) => {
        if (!query) {
          setOptions(addedAuctions);
          return;
        }

        setIsLoading(true);
        try {
          const results = await fetchAuctionsByQuery(query);
          const combined = [...addedAuctions, ...(results || [])];
          const uniqueOptions = Array.from(
            new Map(combined.map((item) => [item.id, item])).values(),
          );

          setOptions(uniqueOptions);
        } finally {
          setIsLoading(false);
        }
      }, 400),
    [addedAuctions],
  );

  useEffect(() => {
    let active = true;
    if (adminInput === '') {
      setAdminOptions([]);
      return;
    }
    setIsAdminsLoading(true);
    fetchUsersByQuery(adminInput)
      .then((results) => {
        if (active) {
          setAdminOptions(results.data || []);
          setIsAdminsLoading(false);
        }
      })
      .catch(() => {
        if (active) setAdminOptions([]);
      });
    return () => {
      active = false;
    };
  }, [adminInput]);
  const handleSubmit = () => {
    if (!title.trim()) return;

    EditGroupMutation.mutate(
      {
        id: current_group.id,
        group: {
          groupAdminId: groupAdmin?.id,
          title,
          auctions: addedAuctions.map((a) => a.id),
        },
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
            disabled={!title.trim() || EditGroupMutation.isPending}
          >
            {EditGroupMutation.isPending ? (
              <CircularProgress size={24} />
            ) : (
              'Редагувати'
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
          id="async-auctions-select"
          filterSelectedOptions
          value={addedAuctions}
          options={options}
          loading={isLoading}
          onInputChange={(_, newInputValue) => {
            debouncedFetch(newInputValue);
          }}
          onChange={(_, newValue) => {
            setAddedAuctions(newValue);
            setOptions((prev) => {
              const combined = [...newValue, ...prev];
              return Array.from(
                new Map(combined.map((item) => [item.id, item])).values(),
              );
            });
          }}
          getOptionLabel={(option) => option.title}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Пошук аукціонів"
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
        <Autocomplete
          value={groupAdmin}
          options={adminOptions || []}
          loading={isAdminsLoading}
          onInputChange={(_, val) => setAdminInput(val)}
          onChange={(_, val) => setGroupAdmin(val)}
          getOptionLabel={(o) => {
            if (!o) return '';
            return `${o.firstName || ''} ${o.lastName || ''} (${o.email || ''})`;
          }}
          isOptionEqualToValue={(o, v) => o?.id === v?.id}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Адміністратор групи"
              placeholder="Пошук за іменем або email..."
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isAdminsLoading ? (
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
