import { Button, Typography } from '@mui/material';
import BaseModal from '../../../shared/ui/Modal';

interface DeleteAuctionModalProps {
    isModalOpen: boolean;
    handleClose: () => void;
    handleExit: () => void;
}

export default function SessionsExitModal({
    isModalOpen,
    handleClose,
    handleExit
}: DeleteAuctionModalProps) {
    const handleSubmit = async () => {
        handleExit();
        handleClose();
    };

    return (
        <BaseModal
            open={isModalOpen}
            onClose={handleClose}
            title="Підвердіть вихід з усіх сесій"
            actions={
                <>
                    <Button onClick={handleClose} color="inherit">
                        Скасувати
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        color="error"
                        variant="contained"
                    >
                        Вийти
                    </Button>
                </>
            }
        >
            <Typography color="error">{`Ви впевнені що хочете вийти з усіх сесій`}</Typography>
        </BaseModal>
    );
}
