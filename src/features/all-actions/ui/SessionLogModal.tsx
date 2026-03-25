import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import type { AuctionSession, LogFilters } from '../model/types';
import { useSessionLogsHistory } from '../model/useSessionLogs';

interface SessionLogModalProps {
  session: AuctionSession | null;
  onClose: () => void;
}

const EventTypeMap: Record<
  string,
  {
    label: string;
    color: 'error' | 'warning' | 'info' | 'default' | 'primary' | 'secondary';
  }
> = {
  ForbiddenAction: { label: 'Заборонена дія', color: 'error' },
  SessionError: { label: 'Помилка сесії', color: 'warning' },
  Navigation: { label: 'Перехід', color: 'info' },
  TextInput: { label: 'Введення тексту', color: 'default' },
  ButtonClick: { label: 'Натиск кнопки', color: 'primary' },
  Other: { label: 'Інше', color: 'secondary' },
};

const SessionLogModal: React.FC<SessionLogModalProps> = ({
  session,
  onClose,
}) => {
  const [filters, setFilters] = useState<LogFilters>({ take: 100 });
  const [onlyIncidents, setOnlyIncidents] = useState(false);
  const [onlyForbidden, setOnlyForbidden] = useState(false);

  const { data: logs = [], isLoading } = useSessionLogsHistory(session?.id, {
    ...filters,
    isIncident: onlyIncidents ? true : undefined,
    eventType: onlyForbidden ? 'ForbiddenAction' : filters.eventType,
  });

  if (!session) return null;

  const handleFilterChange = <K extends keyof LogFilters>(
    key: K,
    value: LogFilters[K],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
  };

  return (
    <Dialog
      open={!!session}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle>
        Лог сесії: {session.users?.[0]?.email || 'Невідомий користувач'}
        <Typography variant="caption" display="block" color="text.secondary">
          Аукціон: {session.auction?.title} | ID: {session.id}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {/* Панель фільтрів логу */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <TextField
            size="small"
            label="Пошук по тексту"
            sx={{ flexGrow: 1 }}
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
          <TextField
            select
            size="small"
            label="Тип події"
            sx={{ minWidth: 150 }}
            value={filters.eventType || ''}
            onChange={(e) => handleFilterChange('eventType', e.target.value)}
            disabled={onlyForbidden}
          >
            <MenuItem value="">Всі події</MenuItem>
            {Object.entries(EventTypeMap).map(([key, val]) => (
              <MenuItem key={key} value={key}>
                {val.label}
              </MenuItem>
            ))}
          </TextField>
          <FormControlLabel
            control={
              <Switch
                checked={onlyIncidents}
                onChange={(e) => setOnlyIncidents(e.target.checked)}
              />
            }
            label="Тільки інциденти"
          />
          <FormControlLabel
            control={
              <Switch
                checked={onlyForbidden}
                onChange={(e) => setOnlyForbidden(e.target.checked)}
              />
            }
            label="Тільки заборонені"
          />
        </Stack>

        {/* Стрічка подій (Timeline) */}
        {isLoading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : logs.length > 0 ? (
          <Stack spacing={2}>
            {logs.map((log) => {
              const typeInfo =
                EventTypeMap[log.eventType] || EventTypeMap['Other'];
              return (
                <Paper
                  key={log.id}
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderLeft: 4,
                    borderColor: `${typeInfo.color}.main`,
                    backgroundColor: log.isIncident ? 'error.50' : 'inherit',
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={typeInfo.label}
                        color={typeInfo.color}
                        size="small"
                      />
                      {log.isIncident && (
                        <Chip
                          label="Інцидент"
                          color="error"
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      {dayjs(log.createdAt).format('HH:mm:ss (DD.MM.YYYY)')}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                    {log.message}
                  </Typography>
                  {log.details && Object.keys(log.details).length > 0 && (
                    <Box
                      sx={{
                        mt: 1,
                        p: 1,
                        bgcolor: 'grey.100',
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        fontFamily: 'monospace',
                      }}
                    >
                      {JSON.stringify(log.details)}
                    </Box>
                  )}
                </Paper>
              );
            })}
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
