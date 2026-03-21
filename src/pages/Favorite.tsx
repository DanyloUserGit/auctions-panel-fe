import {
  DeleteOutline,
  Person,
  StarOutline
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Divider,
  Grid,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography
} from '@mui/material';
import { type MouseEvent, useState } from 'react';
import { useFavoriteAccounts, useRemoveFromFavorite } from '../features/acounts/model/useAcounts';
import FavoriteItem from '../features/acounts/ui/FavoriteItem';
import { useSession } from '../features/sessions/model/store';
import { Loader } from '../shared/ui/Loader';
import type { Account } from '../features/acounts/model/types';
import { useNavigate } from 'react-router';


export default function FavoriteAccounts() {
  const { items: accounts, isLoading } = useFavoriteAccounts()
  const { mutate: RemoveFromFavorite } = useRemoveFromFavorite()
  const sessionConnect = useSession();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeAccountId, setActiveAccountId] = useState<string | null>(null);

  const handleOpenMenu = (event: MouseEvent<HTMLElement>, id: string) => {
    event.stopPropagation(); // Щоб не спрацював CardActionArea
    setAnchorEl(event.currentTarget);
    setActiveAccountId(id);
  };
  const navigate = useNavigate();
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setActiveAccountId(null);
  };

  const handleSelectAccount = (account: Account) => {
    sessionConnect.setAuctionAuthId(account.id);
    navigate(`/auctions/`, {
      state: {
        view: 'sessions',
      }
    });
  };

  const toggleFavorite = (id: string) => {
    handleCloseMenu();
    RemoveFromFavorite(id)

  };

  if (isLoading) return <Loader />
  return (
    <Box sx={{ py: 4 }}>
      {/* Заголовок */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
          <Person fontSize="large" />
        </Avatar>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Вибрані акаунти
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ваші пріоритетні облікові записи для швидкого доступу
          </Typography>
        </Box>
      </Stack>
      <Divider sx={{ my: 4 }} />
      {
        accounts.length > 0 ?
          <Grid container spacing={3}>
            {accounts.map((account) => (
              <FavoriteItem account={account} handleOpenMenu={handleOpenMenu} handleSelectAccount={handleSelectAccount} />
            ))}
          </Grid> : (
            /* Гарний напис, коли немає обраних */
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 10,
                textAlign: 'center',
                opacity: 0.5
              }}
            >
              <StarOutline sx={{ fontSize: 80, mb: 2, color: 'text.secondary' }} />
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                Список вибраних порожній
              </Typography>
              <Typography variant="body1">
                Додавайте акаунти в обране, щоб вони з'явилися тут для швидкого переходу
              </Typography>
            </Box>
          )
      }

      {/* Меню дій */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: { borderRadius: '12px', minWidth: 160, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }
        }}
      >
        <MenuItem onClick={() => activeAccountId && toggleFavorite(activeAccountId)} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteOutline fontSize="small" color="error" />
          </ListItemIcon>
          <Typography variant="inherit">Прибрати з вибраних</Typography>
        </MenuItem>
      </Menu>
    </Box >
  );
}