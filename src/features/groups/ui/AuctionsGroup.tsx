import { Box, Paper, Typography } from '@mui/material';
import { useState } from 'react';
import type { Group } from '../model/types';
import ConfirmDeleteGroupModal from './ConfirmDeleteGroupModal';
import GroupList from './GroupList';

interface Props {
  activeGroupId: string;
  setActiveGroupId: (id: string) => void;
  onEditGroup?: () => void;
  groups: Group[];
}

export default function AuctionsGroup({
  activeGroupId,
  setActiveGroupId,
  onEditGroup,
  groups,
}: Props) {
  const [isDeleteGroupModalOpen, setDeleteGroupModalOpen] = useState(false);

  const handleOpenDeleteGroupModal = () => setDeleteGroupModalOpen(true);
  const handleCloseDeleteGroupModal = () => setDeleteGroupModalOpen(false);

  const currentGroupExist = groups.find((group) => group.id === activeGroupId);
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
      {groups.length > 0 ? (
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
        <Box sx={{ flexGrow: 1, py: 1.5, px: 2 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            Для початку створіть вашу першу групу
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
