import { Add, ArrowBack, SortByAlpha } from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography,
  Stack,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router';
import AccountList from '../features/acounts/ui/AccountList';
import type { Auction } from '../features/auctions/model/types';
import { useAuctionsData } from '../features/auctions/model/useAuctions';
import AuctionsList from '../features/auctions/ui/AuctionsList';
import { Can } from '../features/auth/ui/Can';
import type { Group } from '../features/groups/model/types';
import { useGroupByQuery, useGroups } from '../features/groups/model/useGroups';
import AddGroupModal from '../features/groups/ui/AddGroupModal';
import AuctionsGroup from '../features/groups/ui/AuctionsGroup';
import EditGroupModal from '../features/groups/ui/EditGroupModal';
import GroupSearch from '../features/groups/ui/GroupSearch';
import { useSession } from '../features/sessions/model/store';
import { useSessionsData } from '../features/sessions/model/useSessionData';
import SessionList from '../features/sessions/ui/SessionList';
import { useMobile } from '../shared/hooks/useMobile';
import { useModal } from '../shared/hooks/useModal';
import { Loader } from '../shared/ui/Loader';
import { useAuth } from '../features/auth/model/useAuth';
import AutoConnectSession from '../features/sessions/ui/AutoConnectSession';

export default function AuctionsPage() {
  const location = useLocation();
  const { data: groups } = useGroups();
  const sessionConnect = useSession();
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'SuperAdmin';

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isAlphabetical, setisAlphabetical] = useState(false);
  const [view, setView] = useState<'auctions' | 'accounts' | 'sessions'>(
    location.state?.view || 'auctions',
  );
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const { data: searchData } = useGroupByQuery(debouncedSearch);
  const isMobile = useMobile();

  const filteredGroups = useMemo<Group[]>(() => {
    let result = groups ?? [];
    if (debouncedSearch.trim()) {
      result = searchData || [];
    }
    if (isAlphabetical) {
      return [...result].sort((a, b) => a.title.localeCompare(b.title));
    }
    return result;
  }, [searchData, groups, debouncedSearch, isAlphabetical]);

  const activeGroupId = useMemo(() => {
    if (filteredGroups?.length === 0) return '';
    if (
      selectedGroupId &&
      filteredGroups?.some((g) => g.id === selectedGroupId)
    )
      return selectedGroupId;
    return filteredGroups?.at(0)?.id || '';
  }, [filteredGroups, selectedGroupId]);

  const activeGroup = groups?.find(
    (group: Group) => group.id === activeGroupId,
  );

  const { items: auctions, isLoading: IsLoadingAuctions } =
    useAuctionsData(activeGroupId);
  const { items: sessions, isLoading: isLoadingSessions } = useSessionsData(
    sessionConnect.auctionAuthId,
  );

  // Обробники подій
  const handleGroupChange = (id: string) => {
    setSelectedGroupId(id);
    setView('auctions');
  };

  const handleAuctionClick = (auction: Auction) => {
    sessionConnect.setAuctionId(auction.id);
    setSelectedAuction(auction);
    setView('accounts');
  };

  const handleBackToAuctions = () => {
    setView('auctions');
    setSelectedAuction(null);
  };

  const handleAuctionAuthClick = () => {
    setView('sessions');
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Модальні вікна
  const {
    isOpen: isEditGroupOpen,
    open: handleOpenEditGroup,
    close: handleModalEditGroup,
  } = useModal(false);
  const {
    isOpen: isCreateGroupOpen,
    open: handleOpenCreateGroup,
    close: handleCloseCreateGroup,
  } = useModal(false);

  if (isLoadingSessions || IsLoadingAuctions) return <Loader />;
  return (
    <Box sx={{ p: { xs: 2, sm: 0 } }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2,
          pt: 1,
          pb: 4,
          minHeight: '80px',
        }}
      >
        <Stack spacing={1}>
          {(view === 'accounts' || view === 'sessions') && (
            <Button
              onClick={handleBackToAuctions}
              startIcon={<ArrowBack />}
              sx={{ color: 'text.secondary', alignSelf: 'flex-start', p: 0 }}
            >
              Назад до аукціонів
            </Button>
          )}
          {!isMobile && (
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, color: 'text.primary' }}
            >
              {view === 'auctions'
                ? 'Аукціони'
                : view === 'accounts'
                  ? `Акаунти: ${selectedAuction?.title || ''}`
                  : 'Активні сесії'}
            </Typography>
          )}
        </Stack>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems="center"
          sx={{ width: { xs: '100%', md: 'auto' } }}
        >
          {view === 'auctions' && (
            <Stack
              direction="row"
              spacing={1}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              <GroupSearch onSearch={(val) => setSearch(val)} />
              <Tooltip
                title={isAlphabetical ? 'Скинути сортування' : 'Сортувати А-Я'}
              >
                <IconButton
                  onClick={() => setisAlphabetical(!isAlphabetical)}
                  sx={{
                    border: '1px solid',
                    borderColor: isAlphabetical ? 'primary.main' : 'divider',
                    color: isAlphabetical ? 'primary.main' : 'text.secondary',
                    borderRadius: '12px',
                    width: 45,
                    height: 45,
                    bgcolor: isAlphabetical ? 'primary.soft' : 'transparent',
                  }}
                >
                  <SortByAlpha />
                </IconButton>
              </Tooltip>
            </Stack>
          )}

          <Can roles={['SuperAdmin']}>
            {view === 'auctions' && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleOpenCreateGroup}
                sx={{
                  height: 45,
                  px: { xs: 3, sm: 1.5, md: 3 },
                  fontSize: { xs: '0.875rem', sm: '0.8rem', md: '0.875rem' },
                  borderRadius: '12px',
                  width: { xs: '100%', sm: 'auto' },
                  ml: { sm: 1, md: 2 },
                  backgroundColor: 'var(--color-primary)',
                  '&:hover': { backgroundColor: 'var(--color-accent)' },
                  minWidth: 'fit-content',
                }}
              >
                Створити групу
              </Button>
            )}
          </Can>
        </Stack>
      </Box>

      {/* СПИСОК ГРУП */}
      {view === 'auctions' && (
        <>
          <AuctionsGroup
            groups={filteredGroups}
            activeGroupId={activeGroupId}
            setActiveGroupId={handleGroupChange}
            onEditGroup={handleOpenEditGroup}
          />
          {filteredGroups.length === 0 && debouncedSearch && (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <Typography color="text.secondary">
                Груп за запитом "<b>{debouncedSearch}</b>" не знайдено
              </Typography>
            </Box>
          )}
        </>
      )}

      {/* ОСНОВНИЙ КОНТЕНТ (Аукціони / Акаунти / Сесії) */}

      <Box sx={{ mt: 2 }}>
        {view === 'auctions' && (
          <AuctionsList
            currentGroupId={activeGroupId}
            filteredAuctions={auctions}
            onAuctionClick={handleAuctionClick}
          />
        )}

        {view === 'accounts' && selectedAuction && (
          <AccountList
            changeView={handleAuctionAuthClick}
            currentAuction={selectedAuction}
          />
        )}

        {view === 'sessions' && (
          // isSuperAdmin ? (
          //   <SessionList sessions={sessions} />
          // ) : (
          <AutoConnectSession sessions={sessions} />
          // )
        )}
      </Box>

      {/* МОДАЛЬНІ ВІКНА */}
      {activeGroup && (
        <EditGroupModal
          key={activeGroupId}
          current_group={activeGroup}
          isModalOpen={isEditGroupOpen}
          handleClose={handleModalEditGroup}
          modal_title="Редагувати групу"
        />
      )}

      <AddGroupModal
        handleClose={handleCloseCreateGroup}
        isModalOpen={isCreateGroupOpen}
        modal_title="Створити групу"
      />
    </Box>
  );
}
