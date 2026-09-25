import { Delete, Edit } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useState } from 'react';
import { api } from '../../shared/http';
import { getErrorMessage } from '../../shared/utils';

const STAGES = {
  New: 'Новий запит',
  Searching: 'Підбір авто',
  Negotiation: 'Узгодження',
  Purchased: 'Куплено',
  Delivered: 'Доставлено',
  Closed: 'Закрито',
} as const;
type Stage = keyof typeof STAGES;

interface Client {
  id: string;
  fullName: string;
  phone?: string | null;
  city?: string | null;
  lookingFor?: string | null;
  stage: Stage;
  comments?: string | null;
  createdAt: string;
  updatedAt: string;
  owner: { id: string; firstName: string; lastName: string };
}

type ClientForm = Pick<Client, 'fullName' | 'phone' | 'city' | 'lookingFor' | 'stage' | 'comments'>;
const emptyForm: ClientForm = { fullName: '', phone: '', city: '', lookingFor: '', stage: 'New', comments: '' };
const key = ['clients'] as const;

// Клієнти (ТЗ 14): персональний облік замовників. User бачить своїх, GA - групи, SA - усіх.
export default function ClientsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [stage, setStage] = useState<Stage | ''>('');
  const [editing, setEditing] = useState<Client | null | undefined>(undefined);
  const [form, setForm] = useState<ClientForm>(emptyForm);

  const { data: clients = [] } = useQuery({
    queryKey: [...key, search, stage],
    queryFn: async () => (await api.get<Client[]>('/clients', { params: { search: search || undefined, stage: stage || undefined } })).data,
    placeholderData: keepPreviousData,
  });

  const save = useMutation({
    mutationFn: async () => (editing ? api.patch(`/clients/${editing.id}`, form) : api.post('/clients', form)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key });
      setEditing(undefined);
    },
  });
  const remove = useMutation({
    mutationFn: async (id: string) => api.delete(`/clients/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
  });

  const open = (client: Client | null) => {
    setForm(client ? { ...emptyForm, ...client } : emptyForm);
    save.reset();
    setEditing(client);
  };
  const set = <K extends keyof ClientForm>(k: K, v: ClientForm[K]) => setForm((prev) => ({ ...prev, [k]: v }));

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3} gap={2} flexWrap="wrap">
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Клієнти
        </Typography>
        <Button variant="contained" onClick={() => open(null)}>
          + Додати клієнта
        </Button>
      </Stack>

      <Grid container spacing={2} mb={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <TextField fullWidth size="small" label="Пошук: ПІБ, телефон, місто, що шукає" value={search} onChange={(e) => setSearch(e.target.value)} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField select fullWidth size="small" label="Етап" value={stage} onChange={(e) => setStage(e.target.value as Stage)}>
            <MenuItem value="">Усі</MenuItem>
            {Object.entries(STAGES).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ПІБ</TableCell>
              <TableCell>Телефон</TableCell>
              <TableCell>Місто</TableCell>
              <TableCell>Що шукає</TableCell>
              <TableCell>Етап</TableCell>
              <TableCell>Відповідальний</TableCell>
              <TableCell>Оновлено</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id} hover>
                <TableCell>{client.fullName}</TableCell>
                <TableCell>{client.phone || '-'}</TableCell>
                <TableCell>{client.city || '-'}</TableCell>
                <TableCell sx={{ maxWidth: 260 }}>{client.lookingFor || '-'}</TableCell>
                <TableCell>
                  <Chip size="small" label={STAGES[client.stage]} />
                </TableCell>
                <TableCell>
                  {client.owner.firstName} {client.owner.lastName}
                </TableCell>
                <TableCell>{dayjs(client.updatedAt).format('DD.MM.YYYY')}</TableCell>
                <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                  <IconButton size="small" onClick={() => open(client)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => window.confirm(`Видалити клієнта ${client.fullName}?`) && remove.mutate(client.id)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {!clients.length && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Клієнтів ще немає
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {editing !== undefined && (
        <Dialog open onClose={() => setEditing(undefined)} maxWidth="sm" fullWidth>
          <DialogTitle>{editing ? 'Редагувати клієнта' : 'Новий клієнт'}</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2}>
              <TextField label="ПІБ" required value={form.fullName} onChange={(e) => set('fullName', e.target.value)} />
              <TextField label="Телефон" value={form.phone ?? ''} onChange={(e) => set('phone', e.target.value)} />
              <TextField label="Місто" value={form.city ?? ''} onChange={(e) => set('city', e.target.value)} />
              <TextField label="Що шукає" multiline minRows={2} value={form.lookingFor ?? ''} onChange={(e) => set('lookingFor', e.target.value)} />
              <TextField select label="Етап покупки" value={form.stage} onChange={(e) => set('stage', e.target.value as Stage)}>
                {Object.entries(STAGES).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField label="Коментарі" multiline minRows={3} value={form.comments ?? ''} onChange={(e) => set('comments', e.target.value)} />
              {save.isError && <Alert severity="error">{getErrorMessage(save.error)}</Alert>}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditing(undefined)}>Скасувати</Button>
            <Button variant="contained" disabled={form.fullName.trim().length < 2 || save.isPending} onClick={() => save.mutate()}>
              Зберегти
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
