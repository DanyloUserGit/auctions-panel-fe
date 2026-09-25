import { AlarmAdd, Delete } from '@mui/icons-material';
import { Button, IconButton, Paper, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useDeleteReminder, useReminders } from '../model/reminders';
import ReminderDialog from './ReminderDialog';

export default function RemindersPanel() {
  const { data: reminders = [] } = useReminders();
  const remove = useDeleteReminder();
  const [isOpen, setIsOpen] = useState(false);
  const upcoming = reminders.filter((r) => dayjs(r.endsAt).isAfter(dayjs()));

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: '12px' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Нагадування про завершення аукціонів
        </Typography>
        <Button size="small" startIcon={<AlarmAdd />} onClick={() => setIsOpen(true)}>
          Додати
        </Button>
      </Stack>
      {upcoming.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Нагадувань немає
        </Typography>
      ) : (
        upcoming.map((r) => (
          <Stack key={r.id} direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="body2">
              {r.title} - завершення {dayjs(r.endsAt).format('DD.MM HH:mm')}
              {r.sentAt ? ' (нагадано)' : `, нагадаю о ${dayjs(r.remindAt).format('DD.MM HH:mm')}`}
            </Typography>
            <IconButton size="small" onClick={() => remove.mutate(r.id)}>
              <Delete fontSize="small" />
            </IconButton>
          </Stack>
        ))
      )}
      {isOpen && <ReminderDialog onClose={() => setIsOpen(false)} />}
    </Paper>
  );
}
