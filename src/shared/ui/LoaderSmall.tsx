import { Box, CircularProgress } from '@mui/material';
import type { FC } from 'react';

export const LoaderSmall: FC = () => {
    return (
        <Box
            sx={{
                width: '100%',
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
