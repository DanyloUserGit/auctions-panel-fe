import { useState } from "react";
import type { Auction } from "../../auctions/model/types";
import { useAcounts } from "../model/useAcounts";
import { Grid } from "@mui/material";
import AccountItem from "./AccountItem";
import type { Account } from "../model/types";
import AddItemButton from "../../../shared/ui/AddItemButton";
import AccountAddModal from "./AccountAddModal";
import { Can } from "../../auth/ui/Can";

export default function AccountList({ currentAuction }: { currentAuction: Auction }) {
    // Використовуємо items напряму з хука, без зайвих useEffect
    const { items: accounts, isLoading } = useAcounts(currentAuction.id);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (isLoading) return <div>Завантаження акаунтів...</div>;

    return (
        <Grid container spacing={3}>
            {accounts.map((account: Account) => (
                <AccountItem key={account.id} account={account} />
            ))}
            <Can roles={['GroupAdmin', 'SuperAdmin', "Admin"]} fallback=<div>Акаунтів ще немає</div>  >
                <AddItemButton
                    isEmpty={accounts.length === 0}
                    onClick={() => setIsModalOpen(true)}
                    type='account'
                />
                <AccountAddModal
                    currentAuctionId={currentAuction.id}
                    isModalOpen={isModalOpen}
                    handleClose={() => setIsModalOpen(false)}
                    modal_title="Додати акаунт"
                />
            </Can>
        </Grid>
    );
}