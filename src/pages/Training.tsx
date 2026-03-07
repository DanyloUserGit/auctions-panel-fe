import { Add, HelpOutline, School, Search } from '@mui/icons-material';
import {
    Box,
    Button,
    InputAdornment,
    Tab,
    Tabs,
    TextField,
    Typography
} from '@mui/material';
import { useState } from 'react';
import { TrainingList } from '../features/trainings/ui/TrainingList';
import { MaterialEditorModal } from '../features/trainings/ui/MaterialEditorModal';
import InfoFaqUI from '../features/trainings/ui/InfoSection';

export default function TrainingPage() {
    const [tabValue, setTabValue] = useState(0);
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    return (
        <Box sx={{ p: 3 }}>
            {/* Заголовок та кнопка створення (тільки для адмінів) */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>Навчальний центр</Typography>

                {/* Компонент Can перевіряє ролі SuperAdmin або GroupAdmin */}
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setIsEditorOpen(true)}
                >
                    Створити матеріал
                </Button>
            </Box>

            {/* Вкладки для розділення Інформації та Навчання */}
            <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 3 }}>
                <Tab icon={<School fontSize="small" />} iconPosition="start" label="Навчальні матеріали" />
                <Tab icon={<HelpOutline fontSize="small" />} iconPosition="start" label="Інформація (FAQ)" />
            </Tabs>

            {/* Пошук */}
            <TextField
                fullWidth
                size="small"
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

            {/* Контент залежно від вкладки */}
            {tabValue === 0 ? <TrainingList /> : <InfoFaqUI />}

            {/* Модалка створення (реалізуємо нижче) */}
            <MaterialEditorModal open={isEditorOpen} onClose={() => setIsEditorOpen(false)} />
        </Box>
    );
}