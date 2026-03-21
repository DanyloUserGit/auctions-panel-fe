import { Button, CircularProgress, Typography } from '@mui/material';
import BaseModal from '../../../shared/ui/Modal';
import type { Group } from '../model/types';
import { useDeleteGroup } from '../model/useGroups';

interface DeleteGroupModalProps {
  isModalOpen: boolean;
  handleClose: () => void;
  currentGroup: Group;
}

export default function ConfirmDeleteGroupModal({
  isModalOpen,
  handleClose,
  currentGroup,
}: DeleteGroupModalProps) {
  const DeleteGroupMutation = useDeleteGroup();

  const handleSubmit = async () => {
    await DeleteGroupMutation.mutate(currentGroup.id);
    handleClose();
  };
  if (!currentGroup) handleClose();

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
            disabled={DeleteGroupMutation.isPending}
          >
            {DeleteGroupMutation.isPending ? (
              <CircularProgress size={24} />
            ) : (
              'Видалити'
            )}
          </Button>
        </>
      }
    >
      <Typography color="error">{`Ви впевнені що хочете видалити групу: ${currentGroup?.title}`}</Typography>
    </BaseModal>
  );
}
