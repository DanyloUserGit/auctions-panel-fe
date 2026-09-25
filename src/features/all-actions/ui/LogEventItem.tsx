import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { EVENT_TYPES, fullName } from '../model/labels';
import type { SessionEventLog } from '../model/types';

// Подія журналу: час, тег, опис і прив'язка до сесії, користувача, аукціону та акаунта (ТЗ 9).
export default function LogEventItem({ log, onOpenSession }: { log: SessionEventLog; onOpenSession?: (sessionId: string) => void }) {
  const type = EVENT_TYPES[log.eventType] ?? EVENT_TYPES.Other;
  return (
    <Paper
      variant="outlined"
      sx={{ p: 2, borderLeft: 4, borderColor: `${type.color === 'default' ? 'grey' : type.color}.main` }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1} gap={1} flexWrap="wrap">
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip label={type.label} color={type.color} size="small" />
          {log.isIncident && <Chip label="Інцидент" color="error" size="small" variant="outlined" />}
        </Stack>
        <Typography variant="caption" color="text.secondary">
          {dayjs(log.createdAt).format('DD.MM.YYYY HH:mm:ss')}
        </Typography>
      </Stack>
      <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
        {log.message}
      </Typography>
      <Box sx={{ mt: 1 }}>
        <Typography variant="caption" color="text.secondary" component="div">
          {[
            log.user ? `Користувач: ${fullName(log.user)} (${log.user.email})` : null,
            log.session ? `Аукціон: ${log.session.auction.title}` : null,
            log.session ? `Акаунт: ${log.session.account.title}` : null,
            `Сесія: ${log.sessionId}`,
          ]
            .filter(Boolean)
            .join(' · ')}
        </Typography>
      </Box>
      {onOpenSession && (
        <Button size="small" sx={{ mt: 1 }} onClick={() => onOpenSession(log.sessionId)}>
          Лог сесії
        </Button>
      )}
    </Paper>
  );
}
