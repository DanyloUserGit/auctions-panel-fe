import { Alert, Stack } from '@mui/material';
import { useState } from 'react';
import type { User } from '../../../auth/model/user-schema';
import SelectGroup from './SelectGroup';
import SelectedGroupSettings from './SelectedGroupSettings';

export function GroupSettings({ user }: { user: User }) {

  const [selectedGroupId, setSelectedGroup] = useState<string | ''>('');

  return (
    <Stack spacing={3} sx={{ maxWidth: 800, mx: 'auto', py: 4 }}>
      {!(user.role === "Admin") && <SelectGroup
        selectedGroupId={selectedGroupId}
        setSelectedGroup={setSelectedGroup}
      />}

      {!(user.role === "Admin") && !selectedGroupId ? (
        <Alert severity="info" sx={{ borderRadius: '15px' }}>
          Оберіть групу, щоб отримати доступ до його налаштувань.
        </Alert>
      ) : (
        <SelectedGroupSettings
          key={user.role === "Admin" && user.managedGroup ? user.managedGroup.id : selectedGroupId}
          groupId={user.role === "Admin" && user.managedGroup ? user.managedGroup.id : selectedGroupId}
        />
      )}
    </Stack>
  );
}
