import {
  Email,
  Language,
  PowerSettingsNew,
  Security,
} from '@mui/icons-material';
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
import { useAuth } from '../../auth/model/useAuth';
import { Can } from '../../auth/ui/Can';
import type { NotificationChannel, NotificationSetting } from '../model/types';

interface Props {
  settings: NotificationSetting[];
  handleToggle: (
    id: string,
    field: 'isEnabled' | NotificationChannel | 'isMandatory',
  ) => void;
}

export default function NotificationsTable({ settings, handleToggle }: Props) {
  const { user } = useAuth();
  const isAdmin = user?.role == 'Admin' || user?.role == 'SuperAdmin';
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '12px' }}
    >
      <Table size="small">
        <TableHead sx={{ bgcolor: 'action.hover' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, py: 2 }}>
              Тип сповіщення
            </TableCell>

            {/* Колонки каналів */}
            <TableCell align="center" sx={{ fontWeight: 700 }}>
              <Tooltip title="Внутрішні сповіщення">
                <Language fontSize="small" />
              </Tooltip>
              <Typography variant="caption" display="block">
                In-App
              </Typography>
            </TableCell>

            <TableCell align="center" sx={{ fontWeight: 700 }}>
              <Tooltip title="Електронна пошта">
                <Email fontSize="small" />
              </Tooltip>
              <Typography variant="caption" display="block">
                Email
              </Typography>
            </TableCell>

            {/* Статус активності */}
            <TableCell align="center" sx={{ fontWeight: 700 }}>
              <Tooltip title="Загальний статус">
                <PowerSettingsNew fontSize="small" />
              </Tooltip>
              <Typography variant="caption" display="block">
                Активне
              </Typography>
            </TableCell>

            {/* Обов'язковість (Тільки для адмінів) */}
            <Can roles={['Admin', 'SuperAdmin']}>
              <TableCell
                align="center"
                sx={{ fontWeight: 700, color: 'primary.main' }}
              >
                <Tooltip title="Адмін-налаштування">
                  <Security fontSize="small" />
                </Tooltip>
                <Typography variant="caption" display="block">
                  Mandatory
                </Typography>
              </TableCell>
            </Can>
          </TableRow>
        </TableHead>

        <TableBody>
          {settings.map((row) => {
            const isRowDisabled = row.isMandatory && !isAdmin;

            return (
              <TableRow key={row.id} hover>
                <TableCell sx={{ py: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {row?.notificationType?.description ||
                      row?.notificationType?.name}
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

                {/* Канал In-App */}
                <TableCell align="center">
                  <Checkbox
                    size="small"
                    checked={row.channels?.includes('InApp') ?? false}
                    disabled={isRowDisabled}
                    onChange={() => handleToggle(row.id, 'InApp')}
                  />
                </TableCell>

                {/* Канал Email */}
                <TableCell align="center">
                  <Checkbox
                    size="small"
                    checked={row.channels?.includes('Email') ?? false}
                    disabled={isRowDisabled}
                    onChange={() => handleToggle(row.id, 'Email')}
                  />
                </TableCell>

                {/* Загальний перемикач isEnabled */}
                <TableCell align="center">
                  <Switch
                    size="small"
                    checked={row.isEnabled}
                    disabled={isRowDisabled}
                    onChange={() => handleToggle(row.id, 'isEnabled')}
                  />
                </TableCell>

                {/* Керування Mandatory (Тільки для SA/Admin) */}
                <Can roles={['Admin', 'SuperAdmin']}>
                  <TableCell align="center">
                    <Checkbox
                      size="small"
                      color="primary"
                      checked={row.isMandatory}
                      onChange={() => handleToggle(row.id, 'isMandatory')}
                    />
                  </TableCell>
                </Can>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
