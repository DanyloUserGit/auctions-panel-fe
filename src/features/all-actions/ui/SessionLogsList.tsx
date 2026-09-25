import { Autocomplete, Box, Grid, MenuItem, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../../shared/http';
import { Loader } from '../../../shared/ui/Loader';
import { RoleMap } from '../../auth/model/types';
import { useAuth } from '../../auth/model/useAuth';
import { EVENT_TYPES, fullName } from '../model/labels';
import type { AuctionSession, LogFilters, SessionEventType, SessionStatus } from '../model/types';
import { useDispatcherSessions, useLogs } from '../model/useSessionLogs';
import { useAuditLog } from '../model/audit';
import AuditList from './AuditList';
import LogEventItem from './LogEventItem';
import SessionFinishModal from './SessionFinishModal';
import SessionLogCard from './SessionLogCard';
import SessionLogModal from './SessionLogModal';

type Option = { id: string; label: string };

const TABS = ['Активні', 'Завершені', 'Заборонені дії', 'Інциденти', 'Журнал подій', 'Входи', 'Дії адмінів'] as const;

// «Всі дії» - диспетчерська сесій (ТЗ 10): SA бачить усі групи, GA - лише свою.
const SessionLogList: React.FC = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === RoleMap.SuperAdmin;
  const [searchParams] = useSearchParams();
  // «Перейти в лог» зі списку працівників відкриває журнал подій цього користувача.
  const [tab, setTab] = useState(searchParams.get('userId') ? 4 : 0);
  const [filters, setFilters] = useState<LogFilters>({
    take: 60,
    sortBy: 'time',
    sortOrder: 'desc',
    userId: searchParams.get('userId') ?? undefined,
  });
  const [logSession, setLogSession] = useState<{ id: string; title?: string } | null>(null);
  const [toTerminate, setToTerminate] = useState<AuctionSession | null>(null);

  const isSessionsTab = tab <= 1;
  const active = useDispatcherSessions(true, filters, tab === 0);
  const closed = useDispatcherSessions(false, filters, tab === 1);
  const forbidden = useLogs('forbidden', filters, tab === 2);
  const incidents = useLogs('incidents', filters, tab === 3);
  const allLogs = useLogs('all', filters, tab === 4);
  const auditFilters = { userId: filters.userId, search: filters.search, startDate: filters.startDate, endDate: filters.endDate, take: 100 };
  const logins = useAuditLog({ ...auditFilters, category: 'Auth' }, tab === 5);
  const adminActions = useAuditLog({ ...auditFilters, category: 'Admin' }, tab === 6);
  const isAuditTab = tab >= 5;

  const { data: users = [] } = useQuery<Option[]>({
    queryKey: ['dispatcher-filter', 'users'],
    queryFn: async () =>
      ((await api.get('/users')).data as { id: string; firstName: string; lastName: string; email: string }[]).map((u) => ({
        id: u.id,
        label: `${fullName(u)} (${u.email})`,
      })),
  });
  const { data: auctions = [] } = useQuery<Option[]>({
    queryKey: ['dispatcher-filter', 'auctions'],
    queryFn: async () => ((await api.get('/auctions/search')).data as { id: string; title: string }[]).map((a) => ({ id: a.id, label: a.title })),
  });
  const { data: groups = [] } = useQuery<Option[]>({
    queryKey: ['dispatcher-filter', 'user-groups'],
    queryFn: async () => ((await api.get('/user-groups')).data as { id: string; name: string }[]).map((g) => ({ id: g.id, label: g.name })),
    enabled: isSuperAdmin,
  });

  const set = <K extends keyof LogFilters>(key: K, value: LogFilters[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));

  const openSessionLog = (sessionId: string, title?: string) => setLogSession({ id: sessionId, title });

  const picker = (label: string, options: Option[], key: 'userId' | 'auctionId' | 'userGroupId') => (
    <Autocomplete
      size="small"
      options={options}
      value={options.find((o) => o.id === filters[key]) ?? null}
      onChange={(_, v) => set(key, v?.id)}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );

  const current = [active, closed, forbidden, incidents, allLogs, logins, adminActions][tab];
  const sessions = (tab === 0 ? active.data?.data : closed.data?.data) ?? [];
  const logs = (tab === 2 ? forbidden.data : tab === 3 ? incidents.data : allLogs.data) ?? [];

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }} variant="scrollable">
        {TABS.map((label) => (
          <Tab key={label} label={label} />
        ))}
      </Tabs>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            size="small"
            label={isSessionsTab ? 'Пошук: ID сесії, користувач, аукціон, акаунт' : 'Пошук: текст події, ID сесії, користувач, аукціон'}
            value={filters.search || ''}
            onChange={(e) => set('search', e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>{picker('Користувач', users, 'userId')}</Grid>
        {!isAuditTab && <Grid size={{ xs: 12, sm: 6, md: 4 }}>{picker('Аукціон', auctions, 'auctionId')}</Grid>}
        {isSuperAdmin && !isAuditTab && <Grid size={{ xs: 12, sm: 6, md: 4 }}>{picker('Група користувачів', groups, 'userGroupId')}</Grid>}
        <Grid size={{ xs: 6, md: 2 }}>
          <TextField fullWidth type="date" size="small" label="Від" slotProps={{ inputLabel: { shrink: true } }} value={filters.startDate || ''} onChange={(e) => set('startDate', e.target.value)} />
        </Grid>
        <Grid size={{ xs: 6, md: 2 }}>
          <TextField fullWidth type="date" size="small" label="До" slotProps={{ inputLabel: { shrink: true } }} value={filters.endDate || ''} onChange={(e) => set('endDate', e.target.value)} />
        </Grid>
        {tab === 1 && (
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField select fullWidth size="small" label="Статус" value={filters.status || ''} onChange={(e) => set('status', e.target.value as SessionStatus)}>
              <MenuItem value="">Усі завершені</MenuItem>
              <MenuItem value="ended">Завершена</MenuItem>
              <MenuItem value="error">Помилка</MenuItem>
            </TextField>
          </Grid>
        )}
        {tab === 4 && (
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField select fullWidth size="small" label="Тег" value={filters.eventType || ''} onChange={(e) => set('eventType', e.target.value as SessionEventType)}>
              <MenuItem value="">Усі теги</MenuItem>
              {Object.entries(EVENT_TYPES).map(([key, val]) => (
                <MenuItem key={key} value={key}>
                  {val.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        )}
        {!isSessionsTab && !isAuditTab && (
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Сортування"
              value={`${filters.sortBy}:${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split(':') as ['time' | 'tag', 'asc' | 'desc'];
                setFilters((prev) => ({ ...prev, sortBy, sortOrder }));
              }}
            >
              <MenuItem value="time:desc">Час: новіші спочатку</MenuItem>
              <MenuItem value="time:asc">Час: старіші спочатку</MenuItem>
              <MenuItem value="tag:asc">За тегом</MenuItem>
            </TextField>
          </Grid>
        )}
      </Grid>

      {current.isLoading ? (
        <Loader />
      ) : isAuditTab ? (
        <AuditList entries={(tab === 5 ? logins.data : adminActions.data) ?? []} />
      ) : isSessionsTab ? (
        <Grid container spacing={2}>
          {sessions.length ? (
            sessions.map((session) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={session.id}>
                <SessionLogCard
                  session={session}
                  canTerminate={tab === 0}
                  onViewLog={(s) => openSessionLog(s.id, `${s.auction.title} · ${s.account.title}`)}
                  onTerminate={setToTerminate}
                />
              </Grid>
            ))
          ) : (
            <Typography sx={{ mt: 4, width: '100%', textAlign: 'center' }}>
              {tab === 0 ? 'Активних сесій не знайдено' : 'Завершених сесій не знайдено'}
            </Typography>
          )}
        </Grid>
      ) : (
        <Stack spacing={2}>
          {logs.length ? (
            logs.map((log) => (
              <LogEventItem
                key={log.id}
                log={log}
                onOpenSession={(id) => openSessionLog(id, log.session ? `${log.session.auction.title} · ${log.session.account.title}` : undefined)}
              />
            ))
          ) : (
            <Typography>Подій не знайдено</Typography>
          )}
        </Stack>
      )}

      <SessionLogModal session={logSession} onClose={() => setLogSession(null)} />
      <SessionFinishModal isModalOpen={!!toTerminate} handleClose={() => setToTerminate(null)} currentSession={toTerminate} />
    </Box>
  );
};

export default SessionLogList;
