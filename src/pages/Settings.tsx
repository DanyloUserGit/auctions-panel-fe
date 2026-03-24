import {
  Gavel,
  Groups,
  Notifications,
  Person,
  Public,
} from '@mui/icons-material';
import { Box, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useAuth } from '../features/auth/model/useAuth';
import ProfileEdit from '../features/profile/ui/ProfileEdit';
import GlobalSettings from '../features/settings/ui/GlobalSettings';
import NotificationsSettings from '../features/settings/ui/NotificationsSettings';
import { AuctionSettings } from '../features/settings/ui/auction/AuctionSettings';
import { GroupSettings } from '../features/settings/ui/group/GroupSettings';
import { useMobile } from '../shared/hooks/useMobile';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const isMobile = useMobile();
  const { user } = useAuth();

  const allTabs = useMemo(
    () => [
      {
        label: 'Загальне',
        icon: <Public />,
        component: <GlobalSettings />,
        roles: ['User', 'SuperAdmin'],
      },
      {
        label: 'Профіль та Безпека',
        icon: <Person />,
        component: <ProfileEdit />,
        roles: ['User', 'Admin', 'SuperAdmin'],
      },
      {
        label: 'Сповіщення',
        icon: <Notifications />,
        component: <NotificationsSettings />,
        roles: ['User', 'Admin', 'SuperAdmin'],
      },
      {
        label: 'Налаштування групи',
        icon: <Groups />,
        component: <GroupSettings />,
        roles: ['Admin', 'SuperAdmin'],
      },
      {
        label: 'Правила аукціонів',
        icon: <Gavel />,
        component: <AuctionSettings />,
        roles: ['Admin', 'SuperAdmin'],
      },
    ],
    [],
  );

  const visibleTabs = useMemo(
    () => allTabs.filter((tab) => tab.roles.includes(user?.role || 'User')),
    [allTabs, user?.role],
  );

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1200, mx: 'auto' }}>
      {!isMobile && (
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
          Налаштування
        </Typography>
      )}

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
        {/* Ліва панель навігації */}
        <Paper
          sx={{
            width: { xs: '100%', md: 300 },
            borderRadius: '20px',
            p: 1.5,
            height: 'fit-content',
            position: { md: 'sticky' },
            top: 24,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: 'none',
          }}
        >
          <Tabs
            orientation="vertical"
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            sx={{
              borderRight: 0,
              '& .MuiTab-root': {
                padding: '10px 16px',
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                textAlign: 'left',
                borderRadius: '12px',
                mb: 1,
                minHeight: 44,
                transition: '0.2s',
                textTransform: 'none', // Прибираємо Caps Lock
                fontSize: 14, // Компактний шрифт
                fontWeight: 500,
                color: 'text.secondary',
                '&.Mui-selected': {
                  color: 'primary.main',
                  bgcolor: 'rgba(25, 118, 210, 0.08)',
                  fontWeight: 700,
                },
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              },
              '& .MuiTabs-indicator': {
                display: 'none', // Прибираємо стандартну лінію, бо у нас стиль кнопок
              },
            }}
          >
            {visibleTabs.map((tab) => (
              <Tab
                key={tab.label}
                icon={tab.icon}
                iconPosition="start"
                label={tab.label}
                disableRipple // Прибирає ефект хвилі для більш "солідного" вигляду
                sx={{
                  '& .MuiSvgIcon-root': {
                    fontSize: 20, // Розмір іконки
                    mr: 1.5,
                  },
                }}
              />
            ))}
          </Tabs>
        </Paper>

        {/* Права панель контенту */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          {visibleTabs[activeTab] ? (
            visibleTabs[activeTab].component
          ) : (
            <Typography>Оберіть розділ налаштувань</Typography>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
