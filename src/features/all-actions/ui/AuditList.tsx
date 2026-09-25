import { Chip, Paper, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { fullName } from '../model/labels';
import type { AuditEntry } from '../model/audit';

const AUTH_ACTIONS: Record<string, { label: string; color: 'success' | 'error' | 'default' }> = {
  'login.success': { label: 'Вхід', color: 'success' },
  'login.failed': { label: 'Невдалий вхід', color: 'error' },
  logout: { label: 'Вихід', color: 'default' },
};

export default function AuditList({ entries }: { entries: AuditEntry[] }) {
  if (!entries.length) return <Typography>Записів не знайдено</Typography>;
  return (
    <Stack spacing={1.5}>
      {entries.map((entry) => {
        const auth = AUTH_ACTIONS[entry.action];
        return (
          <Paper key={entry.id} variant="outlined" sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1} flexWrap="wrap" mb={0.5}>
              <Chip size="small" label={auth?.label ?? entry.action} color={auth?.color ?? 'primary'} variant="outlined" />
              <Typography variant="caption" color="text.secondary">
                {dayjs(entry.createdAt).format('DD.MM.YYYY HH:mm:ss')}
                {entry.ip ? ` · IP ${entry.ip}` : ''}
              </Typography>
            </Stack>
            <Typography variant="body2">{entry.message}</Typography>
            <Typography variant="caption" color="text.secondary">
              {entry.actor ? `Хто: ${fullName(entry.actor)} (${entry.actor.email})` : 'Хто: система / невідомий користувач'}
              {entry.targetUser && entry.targetUser.id !== entry.actor?.id ? ` · Кого стосується: ${fullName(entry.targetUser)}` : ''}
            </Typography>
          </Paper>
        );
      })}
    </Stack>
  );
}
