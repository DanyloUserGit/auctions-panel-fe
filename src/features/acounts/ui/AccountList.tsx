import { Grid } from "@mui/material";
import { useModal } from "../../../shared/hooks/useModal";
import AddItemButton from "../../../shared/ui/AddItemButton";
import type { Auction } from "../../auctions/model/types";
import { Can } from "../../auth/ui/Can";
import { useSession } from "../../sessions/model/store";
import type { Account } from "../model/types";
import { useAcounts } from "../model/useAcounts";
import AccountAddModal from "./AccountAddModal";
import AccountItem from "./AccountItem";

export default function AccountList({ currentAuction, changeView }: { currentAuction: Auction, changeView: () => void }) {
    const sessionConnect = useSession();
    const { items: accounts, isLoading } = useAcounts(currentAuction.id);
    const { isOpen, open, close } = useModal(false)

    const handleSelectAccount = (accountId: string) => {
        sessionConnect.setAuctionAuthId(accountId);
        changeView();
    }

    if (isLoading) return <div>Завантаження акаунтів...</div>;

    return (
        <Grid container spacing={3}>
            {accounts.map((account: Account) => (
                <AccountItem handleSelectAccount={handleSelectAccount} key={account.id} account={account} />
            ))}
            <Can roles={['GroupAdmin', 'SuperAdmin',]} fallback={<div>Акаунтів ще немає</div>}  >
                <AddItemButton
                    isEmpty={accounts.length === 0}
                    onClick={open}
                    type='account'
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