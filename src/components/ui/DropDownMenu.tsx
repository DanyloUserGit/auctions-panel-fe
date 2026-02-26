import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { MoreVert, Edit, DeleteOutline } from '@mui/icons-material';

interface DropDownMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

export default function DropDownMenu({ onEdit, onDelete }: DropDownMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVert />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => { onEdit(); handleClose(); }}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Редагувати</ListItemText>
        </MenuItem>
        
        <MenuItem 
          onClick={() => { onDelete(); handleClose(); }}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteOutline fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Видалити</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
}