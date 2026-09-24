import { ExpandLess, ExpandMore, WarningAmber } from '@mui/icons-material';
import {
  Box,
  Checkbox,
  Chip,
  CircularProgress,
  Collapse,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import type {
  AccessGrants,
  AccessKind,
  AccountSummary,
  AuctionSummary,
  CatalogAuctionGroup,
} from '../model/types';
import { useAllAuctionGroups, useAuctionAccounts } from '../model/useUserGroups';

// Дерево доступу: група аукціонів → аукціон → акаунт.
// Кожен рівень вмикається окремо: увімкнена група аукціонів НЕ відкриває всі її аукціони,
// увімкнений аукціон НЕ відкриває всі його акаунти. Дочірній рівень діє лише тоді,
// коли діє батьківський.
interface AccessTreeProps {
  grants: AccessGrants;
  // Для особистого доступу: що вже надає група користувача (позначка «з групи»).
  inherited?: AccessGrants;
  readOnly: boolean;
  onToggle?: (kind: AccessKind, id: string, allow: boolean) => void;
  busy?: boolean;
}

// Логін (email) є лише у відповідях для SuperAdmin.
const accountLabel = (a: AccountSummary) => (a.email ? `${a.title} (${a.email})` : a.title);

type GrantSets = { groups: Set<string>; auctions: Set<string>; accounts: Set<string> };

const toSets = (grants?: AccessGrants): GrantSets => ({
  groups: new Set(grants?.allowedAuctionGroups.map((g) => g.id) ?? []),
  auctions: new Set(grants?.allowedAuctions.map((a) => a.id) ?? []),
  accounts: new Set(grants?.allowedAccounts.map((a) => a.id) ?? []),
});

// У режимі перегляду дерево будується лише з наявних дозволів (разом з їхніми батьківськими рівнями).
function catalogFromGrants(grants: AccessGrants): CatalogAuctionGroup[] {
  const groups = new Map<string, CatalogAuctionGroup>();
  const ensureGroup = (id: string, title?: string) => {
    if (!groups.has(id)) groups.set(id, { id, title: title ?? '-', auctions: [] });
    return groups.get(id)!;
  };
  grants.allowedAuctionGroups.forEach((g) => ensureGroup(g.id, g.title));

  const auctions = new Map<string, AuctionSummary>();
  grants.allowedAuctions.forEach((a) => auctions.set(a.id, a));
  grants.allowedAccounts.forEach((acc) => {
    if (acc.auction && !auctions.has(acc.auction.id)) {
      auctions.set(acc.auction.id, { ...acc.auction, url: '' });
    }
  });

  auctions.forEach((auction) => {
    const groupId = auction.auctionGroupId ?? auction.auctionGroup?.id;
    if (!groupId) return;
    ensureGroup(groupId, auction.auctionGroup?.title).auctions!.push(auction);
  });

  return [...groups.values()].sort((a, b) => a.title.localeCompare(b.title));
}

export function AccessTree({ grants, inherited, readOnly, onToggle, busy }: AccessTreeProps) {
  const { auctionGroups: catalog, isLoading } = useAllAuctionGroups();
  const own = useMemo(() => toSets(grants), [grants]);
  const inh = useMemo(() => toSets(inherited), [inherited]);

  const groups = useMemo(
    () =>
      readOnly
        ? catalogFromGrants(grants)
        : [...catalog].sort((a, b) => a.title.localeCompare(b.title)),
    [readOnly, grants, catalog],
  );

  // Дозволи на аукціони/акаунти поза каталогом (аукціон без групи) - недоступні, але їх можна зняти.
  const catalogAuctionIds = useMemo(
    () => new Set(groups.flatMap((g) => (g.auctions ?? []).map((a) => a.id))),
    [groups],
  );
  const orphanAuctions = readOnly ? [] : grants.allowedAuctions.filter((a) => !catalogAuctionIds.has(a.id));
  const orphanAccounts = readOnly ? [] : grants.allowedAccounts.filter((a) => !catalogAuctionIds.has(a.auctionId));

  if (!readOnly && isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (groups.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        {readOnly ? 'Доступів немає.' : 'Груп аукціонів ще немає.'}
      </Typography>
    );
  }

  const toggle = (kind: AccessKind, id: string, allow: boolean) => onToggle?.(kind, id, allow);

  return (
    <Stack spacing={1}>
      {groups.map((group) => (
        <AuctionGroupNode
          key={group.id}
          group={group}
          grants={grants}
          inherited={inherited}
          own={own}
          inh={inh}
          readOnly={readOnly}
          busy={busy}
          onToggle={toggle}
        />
      ))}

      {(orphanAuctions.length > 0 || orphanAccounts.length > 0) && (
        <Box sx={{ border: 1, borderColor: 'warning.light', borderRadius: 2, p: 1.5 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Дозволи поза групами аукціонів (не діють)
          </Typography>
          {orphanAuctions.map((a) => (
            <NodeRow
              key={a.id}
              label={a.title}
              checked
              disabled={busy}
              onChange={() => toggle('auction', a.id, false)}
            />
          ))}
          {orphanAccounts.map((a) => (
            <NodeRow
              key={a.id}
              label={accountLabel(a)}
              checked
              disabled={busy}
              onChange={() => toggle('account', a.id, false)}
            />
          ))}
        </Box>
      )}
    </Stack>
  );
}

interface NodeProps {
  grants: AccessGrants;
  inherited?: AccessGrants;
  own: GrantSets;
  inh: GrantSets;
  readOnly: boolean;
  busy?: boolean;
  onToggle: (kind: AccessKind, id: string, allow: boolean) => void;
}

function AuctionGroupNode({ group, ...props }: NodeProps & { group: CatalogAuctionGroup }) {
  const { own, inh, readOnly, busy, onToggle } = props;
  const auctions = group.auctions ?? [];
  const granted = own.groups.has(group.id);
  const viaGroup = inh.groups.has(group.id);
  const effective = granted || viaGroup;
  const enabledAuctions = auctions.filter((a) => own.auctions.has(a.id) || inh.auctions.has(a.id)).length;

  const [open, setOpen] = useState<boolean | null>(null);
  const isOpen = open ?? (readOnly || effective || enabledAuctions > 0);

  return (
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}>
      <NodeRow
        label={group.title}
        bold
        secondary={readOnly ? undefined : `Увімкнено аукціонів: ${enabledAuctions} з ${auctions.length}`}
        checked={granted}
        disabled={readOnly || busy}
        inheritedChip={viaGroup}
        onChange={() => onToggle('auctionGroup', group.id, !granted)}
        open={isOpen}
        onToggleOpen={() => setOpen(!isOpen)}
      />
      <Collapse in={isOpen} unmountOnExit>
        <Box sx={{ pl: 4, pr: 1, pb: 1 }}>
          {auctions.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 0.5 }}>
              У групі немає аукціонів.
            </Typography>
          ) : (
            auctions
              .slice()
              .sort((a, b) => a.title.localeCompare(b.title))
              .map((auction) => (
                <AuctionNode key={auction.id} auction={auction} parentEffective={effective} {...props} />
              ))
          )}
        </Box>
      </Collapse>
    </Box>
  );
}

