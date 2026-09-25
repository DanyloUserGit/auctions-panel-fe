import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '../../../shared/http';
import { getErrorMessage } from '../../../shared/utils';

export type StageTarget = { carId: number; field: string; label: string; date?: string | null };

// Зміна дати етапу процесу (ТЗ 13.5): GA і SA; порожня дата - етап не виконано.
export default function StageDialog({ target, onClose }: { target: StageTarget; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [date, setDate] = useState(target.date ? String(target.date).split('T')[0] : '');
  const save = useMutation({
    mutationFn: async (value: string | null) => api.patch(`/processes/${target.carId}`, { field: target.field, date: value }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processes'] });
      onClose();
    },
  });

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{target.label}</DialogTitle>
      <DialogContent dividers>
        <TextField fullWidth type="date" label="Дата" value={date} onChange={(e) => setDate(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
        {save.isError && <Alert severity="error" sx={{ mt: 2 }}>{getErrorMessage(save.error)}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={() => save.mutate(null)} disabled={save.isPending}>
          Очистити
        </Button>
        <Button onClick={onClose}>Скасувати</Button>
        <Button variant="contained" onClick={() => save.mutate(date)} disabled={!date || save.isPending}>
          Зберегти
        </Button>
      </DialogActions>
    </Dialog>
  );
}
