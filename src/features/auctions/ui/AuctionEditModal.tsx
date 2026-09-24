import {
  Box,
  Button,
  CircularProgress,
  TextField
} from '@mui/material';
import { useState } from 'react';
import BaseModal from '../../../shared/ui/Modal';
import type { Auction } from '../model/types';
import { useEditAuction } from '../model/useAuctions';

interface DeleteAuctionModalProps {
  isModalOpen: boolean;
  handleClose: () => void;
  currentAuction: Auction;
}

export default function AuctionDeleteModal({
  isModalOpen,
  handleClose,
  currentAuction,
}: DeleteAuctionModalProps) {
  const { mutate, isPending } = useEditAuction();
  const [title, setTitle] = useState<string>(currentAuction.title);
  const [url, setUrl] = useState<string>(currentAuction.url);
  const handleSubmit = () => {
    if (!title.trim()) return;

    mutate(
      {
        id: currentAuction.id,
        data: {
          auctionGroupId: currentAuction.auctionGroupId,
          title: title,
          url: url,
        },
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
      title="Редагувати аукціон"
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
            {isPending ? <CircularProgress size={24} /> : 'Редагувати'}
          </Button>
        </>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
        <TextField
          label="Назва акукціона"
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
