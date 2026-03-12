import { Add, Search } from '@mui/icons-material';
import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { MaterialCreateModal } from '../features/trainings/ui/TrainingCreateModal';
import { TrainingList } from '../features/trainings/ui/TrainingList';
import { Can } from '../features/auth/ui/Can';
import { useTraining } from '../features/trainings/model/useTraining';

export default function TrainingPage() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const [search, setSearch] = useState('');

  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { items: training } = useTraining(debouncedSearch);

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Навчальний центр
        </Typography>

        <Can roles={['Admin', 'SuperAdmin']}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setIsEditorOpen(true)}
          >
            Створити матеріал
          </Button>
        </Can>
      </Box>

      <TextField
        fullWidth
        value={search}
        size="small"
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Пошук по базі знань..."
        sx={{ mb: 4, bgcolor: 'background.paper', borderRadius: '10px' }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />
      <TrainingList materials={training} />

      <MaterialCreateModal
        open={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
      />
    </Box>
  );
}