function AuctionNode({
  auction,
  parentEffective,
  ...props
}: NodeProps & { auction: AuctionSummary; parentEffective: boolean }) {
  const { grants, inherited, own, inh, readOnly, busy, onToggle } = props;
  const granted = own.auctions.has(auction.id);
  const viaGroup = inh.auctions.has(auction.id);
  const effective = (granted || viaGroup) && parentEffective;
  const hasEnabledAccounts =
    grants.allowedAccounts.some((a) => a.auctionId === auction.id) ||
    !!inherited?.allowedAccounts.some((a) => a.auctionId === auction.id);

  const [open, setOpen] = useState<boolean | null>(null);
  const isOpen = open ?? (readOnly || effective || hasEnabledAccounts);

  return (
    <Box>
      <NodeRow
        label={auction.title}
        checked={granted}
        // Вмикати аукціон має сенс лише в діючій групі аукціонів; вимкнути можна завжди.
        disabled={readOnly || busy || (!granted && !parentEffective)}
        inheritedChip={viaGroup}
        inactive={(granted || viaGroup) && !parentEffective}
        onChange={() => onToggle('auction', auction.id, !granted)}
        open={isOpen}
        onToggleOpen={() => setOpen(!isOpen)}
      />
      <Collapse in={isOpen} unmountOnExit>
        <Box sx={{ pl: 4 }}>
          <AccountsList auction={auction} parentEffective={effective} {...props} />
        </Box>
      </Collapse>
    </Box>
  );
}

function AccountsList({
  auction,
  parentEffective,
  grants,
  own,
  inh,
  readOnly,
  busy,
  onToggle,
}: NodeProps & { auction: AuctionSummary; parentEffective: boolean }) {
  // У режимі редагування - усі акаунти аукціону; у перегляді - лише надані.
  const { accounts, isLoading } = useAuctionAccounts(readOnly ? undefined : auction.id);
  const list: AccountSummary[] = readOnly
    ? grants.allowedAccounts.filter((a) => a.auctionId === auction.id)
    : accounts;

  if (!readOnly && isLoading) return <CircularProgress size={16} sx={{ my: 0.5 }} />;

  if (list.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 0.5 }}>
        {readOnly ? 'Акаунтів не надано.' : 'В аукціоні немає акаунтів.'}
      </Typography>
    );
  }

  return (
    <>
      {list.map((account) => {
        const granted = own.accounts.has(account.id);
        const viaGroup = inh.accounts.has(account.id);
        return (
          <NodeRow
            key={account.id}
            label={accountLabel(account)}
            checked={granted}
            disabled={readOnly || busy || (!granted && !parentEffective)}
            inheritedChip={viaGroup}
            inactive={(granted || viaGroup) && !parentEffective}
            onChange={() => onToggle('account', account.id, !granted)}
          />
        );
      })}
    </>
  );
}

function NodeRow({
  label,
  secondary,
  bold,
  checked,
  disabled,
  inheritedChip,
  inactive,
  onChange,
  open,
  onToggleOpen,
}: {
  label: string;
  secondary?: string;
  bold?: boolean;
  checked: boolean;
  disabled?: boolean;
  inheritedChip?: boolean;
  inactive?: boolean;
  onChange: () => void;
  open?: boolean;
  onToggleOpen?: () => void;
}) {
  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ minHeight: 40, flexWrap: 'wrap' }}>
      <Checkbox size="small" checked={checked} disabled={disabled} onChange={onChange} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: bold ? 700 : 400, wordBreak: 'break-word' }}>
          {label}
        </Typography>
        {secondary && (
          <Typography variant="caption" color="text.secondary">
            {secondary}
          </Typography>
        )}
      </Box>
      {inheritedChip && <Chip size="small" variant="outlined" label="з групи" />}
      {inactive && (
        <Chip
          size="small"
          color="warning"
          variant="outlined"
          icon={<WarningAmber fontSize="small" />}
          label="не діє: вимкнено батьківський рівень"
        />
      )}
      {onToggleOpen && (
        <IconButton size="small" onClick={onToggleOpen} aria-label={open ? 'Згорнути' : 'Розгорнути'}>
          {open ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
        </IconButton>
      )}
    </Stack>
  );
}
