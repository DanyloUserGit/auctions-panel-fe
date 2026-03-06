import { AccessTime, DeleteOutline, Edit, Gavel, Lock, MoreVert, People, Sensors } from "@mui/icons-material";
import {
    Box,
    IconButton,
    ListItemIcon,
    Menu, MenuItem,
    Paper, Typography
} from "@mui/material";
import { useState, type ReactNode } from "react";
import { Can } from "../../auth/ui/Can";
import type { Group } from "../model/types";

// Mock data generator (залишаємо як було)
const getMockData = (groupId: string) => ({
    userCount: 15,
    sessionLimit: 50,
    activeSessions: 34,
    auctionsCount: 8,
    lastActivity: "5 хв. тому",
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

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation(); // Щоб не спрацював onSelect при відкритті меню
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
                scrollSnapAlign: "start",
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
                        onClick={(e) => e.stopPropagation()} // Запобігаємо кліку по картці при виборі пункту
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
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AccessTime sx={{ fontSize: 12 }} /> {mock.lastActivity}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <StatBlock icon={<People />} label="Юзери" value={mock.userCount} />
                <StatBlock icon={<Gavel />} label="Аукціони" value={group.auctions?.length} />
                <StatBlock icon={<Sensors />} label="Сесії" value={mock.activeSessions} />
            </Box>


        </Paper>
    );
}

// Допоміжний під-компонент
interface StatBlockProps {
    icon: ReactNode,
    label: string,
    value: string | number,
}
function StatBlock({ icon, label, value }: StatBlockProps) {
    return (
        <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.3, color: 'text.secondary' }}>
                {icon}
                <Typography variant="caption" sx={{ fontSize: '10px' }}>{label}</Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{value}</Typography>
        </Box>
    );
}