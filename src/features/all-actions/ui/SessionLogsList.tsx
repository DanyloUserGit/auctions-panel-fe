import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import React, { useState } from 'react';

import { Loader } from '../../../shared/ui/Loader';
import { RoleMap } from '../../auth/model/types';
import { useAuth } from '../../auth/model/useAuth';
import {
  useActiveSessions,
  useClosedSessions,
  useForbiddenLogs,
  useIncidentLogs,
  useTerminateSession,
} from '../model/useSessionLogs';
import type {
  AuctionSession,
  LogFilters,
  SessionEventLog,
} from './../model/types';
import SessionLogCard from './SessionLogCard';
import SessionLogModal from './SessionLogModal';

const SessionLogList: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState<number>(0);

  const [filters, setFilters] = useState<LogFilters>({ take: 50 });

  const [selectedSessionForLog, setSelectedSessionForLog] =
    useState<AuctionSession | null>(null);

  const { data: activeSessions = [], isLoading: isActiveLoading } =
    useActiveSessions(filters);
  const { data: closedSessions = [], isLoading: isClosedLoading } =
    useClosedSessions(filters);
  const { data: forbiddenLogs = [], isLoading: isForbiddenLoading } =
    useForbiddenLogs(filters);
  const { data: incidentLogs = [], isLoading: isIncidentLoading } =
    useIncidentLogs(filters);

  const terminateMutation = useTerminateSession();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleFilterChange = <K extends keyof LogFilters>(
    key: K,
    value: LogFilters[K],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
  };

  const handleViewLog = (session: AuctionSession) => {
    setSelectedSessionForLog(session);
  };

  const gotoSession = (sessionId: string) => {
    setTabValue(1);

    setTimeout(() => {
      const element = document.getElementById(sessionId);

      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });

        element.style.transition = 'box-shadow 0.5s ease-in-out';
        element.style.boxShadow = '0 0 15px 2px rgba(25, 118, 210, 0.6)';

        setTimeout(() => {
          element.style.boxShadow = 'none';
        }, 2000);
      }
    }, 100);
  };

  const handleTerminate = (sessionId: string) => {
    if (
      window.confirm('Ви впевнені, що хочете примусово завершити цю сесію?')
    ) {
      terminateMutation.mutate(sessionId);
    }
  };

  const isLoading =
    isActiveLoading ||
    isClosedLoading ||
    isForbiddenLoading ||
    isIncidentLoading;

  // Компонент для відображення одного запису логу (Інциденти / Заборонені)
  const renderLogEvent = (log: SessionEventLog) => (
    <Paper key={log.id} variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Stack direction="row" justifyContent="space-between" mb={1}>
        <Typography variant="subtitle2" color="error">
          {log.eventType} {log.isIncident && '(Інцидент)'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {dayjs(log.createdAt).format('YYYY-MM-DD HH:mm:ss')}
        </Typography>
      </Stack>
      <Typography variant="body1">{log.message}</Typography>
      {log.user && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Користувач: {log.user.email}
        </Typography>
      )}
      <Button
        size="small"
        sx={{ mt: 1 }}
        onClick={() => gotoSession(log.sessionId)}
      >
        Перейти до сесії
      </Button>
    </Paper>
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Активні" />
        <Tab label="Завершені" />
        <Tab label="Заборонені дії" />
        <Tab label="Інциденти" />
      </Tabs>

      {/* Панель фільтрів */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            size="small"
            label="Пошук (повідомлення / користувач)"
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            type="date"
            size="small"
            label="Початкова дата"
            InputLabelProps={{ shrink: true }}
            value={filters.startDate || ''}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            type="date"
            size="small"
            label="Кінцева дата"
            InputLabelProps={{ shrink: true }}
            value={filters.endDate || ''}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
          />
        </Grid>
        {user?.role === RoleMap.SuperAdmin && (
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              size="small"
              label="ID Групи (тільки SA)"
              value={filters.auctionGroupId || ''}
              onChange={(e) =>
                handleFilterChange('auctionGroupId', e.target.value)
              }
            />
          </Grid>
        )}
      </Grid>

      {isLoading ? (
        <Loader />
      ) : (
        <Box>
          {/* ТАБ 0: АКТИВНІ */}
          {tabValue === 0 && (
            <Grid container spacing={2}>
              {activeSessions.length > 0 ? (
                activeSessions.map((session) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={session.id}>
                    <SessionLogCard
                      session={session}
                      canTerminate={true}
                      onViewLog={handleViewLog}
                      onTerminate={handleTerminate}
                    />
                  </Grid>
                ))
              ) : (
                <Typography sx={{ mt: 4, width: '100%', textAlign: 'center' }}>
                  Активних сесій не знайдено
                </Typography>
              )}
            </Grid>
          )}

          {/* ТАБ 1: ЗАВЕРШЕНІ */}
          {tabValue === 1 && (
            <Grid container spacing={2}>
              {closedSessions.length > 0 ? (
                closedSessions.map((session) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={session.id}>
                    <SessionLogCard
                      session={session}
                      canTerminate={false}
                      onViewLog={handleViewLog}
                      onTerminate={handleTerminate}
                    />
                  </Grid>
                ))
              ) : (
                <Typography sx={{ mt: 4, width: '100%', textAlign: 'center' }}>
                  Завершених сесій не знайдено
                </Typography>
              )}
            </Grid>
          )}

          {/* ТАБ 2: ЗАБОРОНЕНІ ДІЇ */}
          {tabValue === 2 && (
            <Box>
              {forbiddenLogs.length > 0 ? (
                forbiddenLogs.map(renderLogEvent)
              ) : (
                <Typography>Порушень не виявлено</Typography>
              )}
            </Box>
          )}

          {/* ТАБ 3: ІНЦИДЕНТИ */}
          {tabValue === 3 && (
            <Box>
              {incidentLogs.length > 0 ? (
                incidentLogs.map(renderLogEvent)
              ) : (
                <Typography>Інцидентів не виявлено</Typography>
              )}
            </Box>
          )}
        </Box>
      )}
      <SessionLogModal
        session={selectedSessionForLog}
        onClose={() => setSelectedSessionForLog(null)}
      />
    </Box>
  );
};

export default SessionLogList;
