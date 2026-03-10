import { Email, Language, Security, Telegram } from '@mui/icons-material';
import {
  Alert,
  Box,
  Checkbox,
  Chip,
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Can } from '../../auth/ui/Can';
import type { NotificationSetting } from '../model/type';

export default function NotificationsPage() {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: '1',
      type: 'Нова ставка в аукціоні',
      inApp: true,
      email: true,
      telegram: false,
      isMandatory: true,
    },
    {
      id: '2',
      type: 'Вашу ставку перебито',
      inApp: true,
      email: false,
      telegram: true,
      isMandatory: false,
    },
    {
      id: '3',
      type: 'Завершення аукціону (за 15 хв)',
      inApp: true,
      email: true,
      telegram: true,
      isMandatory: false,
    },
    {
      id: '4',
      type: 'Системні оновлення',
      inApp: true,
      email: false,
      telegram: false,
      isMandatory: true,
    },
  ]);

  const handleToggle = (id: string, field: keyof NotificationSetting) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: !s[field] } : s)),
    );
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Сповіщення
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Керуйте тим, як і де ви отримуєте інформацію про активність в аукціонах.
      </Typography>

      <Can roles={['Admin', 'SuperAdmin']}>
        <Paper
          sx={{
            p: 2,
            mb: 4,
            bgcolor: 'rgba(25, 118, 210, 0.05)',
            border: '1px dashed #1976d2',
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Security color="primary" fontSize="small" />
            <Typography
              variant="subtitle2"
              color="primary.main"
              sx={{ fontWeight: 700 }}
            >
              Адміністрування групи
            </Typography>
          </Stack>
          <Typography variant="caption" display="block" sx={{ mb: 2 }}>
            Позначте сповіщення як <b>обов'язкові</b>, щоб користувачі групи не
            могли їх вимкнути.
          </Typography>
        </Paper>
      </Can>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '12px',
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: 'action.hover' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Тип сповіщення</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                <Tooltip title="У кабінеті">
                  <Language fontSize="small" />
                </Tooltip>
                <Typography variant="caption" display="block">
                  Кабінет
                </Typography>
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                <Tooltip title="Email">
                  <Email fontSize="small" />
                </Tooltip>
                <Typography variant="caption" display="block">
                  Email
                </Typography>
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                <Tooltip title="Telegram">
                  <Telegram fontSize="small" />
                </Tooltip>
                <Typography variant="caption" display="block">
                  Telegram
                </Typography>
              </TableCell>
              <Can roles={['Admin', 'SuperAdmin']}>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 700, color: 'primary.main' }}
                >
                  Обов'язкове
                </TableCell>
              </Can>
            </TableRow>
          </TableHead>
          <TableBody>
            {settings.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {row.type}
                  </Typography>
                  {row.isMandatory && (
                    <Chip
                      label="Обов'язкове"
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ mt: 0.5, height: 18, fontSize: '10px' }}
                    />
                  )}
                </TableCell>

                <TableCell align="center">
                  <Switch
                    size="small"
                    checked={row.inApp}
                    disabled={row.isMandatory}
                    onChange={() => handleToggle(row.id, 'inApp')}
                  />
                </TableCell>

                <TableCell align="center">
                  <Checkbox
                    checked={row.email}
                    disabled={row.isMandatory}
                    onChange={() => handleToggle(row.id, 'email')}
                  />
                </TableCell>

                <TableCell align="center">
                  <Checkbox
                    checked={row.telegram}
                    disabled={row.isMandatory}
                    onChange={() => handleToggle(row.id, 'telegram')}
                  />
                </TableCell>

                <Can roles={['Admin', 'SuperAdmin']}>
                  <TableCell align="center">
                    <Checkbox
                      color="primary"
                      checked={row.isMandatory}
                      onChange={() => handleToggle(row.id, 'isMandatory')}
                    />
                  </TableCell>
                </Can>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Alert severity="info" sx={{ mt: 3, borderRadius: '10px' }}>
        Для активації Telegram-сповіщень необхідно підключити бота{' '}
        <b>@AuctionMasterBot</b> у вашому профілі.
      </Alert>
    </Box>
  );
}
