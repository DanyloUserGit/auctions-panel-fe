import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  TextField,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useAutoComplete } from '../../../shared/hooks/useAutoComplete';
import BaseModal from '../../../shared/ui/Modal';
import { fetchAuctionsByQuery } from '../../auctions/model/api-auctions';
import type { Auction } from '../../auctions/model/types';
import { fetchUserById, fetchUsersByQuery } from '../../auth/model/api-user';
import type { User } from '../../auth/model/user-schema';
import type { Group, GroupEdit } from '../model/types';
import { useEditGroup } from '../model/useGroups';

interface EditGroupModalProps {
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
}: EditGroupModalProps) {
  const EditGroupMutation = useEditGroup();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Локальні стейти
  const [title, setTitle] = useState<string>('');
  const [addedAuctions, setAddedAuctions] = useState<Auction[]>([]);
  const [Admin, setAdmin] = useState<User | null>(null);
  const [addedWorkers, setAddedWorkers] = useState<User[]>([]);

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

  useEffect(() => {
    const loadData = async () => {
      if (!isModalOpen || !current_group) return;

      setIsInitialLoading(true);
      try {
        // 1. Назва та аукціони (вони зазвичай вже є в об'єкті)
        setTitle(current_group.title || '');
        setAddedAuctions(current_group.auctions || []);

        // 2. Завантажуємо адміна
        if (current_group.AdminId) {
          const adminData = await fetchUserById(current_group.AdminId);
          setAdmin(adminData);
        } else {
          setAdmin(null);
        }

        // 3. Завантажуємо учасників (accounts)
        if (current_group.accounts && current_group.accounts.length > 0) {
          const usersPromises = current_group.accounts.map((u) =>
            fetchUserById(u.id),
          );
          const fullUsers = await Promise.all(usersPromises);
          setAddedWorkers(fullUsers);
        } else {
          setAddedWorkers([]);
        }
      } catch (error) {
        console.error('Failed to load group details:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadData();
  }, [current_group, isModalOpen]);

  const handleSubmit = () => {
    if (!title.trim()) return;

    const groupData: GroupEdit = {
      title: title.trim(),
    };

    if (Admin?.id) {
      groupData.Admin = Admin.id;
    }

    if (addedAuctions.length > 0) {
      groupData.auctions = addedAuctions.map((a) => a.id);
    }

    if (addedWorkers.length > 0) {
      // Використовуємо назву поля "users" або "accounts" відповідно до вашого API
      groupData.users = addedWorkers.map((w) => w.id);
    }

    EditGroupMutation.mutate(
      {
        id: current_group.id,
        group: groupData,
      },
      {
        onSuccess: () => {
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
            disabled={
              !title.trim() || EditGroupMutation.isPending || isInitialLoading
            }
          >
            {EditGroupMutation.isPending ? (
              <CircularProgress size={24} />
            ) : (
              'Зберегти зміни'
            )}
          </Button>
        </>
      }
    >
      {isInitialLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
          <TextField
            label="Назва групи"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Autocomplete
            multiple
            value={addedAuctions}
            options={auctionsSearch.getFilteredOptions(addedAuctions)}
            loading={auctionsSearch.isLoading}
            onInputChange={(_, val) =>
              auctionsSearch.debouncedFetch(val, addedAuctions)
            }
            onChange={(_, val) => setAddedAuctions(val)}
            getOptionLabel={(o) => o.title || ''}
            isOptionEqualToValue={(o, v) => o?.id === v?.id}
            renderInput={(params) => (
              <TextField {...params} label="Аукціони групи" />
            )}
          />

          <Autocomplete
            value={Admin}
            options={AdminSearch.getFilteredOptions(Admin ? [Admin] : [])}
            loading={AdminSearch.isLoading}
            onInputChange={(_, val) =>
              AdminSearch.debouncedFetch(val, Admin ? [Admin] : [])
            }
            onChange={(_, val) => setAdmin(val)}
            getOptionLabel={(o) =>
              o ? `${o.firstName} ${o.lastName} (${o.email})` : ''
            }
            isOptionEqualToValue={(o, v) => o?.id === v?.id}
            renderInput={(params) => (
              <TextField {...params} label="Адмін групи" />
            )}
          />

          <Autocomplete
            multiple
            value={addedWorkers}
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
      )}
    </BaseModal>
  );
}
