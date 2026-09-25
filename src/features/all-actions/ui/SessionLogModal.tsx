import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { EVENT_TYPES } from '../model/labels';
import type { LogFilters, SessionEventType } from '../model/types';
import { useSessionLogsHistory } from '../model/useSessionLogs';
import LogEventItem from './LogEventItem';

interface SessionLogModalProps {
  session: { id: string; title?: string } | null;
  onClose: () => void;
}

// «Лог сесії»: стрічка подій з тегами, пошуком, фільтрами та сортуванням (ТЗ 9, 10).
const SessionLogModal: React.FC<SessionLogModalProps> = ({ session, onClose }) => {
  const [filters, setFilters] = useState<LogFilters>({ take: 200, sortBy: 'time', sortOrder: 'desc' });
  const [onlyIncidents, setOnlyIncidents] = useState(false);
  const [onlyForbidden, setOnlyForbidden] = useState(false);

  const { data: logs = [], isLoading } = useSessionLogsHistory(session?.id, {
    ...filters,
    isIncident: onlyIncidents ? true : undefined,
    eventType: onlyForbidden ? 'ForbiddenAction' : filters.eventType,
  });

  if (!session) return null;

  const set = <K extends keyof LogFilters>(key: K, value: LogFilters[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth scroll="paper">
      <DialogTitle>
        Лог сесії {session.title ? `· ${session.title}` : ''}
        <Typography variant="caption" display="block" color="text.secondary">
          ID: {session.id}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }} flexWrap="wrap" useFlexGap>
          <TextField size="small" label="Пошук (текст, користувач)" sx={{ flexGrow: 1 }} value={filters.search || ''} onChange={(e) => set('search', e.target.value)} />
          <TextField select size="small" label="Тег" sx={{ minWidth: 170 }} value={filters.eventType || ''} onChange={(e) => set('eventType', e.target.value as SessionEventType)} disabled={onlyForbidden}>
            <MenuItem value="">Усі теги</MenuItem>
            {Object.entries(EVENT_TYPES).map(([key, val]) => (
              <MenuItem key={key} value={key}>
                {val.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            label="Сортування"
            sx={{ minWidth: 190 }}
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
          <FormControlLabel control={<Switch checked={onlyIncidents} onChange={(e) => setOnlyIncidents(e.target.checked)} />} label="Тільки інциденти" />
          <FormControlLabel control={<Switch checked={onlyForbidden} onChange={(e) => setOnlyForbidden(e.target.checked)} />} label="Тільки заборонені" />
        </Stack>

        {isLoading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : logs.length > 0 ? (
          <Stack spacing={2}>
            {logs.map((log) => (
              <LogEventItem key={log.id} log={log} />
            ))}
          </Stack>
        ) : (
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            Подій за цими критеріями не знайдено
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Закрити
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionLogModal;
