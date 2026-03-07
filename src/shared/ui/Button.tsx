import { Button as ButtonMui } from '@mui/material';
import type { FC, ReactNode } from 'react';
interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  styles: {
    width: {
      xs: string;
      sm: string;
    };
  };
}
export const ButtonUI: FC<ButtonProps> = ({ children, onClick, styles }) => {
  return (
    <ButtonMui
      type="submit"
      variant="contained"
      size="medium"
      onClick={onClick}
      sx={{
        mt: 2,
        mb: 3,
        backgroundColor: 'var(--color-primary)',
        '&:hover': { backgroundColor: 'var(--color-accent)' },
        py: 1.5,
        ...styles,
      }}
    >
      {children}
    </ButtonMui>
  );
};
