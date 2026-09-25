import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';
import { getErrorMessage } from '../../../shared/utils';
import { useCreateReminder } from '../model/reminders';

// Нагадування про завершення аукціону (ТЗ 15): за скільки часу нагадати - у налаштуваннях сповіщень.
export default function ReminderDialog({ defaultTitle = '', onClose }: { defaultTitle?: string; onClose: () => void }) {
  const [title, setTitle] = useState(defaultTitle);
  const [endsAt, setEndsAt] = useState(dayjs().add(1, 'hour').format('YYYY-MM-DDTHH:mm'));
  const create = useCreateReminder();

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Нагадати про завершення аукціону</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField fullWidth label="Що завершується (лот, авто)" value={title} onChange={(e) => setTitle(e.target.value)} />
          <TextField
            fullWidth
            type="datetime-local"
            label="Час завершення"
            value={endsAt}
            onChange={(e) => setEndsAt(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <Typography variant="caption" color="text.secondary">
            За скільки часу нагадати, задається в Налаштування → Сповіщення.
          </Typography>
          {create.isError && <Alert severity="error">{getErrorMessage(create.error)}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Скасувати</Button>
        <Button
          variant="contained"
          disabled={!title.trim() || create.isPending}
          onClick={() => create.mutate({ title, endsAt: new Date(endsAt).toISOString() }, { onSuccess: onClose })}
        >
          Створити
        </Button>
      </DialogActions>
    </Dialog>
  );
}
