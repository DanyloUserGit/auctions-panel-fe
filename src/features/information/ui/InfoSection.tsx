import { Add, DescriptionOutlined, InfoOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  Typography,
  useMediaQuery
} from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router';
import { useMobile } from '../../../shared/hooks/useMobile';
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

  const isMobile = useMobile();
  const isExtraSmall = useMediaQuery('(max-width:360px)');

  const [loadedContent, setLoadedContent] = useState<Record<string, string>>(
    {},
  );
  const [loadingSlugs, setLoadingSlugs] = useState<Record<string, boolean>>({});

  const handleAccordionChange =
    (slug: string) => async (_: React.SyntheticEvent, isExpanded: boolean) => {
      if (!isExpanded || loadedContent[slug]) return;

      try {
        setLoadingSlugs((prev) => ({ ...prev, [slug]: true }));
        const response = await fetchInfoBySlug(slug);
        setLoadedContent((prev) => ({ ...prev, [slug]: response.content }));
      } catch (error) {
        console.error('Помилка при завантаженні контенту:', error);
      } finally {
        setLoadingSlugs((prev) => ({ ...prev, [slug]: false }));
      }
    };

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: 'auto',
        px: { xs: 1.5, sm: 2, md: 0 },
        pb: { xs: 4, md: 6 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 1.5, sm: 2.5 },
          mb: { xs: 3, md: 5 },
          mt: { xs: 1, sm: 3 },
          bgcolor: 'rgba(2, 136, 209, 0.04)',
          border: '1px solid',
          borderColor: 'info.light',
          borderRadius: { xs: '12px', sm: '16px' },
          opacity: 0.95,
        }}
      >
        <Stack
          direction="row"
          spacing={{ xs: 1, sm: 2 }}
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ minWidth: 0 }}
          >
            <InfoOutlined
              color="info"
              sx={{
                fontSize: { xs: 20, sm: 26 },
                flexShrink: 0,
                display: isExtraSmall ? 'none' : 'block',
              }}
            />
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                whiteSpace: 'nowrap',
                fontSize: { xs: '0.75rem', sm: '0.9rem', md: '1rem' },
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Швидкий старт
            </Typography>
          </Stack>

          <Button
            component={Link}
            to="/learning"
            size={isMobile ? 'small' : 'medium'}
            variant="contained"
            color="info"
            sx={{
              borderRadius: '10px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              px: { xs: 1.5, sm: 3 },
              fontSize: { xs: '0.7rem', sm: '0.8125rem' },
              height: { xs: 30, sm: 38 },
              boxShadow: 'none',
              textTransform: 'none',
              '&:hover': { boxShadow: 'none' },
            }}
          >
            Відкрити гайд
          </Button>
        </Stack>
      </Paper>

      <Box sx={{ mb: 4 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 2, sm: 0 }}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          justifyContent="space-between"
          sx={{ mb: { xs: 2, md: 4 } }}
        >
          {
            !isMobile &&
            <Stack direction="row" spacing={1.5} alignItems="center">
              <DescriptionOutlined
                color="primary"
                sx={{ fontSize: { xs: 24, sm: 28 } }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.2rem', sm: '1.5rem' },
                  letterSpacing: '-0.5px',
                }}
              >
                Довідкова інформація
              </Typography>
            </Stack>
          }

          <Can roles={['SuperAdmin', 'Admin']}>
            <Button
              size={isMobile ? 'medium' : 'small'}
              startIcon={<Add />}
              onClick={open}
              variant="contained"
              sx={{
                borderRadius: '12px',
                px: 3,
                py: { xs: 1, sm: 0.5 },
                boxShadow: 'none',
              }}
            >
              Додати сторінку
            </Button>
          </Can>
        </Stack>
        <Divider />
        <Stack spacing={2}>
          {infoPages?.map((page: Info) => (
            <InfoItem
              key={page.id}
              page={page}
              loadedContent={loadedContent}
              loadingSlugs={loadingSlugs}
              handleAccordionChange={handleAccordionChange}
            />
          ))}
        </Stack>

        {infoPages?.length === 0 && (
          <Box sx={{ width: '100%', textAlign: 'center', py: 5 }}>
            <Typography color="text.secondary">
              Інформаційних сторінок поки не створено.
            </Typography>
          </Box>
        )}
      </Box>

      <InfoCreateModal isModalOpen={isOpen} handleClose={close} />
    </Box>
  );
}
