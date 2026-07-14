import StopCircleIcon from '@mui/icons-material/StopCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';
import type { AuctionSession } from '../model/types';
import dayjs from 'dayjs';

interface SessionCardProps {
  session: AuctionSession;
  canTerminate: boolean;
  onViewLog: (session: AuctionSession) => void;
  onTerminate: (sessionId: string) => void;
}

const SessionLogCard: React.FC<SessionCardProps> = ({
  session,
  canTerminate,
  onViewLog,
  onTerminate,
}) => {
  const { id, auction, createdAt, endedAt, isActive, auctionGroupId, users } =
    session;
  const mainUser = users?.[0];

  return (
    <Card
      id={id}
      variant="outlined"
      sx={{ mb: 2, '&:hover': { boxShadow: 3 } }}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={1}
        >
          <Typography variant="h6" component="div">
            {mainUser
              ? `${mainUser.firstName} ${mainUser.lastName}`
              : 'Сплив термін сесії'}
          </Typography>
          <Chip
            label={isActive ? 'Активна' : 'Завершена'}
            color={isActive ? 'success' : 'default'}
            size="small"
          />
        </Stack>

        <Box sx={{ mb: 2 }}>
          <Typography color="text.secondary" variant="body2">
            <strong>Аукціон:</strong> {auction?.title || 'Без назви'}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            <strong>Початок:</strong>{' '}
            {dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')}
          </Typography>
          {!isActive && endedAt && (
            <Typography color="text.secondary" variant="body2">
              <strong>Завершено:</strong>{' '}
              {dayjs(endedAt).format('YYYY-MM-DD HH:mm:ss')}
            </Typography>
          )}
          {auctionGroupId && (
            <Typography color="text.secondary" variant="body2">
              <strong>Група:</strong> {auctionGroupId}
            </Typography>
          )}
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<VisibilityIcon />}
            onClick={() => onViewLog(session)}
          >
            Переглянути лог
          </Button>

          {canTerminate && isActive && (
            <Button
              variant="contained"
              color="error"
              size="small"
              startIcon={<StopCircleIcon />}
              onClick={() => onTerminate(session.id)}
            >
              Завершити
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SessionLogCard;
