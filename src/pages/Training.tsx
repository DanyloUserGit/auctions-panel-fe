import { Add, Search } from '@mui/icons-material';
import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
  Stack,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { MaterialCreateModal } from '../features/trainings/ui/TrainingCreateModal';
import { TrainingList } from '../features/trainings/ui/TrainingList';
import { Can } from '../features/auth/ui/Can';
import { useTraining } from '../features/trainings/model/useTraining';
import { useMobile } from '../shared/hooks/useMobile';

export default function TrainingPage() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const isMobile = useMobile();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { items: training } = useTraining(debouncedSearch);

  // Виносимо кнопку в окрему змінну для зручності
  const CreateButton = (
    <Can roles={['Admin', 'SuperAdmin']}>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => setIsEditorOpen(true)}
        fullWidth={isMobile} // На мобільних розтягуємо
        sx={{
          borderRadius: '12px',
          height: 48,
          whiteSpace: 'nowrap',
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        }}
      >
        Створити матеріал
      </Button>
    </Can>
  );

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1200, mx: 'auto' }}>
      {/* HEADER: На мобільних тільки заголовок (якщо не прихований) */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: { xs: 2, sm: 4 } }}
      >
        {!isMobile && (
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Навчальний центр
            </Typography>
            <Typography variant="body2" color="text.secondary">
              База знань та корисні матеріали
            </Typography>
          </Box>
        )}

        {/* Кнопка в заголовку тільки для десктопа */}
        {!isMobile && CreateButton}
      </Stack>

      {/* SEARCH SECTION */}
      <TextField
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Пошук по базі знань..."
        sx={{
          mb: { xs: 2, sm: 4 }, // Менший відступ на мобілках, бо кнопка буде під ним
          bgcolor: 'background.paper',
          '& .MuiOutlinedInput-root': { borderRadius: '12px' },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search color="action" />
            </InputAdornment>
          ),
        }}
      />

      {/* Кнопка під пошуком ТІЛЬКИ для мобільних */}
      {isMobile && <Box sx={{ mb: 3 }}>{CreateButton}</Box>}

      <Box sx={{ minHeight: '50vh' }}>
        <TrainingList materials={training} />
      </Box>

      <MaterialCreateModal
        open={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
      />
    </Box>
  );
}
