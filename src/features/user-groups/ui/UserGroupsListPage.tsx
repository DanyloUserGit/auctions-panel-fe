import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';
import {
    Box,
    Button,
    Card,
    Chip,
    CircularProgress,
    IconButton,
    Stack,
    Switch,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import type { UserGroup } from '../model/types';
import {
    useDeleteUserGroup,
    useToggleUserGroupActive,
    useUserGroupsData,
    useUserGroupsSearch,
} from '../model/useUserGroups';
import { UserGroupFormDialog } from './UserGroupFormDialog';


interface UserGroupsListPageProps {
    onOpenGroup: (group: UserGroup) => void;
}

export function UserGroupsListPage({ onOpenGroup }: UserGroupsListPageProps) {
    const [query, setQuery] = useState('');
    const [formOpen, setFormOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState<UserGroup | null>(null);

    const { items: allGroups, isLoading: isAllLoading } = useUserGroupsData();
    const { items: searchResults, isLoading: isSearchLoading } = useUserGroupsSearch(query);

    const groups = query ? searchResults : allGroups;
    const isLoading = query ? isSearchLoading : isAllLoading;

    const toggleActive = useToggleUserGroupActive();
    const deleteGroup = useDeleteUserGroup();

    const handleCreate = () => {
        setEditingGroup(null);
        setFormOpen(true);
    };

    const handleEdit = (group: UserGroup, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingGroup(group);
        setFormOpen(true);
    };

    const handleDelete = (group: UserGroup, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm(`Видалити групу користувачів "${group.name}"? Це не можна скасувати.`)) {
            deleteGroup.mutate(group.id);
        }
    };

    return (
        <Box className="flex flex-col gap-4">
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <Typography variant="h5">Групи користувачів</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
                    Нова група
                </Button>
            </Stack>

            <TextField
                size="small"
                placeholder="Пошук за назвою групи..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="max-w-sm"
            />

            {isLoading ? (
                <Box className="flex justify-center py-10">
                    <CircularProgress size={28} />
                </Box>
            ) : groups.length === 0 ? (
                <Typography color="text.secondary" className="py-6 text-center">
                    Груп користувачів не знайдено
                </Typography>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groups.map((group) => (
                        <Card
                            key={group.id}
                            onClick={() => onOpenGroup(group)}
                            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                        >
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={600}>
                                        {group.name}
                                    </Typography>
                                    {group.Admin && (
                                        <Typography variant="caption" color="text.secondary">
                                            Адмін: {group.Admin.firstName} {group.Admin.lastName}
                                        </Typography>
                                    )}
                                </Box>
                                <Tooltip title={group.isActive ? 'Активна' : 'Заблокована'}>
                                    <Switch
                                        size="small"
                                        checked={group.isActive}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={() =>
                                            toggleActive.mutate({ id: group.id, isActive: group.isActive })
                                        }
                                    />
                                </Tooltip>
                            </Stack>

                            <Stack direction="row" spacing={1} flexWrap="wrap" className="mt-3">
                                <Chip size="small" label={`Користувачів: ${group.usersCount ?? 0}`} />
                                <Chip size="small" label={`Груп аукціонів: ${group.auctionGroupsCount ?? 0}`} />
                                <Chip size="small" label={`Аукціонів: ${group.auctionsCount ?? 0}`} />
                                <Chip size="small" label={`Акаунтів: ${group.accountsCount ?? 0}`} />
                            </Stack>

                            <Stack direction="row" justifyContent="flex-end" spacing={1} className="mt-3">
                                <Tooltip title="Налаштування доступу">
                                    <IconButton size="small" onClick={() => onOpenGroup(group)}>
                                        <SettingsIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Редагувати">
                                    <IconButton size="small" onClick={(e) => handleEdit(group, e)}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Видалити">
                                    <IconButton size="small" color="error" onClick={(e) => handleDelete(group, e)}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </Card>
                    ))}
                </div>
            )}

            <UserGroupFormDialog
                open={formOpen}
                group={editingGroup}
                onClose={() => setFormOpen(false)}
            />
        </Box>
    );
}