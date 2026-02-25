import {  useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
} from "@mui/material";
import AuctionsList from "../components/ui/AuctionsList";
import AuctionsGroup from "../components/ui/AuctionsGroup";
import { useAuctionsData } from "../hooks/useAuctions";
import { useGroups } from "../hooks/useGroups";



export default function AuctionsPage() {
  const { items: auctions, isLoading:IsLoadingAuctions } = useAuctionsData();
  const { items: groups, isLoading:IsLoadingGroups } = useGroups();
  const [activeGroupId, setActiveGroupId] = useState(groups[0]?.id || "");
  const filteredAuctions = auctions.filter(item => item.groupId === activeGroupId);

  useEffect(() => {
    console.log("Завантаження аукціонів:", groups);
  }, [groups]);
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 800, color: "#1a1a1a" }}>
        Аукціони
      </Typography>
      <AuctionsGroup activeGroupId={activeGroupId} setActiveGroupId={setActiveGroupId} />

      {IsLoadingAuctions ? (
        <Typography variant="body1" color="text.secondary">
          Завантаження аукціонів...
        </Typography>
      ) : (
        <AuctionsList filteredAuctions={auctions} />
      )}
    </Box>
  );
}