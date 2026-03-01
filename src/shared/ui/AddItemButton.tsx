import { AddCircleOutline } from '@mui/icons-material'
import { Box, CardActionArea, Typography, Card, Grid } from '@mui/material'

interface Props {
    isEmpty: boolean;
    onClick: () => void;
    type: 'auction' | 'account';
}

export default function AddItemButton({ isEmpty, onClick, type }: Props) {
    const label = type === 'auction'
        ? (isEmpty ? "Додайте перший аукціон" : "Додати аукціон")
        : (isEmpty ? "Додайте перший акаунт" : "Додати акаунт");

    return (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Card
                variant="outlined"
                sx={{
                    height: "100%",
                    minHeight: 88,
                    display: "flex",
                    borderRadius: "12px",
                    border: "2px dashed",
                    borderColor: "divider",
                    bgcolor: "transparent",
                    transition: "0.2s",
                    // Додаємо, щоб картка не була занадто вузькою для тексту
                    minWidth: "fit-content",
                    "&:hover": {
                        borderColor: "primary.main",
                        bgcolor: "rgba(25, 118, 210, 0.04)",
                    },
                }}
            >
                <CardActionArea
                    onClick={onClick}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        px: 3, // Збільшуємо горизонтальні відступи для "дихання" тексту
                        py: 2,
                        height: "100%"
                    }}
                >
                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        color: "primary.main",
                        whiteSpace: "nowrap" // Забороняємо перенос рядка
                    }}>
                        <AddCircleOutline sx={{ fontSize: 24 }} />
                        <Typography sx={{
                            fontWeight: 600,
                            fontSize: '1rem', // Повертаємо нормальний розмір шрифту
                        }}>
                            {label}
                        </Typography>
                    </Box>
                </CardActionArea>
            </Card>
        </Grid>
    )
}