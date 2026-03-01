import { Card, Grid } from "@mui/material";
import AddAuctionButton from "./addAuctionButton";
import AuctionItem from "./AuctionItem";
import { useState } from "react";
import AuctionAddModal from "./AuctionAddModal";
import type { Auction } from "../model/types";

interface Props {
  filteredAuctions: Auction[];
  onAuctionClick: (auction: Auction) => void;
  currentGroupId: string
}
export default function AuctionsList({ filteredAuctions, onAuctionClick, currentGroupId }: Props) {
  const [isModalOpen, setModalOpen] = useState(false)
  const handleOpen = () => setModalOpen(true)
  const handleClose = () => setModalOpen(false)

  return (
    <Grid container spacing={3}>

      {filteredAuctions.length > 0 ?
        <>
          {filteredAuctions.map((auction) => (
            <AuctionItem key={auction.id} auction={auction} onClick={onAuctionClick} />
          ))}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card
              variant="outlined"
              sx={{
                height: "100%",
                minHeight: 88, // Підганяємо під висоту AuctionItem
                display: "flex",
                borderRadius: "12px",
                border: "2px dashed",
                borderColor: "divider",
                bgcolor: "transparent",
                transition: "0.2s",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: "rgba(25, 118, 210, 0.04)",
                },
              }}
            >
              <AddAuctionButton auctions={filteredAuctions} onClick={handleOpen} />
            </Card>
          </Grid>
        </>



        : <AddAuctionButton auctions={filteredAuctions} onClick={handleOpen} />
      }
      <AuctionAddModal currentGroupId={currentGroupId} isModalOpen={isModalOpen} handleClose={handleClose} modal_title="Створити Аукціон" />
    </Grid>
  )
}
