import { Add, Search } from '@mui/icons-material';
import {
    Box,
    Button,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TablePagination,
    TextField,
    Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import type { UserGroup } from '../features/user-groups/model/types';
import {
    useDeleteUserGroup,
    useToggleUserGroupActive,
    useUserGroupsData,
    useUserGroupsSearch,
} from '../features/user-groups/model/useUserGroups';
import { UserGroupDetailModal } from '../features/user-groups/ui/UserGroupDetailModal';
import { UserGroupFormDialog } from '../features/user-groups/ui/UserGroupFormDialog';
import { Can } from '../features/auth/ui/Can';
import UserGroupsTable from '../features/user-groups/ui/UserGroupsTable';
import { useMobile } from '../shared/hooks/useMobile';
import { useModal } from '../shared/hooks/useModal';

export default function UserGroupsSection() {
    const isMobile = useMobile();

    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);

    const { items: allGroups } = useUserGroupsData();
    const { items: searchResults } = useUserGroupsSearch(debouncedSearch);
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

    const toggleActive = useToggleUserGroupActive();
    const deleteGroup = useDeleteUserGroup();

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(0);
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    const filteredGroups = useMemo(() => {
        return allGroups.filter((group) => {
            const matchesStatus =
                statusFilter === 'All' ||
                (statusFilter === 'Blocked' ? !group.isActive : group.isActive);

            return matchesStatus;
        });
    }, [allGroups, statusFilter]);

    const showGroups = useMemo(() => {
        if (debouncedSearch.trim()) {
            return searchResults;
        }

        const start = page * limit;
        return filteredGroups.slice(start, start + limit);
    }, [filteredGroups, searchResults, page, limit, debouncedSearch]);

    const totalCount = useMemo(() => {
        if (debouncedSearch.trim()) {
            return searchResults.length;
        }
        return filteredGroups.length;
    }, [debouncedSearch, searchResults, filteredGroups]);

    const handleStatusChange = (val: string) => {
        setStatusFilter(val);
        setPage(0);
    };

    const effectiveId = selectedGroupId || allGroups?.[0]?.id || '';

    const handleChangeGroup = (id: string) => {
        console.log(id)
        setSelectedGroupId(id);
    };

    const currentGroup = allGroups?.find((g) => g.id === effectiveId) ?? null;

    const {
        isOpen: isDetailOpen,
        open: OpenDetail,
        close: CloseDetail,
    } = useModal(false);
    const {
        isOpen: isAddGroupOpen,
        open: OpenAddGroup,
        close: CloseAddGroup,
    } = useModal(false);
    const {
        isOpen: isEditGroupOpen,
        open: OpenEditGroup,
        close: CloseEditGroup,
    } = useModal(false);

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setLimit(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleToggleActive = (group: UserGroup) => {
        toggleActive.mutate({ id: group.id, isActive: group.isActive });
    };

    const handleDelete = (group: UserGroup) => {
        if (confirm(`Видалити групу користувачів "${group.name}"? Це не можна скасувати.`)) {
            deleteGroup.mutate(group.id);
        }
    };

    return (
        <Box sx={{ p: { xs: 0, sm: 3 } }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 4,
                    flexWrap: 'wrap',
                    gap: 2,
                }}
            >
                {!isMobile && (
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                        Групи користувачів
                    </Typography>
                )}

                <Can roles={['SuperAdmin']}>
                    <Button
                        onClick={OpenAddGroup}
                        variant="contained"
                        startIcon={<Add />}
                        fullWidth={isMobile}
                        sx={{ borderRadius: '10px', px: 3, height: 45 }}
                    >
                        Додати групу
                    </Button>
                </Can>
            </Box>

            <Paper
                sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: '15px',
                    display: 'flex',
                    gap: 2,
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    boxShadow: 'none',
                    border: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <TextField
                    size="small"
                    placeholder="Пошук за назвою групи"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: 300 }, maxWidth: 400 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search fontSize="small" />
                            </InputAdornment>
                        ),
                        endAdornment: search && (
                            <InputAdornment position="end">
                                <IconButton size="small" onClick={() => setSearch('')}>
                                    <Add sx={{ transform: 'rotate(45deg)' }} />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <FormControl
                    size="small"
                    sx={{ minWidth: { xs: '47%', sm: 150 }, flexGrow: { xs: 1, sm: 0 } }}
                >
                    <InputLabel>Статус</InputLabel>
                    <Select
                        value={statusFilter}
                        label="Статус"
                        onChange={(e) => handleStatusChange(e.target.value)}
                    >
                        <MenuItem value="All">Всі статуси</MenuItem>
                        <MenuItem value="Active">Активні</MenuItem>
                        <MenuItem value="Blocked">Заблоковані</MenuItem>
                    </Select>
                </FormControl>
            </Paper>

            <UserGroupsTable
                groups={showGroups}
                handleChangeGroup={handleChangeGroup}
                OpenDetail={OpenDetail}
                OpenEditGroup={OpenEditGroup}
                onToggleActive={handleToggleActive}
                onDelete={handleDelete}
            />

            <TablePagination
                component="div"
                count={totalCount}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={limit}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage={isMobile ? '' : 'Рядків на сторінці:'}
                sx={{
                    mt: 2,
                    '.MuiTablePagination-selectLabel': {
                        display: isMobile ? 'none' : 'block',
                    },
                }}
            />

            <UserGroupDetailModal id={effectiveId} open={isDetailOpen} onClose={CloseDetail} />

            <UserGroupFormDialog open={isAddGroupOpen} group={null} onClose={CloseAddGroup} />

            {currentGroup && (
                <UserGroupFormDialog
                    key={effectiveId}
                    open={isEditGroupOpen}
                    group={currentGroup}
                    onClose={CloseEditGroup}
                />
            )}
        </Box>
    );
}