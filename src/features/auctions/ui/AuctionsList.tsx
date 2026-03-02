import { Grid } from "@mui/material";
import AuctionItem from "./AuctionItem";
import { useState } from "react";
import AuctionAddModal from "./AuctionAddModal";
import type { Auction } from "../model/types";
import AddItemButton from "../../../shared/ui/AddItemButton";
import { Can } from "../../auth/ui/Can";

interface Props {
  filteredAuctions: Auction[];
  onAuctionClick: (auction: Auction) => void;
  currentGroupId: string;
}

export default function AuctionsList({ filteredAuctions, onAuctionClick, currentGroupId }: Props) {
  const [isModalOpen, setModalOpen] = useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const isEmpty = filteredAuctions.length === 0;

  return (
    <Grid container spacing={3}>
      {/* 1. Рендеримо аукціони, якщо вони є */}
      {filteredAuctions.map((auction) => (
        <AuctionItem
          key={auction.id}
          auction={auction}
          onClick={onAuctionClick}
        />
      ))}

      <Can roles={['GroupAdmin', 'SuperAdmin', "Admin"]}>
        <AddItemButton
          type="auction"
          isEmpty={isEmpty}
          onClick={handleOpen}
        />

        {/* Модалка */}
        <AuctionAddModal
          currentGroupId={currentGroupId}
          isModalOpen={isModalOpen}
          handleClose={handleClose}
          modal_title="Створити Аукціон"
        />
      </Can>
    </Grid>
  );
}