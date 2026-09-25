import { Alert, Slide, type SlideProps, Snackbar } from '@mui/material';

function TransitionUp(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

interface Props {
  isOpen: boolean;
  close: () => void;
  message: string;
}
export function Notification({ isOpen, close, message }: Props) {
  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={4000}
      onClose={close}
      TransitionComponent={TransitionUp}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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
