import { Grid } from '@mui/material';
import { useModal } from '../../../shared/hooks/useModal';
import AddItemButton from '../../../shared/ui/AddItemButton';
import type { Auction } from '../../auctions/model/types';
import { Can } from '../../auth/ui/Can';
import { useNavigate } from 'react-router-dom';
import { useTabsStore } from '../../sessions/model/tabs';
import type { Account } from '../model/types';
import { useAccounts, useFavoriteAccounts } from '../model/useAccounts';
import AccountAddModal from './AccountAddModal';
import AccountItem from './AccountItem';
import { useMemo } from 'react';

export default function AccountList({ currentAuction }: { currentAuction: Auction }) {
  const navigate = useNavigate();
  const openTab = useTabsStore((s) => s.openTab);
  const { items: accounts, isLoading } = useAccounts(currentAuction.id);
  const { items: favourite, isLoading: isLoadingFavorite } =
    useFavoriteAccounts();
  const { isOpen, open, close } = useModal(false);
  const favIds = useMemo(
    () => new Set(favourite.map((f) => f.id)),
    [favourite],
  );
  // Клік по акаунту одразу відкриває вкладку, без вибору сесії (ТЗ 6.1).
  const handleSelectAccount = (account: Account) => {
    openTab({
      auctionId: currentAuction.id,
      auctionAuthId: account.id,
      auctionTitle: currentAuction.title,
      accountTitle: account.title,
    });
    navigate(`/session/${account.id}`);
  };

  if (isLoading || isLoadingFavorite)
    return <div>Завантаження акаунтів...</div>;

  return (
    <Grid container spacing={3}>
      {accounts.map((account: Account) => {
        const isFavorite = favIds.has(account.id);
        return (
          <AccountItem
            handleSelectAccount={handleSelectAccount}
            key={account.id}
            account={account}
            isFavorite={isFavorite}
          />
        );
      })}
      <Can
        roles={['SuperAdmin']}
        // fallback={<div>Акаунтів ще немає</div>}
      >
        <AddItemButton
          isEmpty={accounts.length === 0}
          onClick={open}
          type="account"
        />
        <AccountAddModal
          currentAuctionId={currentAuction.id}
          isModalOpen={isOpen}
          handleClose={close}
          modal_title="Додати акаунт"
        />
      </Can>
    </Grid>
  );
}
