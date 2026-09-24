import { Gavel, HowToReg, InfoOutlined, Sensors } from '@mui/icons-material';
import { Box, Chip, Divider, Paper, Tooltip, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { Can } from '../../auth/ui/Can';
import type { Group } from '../model/types';
import DropDownMenu from './DropDownMenu';

interface GroupTabProps {
  group: Group;
  isActive: boolean;
  onSelect: (id: string) => void;
  onEdit: () => void;
  onDelete?: (id: string) => void;
}

export default function GroupItem({
  group,
  isActive,
  onSelect,
  onEdit,
  onDelete,
}: GroupTabProps) {
  return (
    <Paper
      elevation={0}
      onClick={() => onSelect(group.id)}
      sx={{
        minWidth: { xs: 260, sm: 300 },
        maxWidth: { xs: 260, sm: 300 },
        p: { xs: 1.5, sm: 2 },
        cursor: 'pointer',
        borderRadius: '14px',
        border: '2px solid',
        borderColor: isActive ? 'primary.main' : 'divider',
        bgcolor: isActive ? 'rgba(25, 118, 210, 0.04)' : 'background.paper',
        transition: '0.2s',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        '&:hover': { borderColor: isActive ? 'primary.main' : 'primary.light' },
      }}
    >
      {/* Меню дій */}
      <Can roles={['SuperAdmin']}>
        <Box
          sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}
          onClick={(e) => e.stopPropagation()}
        >
          <DropDownMenu
            onEdit={() => {
              onSelect(group.id);
              onEdit();
            }}
            onDelete={() => {
              onSelect(group.id);
              onDelete?.(group.id);
            }}
          />
        </Box>
      </Can>

      <Box sx={{ mb: 1, pr: 4 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 800,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.2,
            mb: 0.5,
          }}
        >
          {group.title}
        </Typography>

        {isActive && (
          <Chip
            label="Вибрано"
            size="small"
            color="primary"
            sx={{ height: 18, fontSize: '10px' }}
          />
        )}
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
        <StatBlock
          icon={<Gavel sx={{ fontSize: 14 }} />}
          label="Аукціони"
          value={group.auctionsCount ?? group.auctions?.length ?? 0}
        />
        <StatBlock
          icon={<Sensors sx={{ fontSize: 14 }} />}
          label="Ліміт сесій"
          value={group.sessionLimit > 0 ? group.sessionLimit : '∞'}
          tooltip="Максимум одночасно активних сесій на всіх аукціонах групи (∞ - без ліміту)"
        />
        <StatBlock
          icon={<HowToReg sx={{ fontSize: 14 }} />}
          label="Сесії"
          value={group.sessionsCount ?? 0}
        />
      </Box>
    </Paper>
  );
}

function StatBlock({
  icon,
  label,
  value,
  tooltip,
}: StatBlockProps & { tooltip?: string }) {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.3,
          color: 'text.secondary',
        }}
      >
        {icon}
        <Typography
          variant="caption"
          sx={{ fontSize: '10px', whiteSpace: 'nowrap' }}
        >
          {label}
        </Typography>
        {tooltip && (
          <Tooltip title={tooltip} arrow>
            <InfoOutlined sx={{ fontSize: 10, ml: 0.2, cursor: 'help' }} />
          </Tooltip>
        )}
      </Box>
      <Typography variant="body2" sx={{ fontWeight: 700 }}>
        {value}
      </Typography>
    </Box>
  );
}

interface StatBlockProps {
  icon: ReactNode;
  label: string;
  value: string | number;
}
