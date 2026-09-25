import {
  Email,
  Language,
  PowerSettingsNew,
  Security,
} from '@mui/icons-material';
import {
  Box,
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
  TextField,
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
  handleValueChange: (id: string, value: number) => void;
}

export default function NotificationsTable({ settings, handleToggle, handleValueChange }: Props) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin' || user?.role === 'SuperAdmin';

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

            <TableCell align="center" sx={{ fontWeight: 700, width: 80 }}>
              <Tooltip title="Внутрішні сповіщення">
                <Language fontSize="small" />
              </Tooltip>
              <Typography variant="caption" display="block">
                In-App
              </Typography>
            </TableCell>

            <TableCell align="center" sx={{ fontWeight: 700, width: 80 }}>
              <Tooltip title="Електронна пошта">
                <Email fontSize="small" />
              </Tooltip>
              <Typography variant="caption" display="block">
                Email
              </Typography>
            </TableCell>

            <TableCell align="center" sx={{ fontWeight: 700, width: 80 }}>
              <Tooltip title="Загальний статус">
                <PowerSettingsNew fontSize="small" />
              </Tooltip>
              <Typography variant="caption" display="block">
                Активне
              </Typography>
            </TableCell>

            <Can roles={['Admin', 'SuperAdmin']}>
              <TableCell
                align="center"
                sx={{ fontWeight: 700, color: 'primary.main', width: 80 }}
              >
                <Tooltip title="Обов'язкове для вашої групи">
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
          {settings.length === 0 && (
            <TableRow>
              <TableCell colSpan={5}>
                <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                  Немає доступних налаштувань сповіщень
                </Typography>
              </TableCell>
            </TableRow>
          )}

          {settings.map((row) => {
            // Обов'язкові сповіщення не можна вимкнути нікому, крім адміна
            // групи, який власне і встановлює обов'язковість (колонка Mandatory).
            const isRowDisabled = row.isMandatory && !isAdmin;
            const notificationSetting = row.notificationType?.setting;

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

                  {notificationSetting && (
                    <Box sx={{ mt: 1.5 }}>
                      {/* Значення зберігається в секундах, користувач задає хвилини. */}
                      <TextField
                        size="small"
                        type="number"
                        label="Нагадати за, хв"
                        disabled={isRowDisabled}
                        defaultValue={Math.round((row.value ?? notificationSetting.default) / 60)}
                        onBlur={(e) => handleValueChange(row.id, Math.round(Number(e.target.value) * 60))}
                        inputProps={{
                          min: Math.ceil(notificationSetting.min / 60),
                          max: Math.floor(notificationSetting.max / 60),
                        }}
                        sx={{ width: 160 }}
                        helperText={`Від ${Math.ceil(notificationSetting.min / 60)} до ${Math.floor(notificationSetting.max / 60)} хв до завершення`}
                        FormHelperTextProps={{ sx: { mx: 0 } }}
                      />
                    </Box>
                  )}
                </TableCell>

                <TableCell align="center">
                  <Checkbox
                    size="small"
                    checked={row.channels?.includes('InApp') ?? false}
                    disabled={isRowDisabled}
                    onChange={() => handleToggle(row.id, 'InApp')}
                  />
                </TableCell>

                <TableCell align="center">
                  <Checkbox
                    size="small"
                    checked={row.channels?.includes('Email') ?? false}
                    disabled={isRowDisabled}
                    onChange={() => handleToggle(row.id, 'Email')}
                  />
                </TableCell>

                <TableCell align="center">
                  <Switch
                    size="small"
                    checked={row.isEnabled}
                    disabled={isRowDisabled}
                    onChange={() => handleToggle(row.id, 'isEnabled')}
                  />
                </TableCell>

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