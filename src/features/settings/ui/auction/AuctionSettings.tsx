import { Alert, Stack } from '@mui/material';
import { useState } from 'react';
import type { User } from '../../../auth/model/user-schema';
import SelectAuction from './SelectAuction';
import SelectedAuctionSettings from './SelectedAuctionSettings';

export function AuctionSettings({ user }: { user: User }) {
  const [selectedAuctionId, setSelectedAuction] = useState<string | ''>('');

  return (
    <Stack spacing={3}>

      <SelectAuction
        user={user}
        selectedAuction={selectedAuctionId}
        setSelectedAuction={setSelectedAuction}
      />
      {!selectedAuctionId ? (
        <Alert severity="info" sx={{ borderRadius: '15px' }}>
          Оберіть аукціон, щоб отримати доступ до його налаштувань.
        </Alert>
      ) : (
        <SelectedAuctionSettings
          key={selectedAuctionId}
          selectedAuction={selectedAuctionId}
        />
      )}
    </Stack>
  );
}
