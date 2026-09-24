import CloseIcon from '@mui/icons-material/Close';
import { Box, CircularProgress, Dialog, DialogContent, IconButton, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import { useMobile } from '../../../shared/hooks/useMobile';
import { useUserGroup } from '../model/useUserGroups';
import { UserGroupAccessPanel } from './UserGroupAccessPanel';
import { UserGroupUsersPanel } from './UserGroupUsersPanel';

interface UserGroupDetailModalProps {
  id: string;
  open: boolean;
  onClose: () => void;
}

export function UserGroupDetailModal({ id, open, onClose }: UserGroupDetailModalProps) {
  const isMobile = useMobile();
  const { group, isLoading } = useUserGroup(id);
  const [tab, setTab] = useState<'users' | 'access'>('users');

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={isMobile}>
      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">{group?.name ?? 'Доступи групи'}</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {isLoading || !group ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={28} />
          </Box>
        ) : (
          <>
            <Tabs value={tab} onChange={(_e, value) => setTab(value)} sx={{ mb: 2 }}>
              <Tab value="users" label="Користувачі" />
              <Tab value="access" label="Доступи (групи / аукціони / акаунти)" />
            </Tabs>

            {tab === 'users' ? (
              <UserGroupUsersPanel groupId={id} />
            ) : (
              <UserGroupAccessPanel groupId={id} />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}