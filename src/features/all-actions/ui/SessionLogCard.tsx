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
import type { SessionLog } from '../model/types';
import dayjs from 'dayjs';

interface SessionCardProps {
  session: SessionLog;
  canTerminate: boolean;
  onViewLog: (session: SessionLog) => void;
  onTerminate: (sessionId: string, userFullName: string) => void;
}

const SessionLogCard: React.FC<SessionCardProps> = ({
  session,
  canTerminate,
  onViewLog,
  onTerminate,
}) => {
  const { id, endedBy, auction, endedAt, isActive, group } = session;
  const userFullName = `${endedBy?.email}`;

  return (
    <Card variant="outlined" sx={{ mb: 2, '&:hover': { boxShadow: 3 } }}>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={1}
        >
          <Typography variant="h6" component="div">
            {isActive ? 'Поточна сесія' : `Завершив: ${userFullName}`}
          </Typography>
          <Chip
            label={isActive ? 'Активна' : 'Завершена'}
            color={isActive ? 'success' : 'default'}
            size="small"
          />
        </Stack>

        <Box sx={{ mb: 2 }}>
          <Typography color="text.secondary" variant="body2">
            <strong>Аукціон:</strong> {auction.title}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            <strong>Час:</strong>{' '}
            {dayjs(endedAt).format('YYYY-MM-DD (HH:mm:ss)')}
          </Typography>
          {group && (
            <Typography color="text.secondary" variant="body2">
              <strong>Група:</strong> {group}
            </Typography>
          )}
          {isActive && (
            <Typography color="text.secondary" variant="body2">
              <strong>Відповідальний:</strong> {userFullName}
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
            Лог
          </Button>

          {canTerminate && isActive && (
            <Button
              variant="contained"
              color="error"
              size="small"
              startIcon={<StopCircleIcon />}
              onClick={() => onTerminate(id, userFullName)}
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
