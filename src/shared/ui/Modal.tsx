import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode; // Кнопки "Зберегти", "Скасувати" тощо
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export default function BaseModal({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
}: BaseModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={maxWidth}
      sx={{ '& .MuiPaper-root': { borderRadius: '16px' } }}
    >
      {/* Шапка модалки */}
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: (theme) => theme.palette.grey[500] }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3, borderTop: '1px solid #f0f0f0' }}>
        <Box sx={{ mt: 1 }}>{children}</Box>
      </DialogContent>

      {actions && <DialogActions sx={{ p: 2, px: 3 }}>{actions}</DialogActions>}
    </Dialog>
  );
}
