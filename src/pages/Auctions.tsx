import { Add, ArrowBack, SortByAlpha } from "@mui/icons-material";
import { Box, Button, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
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
import { useSession } from "../features/sessions/model/store";
import { useSessionsData } from "../features/sessions/model/useSessionData";
import { ButtonUI } from "../shared/ui/Button";
import SessionList from "../features/sessions/ui/SessionList";
import GroupSearch from "../features/groups/ui/GroupSearch";


export default function AuctionsPage() {
  const { items: groups } = useGroups();
  const sessionConnect = useSession();
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const activeGroupId = selectedGroupId || (groups.length > 0 ? groups[0].id : "");

  const { items: auctions, isLoading: IsLoadingAuctions } = useAuctionsData(activeGroupId);
  const { items: sessions, isLoading: isLoadingSessions } = useSessionsData(sessionConnect.auctionAuthId);

  const [view, setView] = useState<'auctions' | 'accounts' | 'sessions'>('auctions');
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);

  const handleGroupChange = (id: string) => {
    setSelectedGroupId(id);
    setView('auctions');
  };

  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalEditGroupOpen, setModalEditGroupOpen] = useState(false);

  const handleAuctionClick = (auction: Auction) => {
    sessionConnect.setAuctionId(auction.id)
    setSelectedAuction(auction);
    setView('accounts');
  };

  const handleBackToAuctions = () => {
    setView('auctions');
    setSelectedAuction(null);
  };

  const handleAuctionAuthClick = () => {
    setView("sessions");
  }

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isAlphabetical, setisAlphabetical] = useState(false)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);



  const filteredGroups = useMemo(() => {
    // 1. Фільтрація
    let result = groups;
    if (debouncedSearch.trim()) {
      const searchLower = debouncedSearch.toLowerCase();
      result = groups.filter((group: Group) =>
        group.title.toLowerCase().includes(searchLower)
      );
    }

    // 2. Сортування (якщо активовано)
    if (isAlphabetical) {
      // Створюємо копію [...result], бо sort змінює оригінальний масив
      return [...result].sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [groups, debouncedSearch, isAlphabetical]);
  // 2. Логіка для автоматичного вибору активної групи
  // Якщо після пошуку активна група зникла з результатів, обираємо першу зі знайдених
  useEffect(() => {
    if (filteredGroups.length > 0) {
      const isActiveVisible = filteredGroups.some(g => g.id === activeGroupId);
      if (!isActiveVisible) {
        setSelectedGroupId(filteredGroups[0].id);
      }
    }
  }, [filteredGroups, activeGroupId]);

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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'baseline' }}>
          {(view === 'accounts' || view === "sessions") && (
            <Button onClick={handleBackToAuctions} startIcon={<ArrowBack />} sx={{ color: 'text.secondary' }}>
              Назад
            </Button>
          )}
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#1a1a1a" }}>
            {view === 'auctions' ? "Аукціони" : view === 'accounts' ? `Акаунти: ${selectedAuction?.title}` : "Сесії"}
          </Typography>
        </Box>

        <GroupSearch onSearch={(val) => setSearch(val)} />
        <Tooltip title={isAlphabetical ? "Скинути сортування" : "Сортувати А-Я"}>
          <IconButton
            onClick={() => setisAlphabetical(!isAlphabetical)}
            sx={{
              border: "1px solid",
              borderColor: isAlphabetical ? "primary.main" : "divider",
              color: isAlphabetical ? "primary.main" : "text.secondary",
              borderRadius: "12px",
              height: "40px", // Щоб висота збігалася з TextField
              width: "40px",
              bgcolor: isAlphabetical ? "rgba(25, 118, 210, 0.04)" : "transparent",
              "&:hover": {
                bgcolor: isAlphabetical ? "rgba(25, 118, 210, 0.08)" : "rgba(0, 0, 0, 0.04)",
              }
            }}
          >
            <SortByAlpha />
          </IconButton>
        </Tooltip>

        {view === 'auctions' && (
          <Can roles={['GroupAdmin', 'SuperAdmin', "Admin"]}>
            <ButtonUI onClick={() => setModalOpen(true)} styles={{ width: { xs: "100%", sm: "auto" } }}>
              <Add /> Створити групу
            </ButtonUI>
          </Can>
        )}
      </Box>

      {view === 'auctions' && (
        <>

          <AuctionsGroup
            groups={filteredGroups}
            activeGroupId={activeGroupId}
            setActiveGroupId={handleGroupChange}
            onEditGroup={() => setModalEditGroupOpen(true)}
          />
          {/* Повідомлення, якщо пошук порожній */}
          {filteredGroups.length === 0 && debouncedSearch && (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                Груп за запитом "<b>{debouncedSearch}</b>" не знайдено
              </Typography>
            </Box>
          )}
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
            (selectedAuction && view !== 'sessions') && <AccountList changeView={handleAuctionAuthClick} currentAuction={selectedAuction} />
          )}
        </Grid>
      )}

      {isLoadingSessions ? (
        <Typography variant="body1" color="text.secondary">Завантаження...</Typography>
      ) : (
        <Grid container spacing={3}>
          {view === 'sessions' ? (
            <SessionList
              sessions={sessions}
            />
          ) : (
            <></>
          )}
        </Grid>
      )}
      <AddGroupModal handleClose={() => setModalOpen(false)} isModalOpen={isModalOpen} modal_title="Створити групу" />
    </Box>
  );
}