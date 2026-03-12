import { Edit, ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CircularProgress,
  Divider,
  Typography,
} from '@mui/material';
import { Fragment, type SyntheticEvent } from 'react';
import { useModal } from '../../../shared/hooks/useModal';
import { Can } from '../../auth/ui/Can';
import type { Info } from '../model/schemas';
import { InfoEditModal } from './InfoEditModal';
interface Props {
  page: Info;
  loadingSlugs: Record<string, boolean>; // Змінено на об'єкт для відстеження по slug
  loadedContent: Record<string, string>; // Змінено на об'єкт для збереження тексту по slug
  handleAccordionChange: (
    slug: string,
  ) => (event: SyntheticEvent, isExpanded: boolean) => Promise<void>;
}
export default function InfoItem({
  page,
  loadingSlugs,
  loadedContent,
  handleAccordionChange,
}: Props) {
  const { isOpen, open, close } = useModal(false);

  return (
    <Fragment key={page.slug}>
      <Accordion
        elevation={0}
        // Викликаємо фетчінг при зміні стану акордеона
        onChange={handleAccordionChange(page.slug)}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          mb: 1,
          borderRadius: '10px !important',
          '&:before': { display: 'none' },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{
            '& .MuiAccordionSummary-content': {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            },
          }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
            {page.title}
          </Typography>

          <Can roles={['Admin', 'SuperAdmin']}>
            {/* Використовуємо Box замість IconButton, щоб уникнути вкладених кнопок */}
            <Box
              onClick={(e) => {
                e.stopPropagation(); // Зупиняємо відкриття акордеона
                open();
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 0.5,
                ml: 'auto', // Притискаємо до правого краю
                mr: 1, // Відступ від стрілки ExpandMore
                borderRadius: '50%',
                cursor: 'pointer',
                color: 'text.secondary',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: 'action.hover',
                  color: 'primary.main',
                },
              }}
            >
              <Edit sx={{ fontSize: '1.2rem' }} />
            </Box>
          </Can>
        </AccordionSummary>

        <AccordionDetails>
          <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />

          {loadingSlugs[page.slug] ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 1.6 }}
              component="div"
              dangerouslySetInnerHTML={{
                __html: loadedContent[page.slug] || page.content,
              }}
            />
          )}
        </AccordionDetails>
      </Accordion>
      <InfoEditModal item={page} open={isOpen} onClose={close} />
    </Fragment>
  );
}
