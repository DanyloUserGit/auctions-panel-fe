import { Done } from '@mui/icons-material';
import {
    Box,
    Divider,
    IconButton,
    ListItem,
    ListItemText,
    Tooltip,
    Typography
} from '@mui/material';
import type { Notification } from '../model/types';

import { useMarkAsRead } from '../model/useNotifications';

interface Props {
    item: Notification;
}

export default function NotificationItem({ item }: Props) {
    const { mutate: markAsRead } = useMarkAsRead()

    const handleMarkAsRead = async (e: React.MouseEvent) => {
        e.stopPropagation();
        markAsRead(item.id)

    };
    const isRead = false

    return (
        <Box>
            <ListItem
                alignItems="flex-start"
                secondaryAction={
                    <Box>
                        {!isRead && (
                            <Tooltip title="Позначити як прочитане">
                                <IconButton
                                    edge="end"
                                    size="small"
                                    onClick={handleMarkAsRead}
                                    sx={{ mr: 1, color: 'primary.main' }}
                                >
                                    <Done fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}

                    </Box>
                }
                sx={{
                    py: 2,

                    bgcolor: isRead ? 'transparent' : 'rgba(25, 118, 210, 0.04)',
                    '&:hover': { bgcolor: 'action.hover' },
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                }}
            >

                {!isRead && (
                    <Box
                        sx={{
                            width: 8,
                            height: 8,
                            bgcolor: 'primary.main',
                            borderRadius: '50%',
                            position: 'absolute',
                            left: 8,
                            top: 28,
                        }}
                    />
                )}

                <ListItemText
                    sx={{ ml: isRead ? 0 : 2 }} // зміщення тексту, якщо є крапка
                    primary={
                        <Typography
                            fontWeight={isRead ? 500 : 700}
                            variant="body1"
                            color={isRead ? 'text.primary' : 'primary.main'}
                        >
                            {item.type}
                        </Typography>
                    }
                    secondary={
                        <>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    mt: 0.5,
                                    fontWeight: isRead ? 400 : 500,
                                    color: isRead ? 'text.secondary' : 'text.primary'
                                }}
                            >
                                {item.message}
                            </Typography>
                            <Typography
                                variant="caption"
                                color="text.disabled"
                                sx={{ mt: 1, display: 'block' }}
                            >
                                {item.createdAt}
                            </Typography>
                        </>
                    }
                />
            </ListItem>
            <Divider component="li" />
        </Box>
    );
}