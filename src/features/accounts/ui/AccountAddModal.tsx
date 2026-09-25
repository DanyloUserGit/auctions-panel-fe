import { Box, Button, CircularProgress, TextField } from '@mui/material';
import { useState } from 'react';
import BaseModal from '../../../shared/ui/Modal';
import { useCreateAcount } from '../model/useAccounts';

interface AddGroupModalProps {
  isModalOpen: boolean;
  handleClose: () => void;
  modal_title: string;
  currentAuctionId: string;
}

export default function AccountAddModal({
  isModalOpen,
  handleClose,
  modal_title,
  currentAuctionId,
}: AddGroupModalProps) {
  const { mutate, isPending } = useCreateAcount();

  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (!email.trim()) return;

    mutate(
      {
        email,
        password,
        auctionId: currentAuctionId,
        title,
      },
      {
        onSuccess: () => {
          setEmail('');
          setPassword('');
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
            disabled={!email.trim() || isPending}
          >
            {isPending ? <CircularProgress size={24} /> : 'Створити'}
          </Button>
        </>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
        <TextField
          label="Назва"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Пошта"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Пароль"
          fullWidth
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Box>
    </BaseModal>
  );
}
