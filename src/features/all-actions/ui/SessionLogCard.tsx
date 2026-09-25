import { ContentCopy } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';
import { copyText } from '../../../shared/utils';
import { END_REASON, EVENT_TYPES, fullName, SESSION_STATUS } from '../model/labels';
import type { AuctionSession } from '../model/types';

interface SessionCardProps {
  session: AuctionSession;
  canTerminate: boolean;
  onViewLog: (session: AuctionSession) => void;
  onTerminate: (session: AuctionSession) => void;
}

const time = (value?: string | null) => (value ? dayjs(value).format('DD.MM.YYYY HH:mm:ss') : '-');

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <Typography color="text.secondary" variant="body2">
    <strong>{label}:</strong> {children}
  </Typography>
);

// Картка сесії (ТЗ 10): ID, користувачі й кількість підключень, група, аукціон, акаунт,
// час старту, остання активність, завершення, статус, остання подія.
const SessionLogCard: React.FC<SessionCardProps> = ({ session, canTerminate, onViewLog, onTerminate }) => {
  const status = SESSION_STATUS[session.status];
  const groups = [...new Set(session.users.map((u) => u.userGroup?.name).filter(Boolean))];

  return (
    <Card id={session.id} variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1} gap={1}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" noWrap>
              {session.auction?.title} · {session.account?.title}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                {session.id}
              </Typography>
              <Tooltip title="Скопіювати ID сесії">
                <IconButton size="small" onClick={() => copyText(session.id)}>
                  <ContentCopy sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
          <Chip label={status.label} color={status.color} size="small" />
        </Stack>

        <Stack spacing={0.5} mb={2}>
          <Row label="Користувачі">
            {session.users.length
              ? session.users.map((u) => `${fullName(u)}${session.isActive && u.isConnected ? ' ●' : ''}`).join(', ')
              : '-'}
          </Row>
          <Row label="Підключень">
            {session.activeConnections} / {session.maxConnections}
          </Row>
          <Row label="Група">
            {groups.length ? groups.join(', ') : '-'}
            {session.auctionGroup ? ` (група аукціонів: ${session.auctionGroup.title})` : ''}
          </Row>
          <Row label="Старт">{time(session.createdAt)}</Row>
          <Row label="Остання активність">{time(session.lastActivityAt)}</Row>
          {!session.isActive && (
            <Row label="Завершено">
              {time(session.endedAt)}
              {session.endReason ? ` - ${END_REASON[session.endReason]}` : ''}
              {session.endedBy ? ` (${fullName(session.endedBy)})` : ''}
            </Row>
          )}
          {session.errorMessage && <Row label="Помилка">{session.errorMessage}</Row>}
          {session.lastEvent && (
            <Row label="Остання подія">
              [{EVENT_TYPES[session.lastEvent.eventType]?.label}] {session.lastEvent.message.slice(0, 120)} ({time(session.lastEvent.createdAt)})
            </Row>
          )}
        </Stack>

        <Stack direction="row" spacing={2}>
          <Button variant="outlined" size="small" onClick={() => onViewLog(session)}>
            Переглянути лог
          </Button>
          {canTerminate && session.isActive && (
            <Button variant="contained" color="error" size="small" onClick={() => onTerminate(session)}>
              Завершити сесію
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SessionLogCard;
