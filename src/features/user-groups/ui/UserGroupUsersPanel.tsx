import CloseIcon from '@mui/icons-material/Close';
import GroupIcon from '@mui/icons-material/Group';
import {
    Box,
    Chip,
    CircularProgress,
    Stack,
    Typography,
} from '@mui/material';

import type { User } from '../../auth/model/user-schema';
import {
    useRemoveUserFromGroup,
    useUserGroup,
    useUsersGroup,
} from '../model/useUserGroups';

interface UserGroupUsersPanelProps {
    groupId: string;
}

export function UserGroupUsersPanel({
    groupId,
}: UserGroupUsersPanelProps) {
    const { group, isLoading } = useUserGroup(groupId);
    const removeUser = useRemoveUserFromGroup();

    const { users: data, isLoading: isLoadingUsers } = useUsersGroup(groupId);
    const users = data ?? [];

    if (isLoading || !group || isLoadingUsers) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    py: 6,
                }}
            >
                <CircularProgress size={28} />
            </Box>
        );
    }


    return (
        <Stack spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center">
                <GroupIcon fontSize="small" />

                <Typography variant="subtitle1" fontWeight={600}>
                    Користувачі групи
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    ({users.length})
                </Typography>
            </Stack>

            {users.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                    У групі ще немає користувачів.
                </Typography>
            ) : (
                <Stack direction="row" flexWrap="wrap" gap={1}>
                    {users.map((user: User) => (
                        <Chip
                            key={user.id}
                            label={user.email ?? user.firstName ?? user.id}
                            variant="outlined"
                            deleteIcon={<CloseIcon />}
                            disabled={removeUser.isPending}
                            onDelete={() =>
                                removeUser.mutate({
                                    id: groupId,
                                    data: {
                                        userId: user.id,
                                    },
                                })
                            }
                        />
                    ))}
                </Stack>
            )}
        </Stack>
    );
}