import {
  Add,
  DescriptionOutlined,
  ExpandMore,
  InfoOutlined
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import { Link } from 'react-router';
import { useModal } from '../../../shared/hooks/useModal';
import { Can } from '../../auth/ui/Can';
import type { InfoPage } from '../../trainings/model/types';
import { useInfoPages } from '../../trainings/model/useTraining';
import { InfoCreateModal } from './InfoCreateModal';

export default function InfoFaqUI() {
  const { data: infoPages, } = useInfoPages();

  const { isOpen, open, close } = useModal(false);

  // if (isLoading) {
  //   return (
  //     <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
  //       <CircularProgress />
  //     </Box>
  //   );
  // }

  // if (isError) {
  //   return (
  //     <Typography color="error" textAlign="center">
  //       Помилка завантаження інформаційних сторінок.
  //     </Typography>
  //   );
  // }

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
          <Link to={"/learning"}>

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

        {/* Рендер динамічних сторінок InfoPage */}
        {[{
          "title": "title",
          "slug": "slug-slug-123",
          "content": "vnjkdsnvsndvndsvlsnv"
        }]?.map((page: InfoPage) => (
          <Accordion
            key={page.slug}
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              mb: 1,
              borderRadius: '10px !important',
              '&:before': { display: 'none' },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                {page.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 1.6 }}
                component="div"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            </AccordionDetails>
          </Accordion>
        ))}

        {infoPages?.length === 0 && (
          <Typography color="text.secondary" textAlign="center" sx={{ py: 3 }}>
            Інформаційних сторінок поки не створено.
          </Typography>
        )}
      </Box>

      <InfoCreateModal
        isModalOpen={isOpen}
        handleClose={close}
      />
    </Box>
  );
}