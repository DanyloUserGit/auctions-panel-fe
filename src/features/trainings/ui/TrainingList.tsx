import {
    Button,
    Card, CardContent, CardMedia,
    Grid,
    Typography
} from '@mui/material';

export const TrainingList = () => {
    // Тут використовуємо GET /api/training/materials
    // const materials = []; // Твій масив даних
    // const materials = []; // Твій масив даних


    return (
        <Grid container spacing={3}>
            {[1, 2, 3].map((i) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                    <Card sx={{ borderRadius: '16px', overflow: 'hidden', height: '100%' }}>
                        <CardMedia
                            component="img"
                            height="160"
                            image={`https://picsum.photos/400/200?random=${i}`}
                            alt="Preview"
                        />
                        <CardContent>
                            <Typography variant="overline" color="primary" sx={{ fontWeight: 700 }}>
                                КАТЕГОРІЯ
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                Як правильно робити ставки?
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Детальна інструкція про те, як працює система таймерів та ліміти...
                            </Typography>
                            <Button size="small" variant="outlined" fullWidth>Читати</Button>
                        </CardContent>
                    </Card>
                </Grid>
            ))
            }
        </Grid >
    );
}