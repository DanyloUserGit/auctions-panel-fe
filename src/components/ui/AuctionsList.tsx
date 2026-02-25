import { Grid } from "@mui/material";
import AuctionItem from "./AuctionItem";


export default function AuctionsList({filteredAuctions}: {filteredAuctions: { id: string, title: string, url: string }[]}) {

  return (
    <Grid container spacing={3}>
        {filteredAuctions.map((auction) => (
          <AuctionItem key={auction.id} title={auction.title} url={auction.url} />
        ))}
      </Grid>
  )
}
