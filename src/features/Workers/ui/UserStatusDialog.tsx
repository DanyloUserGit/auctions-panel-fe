import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { getErrorMessage } from '../../../shared/utils';
import { useChangeUserStatus } from '../../auth/model/useAuth';
import { ACCESS_STATUSES, ACCESS_STATUS_LABELS, statusLabel, type AccessStatus, type User } from '../../auth/model/user-schema';

const BLOCKED = 'Blocked';

// Зміна статусу доступу (ТЗ 12): GA - для своєї групи, SA - для всіх. Причина обов'язкова й іде в журнал.
export default function UserStatusDialog({
  user,
  onClose,
}: {
  user: Pick<User, 'id' | 'firstName' | 'lastName' | 'accessStatus' | 'isBlocked'>;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<AccessStatus | typeof BLOCKED>(user.isBlocked ? BLOCKED : user.accessStatus ?? 'ReadOnly');
  const [reason, setReason] = useState('');
  const change = useChangeUserStatus();

  const submit = () => {
    const data =
      status === BLOCKED
        ? { isBlocked: true, reason }
        : { accessStatus: status, isBlocked: false, reason };
    change.mutate({ id: user.id, data }, { onSuccess: onClose });
  };

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Статус доступу</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            {user.firstName} {user.lastName}: зараз «{statusLabel(user)}»
          </Typography>
          <TextField select fullWidth label="Новий статус" value={status} onChange={(e) => setStatus(e.target.value as AccessStatus)}>
            {ACCESS_STATUSES.map((s) => (
              <MenuItem key={s} value={s}>
                {ACCESS_STATUS_LABELS[s]}
              </MenuItem>
            ))}
            <MenuItem value={BLOCKED}>Заблокований</MenuItem>
          </TextField>
          <TextField
            fullWidth
            required
            multiline
            minRows={2}
            label="Причина"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            helperText="Записується в журнал змін"
          />
          {change.isError && <Alert severity="error">{getErrorMessage(change.error)}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Скасувати</Button>
        <Button variant="contained" onClick={submit} disabled={reason.trim().length < 3 || change.isPending}>
          Зберегти
        </Button>
      </DialogActions>
    </Dialog>
  );
}
