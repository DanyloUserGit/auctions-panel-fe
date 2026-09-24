import { Alert, Box, CircularProgress, Stack } from '@mui/material';
import { useMemo } from 'react';
import { useAuth } from '../../auth/model/useAuth';
import type { AccessGrants, AccessKind } from '../model/types';
import {
    useToggleAllowedAccount,
    useToggleAllowedAuction,
    useToggleAllowedAuctionGroup,
    useUserGroup,
} from '../model/useUserGroups';
import { AccessTree } from './AccessTree';

interface UserGroupAccessPanelProps {
    groupId: string;
}

// Налаштування доступу групи користувачів. Змінює лише SuperAdmin, Admin бачить доступи своєї групи.
export function UserGroupAccessPanel({ groupId }: UserGroupAccessPanelProps) {
    const { user } = useAuth();
    const isSuperAdmin = user?.role === 'SuperAdmin';
    const { group } = useUserGroup(groupId);

    const toggleAuctionGroup = useToggleAllowedAuctionGroup(groupId);
    const toggleAuction = useToggleAllowedAuction(groupId);
    const toggleAccount = useToggleAllowedAccount(groupId);

    const grants = useMemo<AccessGrants>(
        () => ({
            allowedAuctionGroups: group?.allowedAuctionGroups ?? [],
            allowedAuctions: group?.allowedAuctions ?? [],
            allowedAccounts: group?.allowedAccounts ?? [],
        }),
        [group],
    );

    if (!group) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <CircularProgress size={24} />
            </Box>
        );
    }

    const handleToggle = (kind: AccessKind, id: string, allow: boolean) => {
        if (kind === 'auctionGroup') toggleAuctionGroup.mutate({ auctionGroupId: id, allow });
        else if (kind === 'auction') toggleAuction.mutate({ auctionId: id, allow });
        else toggleAccount.mutate({ accountId: id, allow });
    };

    const busy = toggleAuctionGroup.isPending || toggleAuction.isPending || toggleAccount.isPending;
    const hasError = toggleAuctionGroup.isError || toggleAuction.isError || toggleAccount.isError;

    return (
        <Stack spacing={2}>
            {!group.isActive && (
                <Alert severity="warning">
                    Групу заблоковано - її учасники не мають доступу до жодних аукціонів, доки групу не розблоковано.
                </Alert>
            )}
            <Alert severity="info">
                Кожен рівень вмикається окремо: увімкнена група аукціонів не відкриває всі її аукціони, а
                увімкнений аукціон - усі його акаунти. Акаунт доступний, лише коли увімкнено групу аукціонів,
                аукціон і сам акаунт.
                {!isSuperAdmin && ' Змінювати доступи може лише SuperAdmin.'}
            </Alert>
            {hasError && <Alert severity="error">Не вдалося зберегти зміну доступу. Спробуйте ще раз.</Alert>}
            <AccessTree grants={grants} readOnly={!isSuperAdmin} onToggle={handleToggle} busy={busy} />
        </Stack>
    );
}
