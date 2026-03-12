// src/features/information/ui/InfoEditModal.tsx
import { useEffect, useState } from 'react';
import { Stack, TextField, Button, CircularProgress } from '@mui/material';
import BaseModal from '../../../shared/ui/Modal';
import { type Info } from '../model/schemas';
import { useUpdateInfo } from '../model/useInfo';
import { fetchInfoBySlug } from '../model/api';

interface InfoEditModalProps {
  item: Info;
  open: boolean;
  onClose: () => void;
}

export function InfoEditModal({ item, open, onClose }: InfoEditModalProps) {
  const { mutate: updateInfo, isPending } = useUpdateInfo();

  const [title, setTitle] = useState(item.title);
  const [content, setContent] = useState(item.content || '');
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  useEffect(() => {
    if (open && item.slug) {
      const loadContent = async () => {
        setIsLoadingContent(true);
        try {
          const response = await fetchInfoBySlug(item.slug);
          setContent(response.content || ''); // Припускаємо, що API повертає поле content
          setTitle(response.title || item.title); // Оновлюємо заголовок актуальними даними
        } catch (error) {
          console.error('Помилка завантаження контенту:', error);
        } finally {
          setIsLoadingContent(false);
        }
      };
      loadContent();
    }
  }, [open, item.slug, item.title]);

  const handleSave = () => {
    updateInfo(
      {
        id: item.id,
        data: {
          title,
          content,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Редагування інформації"
      maxWidth="sm"
      actions={
        <Stack direction="row" spacing={2}>
          <Button onClick={onClose} color="inherit">
            Скасувати
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={isPending || isLoadingContent || !title.trim()}
          >
            {isPending ? <CircularProgress size={24} /> : 'Зберегти'}
          </Button>
        </Stack>
      }
    >
      <Stack spacing={3} sx={{ mt: 1 }}>
        <TextField
          label="Slug (ідентифікатор)"
          value={item.slug}
          disabled // Slug не можна редагувати
          fullWidth
          helperText="Унікальний ідентифікатор не підлягає зміні"
        />
        <TextField
          label="Заголовок"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Контент (HTML підтримується)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          multiline
          rows={10}
          fullWidth
        />
      </Stack>
    </BaseModal>
  );
}
