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
import DOMPurify from 'dompurify';
interface Props {
  page: Info;
  loadingSlugs: Record<string, boolean>;
  loadedContent: Record<string, string>;
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
                ml: 'auto',
                mr: 1,
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
                // Вміст редагують адміністратори; санітизація прибирає скрипти й обробники подій.
                __html: DOMPurify.sanitize(loadedContent[page.slug] || page.content),
              }}
            />
          )}
        </AccordionDetails>
      </Accordion>
      <InfoEditModal item={page} open={isOpen} onClose={close} />
    </Fragment>
  );
}
