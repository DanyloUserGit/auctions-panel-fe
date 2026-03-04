import { useState } from "react";
import type { User } from "../../auth/model/user-schema";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { Block, Edit, MoreVert } from "@mui/icons-material";
import { useBlockUser } from "../../auth/model/useAuth";


export function UserActionsMenu({ user }: { user: User }) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const { mutate: block } = useBlockUser()
    const handleBlock = async () => {
        block(user)
    }
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
                <MenuItem onClick={() => setAnchorEl(null)}>
                    <Edit fontSize="small" sx={{ mr: 1 }} /> Редагувати
                </MenuItem>
                <MenuItem onClick={() => { setAnchorEl(null); handleBlock() }} sx={{ color: 'error.main' }}>
                    <Block fontSize="small" sx={{ mr: 1 }} />
                    {user.isBlocked ? "Розблокувати" : "Заблокувати"}
                </MenuItem>
            </Menu>
        </>
    );
}