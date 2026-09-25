import { Alert, Box, Checkbox, CircularProgress, FormControlLabel, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import BaseModal from '../../../shared/ui/Modal';
import { useAuth } from '../../auth/model/useAuth';
import type { User } from '../../auth/model/user-schema';
import type { AccessGrants, AccountSummary, PersonalAccess, UserGroup } from '../../user-groups/model/types';
import {
  useToggleDeniedAccount,
  useTogglePersonalAccess,
  useUserGroup,
  useUserPersonalAccess,
} from '../../user-groups/model/useUserGroups';
import { AccessTree } from '../../user-groups/ui/AccessTree';

interface UserAccessModalProps {
  user: User;
  open: boolean;
  onClose: () => void;
}

// Особисті доступи користувача: власний ланцюг група аукціонів -> аукціон -> акаунт,
// що доповнює доступ його групи. Змінює лише SuperAdmin, Admin бачить доступи учасників своєї групи.
export function UserAccessModal({ user, open, onClose }: UserAccessModalProps) {
  const { user: currentUser } = useAuth();
  const isSuperAdmin = currentUser?.role === 'SuperAdmin';

  const { grants, isLoading } = useUserPersonalAccess(open ? user.id : undefined);
  const { group } = useUserGroup(open && user.userGroupId ? user.userGroupId : undefined);
  const toggle = useTogglePersonalAccess(user.id);

  const inherited = useMemo<AccessGrants | undefined>(
    () =>
      group?.isActive
        ? {
          allowedAuctionGroups: group.allowedAuctionGroups ?? [],
          allowedAuctions: group.allowedAuctions ?? [],
          allowedAccounts: group.allowedAccounts ?? [],
        }
        : undefined,
    [group],
  );

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={`Особисті доступи: ${user.firstName} ${user.lastName}`}
      maxWidth="md"
    >
      <Stack spacing={2} sx={{ pt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Група користувача: <b>{group?.name ?? (user.userGroupId ? '…' : 'без групи')}</b>
        </Typography>

        {group && !group.isActive && (
          <Alert severity="warning">
            Групу користувача заблоковано - доступ вимкнено повністю, включно з особистими дозволами.
          </Alert>
        )}

        <Alert severity="info">
          Особисті дозволи доповнюють доступ групи. Кожен рівень вмикається окремо - акаунт доступний, лише
          коли його група аукціонів і аукціон доступні користувачу (особисто або через групу - позначка
          «з групи»).
          {!isSuperAdmin && ' Змінювати доступи може лише SuperAdmin.'}
        </Alert>

        {toggle.isError && (
          <Alert severity="error">Не вдалося зберегти зміну доступу. Спробуйте ще раз.</Alert>
        )}

        {isLoading || !grants ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <>
            <AccessTree
              grants={grants}
              inherited={inherited}
              readOnly={!isSuperAdmin}
              onToggle={(kind, id, allow) => toggle.mutate({ kind, id, allow })}
              busy={toggle.isPending}
            />
            {group && <DeniedAccountsSection userId={user.id} group={group} access={grants} />}
          </>
        )}
      </Stack>
    </BaseModal>
  );
}

// Акаунти групи, заборонені цьому учаснику. Змінює SuperAdmin або GA, якщо SuperAdmin увімкнув групі
// «GA групи можуть керувати доступом до акаунтів» (canGaManageAccounts).
function DeniedAccountsSection({
  userId,
  group,
  access,
}: {
  userId: string;
  group: UserGroup;
  access: PersonalAccess;
}) {
  const toggleDenied = useToggleDeniedAccount(userId);
  const denied = useMemo(() => new Set(access.deniedAccounts.map((a) => a.id)), [access.deniedAccounts]);
  const auctionTitles = useMemo(
    () => new Map((group.allowedAuctions ?? []).map((a) => [a.id, a.title])),
    [group.allowedAuctions],
  );

  // Акаунти групи + уже заборонені, яких група більше не надає (щоб їх можна було зняти).
  const accounts = useMemo(() => {
    const byId = new Map<string, AccountSummary>();
    (group.allowedAccounts ?? []).forEach((a) => byId.set(a.id, a));
    access.deniedAccounts.forEach((a) => byId.set(a.id, a));
    return [...byId.values()];
  }, [group.allowedAccounts, access.deniedAccounts]);

  const label = (a: AccountSummary) => {
    const auction = a.auction?.title ?? auctionTitles.get(a.auctionId) ?? '-';
    return `${auction} - ${a.email ? `${a.title} (${a.email})` : a.title}`;
  };

  return (
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 1.5 }}>
      <Typography variant="subtitle2">Заборонені акаунти групи</Typography>
      <Typography variant="caption" color="text.secondary" component="p" sx={{ mb: 1 }}>
        Позначений акаунт недоступний цьому користувачу, навіть якщо його надано групі.
        {!access.canManageDenials &&
          ' Змінювати може SuperAdmin або GA, якщо SuperAdmin дозволив це для групи.'}
      </Typography>
      {toggleDenied.isError && (
        <Alert severity="error" sx={{ mb: 1 }}>
          Не вдалося зберегти зміну. Спробуйте ще раз.
        </Alert>
      )}
      {accounts.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Групі не надано жодного акаунта.
        </Typography>
      ) : (
        <Stack>
          {accounts.map((a) => (
            <FormControlLabel
              key={a.id}
              control={
                <Checkbox
                  size="small"
                  checked={denied.has(a.id)}
                  disabled={!access.canManageDenials || toggleDenied.isPending}
                  onChange={() => toggleDenied.mutate({ accountId: a.id, deny: !denied.has(a.id) })}
                />
              }
              label={<Typography variant="body2">{label(a)}</Typography>}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}
