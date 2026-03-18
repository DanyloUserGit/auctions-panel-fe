
import {
    Alert,
    Stack,
} from '@mui/material';
import { useState } from 'react';
import SelectAuction from './SelectAuction';
import SelectedAuctionSettings from './SelectedAuctionSettings';

export function AuctionSettings() {
    const [selectedAuctionId, setSelectedAuction] = useState<string | "">("");

    console.log(selectedAuctionId)

    return (
        <Stack spacing={3}>
            {/* Селектор аукціону */}

            <SelectAuction selectedAuction={selectedAuctionId} setSelectedAuction={setSelectedAuction} />
            {!selectedAuctionId ? (
                <Alert severity="info" sx={{ borderRadius: '15px' }}>
                    Оберіть аукціон, щоб отримати доступ до його налаштувань.
                </Alert>
            ) : (
                <SelectedAuctionSettings key={selectedAuctionId} selectedAuction={selectedAuctionId} />
            )}
        </Stack>
    );
}
