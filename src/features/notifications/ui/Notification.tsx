import { Alert, Slide, type SlideProps, Snackbar } from '@mui/material';

function TransitionUp(props: SlideProps) {
    return <Slide {...props} direction="up" />;
}

// У головному компоненті:
interface Props {
    isOpen: boolean;
    close: () => void;
    message: string
}
export function Notification({ isOpen, close, message }: Props) {

    return (
        <Snackbar
            open={isOpen}
            autoHideDuration={4000} // 4 секунди (ваш запит 3-5 сек)
            onClose={close}
            TransitionComponent={TransitionUp}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} // Як у ТГ
        >
            <Alert
                onClose={close}
                severity="info"
                variant="filled"
                sx={{ width: '100%', borderRadius: '12px', boxShadow: 3 }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
}