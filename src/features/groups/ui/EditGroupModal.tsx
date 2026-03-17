import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import BaseModal from '../../../shared/ui/Modal';
import { fetchAuctionsByQuery } from '../../auctions/model/api-auctions';
import type { Auction } from '../../auctions/model/types';
import type { Group } from '../model/types';
import { useGroups } from '../model/useGroups';
import type { User } from '../../auth/model/user-schema';
import { fetchUserById, fetchUsersByQuery } from '../../auth/model/api-user';
import { useAutoComplete } from '../../../shared/hooks/useAutoComplete';

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
  const { EditGroupMutation } = useGroups();

  // Стан для відстеження повної готовності даних
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Локальні стейти для вибраних об'єктів
  const [title, setTitle] = useState<string>(current_group?.title ?? '');
  const [addedAuctions, setAddedAuctions] = useState<Auction[]>(
    current_group?.auctions ?? [],
  );
  const [groupAdmin, setGroupAdmin] = useState<User | null>(null);
  const [addedWorkers, setAddedWorkers] = useState<User[]>([]);

  // Ефект для підтягування повних даних профілів при відкритті модалки
  useEffect(() => {
    const loadData = async () => {
      if (!isModalOpen || !current_group) return;

      setIsInitialLoading(true);
      try {
        // 1. Завантажуємо адміна за ID
        if (current_group.AdminId) {
          console.log(current_group.AdminId);
          const adminData = await fetchUserById(current_group.AdminId);
          setGroupAdmin(adminData);
        }

        // 2. Завантажуємо учасників за їхніми ID (якщо в моделі Group.users лежать рядки)
        if (current_group.users && current_group.users.length > 0) {
          const usersPromises = current_group.users.map((id) =>
            fetchUserById(id),
          );
          const fullUsers = await Promise.all(usersPromises);
          setAddedWorkers(fullUsers);
        }
      } catch (error) {
        console.error('Failed to load group details:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadData();
  }, [current_group, isModalOpen]);

  // Ініціалізація хуків автокомпліту
  // Передаємо завантажені стейти в initialSelected
  const auctionsSearch = useAutoComplete<Auction>({
    fetchFn: fetchAuctionsByQuery,
    initialSelected: addedAuctions,
  });

  const groupAdminSearch = useAutoComplete<User>({
    fetchFn: fetchUsersByQuery,
    initialSelected: groupAdmin || [], // хук очікує масив або об'єкт
  });

  const workersSearch = useAutoComplete<User>({
    fetchFn: fetchUsersByQuery,
    initialSelected: addedWorkers,
  });

  const handleSubmit = () => {
    if (!title.trim()) return;

    EditGroupMutation.mutate(
      {
        id: current_group.id,
        group: {
          title,
          AdminId: groupAdmin?.id || undefined,
          auctions: addedAuctions.map((a) => a.id),
          users: addedWorkers.map((w) => w.id),
        },
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
            getOptionLabel={(o) => o.title}
            isOptionEqualToValue={(o, v) => o?.id === v?.id}
            renderInput={(params) => (
              <TextField {...params} label="Аукціони групи" />
            )}
          />

          <Autocomplete
            value={groupAdmin}
            options={groupAdminSearch.getFilteredOptions(groupAdmin)}
            loading={groupAdminSearch.isLoading}
            onInputChange={(_, val) =>
              groupAdminSearch.debouncedFetch(val, groupAdmin)
            }
            onChange={(_, val) => setGroupAdmin(val)}
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
