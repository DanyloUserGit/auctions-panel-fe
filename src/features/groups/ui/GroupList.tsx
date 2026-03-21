import { Box } from '@mui/material';
import type { Group } from '../model/types';
import GroupItem from './GroupItem';

interface Props {
  groups: Group[];
  activeGroupId: string;
  setActiveGroupId: (id: string) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function GroupList({
  groups,
  activeGroupId,
  setActiveGroupId,
  onEdit,
  onDelete,
}: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: { xs: 1.5, sm: 2 },
        overflowX: 'auto',
        pb: 2,
        mb: 3,
        px: { xs: 2, sm: 0 },
        mx: { xs: -2, sm: 0 },
        // Стилізація скроллбару, щоб він виглядав акуратно
        '&::-webkit-scrollbar': { height: '6px' },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,0.1)',
          borderRadius: '10px',
        },
      }}
    >
      {groups.map((group: Group) => (
        <GroupItem
          key={group.id}
          group={group}
          isActive={activeGroupId === group.id}
          onSelect={setActiveGroupId}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </Box>
  );
}
