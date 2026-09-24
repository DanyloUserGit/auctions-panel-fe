import { useState } from 'react';
import type { User } from '../../auth/model/user-schema';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { Block, Edit, Key, MoreVert } from '@mui/icons-material';
import { useAuth, useBlockUser } from '../../auth/model/useAuth';

export function UserActionsMenu({
  user,
  openEdit,
  openAccess,
}: {
  user: User;
  openEdit: () => void;
  openAccess: () => void;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { mutate: block } = useBlockUser();
  const { user: currentUser } = useAuth();

  // Ті самі правила, що й на бекенді: SuperAdmin - будь-кого,
  // Admin - лише учасників своєї групи з роллю User.
  const isSuperAdmin = currentUser?.role === 'SuperAdmin';
  const canManage =
    isSuperAdmin ||
    (currentUser?.role === 'Admin' &&
      user.role === 'User' &&
      !!currentUser.managedGroup?.id &&
      user.userGroupId === currentUser.managedGroup.id);
  const canViewAccess = canManage && user.role !== 'SuperAdmin';

  if (!canManage) return null;

  const handleBlock = async () => {
    block(user);
  };
  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <MoreVert />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            openEdit();
          }}
        >
          <Edit fontSize="small" sx={{ mr: 1 }} /> Редагувати
        </MenuItem>
        {canViewAccess && (
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              openAccess();
            }}
          >
            <Key fontSize="small" sx={{ mr: 1 }} /> Доступи
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            handleBlock();
          }}
          sx={{ color: 'error.main' }}
        >
          <Block fontSize="small" sx={{ mr: 1 }} />
          {user.isBlocked ? 'Розблокувати' : 'Заблокувати'}
        </MenuItem>
      </Menu>
    </>
  );
}
