import { Button, CircularProgress, Typography } from '@mui/material';
import BaseModal from '../../../shared/ui/Modal';
import { useGroups } from '../model/useGroups';
import type { Group } from '../model/types';

interface DeleteGroupModalProps {
    isModalOpen: boolean;
    handleClose: () => void;
    currentGroup: Group
}

export default function ConfirmDeleteGroupModal({ isModalOpen, handleClose, currentGroup }: DeleteGroupModalProps) {
    const { DeleteGroupMutation } = useGroups()

    const handleSubmit = async () => {
        console.log(currentGroup)
        await DeleteGroupMutation.mutate(currentGroup.id);
        handleClose()
    }
    if (!currentGroup) handleClose()

    return (
        <BaseModal
            open={isModalOpen}
            onClose={handleClose}
            title="Підвердіть видалення"
            actions={
                <>
                    <Button onClick={handleClose} color="inherit">Скасувати</Button>
                    <Button
                        onClick={handleSubmit}
                        color='error'
                        variant="contained"
                        disabled={DeleteGroupMutation.isPending}
                    >
                        {DeleteGroupMutation.isPending ? <CircularProgress size={24} /> : "Видалити"}
                    </Button>
                </>
            }
        >
            <Typography color='error'>{`Ви впевнені що хочете видалити групу: ${currentGroup?.title}`}</Typography>
        </BaseModal>
    )
}
