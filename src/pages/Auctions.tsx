import { Box, Typography } from "@mui/material";
import AuctionsList from "../components/ui/AuctionsList";
import { api, apiLogout } from "../http";

export default function Auctions() {
  const fn = async () => {
    const res = await api.get('/auctions')
    console.log(res.data)
  }

  return <Box sx={{ bgcolor: "var(--color-bg)" }}>
    <Typography variant="h3">Аукціони</Typography>
    <button onClick={fn}>Get auctions</button>
    <AuctionsList />
  </Box>;
}