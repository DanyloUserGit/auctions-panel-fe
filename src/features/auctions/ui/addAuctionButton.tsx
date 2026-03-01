import { AddCircleOutline } from '@mui/icons-material'
import { Box, CardActionArea, Typography } from '@mui/material'
import type { Auction } from '../model/types'
interface Props { auctions: Auction[]; onClick: () => void }
export default function AddAuctionButton({ auctions, onClick }: Props) {
    return (<CardActionArea onClick={onClick} sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, color: "primary.main" }}>
            <AddCircleOutline />
            <Typography sx={{ fontWeight: 600 }}>
                {auctions.length > 0 ? "Додати аукціон" : "Додайте перший аукціон"}
            </Typography>
        </Box>
    </CardActionArea>
    )
}
