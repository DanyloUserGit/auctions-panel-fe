import {
  Alert,
  Stack
} from '@mui/material';
import { useState } from 'react';
import SelectGroup from './SelectGroup';
import SelectedGroupSettings from './SelectedGroupSettings';

export function GroupSettings() {
  const [selectedGroupId, setSelectedGroup] = useState<string | ''>('');


  return (
    <Stack spacing={3} sx={{ maxWidth: 800, mx: 'auto', py: 4 }}>
      <SelectGroup selectedGroupId={selectedGroupId} setSelectedGroup={setSelectedGroup} />

      {!selectedGroupId ? (
        <Alert severity="info" sx={{ borderRadius: '15px' }}>
          Оберіть групу, щоб отримати доступ до його налаштувань.
        </Alert>
      ) : (
        <SelectedGroupSettings
          key={selectedGroupId}
          groupId={selectedGroupId}
        />
      )}

    </Stack>
  );
}