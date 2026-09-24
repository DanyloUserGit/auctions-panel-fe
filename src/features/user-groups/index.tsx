import { useState } from 'react';
import type { UserGroup } from './model/types';
import { UserGroupDetailPage } from './ui/UserGroupDetailPage';
import { UserGroupsListPage } from './ui/UserGroupsListPage';

export function UserGroupsFeature() {
  const [openedGroupId, setOpenedGroupId] = useState<string | null>(null);

  if (openedGroupId) {
    return (
      <UserGroupDetailPage
        groupId={openedGroupId}
        onBack={() => setOpenedGroupId(null)}
      />
    );
  }

  return (
    <UserGroupsListPage
      onOpenGroup={(group: UserGroup) => setOpenedGroupId(group.id)}
    />
  );
}

export * from './ui/UserGroupAccessPanel';
export * from './ui/UserGroupDetailPage';
export * from './ui/UserGroupFormDialog';
export * from './ui/UserGroupsListPage';
