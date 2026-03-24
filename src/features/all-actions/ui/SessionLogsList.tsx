import {
  Alert,
  Box,
  Grid,
  MenuItem,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import React, { useMemo, useState } from 'react';

import { Loader } from '../../../shared/ui/Loader';
import { RoleMap } from '../../auth/model/types';
import { useAuth } from '../../auth/model/useAuth';
import {
  useActiveSessions,
  useClosedSessions,
  useTerminateSession,
} from '../model/useSessionLogs';
import type { SessionLog } from './../model/types';
import SessionLogCard from './SessionLogCard';

const SessionLogList: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [groupFilter, setGroupFilter] = useState<string>('all');

  // React Query хуки
  const {
    data: activeSessions = [],
    isLoading: isActiveLoading,
    isError: isActiveError,
  } = useActiveSessions(50);

  const {
    data: closedSessions = [],
    isLoading: isClosedLoading,
    isError: isClosedError,
  } = useClosedSessions(50);

  const terminateMutation = useTerminateSession();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleViewLog = (session: SessionLog) => {
  };

  const handleTerminate = (sessionId: string, userFullName: string) => {
    const confirm = window.confirm(
      `Ви впевнені, що хочете завершити сесію (відповідальний: ${userFullName})?`,
    );
    if (confirm) {
      terminateMutation.mutate(sessionId);
    }
  };

  // Об'єднуємо дані для вкладки "Всі сесії"
  const allSessionsData = useMemo(() => {
    return [...activeSessions, ...closedSessions];
  }, [activeSessions, closedSessions]);

  // Фільтрація
  const filteredSessions = useMemo(() => {
    const sourceData = tabValue === 0 ? activeSessions : allSessionsData;

    return sourceData.filter((session) => {
      if (user?.role === RoleMap.Admin && session.group !== user.auctionGroupId)
        return false;

      if (
        user?.role === RoleMap.SuperAdmin &&
        groupFilter !== 'all' &&
        session.group !== groupFilter
      )
        return false;

      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        const userFullName = `${session?.endedBy?.email}`;
        const auctionIdStr = String(session.auction.title).toLowerCase();

        return (
          userFullName.includes(lowerQuery) ||
          auctionIdStr.includes(lowerQuery) ||
          session.time.toLowerCase().includes(lowerQuery)
        );
      }

      return true;
    });
  }, [
    tabValue,
    searchQuery,
    groupFilter,
    user,
    activeSessions,
    allSessionsData,
  ]);

  const isLoading = isActiveLoading || isClosedLoading;
  const isError = isActiveError || isClosedError;

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h5" gutterBottom>
        Диспетчерська активних сесій
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label={`Активні (${activeSessions.length})`} />
          <Tab label="Всі сесії" />
        </Tabs>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: user?.role === RoleMap.SuperAdmin ? 8 : 12 }}>
          <TextField
            fullWidth
            size="small"
            label="Пошук (Користувач / Аукціон / Час)"
            variant="outlined"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
          />
        </Grid>

        {user?.role === RoleMap.SuperAdmin && (
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Фільтр за групою"
              value={groupFilter}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setGroupFilter(e.target.value)
              }
            >
              <MenuItem value="all">Всі групи</MenuItem>
              <MenuItem value="Група А">Група А</MenuItem>
              <MenuItem value="Група Б">Група Б</MenuItem>
            </TextField>
          </Grid>
        )}
      </Grid>

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Сталася помилка при завантаженні даних сесій.
        </Alert>
      )}

      {isLoading ? (
        <Loader />
      ) : (
        <Grid container spacing={2}>
          {filteredSessions.length > 0 ? (
            filteredSessions.map((session) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={session.id}>
                <SessionLogCard
                  session={session}
                  canTerminate={user?.role === RoleMap.SuperAdmin}
                  onViewLog={handleViewLog}
                  onTerminate={handleTerminate}
                />
              </Grid>
            ))
          ) : (
            <Grid size={{ xs: 12 }}>
              <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
                Сесій не знайдено
              </Typography>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default SessionLogList;
