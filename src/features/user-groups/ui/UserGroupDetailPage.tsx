import { useState } from 'react';
import { Box, CircularProgress, IconButton, Stack, Tab, Tabs, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useUserGroup } from '../model/useUserGroups';
import { UserGroupAccessPanel } from './UserGroupAccessPanel';


interface UserGroupDetailPageProps {
    groupId: string;
    onBack: () => void;
}

export function UserGroupDetailPage({ groupId, onBack }: UserGroupDetailPageProps) {
    const { group, isLoading } = useUserGroup(groupId);
    const [tab, setTab] = useState<'access' | 'ga'>('access');

    if (isLoading || !group) {
        return (
            <Box className="flex justify-center py-10">
                <CircularProgress size={28} />
            </Box>
        );
    }

    return (
        <Box className="flex flex-col gap-4">
            <Stack direction="row" alignItems="center" spacing={1}>
                <IconButton onClick={onBack} size="small">
                    <ArrowBackIcon fontSize="small" />
                </IconButton>
                <Typography variant="h5">{group.name}</Typography>
            </Stack>

            <Tabs value={tab} onChange={(_e, value) => setTab(value)}>
                <Tab value="access" label="Доступи (групи / аукціони / акаунти)" />
                <Tab value="ga" label="GA-доступ до паролів" />
            </Tabs>

            <Box className="mt-2">
                {tab === 'access' ? (
                    <UserGroupAccessPanel groupId={groupId} />
                ) : (
                    <UserGroupAccessPanel groupId={groupId} />
                )}
            </Box>
        </Box>
    );
}