import { Box, Paper, Typography } from '@mui/material';
import { useState } from 'react';
import type { Group } from '../model/types';
import ConfirmDeleteGroupModal from './ConfirmDeleteGroupModal';
import GroupList from './GroupList';
import { Groups } from '@mui/icons-material';
import { useAuth } from '../../auth/model/useAuth';

interface Props {
  activeGroupId: string;
  setActiveGroupId: (id: string) => void;
  onEditGroup: () => void;
  groups: Group[];
}

export default function AuctionsGroup({
  activeGroupId,
  setActiveGroupId,
  onEditGroup,
  groups,
}: Props) {
  const { user } = useAuth();
  const [isDeleteGroupModalOpen, setDeleteGroupModalOpen] = useState(false);
  const handleOpenDeleteGroupModal = () => setDeleteGroupModalOpen(true);
  const handleCloseDeleteGroupModal = () => setDeleteGroupModalOpen(false);

  const isSuperAdmin = user?.role === 'SuperAdmin';
  const currentGroupExist = groups?.find((group) => group.id === activeGroupId);
  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: 1,
        borderColor: 'divider',
        mb: 4,
        bgcolor: 'transparent',
        position: 'relative',
        minHeight: '49px', // Гарантує стабільну висоту лінії
      }}
    >
      {groups?.length > 0 ? (
        <>
          <GroupList
            groups={groups}
            activeGroupId={activeGroupId}
            setActiveGroupId={setActiveGroupId}
            onEdit={onEditGroup}
            onDelete={handleOpenDeleteGroupModal}
          />
        </>
      ) : (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            py: 3,
            borderColor: 'divider',
            gap: 2,
          }}
        >
          <Groups sx={{ color: 'text.disabled' }} />
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            Список груп порожній.{' '}
            {isSuperAdmin && `Створіть першу групу, щоб додати аукціони.`}
          </Typography>
        </Box>
      )}

      {currentGroupExist && (
        <ConfirmDeleteGroupModal
          isModalOpen={isDeleteGroupModalOpen}
          handleClose={handleCloseDeleteGroupModal}
          currentGroup={currentGroupExist}
        />
      )}
    </Paper>
  );
}
