import { Box, Button, Card, CardContent, CardMedia, Chip, Grid, IconButton, Stack, Typography } from '@mui/material';
import { memo } from "react";
import { useModal } from '../../../shared/hooks/useModal';
import type { Training } from '../model/types';
import TrainingDetailModal from "./TrainingDetailModal";
import { getVisibilityIcon } from '../model/helper';
import { Can } from '../../auth/ui/Can';
import { Edit } from '@mui/icons-material';
import { TrainingEditModal } from './TrainingEditModal';

const TrainingItem = memo(({ item }: { item: Training }) => {
    const { isOpen: isInfoOpen, open, close } = useModal(false);
    const { isOpen: isEditOpen, open: openEdit, close: closeEdit } = useModal(false);

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        openEdit();
    };

    // Використовуємо плейсхолдер, якщо зображення немає
    const displayImage = item.imageUrl || `https://placehold.co/600x400/f0f7ff/1e40af?text=${encodeURIComponent(item.title)}`;

    return (
        <>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                    sx={{
                        borderRadius: '16px',
                        overflow: 'hidden',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        position: "relative",
                        opacity: item.isPublished ? 1 : 0.7,
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 3
                        }
                    }}
                    onClick={open}
                >
                    <Can roles={['Admin', 'SuperAdmin']}>
                        <IconButton
                            size="small"
                            onClick={handleEdit}
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                bgcolor: 'rgba(255, 255, 255, 0.9)',
                                '&:hover': { bgcolor: '#fff' },
                                zIndex: 2,
                                boxShadow: 1
                            }}
                        >
                            <Edit fontSize="small" color="primary" />
                        </IconButton>
                    </Can>

                    <CardMedia
                        component="img"
                        sx={{
                            height: 180, // Фіксована висота зображення
                            objectFit: 'cover' // Зображення заповнює область без деформації
                        }}
                        image={displayImage}
                        alt={item.title}
                    />

                    <CardContent
                        sx={{
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            p: 2
                        }}
                    >
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{ mb: 1 }}
                        >
                            <Typography
                                variant="overline"
                                color="primary"
                                sx={{ fontWeight: 700, lineHeight: 1 }}
                            >
                                {item.visibility === 'Group' ? 'Для груп' : 'Загальне'}
                            </Typography>

                            {!item.isPublished && (
                                <Chip
                                    label="Чернетка"
                                    size="small"
                                    variant="outlined"
                                    color="warning"
                                    sx={{ height: 20 }}
                                />
                            )}
                        </Stack>

                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                mb: 1,
                                lineHeight: 1.3,
                                // Обмеження заголовка до 2 рядків
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                minHeight: '3.4rem' // Щоб картки були однієї висоти, навіть якщо заголовок в 1 рядок
                            }}
                        >
                            {item.title}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mb: 2,
                                flexGrow: 1,
                                // Обмеження основного тексту до 3 рядків
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            {item.content}
                        </Typography>

                        <Box sx={{ mt: 'auto' }}>
                            <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap" useFlexGap>
                                <Chip
                                    icon={getVisibilityIcon(item.visibility)}
                                    label={item.visibility}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontSize: '10px' }}
                                />
                                {item.allowedRoles?.slice(0, 2).map((role) => (
                                    <Chip
                                        key={role}
                                        label={role}
                                        size="small"
                                        sx={{ fontSize: '10px' }}
                                    />
                                ))}
                            </Stack>

                            <Button
                                size="small"
                                variant="contained"
                                fullWidth
                                sx={{ borderRadius: '8px' }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    open();
                                }}
                            >
                                Читати
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            <TrainingDetailModal item={item} isOpen={isInfoOpen} close={close} />
            <TrainingEditModal key={item.id} item={item} isOpen={isEditOpen} close={closeEdit} />
        </>
    );
});

TrainingItem.displayName = "TrainingItem";

export default TrainingItem;