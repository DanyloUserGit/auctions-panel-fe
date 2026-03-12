import { zodResolver } from '@hookform/resolvers/zod';
import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import BaseModal from '../../../shared/ui/Modal';
import { useCreateInfo } from '../../trainings/model/useTraining';
import { createInfoSchema, type CreateInfo } from '../model/schemas';

interface InfoCreateModalProps {
  isModalOpen: boolean;
  handleClose: () => void;
}

export function InfoCreateModal({
  isModalOpen,
  handleClose,
}: InfoCreateModalProps) {
  const { mutate, isPending } = useCreateInfo();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateInfo>({
    resolver: zodResolver(createInfoSchema),
    defaultValues: {
      title: '',
      slug: '',
      content: '',
    },
  });

  const onSubmit = (data: CreateInfo) => {
    console.log(data);
    mutate(data, {
      onSuccess: () => {
        reset();
        handleClose();
      },
    });
  };

  const onCancel = () => {
    reset();
    handleClose();
  };

  return (
    <BaseModal
      open={isModalOpen}
      onClose={onCancel}
      title="Створити информациону страницу"
      maxWidth="md"
      actions={
        <>
          <Button onClick={onCancel} color="inherit">
            Скасувати
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            disabled={isPending}
          >
            {isPending ? <CircularProgress size={24} /> : 'Зберегти'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Заголовок"
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          <TextField
            fullWidth
            label="Slug (URL ідентифікатор)"
            placeholder="napryklad-yak-pratsyuye-taymer"
            {...register('slug')}
            error={!!errors.slug}
            helperText={errors.slug?.message}
          />

          <TextField
            fullWidth
            multiline
            rows={10}
            label="Контент (HTML або текст)"
            {...register('content')}
            error={!!errors.content}
            helperText={errors.content?.message}
          />
        </Stack>
      </form>
    </BaseModal>
  );
}
