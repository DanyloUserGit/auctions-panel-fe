import {
  Alert,
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '../../shared/http';
import { getErrorMessage } from '../../shared/utils';
import { fetchCrmClients, saveCrmClientAssignment, type AssignedUser } from './api';

const userLabel = (u: AssignedUser) => `${u.firstName} ${u.lastName} (${u.email})`;

// SuperAdmin призначає клієнтів CRM користувачам: User бачить процеси й баланси лише своїх клієнтів,
// GA - клієнтів учасників своєї групи (ТЗ 13.5, 13.6).
export default function CrmClientsDialog({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data: clients = [], isLoading } = useQuery({ queryKey: ['crm-clients'], queryFn: fetchCrmClients });
  const { data: users = [] } = useQuery<AssignedUser[]>({
    queryKey: ['users', 'all'],
    queryFn: async () => (await api.get('/users')).data,
  });

  const save = useMutation({
    mutationFn: saveCrmClientAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-clients'] });
      queryClient.invalidateQueries({ queryKey: ['balances'] });
      queryClient.invalidateQueries({ queryKey: ['processes'] });
    },
  });

  const visible = clients.filter((c) => c.clientName.toLowerCase().includes(search.toLowerCase()));

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Відповідальні за клієнтів</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Користувач бачить процеси й баланси лише призначених йому клієнтів; адміністратор групи - клієнтів
          учасників своєї групи.
        </Typography>
        <TextField fullWidth size="small" label="Пошук клієнта" value={search} onChange={(e) => setSearch(e.target.value)} sx={{ mb: 2 }} />
        {save.isError && <Alert severity="error" sx={{ mb: 2 }}>{getErrorMessage(save.error)}</Alert>}
        {isLoading && <Typography>Завантаження...</Typography>}
        <Stack spacing={1.5}>
          {visible.map((client) => (
            <Stack key={client.clientName} direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }}>
              <Typography sx={{ minWidth: 220, fontWeight: 500 }}>{client.clientName}</Typography>
              <Autocomplete
                multiple
                fullWidth
                size="small"
                options={users}
                value={users.filter((u) => client.users.some((a) => a.id === u.id))}
                getOptionLabel={userLabel}
                isOptionEqualToValue={(a, b) => a.id === b.id}
                onChange={(_, value) => save.mutate({ clientName: client.clientName, userIds: value.map((u) => u.id) })}
                renderInput={(params) => <TextField {...params} placeholder="Користувачі" />}
              />
            </Stack>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрити</Button>
      </DialogActions>
    </Dialog>
  );
}
