import { DeleteOutline, MailOutline, MoreVert, Person } from "@mui/icons-material";
import {
    Avatar, Box, Card, CardActionArea, Grid,
    IconButton,
    ListItemIcon,
    Menu, MenuItem,
    Typography
} from "@mui/material";
import { useState } from "react";
import type { Account } from "../model/types";
import ConfirmDeleteAccountModal from "./ConfirmDeleteAccountModal";



interface AccountItemProps {
    account: Account;
    handleSelectAccount: (accountId: string) => void;
    onDelete?: (account: Account) => void;
}

export default function AccountItem({ account, handleSelectAccount }: AccountItemProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isOpen, setIsOpen] = useState(false)
    const open = Boolean(anchorEl);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(null);
    };

    return (
        <Grid >
            <Card
                sx={{
                    borderRadius: "12px",
                    border: "1px solid #e0e0e0",
                    boxShadow: "none",
                    transition: "0.2s",
                    position: "relative",
                    "&:hover": {
                        borderColor: "var(--color-primary)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                    }
                }}
            >
                {/* Кнопка меню (три крапки) */}
                <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}>
                    <IconButton size="small" onClick={handleOpenMenu} sx={{ color: "text.secondary" }}>
                        <MoreVert fontSize="small" />
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleCloseMenu}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >

                        <MenuItem onClick={(e) => { handleCloseMenu(e); handleOpen(); }} sx={{ color: 'error.main' }}>
                            <ListItemIcon><DeleteOutline fontSize="small" color="error" /></ListItemIcon>
                            <Typography variant="inherit">Видалити</Typography>
                        </MenuItem>
                    </Menu>
                </Box>

                <ConfirmDeleteAccountModal handleClose={handleClose} currentAccount={account} isModalOpen={isOpen} />

                <CardActionArea onClick={() => handleSelectAccount(account.id)} sx={{ p: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar
                            sx={{
                                width: 50,
                                height: 50,
                                bgcolor: "#f4f6f8",
                                color: "text.secondary",
                            }}
                        >
                            <Person sx={{ fontSize: 28 }} />
                        </Avatar>

                        <Box sx={{ overflow: "hidden", flexGrow: 1, pr: 3 }}>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: 700,
                                    lineHeight: 1.2,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                            >
                                {account.email
                                    ? `${account.email}`
                                    : ""}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                <MailOutline sx={{ fontSize: 14, color: 'text.secondary' }} />
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}
                                >
                                    {account.email}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </CardActionArea>
            </Card>
        </Grid>
    );
}