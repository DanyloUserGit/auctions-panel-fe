import { Security } from '@mui/icons-material';
import {
    Alert,
    Box,
    CircularProgress,
    MenuItem,
    Paper,
    Stack,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import {
    useGroupRequirements,
    useMyAdminGroups,
    useUpdateNotificationsRequirements,
} from '../model/useNotifications';

export default function GroupMandatorySettings() {
    const { data: groups, isLoading: groupsLoading } = useMyAdminGroups();
    const [groupId, setGroupId] = useState<string>('');

    useEffect(() => {
        if (!groupId && groups && groups.length > 0) {
            setGroupId(groups[0].id);
        }
    }, [groups, groupId]);

    const { data: requirements, isLoading: requirementsLoading } =
        useGroupRequirements(groupId);
    const { mutate, isPending } = useUpdateNotificationsRequirements();

    const handleToggle = (typeId: string, isMandatory: boolean) => {
        mutate({ id: groupId, data: { typeId, isMandatory } });
    };

    return (
        <Paper
            sx={{
                p: 2,
                mb: 4,
                bgcolor: 'rgba(25, 118, 210, 0.05)',
                border: '1px dashed #1976d2',
                borderRadius: '12px',
            }}
        >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <Security color="primary" fontSize="small" />
                <Typography variant="subtitle2" color="primary.main" sx={{ fontWeight: 700 }}>
                    Адміністрування групи
                </Typography>
            </Stack>
            <Typography variant="caption" display="block" sx={{ mb: 2 }}>
                Позначте сповіщення як <b>обов'язкові</b>, щоб користувачі групи не могли їх вимкнути.
            </Typography>

            {groupsLoading && <CircularProgress size={20} />}

            {!groupsLoading && (!groups || groups.length === 0) && (
                <Alert severity="info" sx={{ borderRadius: '10px' }}>
                    У вас немає груп, якими ви керуєте.
                </Alert>
            )}

            {!groupsLoading && groups && groups.length > 0 && (
                <>
                    <TextField
                        select
                        size="small"
                        label="Група"
                        value={groupId}
                        onChange={(e) => setGroupId(e.target.value)}
                        sx={{ mb: 2, minWidth: 240 }}
                    >
                        {groups.map((g) => (
                            <MenuItem key={g.id} value={g.id}>
                                {g.title}
                            </MenuItem>
                        ))}
                    </TextField>

                    {requirementsLoading && (
                        <Box sx={{ py: 2 }}>
                            <CircularProgress size={20} />
                        </Box>
                    )}

                    {!requirementsLoading && requirements && (
                        <Stack spacing={1}>
                            {requirements.map((req) => (
                                <Stack
                                    key={req.typeId}
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    sx={{
                                        px: 1.5,
                                        py: 1,
                                        borderRadius: '8px',
                                        bgcolor: 'background.paper',
                                    }}
                                >
                                    <Typography variant="body2">
                                        {req.description || req.name}
                                    </Typography>
                                    <Switch
                                        size="small"
                                        checked={req.isMandatory}
                                        disabled={isPending}
                                        onChange={(e) => handleToggle(req.typeId, e.target.checked)}
                                    />
                                </Stack>
                            ))}
                        </Stack>
                    )}
                </>
            )}
        </Paper>
    );
}