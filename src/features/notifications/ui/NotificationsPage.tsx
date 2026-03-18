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
import type { NotificationChannel, NotificationSetting } from '../model/types';
// import { useNotifications } from '../model/useNotifications';
import { Notification } from './Notification';
import NotificationsTable from './NotificationsTable';

export default function NotificationsPage() {
  const [settings, setSettings] = useState<NotificationSetting[]>([]);

  // const { data } = useNotifications()

  const [open, setOpen] = useState(false);

  const handleToggle = (
    id: string,
    field: 'isEnabled' | 'isMandatory' | NotificationChannel
  ) => {
    setSettings((prev) =>
      prev.map((s) => {
        // Якщо це не наш рядок, повертаємо його без змін
        if (s.id !== id) return s;

        // 1. Якщо це пряме булеве поле (isEnabled або isMandatory)
        if (field === 'isEnabled' || field === 'isMandatory') {
          return { ...s, [field]: !s[field] };
        }

        // 2. Якщо це канал зв'язку (наприклад, 'InApp')
        // Перевіряємо, чи є він вже в масиві channels
        const hasChannel = s.channels.includes(field as NotificationChannel);

        const updatedChannels = hasChannel
          ? s.channels.filter((c) => c !== field)
          : [...s.channels, field as NotificationChannel]; 

        return { ...s, channels: updatedChannels };
      }),
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
