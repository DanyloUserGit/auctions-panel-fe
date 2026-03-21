import {
  MailOutline,
  Person,
  Star,
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
import { Loader } from '../../../shared/ui/Loader';
import { useAuctionById } from '../../auctions/model/useAuctions';
import type { Account } from '../model/types';
import { useRemoveFromFavorite } from '../model/useAcounts';

interface Props {
  account: Account;
  handleSelectAccount: (account: Account) => void;
}

export default function FavoriteItem({
  account,
  handleSelectAccount,
}: Props) {
  const { auction, isLoading: isLoadingAuction } = useAuctionById(
    account.auctionId,
  );

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

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromFavorite(account.id);
  };


  if (isLoadingAuction) return <Loader />;

  return (
    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
      <Card
        sx={{
          borderRadius: '16px',
          border: '1px solid',
          borderColor: 'warning.light', // Оскільки це Favorite, вона завжди підсвічена
          bgcolor: 'rgba(255, 193, 7, 0.03)',
          transition: 'all 0.3s ease',
          position: 'relative',
          height: '100%',
          overflow: 'visible',
          '&:hover': {
            borderColor: 'warning.main',
            boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
          },
        }}
      >
        {/* Кнопка "Прибрати з обраного" зліва */}
        <Box sx={{ position: 'absolute', top: 6, left: 6, zIndex: 2 }}>
          <Tooltip title="Прибрати з обраного">
            <IconButton
              size="small"
              onClick={handleToggleFavorite}
              sx={iconButtonSx}
            >
              <Star fontSize="small" sx={{ color: 'warning.main' }} />
            </IconButton>
          </Tooltip>
        </Box>



        <CardActionArea
          onClick={() => handleSelectAccount(account)}
          sx={{
            p: 3,
            pt: 5,
            height: '100%',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Stack spacing={1.5} alignItems="center" textAlign="center" sx={{ width: '100%' }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: 'warning.lighter',
                color: 'warning.main',
                border: '2px solid',
                borderColor: 'warning.light',
                flexShrink: 0,
              }}
            >
              <Person sx={{ fontSize: 30 }} />
            </Avatar>

            <Box sx={{ width: '100%' }}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  color: 'secondary.main',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  fontSize: '0.65rem',
                  display: 'block',
                  mb: 0.5,
                  wordBreak: 'break-word',
                }}
              >
                {auction?.title}
              </Typography>

              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.2,
                  fontSize: '0.95rem',
                  whiteSpace: 'normal',
                  wordBreak: 'break-all',
                }}
              >
                {account.email}
              </Typography>

              <Stack
                direction="row"
                spacing={0.5}
                alignItems="center"
                justifyContent="center"
                sx={{ mt: 0.8, opacity: 0.6 }}
              >
                <MailOutline sx={{ fontSize: 14 }} />
                <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                  Email доступу
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </CardActionArea>
      </Card>
    </Grid>
  );
}