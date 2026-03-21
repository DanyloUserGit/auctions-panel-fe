import {
  DeleteOutline,
  MailOutline,
  Person,
  Star,
  StarBorder,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  Grid,
  IconButton,
  Stack,
  Typography,
  Tooltip,
} from '@mui/material';
import { useModal } from '../../../shared/hooks/useModal';
import type { Account } from '../model/types';
import { useAddToFavorite, useRemoveFromFavorite } from '../model/useAcounts';
import ConfirmDeleteAccountModal from './ConfirmDeleteAccountModal';

interface AccountItemProps {
  account: Account;
  handleSelectAccount: (accountId: string) => void;
  isFavorite?: boolean;
}

export default function AccountItem({
  account,
  handleSelectAccount,
  isFavorite = false,
}: AccountItemProps) {
  const { isOpen, open: handleOpen, close: handleClose } = useModal(false);

  const { mutate: addToFavorite } = useAddToFavorite();
  const { mutate: removeFromFavorite } = useRemoveFromFavorite();

  // Анімація для кнопок
  const iconButtonSx = {
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.2)',
      bgcolor: 'transparent',
    },
    '&:active': {
      transform: 'scale(0.9)',
    },
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFromFavorite(account.id);
    } else {
      addToFavorite(account.id);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleOpen();
  };

  return (
    <Grid>
      <Card
        sx={{
          borderRadius: '16px',
          border: '1px solid',
          borderColor: isFavorite ? 'warning.light' : 'divider',
          bgcolor: isFavorite ? 'rgba(255, 193, 7, 0.03)' : 'background.paper',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'visible', // Щоб анімація збільшення не обрізалася
          '&:hover': {
            borderColor: isFavorite ? 'warning.main' : 'primary.main',
            boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
          },
        }}
      >
        {/* Кнопка "Обране" зліва */}
        <Box sx={{ position: 'absolute', top: 6, left: 6, zIndex: 2 }}>
          <Tooltip title={isFavorite ? "Видалити з обраного" : "Додати в обране"}>
            <IconButton
              size="small"
              onClick={toggleFavorite}
              sx={{ ...iconButtonSx }}
            >
              {isFavorite ? (
                <Star fontSize="small" sx={{ color: 'warning.main' }} />
              ) : (
                <StarBorder fontSize="small" sx={{ color: 'text.disabled' }} />
              )}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Кнопка "Видалити" справа */}
        <Box sx={{ position: 'absolute', top: 6, right: 6, zIndex: 2 }}>
          <Tooltip title="Видалити акаунт">
            <IconButton
              size="small"
              onClick={handleDeleteClick}
              sx={{
                ...iconButtonSx,
                '&:hover': { ...iconButtonSx['&:hover'], color: 'error.main' }
              }}
            >
              <DeleteOutline fontSize="small" sx={{ color: 'text.disabled' }} />
            </IconButton>
          </Tooltip>
        </Box>

        <ConfirmDeleteAccountModal
          handleClose={handleClose}
          currentAccount={account}
          isModalOpen={isOpen}
        />

        <CardActionArea
          onClick={() => handleSelectAccount(account.id)}
          sx={{ p: 3, pt: 5, borderRadius: '16px' }}
        >
          <Stack spacing={1.5} alignItems="center" textAlign="center">
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: isFavorite ? 'warning.lighter' : 'action.hover',
                color: isFavorite ? 'warning.main' : 'primary.main',
                border: isFavorite ? '2px solid' : '1px solid',
                borderColor: isFavorite ? 'warning.light' : 'divider',
                transition: 'all 0.3s ease',
              }}
            >
              <Person sx={{ fontSize: 30 }} />
            </Avatar>

            <Box sx={{ width: '100%' }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  lineHeight: 1.2,
                  mb: 0.5
                }}
              >
                {account.email?.split('@')[0] || 'Користувач'}
              </Typography>

              <Stack
                direction="row"
                spacing={0.5}
                alignItems="center"
                justifyContent="center"
                sx={{ opacity: 0.6 }}
              >
                <MailOutline sx={{ fontSize: 14 }} />
                <Typography
                  variant="caption"
                  sx={{
                    maxWidth: '140px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {account.email}
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </CardActionArea>
      </Card>
    </Grid>
  );
}