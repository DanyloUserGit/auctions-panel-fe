import {
  Add,
  DescriptionOutlined,
  InfoOutlined
} from '@mui/icons-material';
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router';
import { useModal } from '../../../shared/hooks/useModal';
import { Can } from '../../auth/ui/Can';
import { useInfoPages } from '../../trainings/model/useTraining';
import { fetchInfoBySlug } from '../model/api';
import type { Info } from '../model/schemas';
import { InfoCreateModal } from './InfoCreateModal';
import InfoItem from './InfoItem';

export default function InfoFaqUI() {
  const { data: infoPages } = useInfoPages();

  const { isOpen, open, close } = useModal(false);

  const [loadedContent, setLoadedContent] = useState<Record<string, string>>({});
  const [loadingSlugs, setLoadingSlugs] = useState<Record<string, boolean>>({});

  const handleAccordionChange = (slug: string) => async (_: React.SyntheticEvent, isExpanded: boolean) => {
    if (!isExpanded || loadedContent[slug]) return;

    try {
      setLoadingSlugs((prev) => ({ ...prev, [slug]: true }));
      const response = await fetchInfoBySlug(slug);

      // Припускаємо, що response має поле content
      setLoadedContent((prev) => ({ ...prev, [slug]: response.content }));
    } catch (error) {
      console.error("Помилка при завантаженні контенту:", error);
    } finally {
      setLoadingSlugs((prev) => ({ ...prev, [slug]: false }));
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      {/* Блок швидкої допомоги */}
      <Paper
        sx={{
          p: 2,
          mb: 4,
          bgcolor: 'rgba(2, 136, 209, 0.04)',
          border: '1px solid #e1f5fe',
          borderRadius: '12px',
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <InfoOutlined color="info" />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Швидкий старт
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Прочитайте коротку інструкцію для нових учасників, щоб уникнути
              помилок під час перших торгів.
            </Typography>
          </Box>
          <Link to={'/learning'}>
            <Button
              size="small"
              variant="contained"
              color="info"
              sx={{ ml: 'auto', borderRadius: '8px' }}
            >
              Відкрити гайд
            </Button>
          </Link>
        </Stack>
      </Paper>

      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <DescriptionOutlined color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700, flexGrow: 1 }}>
            Довідкова інформація
          </Typography>

          <Can roles={['SuperAdmin', 'Admin']}>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                startIcon={<Add />}
                onClick={open}
                variant="outlined"
                sx={{ borderRadius: '8px' }}
              >
                Додати
              </Button>
            </Stack>
          </Can>
        </Stack>

        {infoPages?.map((page: Info) => (
          <InfoItem key={page.id} page={page} loadedContent={loadedContent} loadingSlugs={loadingSlugs} handleAccordionChange={handleAccordionChange} />
        ))}

        {infoPages?.length === 0 && (
          <Typography color="text.secondary" textAlign="center" sx={{ py: 3 }}>
            Інформаційних сторінок поки не створено.
          </Typography>
        )}
      </Box>

      <InfoCreateModal isModalOpen={isOpen} handleClose={close} />
    </Box >
  );
}
