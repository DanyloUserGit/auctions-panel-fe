import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useAutoComplete } from '../../../shared/hooks/useAutoComplete';
import BaseModal from '../../../shared/ui/Modal';
import { fetchAuctionsByQuery } from '../../auctions/model/api-auctions';
import type { Auction } from '../../auctions/model/types';
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

  const [title, setTitle] = useState<string>('');
  const [sessionLimit, setSessionLimit] = useState<string>('');
  const [addedAuctions, setAddedAuctions] = useState<Auction[]>([]);

  const auctionsSearch = useAutoComplete<Auction>({
    fetchFn: fetchAuctionsByQuery,
  });

  // Дані групи вже приходять повністю в об'єкті, окремих запитів
  // на адміна/учасників більше не потрібно - modal лише синхронізує локальний стан.
  useEffect(() => {
    if (!isModalOpen || !current_group) return;

    setTitle(current_group.title || '');
    setSessionLimit(
      current_group.sessionLimit != null
        ? String(current_group.sessionLimit)
        : '',
    );
    setAddedAuctions(current_group.auctions || []);
  }, [current_group, isModalOpen]);

  const handleSubmit = () => {
    if (!title.trim()) return;

    const groupData: GroupEdit = {
      title: title.trim(),
      auctions: addedAuctions.map((a) => a.id),
      // Порожнє поле = ліміт знято (0), а не «залишити попередній».
      sessionLimit: sessionLimit.trim() === '' ? 0 : Number(sessionLimit),
    };

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
            disabled={!title.trim() || EditGroupMutation.isPending}
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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
        <TextField
          label="Назва групи"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <TextField
          label="Ліміт сесій"
          type="number"
          fullWidth
          value={sessionLimit}
          onChange={(e) => setSessionLimit(e.target.value)}
          helperText="Максимум одночасно активних сесій на всіх аукціонах групи. 0 або порожньо - без ліміту."
          inputProps={{ min: 0 }}
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
      </Box>
    </BaseModal>
  );
}
