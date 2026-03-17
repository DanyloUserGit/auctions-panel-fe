import { Gavel, Groups, Notifications, Person } from '@mui/icons-material';
import { Box, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import { Can } from '../features/auth/ui/Can';
import ProfileEdit from '../features/profile/ui/ProfileEdit';
import { AuctionSettings } from '../features/settings/ui/AuctionSettings';
import { GroupSettings } from '../features/settings/ui/GroupSettings';
import NotificationsSettings from '../features/settings/ui/NotificationsSettings';
import { useMobile } from '../shared/hooks/useMobile';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const isMobile = useMobile();
  return (
    <Box sx={{ p: { xs: 0, sm: 3 }, maxWidth: 1200, mx: 'auto' }}>
      {!isMobile && (
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
          Налаштування
        </Typography>
      )}

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
        <Paper
          sx={{
            width: { xs: '100%', md: 300 },
            borderRadius: '20px',
            p: 1.5,
            height: 'fit-content',
            position: { md: 'sticky' },
            top: 24,
          }}
        >
          <Tabs
            orientation="vertical"
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            sx={{
              borderRight: 0,
              '& .MuiTab-root': {
                padding: '12px 16px',
                display: 'flex',
                justifyContent: 'start',
                alignItems: 'flex-start',
                textAlign: 'left',
                borderRadius: '12px',
                mb: 1,
                minHeight: 48,
                transition: '0.2s',
              },
              '& .Mui-selected': { bgcolor: 'primary.lighter' },
            }}
          >
            <Tab
              icon={<Person sx={{ fontSize: 20 }} />}
              iconPosition="start"
              label="Профіль та Безпека"
            />
            <Tab
              icon={<Notifications sx={{ fontSize: 20 }} />}
              iconPosition="start"
              label="Сповіщення"
            />

            <Tab
              icon={<Groups sx={{ fontSize: 20 }} />}
              iconPosition="start"
              label="Налаштування групи"
            />
            <Tab
              icon={<Gavel sx={{ fontSize: 20 }} />}
              iconPosition="start"
              label="Правила аукціонів"
            />
          </Tabs>
        </Paper>

        {/* Права панель контенту */}
        <Box sx={{ flexGrow: 1 }}>
          {activeTab === 0 && <ProfileEdit />}
          {activeTab === 1 && <NotificationsSettings />}
          {activeTab === 2 && (
            <Can roles={['Admin', 'SuperAdmin']}>
              <GroupSettings />
            </Can>
          )}
          {activeTab === 3 && (
            <Can roles={['Admin', 'SuperAdmin']}>
              <AuctionSettings />
            </Can>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
