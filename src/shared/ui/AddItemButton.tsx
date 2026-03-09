import { Button, Typography } from '@mui/material';

interface Props {
  isEmpty: boolean;
  onClick: () => void;
  type: 'auction' | 'account' | 'session';
}

export default function AddItemButton({ isEmpty, onClick, type }: Props) {
  const label =
    type === 'auction'
      ? isEmpty
        ? 'Додайте перший аукціон'
        : 'Додати аукціон'
      : type === 'session'
        ? 'Приєднатися до нової'
        : isEmpty
          ? 'Додайте перший акаунт'
          : 'Додати акаунт';

  return (
    <Button
      onClick={onClick}
      sx={{
        maxWidth: 'fit-content',
        height: 'auto',
        display: 'flex',
        borderRadius: '12px',
        border: '2px dashed',
        borderColor: 'divider',
        bgcolor: 'transparent',
        transition: '0.2s',
        padding: '20px',
        width: '100%',
        '&:hover': {
          borderColor: 'primary.main',
          bgcolor: 'rgba(25, 118, 210, 0.04)',
        },
      }}
    >
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: { xs: '0.875rem', sm: '1rem' },
          lineHeight: 1.2,
        }}
      >
        {label}
      </Typography>
    </Button>
  );
}
