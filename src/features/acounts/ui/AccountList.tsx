import { Grid } from '@mui/material';
import { useModal } from '../../../shared/hooks/useModal';
import AddItemButton from '../../../shared/ui/AddItemButton';
import type { Auction } from '../../auctions/model/types';
import { Can } from '../../auth/ui/Can';
import { useSession } from '../../sessions/model/store';
import type { Account } from '../model/types';
import { useAcounts, useFavoriteAccounts } from '../model/useAcounts';
import AccountAddModal from './AccountAddModal';
import AccountItem from './AccountItem';
import { useMemo } from 'react';

export default function AccountList({
  currentAuction,
  changeView,
}: {
  currentAuction: Auction;
  changeView: () => void;
}) {
  const sessionConnect = useSession();
  const { items: accounts, isLoading } = useAcounts(currentAuction.id);
  const { items: favourite, isLoading: isLoadingFavorite } =
    useFavoriteAccounts();
  const { isOpen, open, close } = useModal(false);
  const favIds = useMemo(
    () => new Set(favourite.map((f) => f.id)),
    [favourite],
  );
  const handleSelectAccount = (accountId: string) => {
    sessionConnect.setAuctionAuthId(accountId);
    changeView();
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
        roles={['Admin', 'SuperAdmin']}
        fallback={<div>Акаунтів ще немає</div>}
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
