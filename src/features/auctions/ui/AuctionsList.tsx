import { Grid } from "@mui/material";
import AuctionItem from "./AuctionItem";


export default function AuctionsList({ filteredAuctions, onAuctionClick }: { filteredAuctions: { id: string, title: string, url: string }[]; onAuctionClick: (auction: any) => void }) {

  return (
    <Grid container spacing={3}>
      {filteredAuctions.map((auction) => (
        <AuctionItem key={auction.id} title={auction.title} url={auction.url} onClick={onAuctionClick} />
      ))}
    </Grid>
  )
}
