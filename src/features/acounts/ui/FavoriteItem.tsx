import { MoreVert, Person } from '@mui/icons-material'
import { Avatar, Box, Card, CardActionArea, Grid, IconButton, Stack, Typography } from '@mui/material'
import { Loader } from '../../../shared/ui/Loader'
import { useAuctionById } from '../../auctions/model/useAuctions'
import type { Account } from '../model/types'
interface Props {
    account: Account,
    handleOpenMenu: (e: React.MouseEvent<HTMLElement>, id: string) => void,
    handleSelectAccount: (account: Account) => void
}

export default function FavoriteItem({ account, handleOpenMenu, handleSelectAccount }: Props) {
    const { auction, isLoading: isLoadingAuction } = useAuctionById(account.auctionId)
    if (isLoadingAuction) return <Loader />
    return (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={account.id}>
            <Card
                sx={{
                    borderRadius: '16px',
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: 'none',
                    transition: '0.2s',
                    position: 'relative',
                    '&:hover': {
                        borderColor: 'primary.main',
                        boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                    },
                }}
            >

                <Box sx={{ position: 'absolute', top: 12, right: 8, zIndex: 2 }}>
                    <IconButton
                        size="small"
                        onClick={(e) => handleOpenMenu(e, account.id)}
                    >
                        <MoreVert fontSize="small" />
                    </IconButton>
                </Box>

                <CardActionArea
                    onClick={() => handleSelectAccount(account)}
                    sx={{ p: 2.5 }}
                >
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                            sx={{
                                width: 52,
                                height: 52,
                                bgcolor: 'action.hover',
                                color: 'primary.main',
                                border: '1px solid',
                                borderColor: 'divider'
                            }}
                        >
                            <Person sx={{ fontSize: 28 }} />
                        </Avatar>

                        <Box sx={{ overflow: 'hidden', flexGrow: 1 }}>
                            <Typography
                                variant="caption"
                                sx={{
                                    fontWeight: 600,
                                    color: 'secondary.main',
                                    textTransform: 'uppercase',
                                    letterSpacing: 0.5
                                }}
                            >
                                {auction?.title}
                            </Typography>

                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    lineHeight: 1.2,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    mt: 0.5
                                }}
                            >
                                {account.email}
                            </Typography>
                        </Box>
                    </Stack>
                </CardActionArea>
            </Card>
        </Grid>
    )
}
