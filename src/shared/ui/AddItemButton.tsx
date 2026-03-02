import { AddCircleOutline } from '@mui/icons-material'
import { Box, CardActionArea, Typography, Card, Grid } from '@mui/material'

interface Props {
    isEmpty: boolean;
    onClick: () => void;
    type: 'auction' | 'account' | 'session';
}

export default function AddItemButton({ isEmpty, onClick, type }: Props) {
    const label = type === 'auction'
        ? (isEmpty ? "Додайте перший аукціон" : "Додати аукціон")
        : type === 'session' ? ("Приєднатися до нової") : (isEmpty ? "Додайте перший акаунт" : "Додати акаунт")

    return (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Card
                variant="outlined"
                sx={{
                    height: "100%",
                    minHeight: { xs: 70, sm: 88 }, // Менша висота на мобільних
                    display: "flex",
                    borderRadius: "12px",
                    border: "2px dashed",
                    borderColor: "divider",
                    bgcolor: "transparent",
                    transition: "0.2s",
                    width: "100%", // Картка займає всю доступну ширину колонки
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
                        px: { xs: 1.5, sm: 3 }, // Менші падінги на мобільних
                        py: 2,
                        height: "100%"
                    }}
                >
                    <Box sx={{
                        display: "flex",
                        flexDirection: { xs: "column", xsm: "row" }, // Опційно: іконка над текстом на ДУЖЕ малих екранах
                        alignItems: "center",
                        textAlign: "center",
                        gap: { xs: 0.5, sm: 1.5 },
                        color: "primary.main",
                        // whiteSpace: "nowrap"  <-- ПРИБРАНО для адаптивності
                    }}>
                        <AddCircleOutline sx={{ fontSize: { xs: 20, sm: 24 } }} />
                        <Typography sx={{
                            fontWeight: 600,
                            fontSize: { xs: '0.875rem', sm: '1rem' }, // Менший шрифт на мобільних
                            lineHeight: 1.2,
                        }}>
                            {label}
                        </Typography>
                    </Box>
                </CardActionArea>
            </Card>
        </Grid>
    )
}