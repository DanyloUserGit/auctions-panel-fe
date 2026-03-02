import { Button, CircularProgress, Typography } from "@mui/material";
import BaseModal from "../../../shared/ui/Modal";
import { useSession } from "../model/store";
import type { Session } from "../model/types";
import { useSessionsData } from "../model/useSessionData";

interface SessionFinishModalProps {
    isModalOpen: boolean;
    handleClose: () => void;
    currentSession: Session;
}

export default function SessionFinishModal({
    isModalOpen,
    handleClose,
    currentSession
}: SessionFinishModalProps) {
    const { auctionAuthId } = useSession();

    const { DeleteSessionMutation } = useSessionsData(auctionAuthId);

    const handleSubmit = async () => {
        if (!currentSession) return;

        await DeleteSessionMutation.mutateAsync(currentSession.id);
        handleClose();
    };

    if (!currentSession) return null;

    return (
        <BaseModal
            open={isModalOpen}
            onClose={handleClose}
            title="Підтвердіть завершення"
            actions={
                <>
                    <Button onClick={handleClose} color="inherit">
                        Скасувати
                    </Button>

                    <Button
                        onClick={handleSubmit}
                        color="error"
                        variant="contained"
                        disabled={DeleteSessionMutation.isPending}
                    >
                        {DeleteSessionMutation.isPending ? (
                            <CircularProgress size={24} />
                        ) : (
                            "Завершити"
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