import {
  AccountCircle,
  DeleteOutline,
  Edit,
  Gavel,
  MailOutline,
  MoreVert,
  People,
  Sensors,
  History,
  InfoOutlined,
  Block, // Додано іконку блокування
  CheckCircle, // Додано іконку розблокування
} from '@mui/icons-material';
import {
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Paper,
  Tooltip,
  Typography,
  Chip,
} from '@mui/material';
import { useState, type ReactNode } from 'react';
import dayjs from 'dayjs';
import { useUserById } from '../../auth/model/useAuth';
import { Can } from '../../auth/ui/Can';
import type { Group } from '../model/types';
import { useEditGroup } from '../model/useGroups'; // Імпортуємо хук для редагування

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
  const { data: admin, isLoading: isAdminLoading } = useUserById(group.AdminId);
  const { mutate: updateGroup } = useEditGroup(); // Хук для зміни isActive

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    onSelect(group.id);
  };

  const handleCloseMenu = (
    event: React.MouseEvent | React.SyntheticEvent | Event,
  ) => {
    if (event) {
      event.stopPropagation?.();
    }
    setAnchorEl(null);
  };

  // Обробник перемикання статусу групи
  const handleToggleActive = (event: React.MouseEvent) => {
    handleCloseMenu(event);
    updateGroup({
      id: group.id,
      group: { isActive: !group.isActive },
    });
  };

  const lastActivityFormatted = group.lastActivity
    ? dayjs(group.lastActivity).format('YYYY-MM-DD HH:mm')
    : 'Немає даних';

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
        bgcolor: !group.isActive
          ? 'action.hover'
          : isActive
            ? 'rgba(25, 118, 210, 0.04)'
            : 'background.paper',
        opacity: !group.isActive ? 0.8 : 1,
        transition: '0.2s',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        '&:hover': { borderColor: isActive ? 'primary.main' : 'primary.light' },
      }}
    >
      {/* Меню дій */}
      <Can roles={['Admin', 'SuperAdmin']}>
        <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}>
          <IconButton size="small" onClick={handleOpenMenu}>
            <MoreVert sx={{ fontSize: 18 }} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleCloseMenu}
            onClick={(e) => e.stopPropagation()}
          >
            <MenuItem
              onClick={(e) => {
                handleCloseMenu(e);
                onEdit();
              }}
            >
              <ListItemIcon>
                <Edit fontSize="small" />
              </ListItemIcon>
              Редагувати
            </MenuItem>

            {/* НОВИЙ ПУНКТ: Заблокувати/Розблокувати */}
            <MenuItem
              onClick={handleToggleActive}
              sx={{ color: group.isActive ? 'warning.main' : 'success.main' }}
            >
              <ListItemIcon>
                {group.isActive ? (
                  <Block fontSize="small" color="warning" />
                ) : (
                  <CheckCircle fontSize="small" color="success" />
                )}
              </ListItemIcon>
              {group.isActive ? 'Заблокувати' : 'Розблокувати'}
            </MenuItem>

            <MenuItem
              onClick={(e) => {
                handleCloseMenu(e);
                onDelete?.(group.id);
              }}
              sx={{ color: 'error.main' }}
            >
              <ListItemIcon>
                <DeleteOutline fontSize="small" color="error" />
              </ListItemIcon>
              Видалити
            </MenuItem>
          </Menu>
        </Box>
      </Can>

      <Box>
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
              textDecoration: group.isActive ? 'none' : 'line-through', // Візуальне закреслення назви
              color: group.isActive ? 'text.primary' : 'text.secondary',
            }}
          >
            {group.title}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            <Chip
              label={group.isActive ? 'Активна' : 'Заблокована'}
              size="small"
              variant={group.isActive ? 'outlined' : 'filled'} // Міняємо стиль для акценту
              color={group.isActive ? 'success' : 'error'} // Міняємо колір на червоний при блокуванні
              sx={{ height: 18, fontSize: '10px' }}
            />
            {isActive && (
              <Chip
                label="Вибрано"
                size="small"
                color="primary"
                sx={{ height: 18, fontSize: '10px' }}
              />
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
          <StatBlock
            icon={<People sx={{ fontSize: 14 }} />}
            label="Юзери"
            value={group.accounts?.length || 0}
          />
          <StatBlock
            icon={<Gavel sx={{ fontSize: 14 }} />}
            label="Аукціони"
            value={group.auctions?.length || 0}
          />
          <StatBlock
            icon={<Sensors sx={{ fontSize: 14 }} />}
            label="Ліміт сесій"
            value={group.sessionLimit || 0}
            tooltip="Максимально дозволена кількість сесій"
          />
        </Box>

        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, opacity: 0.7 }}
        >
          <History sx={{ fontSize: 12, color: 'text.secondary' }} />
          <Typography
            variant="caption"
            sx={{ fontSize: '10px', color: 'text.secondary' }}
          >
            Активність: {lastActivityFormatted}
          </Typography>
        </Box>
      </Box>

      {/* Блок Адміна */}
      <Box sx={{ mt: 'auto' }}>
        <Divider sx={{ mb: 1.5, borderStyle: 'dashed' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccountCircle
            sx={{
              color: group.isActive ? 'primary.main' : 'text.disabled',
              fontSize: 32,
              opacity: 0.8,
            }}
          />
          <Box
            sx={{
              overflow: 'hidden',
              minHeight: '32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {isAdminLoading ? (
              <Typography
                variant="caption"
                sx={{ fontStyle: 'italic', color: 'text.secondary' }}
              >
                Завантаження...
              </Typography>
            ) : (
              <>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    display: 'block',
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    color: !group.isActive
                      ? 'text.disabled'
                      : admin
                        ? 'text.primary'
                        : 'text.disabled',
                  }}
                >
                  {admin
                    ? `${admin.firstName} ${admin.lastName}`
                    : 'Адмін не призначений'}
                </Typography>

                {admin?.email && (
                  <Tooltip title={admin.email}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.3,
                        fontSize: '10px',
                      }}
                    >
                      <MailOutline sx={{ fontSize: 10 }} /> {admin.email}
                    </Typography>
                  </Tooltip>
                )}
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

// Допоміжний компонент StatBlock залишається без змін...
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
