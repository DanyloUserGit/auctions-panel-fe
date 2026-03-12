import { Hub, MoreVert, PowerSettingsNew } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  Chip,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import type { Session } from '../model/types';
import SessionFinishModal from './SessionFinishModal';

interface SessionItemProps {
  session: Session;
  onClick: (session: Session) => void;
}

export default function SessionItem({ session, onClick }: SessionItemProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isFinishModalOpen, setFinishModalOpen] = useState(false);

  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const handleOpenFinishModal = () => {
    setFinishModalOpen(true);
    setAnchorEl(null);
  };

  const handleCloseFinishModal = () => setFinishModalOpen(false);

  const isExpired = new Date(session.expiresAt) < new Date();

  return (
    <Card
      sx={{
        borderRadius: '12px',
        border: session.isActive
          ? '1px solid var(--color-primary)'
          : '1px solid #e0e0e0',
        boxShadow: 'none',
        transition: '0.2s',
        position: 'relative',
        opacity: session.isActive ? 1 : 0.7,
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        },
      }}
    >
      {session.isActive && (
        <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}>
          <IconButton
            size="small"
            disabled={!session.isActive}
            onClick={handleMenuClick}
            sx={{
              color: 'text.secondary',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
            }}
          >
            <MoreVert fontSize="small" />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem
              onClick={handleOpenFinishModal}
              sx={{ color: 'error.main' }}
            >
              <ListItemIcon>
                <PowerSettingsNew fontSize="small" color="error" />
              </ListItemIcon>
              <Typography variant="inherit">Завершити сесію</Typography>
            </MenuItem>
          </Menu>
        </Box>
      )}

      <SessionFinishModal
        isModalOpen={isFinishModalOpen}
        handleClose={handleCloseFinishModal}
        currentSession={session}
      />

      <CardActionArea
        sx={{ p: 2 }}
        onClick={() => onClick(session)}
        disabled={!session.isActive}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              width: 50,
              height: 50,
              bgcolor: session.isActive ? '#e3f2fd' : '#f5f5f5',
              color: session.isActive
                ? 'var(--color-primary)'
                : 'text.secondary',
              fontWeight: 'bold',
              fontSize: '1.1rem',
            }}
          >
            <Hub sx={{ fontSize: 24 }} />
          </Avatar>

          <Box sx={{ overflow: 'hidden', flexGrow: 1, pr: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {session.auction?.title}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {session.activeConnections} / {session.maxConnections} підключень
            </Typography>

            {session.worker && (
              <Typography variant="caption" display="block">
                Worker: {session.workerId}
              </Typography>
            )}

            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
            >
              До: {new Date(session.expiresAt).toLocaleString()}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Chip
            size="small"
            label={
              session.isActive
                ? 'Активна'
                : isExpired
                  ? 'Протермінована'
                  : 'Завершена'
            }
            color={
              session.isActive ? 'success' : isExpired ? 'warning' : 'default'
            }
          />
        </Box>
      </CardActionArea>
    </Card>
  );
}
