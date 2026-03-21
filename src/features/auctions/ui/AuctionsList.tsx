import { Grid, Typography, Box } from '@mui/material';
import { useModal } from '../../../shared/hooks/useModal';
import AddItemButton from '../../../shared/ui/AddItemButton';
import { Can } from '../../auth/ui/Can';
import type { Auction } from '../model/types';
import AuctionAddModal from './AuctionAddModal';
import AuctionItem from './AuctionItem';
import { Gavel } from '@mui/icons-material'; // Іконка для гарного вигляду

interface Props {
  filteredAuctions: Auction[];
  onAuctionClick: (auction: Auction) => void;
  currentGroupId: string;
}

export default function AuctionsList({
  filteredAuctions,
  onAuctionClick,
  currentGroupId,
}: Props) {
  const { isOpen, open, close } = useModal(false);

  const isEmpty = filteredAuctions.length === 0;

  return (
    <Grid
      container
      spacing={3}
      sx={{
        width: '100%',
        margin: 0,
        '& > .MuiGrid-item': {
          paddingTop: 3,
          paddingLeft: 3,
        },
      }}
    >
      {/* Якщо аукціони є — рендеримо їх */}
      {!isEmpty ? (
        filteredAuctions.map((auction) => (
          <AuctionItem
            key={auction.id}
            auction={auction}
            onClick={onAuctionClick}
          />
        ))
      ) : (
        /* Якщо аукціонів немає — показуємо повідомлення */
        <Grid size={{ xs: 12 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 6,
              opacity: 0.6,
              textAlign: 'center',
            }}
          >
            <Gavel sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Аукціонів не знайдено
            </Typography>
            <Typography variant="body2">
              У цій групі ще не створено жодного аукціону або вони не
              відповідають фільтру
            </Typography>
          </Box>
        </Grid>
      )}

      <Can roles={['Admin', 'SuperAdmin']}>
        {/* Кнопка додавання */}
        <AddItemButton type="auction" isEmpty={isEmpty} onClick={open} />

        {/* Модалка */}
        <AuctionAddModal
          currentGroupId={currentGroupId}
          isModalOpen={isOpen}
          handleClose={close}
          modal_title="Створити Аукціон"
        />
      </Can>
    </Grid>
  );
}
