import { ArrowForwardIos, Security } from '@mui/icons-material';
import MessageIcon from '@mui/icons-material/Message';
import {
  Alert,
  Badge,
  Box,
  Button,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router';
import { Can } from '../../auth/ui/Can';
import type { NotificationSetting } from '../model/types';
// import { useNotifications } from '../model/useNotifications';
import { Notification } from './Notification';
import NotificationsTable from './NotificationsTable';

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

  // const { data } = useNotifications()

  const [open, setOpen] = useState(false);

  const handleToggle = (id: string, field: keyof NotificationSetting) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: !s[field] } : s)),
    );
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, mx: 'auto' }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        sx={{ mb: 4 }}
      >
        <Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Сповіщення
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Керуйте тим, як і де ви отримуєте інформацію про активність в
            аукціонах.
          </Typography>
        </Box>

        {/* Кнопка переходу в Інбокс */}
        <Button
          component={Link}
          to="/notifications/list" // Шлях до вашої сторінки зі списком (NotificationsPage)
          variant="outlined"
          color="primary"
          startIcon={
            <Badge badgeContent={6} color="error" overlap="circular">
              <MessageIcon />
            </Badge>
          }
          endIcon={<ArrowForwardIos sx={{ fontSize: 12 }} />}
          sx={{
            borderRadius: '12px',
            px: 3,
            py: 1.5,
            textTransform: 'none',
            fontWeight: 700,
          }}
        >
          Переглянути всі
        </Button>
      </Stack>

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

      <NotificationsTable settings={settings} handleToggle={handleToggle} />

      <Alert severity="info" sx={{ mt: 3, borderRadius: '10px' }}>
        Для активації Telegram-сповіщень необхідно підключити бота{' '}
        <b>@AuctionMasterBot</b> у вашому профілі.
      </Alert>
      <Button onClick={() => setOpen(true)}>Показата повідомлення</Button>
      <Notification
        isOpen={open}
        close={() => setOpen(false)}
        message="Тестове повідомлення"
      />
    </Box>
  );
}
