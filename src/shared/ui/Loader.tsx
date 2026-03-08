import { Box, CircularProgress } from '@mui/material';
import type { FC } from 'react';

export const Loader:FC = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default', 
        zIndex: 9999, 
      }}
    >
      <CircularProgress
        sx={{
          color: 'var(--color-primary)', 
        }}
      />
    </Box>
  );
};