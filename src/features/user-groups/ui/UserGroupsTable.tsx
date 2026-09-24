import {
  Chip,
  IconButton,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import TuneIcon from '@mui/icons-material/Tune';
import type { UserGroup } from '../model/types';
import { Can } from '../../auth/ui/Can';

interface UserGroupsTableProps {
  groups: UserGroup[];
  handleChangeGroup: (id: string) => void;
  OpenDetail: () => void;
  OpenEditGroup: () => void;
  onToggleActive: (group: UserGroup) => void;
  onDelete: (group: UserGroup) => void;
}

export default function UserGroupsTable({
  groups,
  handleChangeGroup,
  OpenDetail,
  OpenEditGroup,
  onToggleActive,
  onDelete,
}: UserGroupsTableProps) {
  if (groups.length === 0) {
    return (
      <Paper
        sx={{
          p: 4,
          textAlign: 'center',
          borderRadius: '15px',
          boxShadow: 'none',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography color="text.secondary">Груп користувачів не знайдено</Typography>
      </Paper>
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{ borderRadius: '15px', boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Назва групи</TableCell>
            <TableCell>Адміністратор</TableCell>
            <TableCell align="center">Користувачів</TableCell>
            <TableCell align="center">Груп аукціонів</TableCell>
            <TableCell align="center">Аукціонів</TableCell>
            <TableCell align="center">Акаунтів</TableCell>
            <TableCell align="center">Активна</TableCell>
            <TableCell align="right">Дії</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {groups.map((group) => (
            <TableRow
              key={group.id}
              hover
              onClick={() => {
                handleChangeGroup(group.id);
                OpenDetail();
              }}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell>
                <Typography fontWeight={600}>{group.name}</Typography>
              </TableCell>
              <TableCell>
                {group.Admin ? (
                  `${group.Admin.firstName} ${group.Admin.lastName}`
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Не призначено
                  </Typography>
                )}
              </TableCell>
              <TableCell align="center">
                <Chip size="small" label={group.usersCount ?? 0} />
              </TableCell>
              <TableCell align="center">
                <Chip size="small" label={group.auctionGroupsCount ?? 0} />
              </TableCell>
              <TableCell align="center">
                <Chip size="small" label={group.auctionsCount ?? 0} />
              </TableCell>
              <TableCell align="center">
                <Chip size="small" label={group.accountsCount ?? 0} />
              </TableCell>
              <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                <Switch
                  size="small"
                  checked={group.isActive}
                  onChange={() => onToggleActive(group)}
                />
              </TableCell>
              <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                <Tooltip title="Доступи">
                  <IconButton
                    size="small"
                    onClick={() => {
                      handleChangeGroup(group.id);
                      OpenDetail();
                    }}
                  >
                    <TuneIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Редагувати">
                  <IconButton
                    size="small"
                    onClick={() => {
                      handleChangeGroup(group.id);
                      OpenEditGroup();
                    }}
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Can roles={['SuperAdmin']}>
                  <Tooltip title="Видалити">
                    <IconButton size="small" color="error" onClick={() => onDelete(group)}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Can>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}