import { Button, CircularProgress, Typography } from '@mui/material';
import BaseModal from '../../../shared/ui/Modal';
import type { AuctionSession } from '../model/types';
import { useTerminateSession } from '../model/useSessionLogs';

interface SessionFinishModalProps {
  isModalOpen: boolean;
  handleClose: () => void;
  currentSession: AuctionSession | null;
}

export default function SessionFinishModal({
  isModalOpen,
  handleClose,
  currentSession,
}: SessionFinishModalProps) {
  const terminateMutation = useTerminateSession();

  const handleConfirm = () => {
    if (!currentSession) return;

    terminateMutation.mutate(currentSession.id, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  if (!currentSession) return null;

  return (
    <BaseModal
      open={isModalOpen}
      onClose={handleClose}
      title="Підтвердіть завершення"
      actions={
        <>
          <Button
            onClick={handleClose}
            color="inherit"
            disabled={terminateMutation.isPending}
          >
            Скасувати
          </Button>

          <Button
            onClick={handleConfirm}
            color="error"
            variant="contained"
            disabled={terminateMutation.isPending}
          >
            {terminateMutation.isPending ? (
              <CircularProgress size={24} />
            ) : (
              'Завершити'
            )}
          </Button>
        </>
      }
    >
      <Typography color="error">
        {`Ви впевнені що хочете завершити сесію для аукціону: ${currentSession?.auction?.title}?`}
      </Typography>
    </BaseModal>
  );
}