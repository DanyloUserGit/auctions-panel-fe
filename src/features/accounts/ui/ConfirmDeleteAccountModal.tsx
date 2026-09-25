import { Button, CircularProgress, Typography } from '@mui/material';
import BaseModal from '../../../shared/ui/Modal';
import type { Account } from '../model/types';
import { useDeleteAcount } from '../model/useAccounts';

interface DeleteAccountModalProps {
  isModalOpen: boolean;
  handleClose: () => void;
  currentAccount: Account;
}

export default function ConfirmDeleteAccountModal({
  isModalOpen,
  handleClose,
  currentAccount,
}: DeleteAccountModalProps) {
  const { mutate, isPending } = useDeleteAcount();

  const handleSubmit = async () => {
    await mutate(currentAccount.id);
    handleClose();
  };
  if (!currentAccount) handleClose();

  return (
    <BaseModal
      open={isModalOpen}
      onClose={handleClose}
      title="Підвердіть видалення"
      actions={
        <>
          <Button onClick={handleClose} color="inherit">
            Скасувати
          </Button>
          <Button
            onClick={handleSubmit}
            color="error"
            variant="contained"
            disabled={isPending}
          >
            {isPending ? <CircularProgress size={24} /> : 'Видалити'}
          </Button>
        </>
      }
    >
      <Typography color="error">{`Ви впевнені що хочете видалити групу: ${currentAccount?.email}`}</Typography>
    </BaseModal>
  );
}
