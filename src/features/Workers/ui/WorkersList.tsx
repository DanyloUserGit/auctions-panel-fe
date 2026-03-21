import { Assessment } from '@mui/icons-material';
import { TableBody, TableRow, TableCell, Box, Typography, Chip, Stack, Tooltip, IconButton, type ChipProps, Table, TableHead, TableContainer, Paper, TablePagination } from '@mui/material';
import { UserActionsMenu } from './UserActionsMenu';
import type { User, UserRole } from '../../auth/model/user-schema';
import { useMobile } from '../../../shared/hooks/useMobile';
import { useState } from 'react';
const roleColors: Record<UserRole, ChipProps['color']> = {
    SuperAdmin: 'error',
    Admin: 'primary',
    User: 'default',
};
interface Props {
    users: User[],
    handleChangeWorker: (id: string) => void,
    OpenEditUser: () => void,
    OpenControlCard: () => void


}
export default function WorkersList({ users, handleChangeWorker, OpenControlCard, OpenEditUser }: Props) {
    const isMobile = useMobile();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    return (
        <TableContainer
            component={Paper}
            sx={{ borderRadius: '15px', overflow: 'hidden' }}
        >
            <Table>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Користувач</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Роль</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Статус</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>
                            Дії
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users && users?.length > 0 ? (
                        users.map((user) => (
                            <TableRow key={user.id} hover>
                                <TableCell>
                                    <Box>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{ fontWeight: 600 }}
                                        >{`${user.firstName} ${user.lastName}`}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {user.email}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.role}
                                        size="small"
                                        color={roleColors[user.role] || 'default'}
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.isBlocked ? 'Заблокований' : 'Активний'}
                                        size="small"
                                        sx={{
                                            bgcolor: user.isActive ? '#e1f5fe' : '#ffebee',
                                            color: user.isActive ? '#01579b' : '#b71c1c',
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        justifyContent="flex-end"
                                    >
                                        <Tooltip
                                            title="Картка контролю"
                                            onClick={() => {
                                                handleChangeWorker(String(user.id));
                                                OpenControlCard();
                                            }}
                                        >
                                            <IconButton size="small" color="primary">
                                                <Assessment />
                                            </IconButton>
                                        </Tooltip>
                                        <UserActionsMenu
                                            openEdit={() => {
                                                handleChangeWorker(String(user.id));
                                                OpenEditUser();
                                            }}
                                            user={user}
                                        />
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                <Typography color="text.secondary">
                                    Працівників ще немає
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <TablePagination
                component="div"
                count={users.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage={isMobile ? "" : "Рядків на сторінці:"}
                sx={{ mt: 2 }}
            />
        </TableContainer>
    )
}
