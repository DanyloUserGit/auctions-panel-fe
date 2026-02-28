import { Add } from "@mui/icons-material";
import {
  Box,
  Typography
} from "@mui/material";
import { useState } from "react";
import AddGroupModal from "../components/ui/AddGroupModal";
import AccountSelectModal from "../components/ui/AuctionSelectModal";
import AuctionsGroup from "../components/ui/AuctionsGroup";
import AuctionsList from "../components/ui/AuctionsList";
import { ButtonUI } from "../components/ui/Button";
import EditGroupModal from "../components/ui/EditGroupModal";
import { useAuctionsData } from "../hooks/useAuctions";
import { useGroups } from "../hooks/useGroups";
import type { Auction, Group } from "../shemas/schemas";



export default function AuctionsPage() {
  const { items: groups,
  } = useGroups();

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // Поточний ID — це або той, що вибрав користувач, або ID першої групи
  const activeGroupId = selectedGroupId || (groups.length > 0 ? groups[0].id : "");

  // Тепер використовуємо activeGroupId для запиту аукціонів
  const { items: auctions, isLoading: IsLoadingAuctions } = useAuctionsData(activeGroupId);

  const handleGroupChange = (id: string) => {
    setSelectedGroupId(id);
  };

  const [isModalOpen, setModalOpen] = useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);


  const [isModalEditGroupOpen, setModalEditGroupOpen] = useState(false);
  const handleOpenEditGroup = () => setModalEditGroupOpen(true)
  const handleCloseEditGroup = () => setModalEditGroupOpen(false)


  const [selectedAuction, setSelectedAuction] = useState<Auction>();
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  const handleAuctionClick = (auction: Auction) => {
    setSelectedAuction(auction);
    setIsAccountModalOpen(true);
  };

  return (
    <Box>
      <Box sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", sm: "center" }, // Вирівнювання по центру на ПК
        gap: 2,
        mb: 3
      }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#1a1a1a" }}>
          Аукціони
        </Typography>

        {/* КНОПКА ВІДКРИТТЯ МОДАЛКИ */}
        <ButtonUI
          onClick={handleOpen}
          styles={{ width: { xs: "100%", sm: "auto" } }}
        >
          <Add />
          Створити групу
        </ButtonUI>

        {/* МОДАЛЬНЕ ВІКНО */}
        <AddGroupModal handleClose={handleClose} isModalOpen={isModalOpen} modal_title="Створити групу" />
      </Box>

      <AuctionsGroup
        groups={groups}
        activeGroupId={activeGroupId}
        setActiveGroupId={handleGroupChange}
        onEditGroup={() => {
          handleOpenEditGroup();
        }}
      />
      <EditGroupModal current_group={groups.find((group: Group) => group.id === activeGroupId)} isModalOpen={isModalEditGroupOpen} handleClose={handleCloseEditGroup} modal_title="Редагувати групу" />

      {IsLoadingAuctions ? (
        <Typography variant="body1" color="text.secondary">
          Завантаження аукціонів...
        </Typography>
      ) : (
        <>
          <AuctionsList filteredAuctions={auctions} onAuctionClick={handleAuctionClick} />
          <AccountSelectModal
            open={isAccountModalOpen}
            onClose={() => setIsAccountModalOpen(false)}
            auctionTitle={selectedAuction?.title || ""}
            auctionId={selectedAuction?.id || ""}
          />
        </>

      )}
    </Box>
  );
}