import {
  Box,
  Button,
  CircularProgress,
  TextField
} from '@mui/material';
import { useState } from 'react';
import BaseModal from '../../../shared/ui/Modal';
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


  const handleSubmit = () => {
    if (!title.trim()) return;

    mutate(
      {
        title,
        url,
        auctionGroupId: currentGroupId,
      },
      {
        onSuccess: () => {
          setTitle('');
          setUrl('');
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

      </Box>
    </BaseModal>
  );
}
