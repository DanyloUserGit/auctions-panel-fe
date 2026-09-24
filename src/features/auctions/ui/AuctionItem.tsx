import { DeleteOutline, Edit, Gavel, MoreVert } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  Grid,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import type { Auction } from '../model/types';
import AuctionDeleteModal from './AuctionDeleteModal';
import AuctionEditModal from './AuctionEditModal';
import { useModal } from '../../../shared/hooks/useModal';
import { Can } from '../../auth/ui/Can';

interface AuctionItemProps {
  auction: Auction;
  onClick: (auction: Auction) => void;
}
export default function AuctionItem({ onClick, auction }: AuctionItemProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const {
    isOpen: isDeleteOpen,
    open: openDelete,
    close: closeDelete,
  } = useModal(false);
  const {
    isOpen: isEditOpen,
    open: openEdit,
    close: closeEdit,
  } = useModal(false);

  return (
    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
      <Card
        sx={{
          borderRadius: '12px',
          border: '1px solid #e0e0e0',
          boxShadow: 'none',
          transition: '0.2s',
          position: 'relative',
          '&:hover': {
            borderColor: 'var(--color-primary)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          },
        }}
      >
        <Can roles={['SuperAdmin']}>
          <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}>
            <IconButton
              size="small"
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
              <MenuItem onClick={openEdit}>
                <ListItemIcon>
                  <Edit fontSize="small" />
                </ListItemIcon>
                <Typography variant="inherit">Редагувати</Typography>
              </MenuItem>
              <MenuItem onClick={openDelete} sx={{ color: 'error.main' }}>
                <ListItemIcon>
                  <DeleteOutline fontSize="small" color="error" />
                </ListItemIcon>
                <Typography variant="inherit">Видалити</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Can>

        <AuctionDeleteModal
          isModalOpen={isDeleteOpen}
          handleClose={closeDelete}
          currentAuction={auction}
        />
        {isEditOpen && (
          <AuctionEditModal
            isModalOpen={isEditOpen}
            handleClose={closeEdit}
            currentAuction={auction}
          />
        )}

        <CardActionArea sx={{ p: 2 }} onClick={() => onClick(auction)}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 50,
                height: 50,
                bgcolor: '#f0f7ff',
                color: 'var(--color-primary)',
                fontWeight: 'bold',
                fontSize: '1.1rem',
              }}
            >
              <Gavel sx={{ fontSize: 24 }} />
            </Avatar>

            <Box sx={{ overflow: 'hidden', flexGrow: 1, pr: 3 }}>
              {' '}
              {/* pr: 3 щоб текст не налазив на кнопку */}
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {auction.title}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: 'block',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {auction.url}
              </Typography>
            </Box>
          </Box>
        </CardActionArea>
      </Card>
    </Grid>
  );
}
