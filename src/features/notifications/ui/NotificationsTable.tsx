import { Email, Language, Telegram } from '@mui/icons-material';
import {
  Checkbox,
  Chip,
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
import { Can } from '../../auth/ui/Can';
import type { NotificationSetting } from '../model/types';
interface Props {
  settings: NotificationSetting[];
  handleToggle: (id: string, field: keyof NotificationSetting) => void;
}
export default function NotificationsTable({ settings, handleToggle }: Props) {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '12px',
      }}
    >
      <Table>
        <TableHead sx={{ bgcolor: 'action.hover' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Тип сповіщення</TableCell>
            <TableCell align="center" sx={{ fontWeight: 700 }}>
              <Tooltip title="У кабінеті">
                <Language fontSize="small" />
              </Tooltip>
              <Typography variant="caption" display="block">
                Кабінет
              </Typography>
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 700 }}>
              <Tooltip title="Email">
                <Email fontSize="small" />
              </Tooltip>
              <Typography variant="caption" display="block">
                Email
              </Typography>
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 700 }}>
              <Tooltip title="Telegram">
                <Telegram fontSize="small" />
              </Tooltip>
              <Typography variant="caption" display="block">
                Telegram
              </Typography>
            </TableCell>
            <Can roles={['Admin', 'SuperAdmin']}>
              <TableCell
                align="center"
                sx={{ fontWeight: 700, color: 'primary.main' }}
              >
                Обов'язкове
              </TableCell>
            </Can>
          </TableRow>
        </TableHead>
        <TableBody>
          {settings.map((row) => (
            <TableRow key={row.id} hover>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {row.type}
                </Typography>
                {row.isMandatory && (
                  <Chip
                    label="Обов'язкове"
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ mt: 0.5, height: 18, fontSize: '10px' }}
                  />
                )}
              </TableCell>

              <TableCell align="center">
                <Switch
                  size="small"
                  checked={row.inApp}
                  disabled={row.isMandatory}
                  onChange={() => handleToggle(row.id, 'inApp')}
                />
              </TableCell>

              <TableCell align="center">
                <Checkbox
                  checked={row.email}
                  disabled={row.isMandatory}
                  onChange={() => handleToggle(row.id, 'email')}
                />
              </TableCell>

              <TableCell align="center">
                <Checkbox
                  checked={row.telegram}
                  disabled={row.isMandatory}
                  onChange={() => handleToggle(row.id, 'telegram')}
                />
              </TableCell>

              <Can roles={['Admin', 'SuperAdmin']}>
                <TableCell align="center">
                  <Checkbox
                    color="primary"
                    checked={row.isMandatory}
                    onChange={() => handleToggle(row.id, 'isMandatory')}
                  />
                </TableCell>
              </Can>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
