import { Button, CircularProgress, Typography } from '@mui/material';
import BaseModal from '../../../shared/ui/Modal';
import { useDeleteAuction } from '../model/useAuctions';
import type { Auction } from '../model/types';

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
  const { mutate, isPending } = useDeleteAuction();

  const handleSubmit = async () => {
    console.log(currentAuction);
    await mutate(currentAuction.id);
    handleClose();
  };

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
      <Typography color="error">{`Ви впевнені що хочете видалити: ${currentAuction.title}`}</Typography>
    </BaseModal>
  );
}
