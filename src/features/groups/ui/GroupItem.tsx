import { AccountCircle, DeleteOutline, Edit, Gavel, Lock, MailOutline, MoreVert, People, Sensors } from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu, MenuItem,
  Paper, Tooltip, Typography
} from "@mui/material";
import { useState, type ReactNode } from "react";
import { useUserById } from "../../auth/model/useAuth";
import { Can } from "../../auth/ui/Can";
import type { Group } from "../model/types";

const getMockData = (groupId: string) => ({
  userCount: 15,
  sessionLimit: 50,
  activeSessions: 34,
  auctionsCount: 8,
  lastActivity: '5 хв. тому',
  isBlocked: groupId === '3',
});

interface GroupTabProps {
  group: Group;
  isActive: boolean;
  onSelect: (id: string) => void;
  onEdit?: () => void;
  onDelete?: (id: string) => void;
}

export default function GroupTabItem({ group, isActive, onSelect, onEdit, onDelete }: GroupTabProps) {
  const mock = getMockData(group.id);
  const { data: admin, isLoading: isAdminLoading } = useUserById(group.groupAdminId);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);


  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <Paper
      elevation={0}
      onClick={() => onSelect(group.id)}
      sx={{
        minWidth: { xs: 240, sm: 280 },
        maxWidth: { xs: 240, sm: 280 },
        p: { xs: 1.5, sm: 2 },
        cursor: 'pointer',
        borderRadius: '14px',
        border: '2px solid',
        borderColor: isActive ? 'primary.main' : 'divider',
        bgcolor: mock.isBlocked ? '#fafafa' : (isActive ? 'rgba(25, 118, 210, 0.04)' : 'background.paper'),
        transition: '0.2s',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        '&:hover': { borderColor: isActive ? 'primary.main' : 'primary.light' }
      }}
    >
      <Can roles={["GroupAdmin", "SuperAdmin"]}>
        <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}>
          <IconButton size="small" onClick={handleOpenMenu}>
            <MoreVert sx={{ fontSize: 18 }} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleCloseMenu}
            onClick={(e) => e.stopPropagation()}
          >
            <MenuItem onClick={(e) => { handleCloseMenu(e); onEdit?.(); }}>
              <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
              Редагувати
            </MenuItem>
            <MenuItem onClick={(e) => { handleCloseMenu(e); onDelete?.(group.id); }} sx={{ color: 'error.main' }}>
              <ListItemIcon><DeleteOutline fontSize="small" color="error" /></ListItemIcon>
              Видалити
            </MenuItem>
          </Menu>
        </Box>
      </Can>

      <Box>
        <Box sx={{ mb: 1, pr: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {group.title}
            </Typography>
            {mock.isBlocked && <Lock sx={{ fontSize: 14, color: 'error.main' }} />}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <StatBlock icon={<People sx={{ fontSize: 14 }} />} label="Юзери" value={mock.userCount} />
          <StatBlock icon={<Gavel sx={{ fontSize: 14 }} />} label="Аукціони" value={group.auctions?.length || 0} />
          <StatBlock icon={<Sensors sx={{ fontSize: 14 }} />} label="Сесії" value={mock.activeSessions} />
        </Box>
      </Box>

      {/* Блок Адміна */}
      <Box>
        <Divider sx={{ mb: 1.5, borderStyle: 'dashed' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccountCircle sx={{ color: 'primary.main', fontSize: 32, opacity: 0.8 }} />
          <Box sx={{ overflow: 'hidden', minHeight: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

            {isAdminLoading ? (
              <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
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
                    color: admin ? 'text.primary' : 'text.disabled'
                  }}
                >
                  {admin ? `${admin.firstName} ${admin.lastName}` : "Адмін не призначений"}
                </Typography>

                {admin?.email && (
                  <Tooltip title={admin.email}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.3, fontSize: '10px' }}
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

function StatBlock({ icon, label, value }: StatBlockProps) {
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
        <Typography variant="caption" sx={{ fontSize: '10px' }}>
          {label}
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ fontWeight: 700 }}>
        {value}
      </Typography>
    </Box>
  );
}

interface StatBlockProps {
  icon: ReactNode,
  label: string,
  value: string | number,
}