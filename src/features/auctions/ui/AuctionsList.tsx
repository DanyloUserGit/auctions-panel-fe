import { Grid, Typography } from "@mui/material";
import AddItemButton from "../../../shared/ui/AddItemButton";
import { Can } from "../../auth/ui/Can";
import type { Auction } from "../model/types";
import AuctionAddModal from "./AuctionAddModal";
import AuctionItem from "./AuctionItem";
import { useModal } from "../../../shared/hooks/useModal";

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
        margin: 0, // Скидаємо марджини, які створює spacing
        '& > .MuiGrid-item': {
          paddingTop: 3, // Повертаємо відступи вручну, якщо вони зникли
          paddingLeft: 3,
        },
      }}
    >
      {/* 1. Рендеримо аукціони, якщо вони є */}
      {filteredAuctions.map((auction) => (
        <AuctionItem
          key={auction.id}
          auction={auction}
          onClick={onAuctionClick}
        />
      ))}

      <Can roles={['GroupAdmin', 'SuperAdmin']} fallback={<Typography>Аукціонів ще немає</Typography>}>
        <AddItemButton
          type="auction"
          isEmpty={isEmpty}
          onClick={open}
        />

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
