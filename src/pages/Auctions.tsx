import { Add, ArrowBack } from "@mui/icons-material";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useState } from "react";
import AccountList from "../features/acounts/ui/AccountList";
import type { Auction } from "../features/auctions/model/types";
import { useAuctionsData } from "../features/auctions/model/useAuctions";
import AuctionsList from "../features/auctions/ui/AuctionsList";
import { Can } from "../features/auth/ui/Can";
import type { Group } from "../features/groups/model/types";
import { useGroups } from "../features/groups/model/useGroups";
import AddGroupModal from "../features/groups/ui/AddGroupModal";
import AuctionsGroup from "../features/groups/ui/AuctionsGroup";
import EditGroupModal from "../features/groups/ui/EditGroupModal";
import { ButtonUI } from "../shared/ui/Button";


export default function AuctionsPage() {
  const { items: groups } = useGroups();
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const activeGroupId = selectedGroupId || (groups.length > 0 ? groups[0].id : "");

  const { items: auctions, isLoading: IsLoadingAuctions } = useAuctionsData(activeGroupId);

  // Стан для "заглиблення" в акаунти
  const [view, setView] = useState<'auctions' | 'accounts'>('auctions');
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);

  const handleGroupChange = (id: string) => {
    setSelectedGroupId(id);
    setView('auctions'); // При зміні групи повертаємось до списку аукціонів
  };

  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalEditGroupOpen, setModalEditGroupOpen] = useState(false);

  // Обробка кліку по аукціону
  const handleAuctionClick = (auction: Auction) => {
    setSelectedAuction(auction);
    setView('accounts');
  };

  const handleBackToAuctions = () => {
    setView('auctions');
    setSelectedAuction(null);
  };


  return (
    <Box>
      <Box sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", sm: "center" },
        gap: 2,
        mb: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {view === 'accounts' && (
            <Button onClick={handleBackToAuctions} startIcon={<ArrowBack />} sx={{ color: 'text.secondary' }}>
              Назад
            </Button>
          )}
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#1a1a1a" }}>
            {view === 'auctions' ? "Аукціони" : `Акаунти: ${selectedAuction?.title}`}
          </Typography>
        </Box>

        {view === 'auctions' && (
          <Can roles={['GroupAdmin', 'SuperAdmin', "Admin"]}>
            <ButtonUI onClick={() => setModalOpen(true)} styles={{ width: { xs: "100%", sm: "auto" } }}>
              <Add /> Створити групу
            </ButtonUI>
          </Can>
        )}
      </Box>

      {/* Ховаємо таби груп, коли ми всередині акаунтів, щоб не плутати юзера */}
      {view === 'auctions' && (
        <>
          <AuctionsGroup
            groups={groups}
            activeGroupId={activeGroupId}
            setActiveGroupId={handleGroupChange}
            onEditGroup={() => setModalEditGroupOpen(true)}
          />
          <EditGroupModal
            current_group={groups.find((group: Group) => group.id === activeGroupId)}
            isModalOpen={isModalEditGroupOpen}
            handleClose={() => setModalEditGroupOpen(false)}
            modal_title="Редагувати групу"
          />
        </>
      )}

      {IsLoadingAuctions ? (
        <Typography variant="body1" color="text.secondary">Завантаження...</Typography>
      ) : (
        <Grid container spacing={3}>
          {view === 'auctions' ? (
            <AuctionsList
              currentGroupId={activeGroupId}
              filteredAuctions={auctions}
              onAuctionClick={handleAuctionClick}
            />
          ) : (
            selectedAuction && <AccountList currentAuction={selectedAuction} />
          )}
        </Grid>
      )}

      <AddGroupModal handleClose={() => setModalOpen(false)} isModalOpen={isModalOpen} modal_title="Створити групу" />
    </Box>
  );
}