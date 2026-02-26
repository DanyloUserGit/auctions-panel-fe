import { Gavel } from "@mui/icons-material";
import { Avatar, Box, Card, CardActionArea, Grid, Typography } from "@mui/material";


export default function AuctionItem({ title, url }: { title: string, url: string }) {
  return (
    <Grid width="100%" size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
      <Card
        sx={{
          borderRadius: "12px",
          border: "1px solid #e0e0e0",
          boxShadow: "none",
          transition: "0.2s",
          "&:hover": {
            borderColor: "var(--color-primary)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
          }
        }}
      >
        <CardActionArea sx={{ p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                width: 50,
                height: 50,
                bgcolor: "#f0f7ff", // Краще вказати fallback колір
                color: "var(--color-primary)",
                fontWeight: "bold",
                fontSize: "1.1rem"
              }}
            >
              <Gavel sx={{ fontSize: 24 }} />
            </Avatar>

            <Box sx={{ overflow: "hidden", flexGrow: 1 }}>
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
                {title}
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ 
                  display: 'block',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {url}
              </Typography>
            </Box>
          </Box>
        </CardActionArea>
      </Card>
    </Grid>
  );
}