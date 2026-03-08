import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Divider,
  Button,
  Stack,
  IconButton,
} from '@mui/material';
import {
  ExpandMore,
  InfoOutlined,
  DescriptionOutlined,
  ContactSupportOutlined,
  Edit,
} from '@mui/icons-material';
import { Can } from '../../auth/ui/Can';

export default function InfoFaqUI() {
  // Тимчасовий масив даних (потім замінимо на GET /api/training/info)
  const infoSections = [
    {
      title: 'Загальні правила аукціонів',
      icon: <DescriptionOutlined color="primary" />,
      pages: [
        {
          id: '1',
          q: 'Як працює таймер?',
          a: 'Таймер оновлюється після кожної ставки на +30 секунд, якщо до кінця залишалося менше хвилини...',
        },
        {
          id: '2',
          q: 'Які є ліміти на ставки?',
          a: 'Мінімальний крок ставки залежить від поточної ціни лота. Ви можете переглянути таблицю кроків у своєму профілі.',
        },
      ],
    },
    {
      title: 'Технічна підтримка',
      icon: <ContactSupportOutlined color="primary" />,
      pages: [
        {
          id: '3',
          q: 'Що робити, якщо ставка не пройшла?',
          a: "Перевірте стабільність вашого інтернет-з'єднання. Якщо проблема повторюється — зверніться в чат техпідтримки.",
        },
        {
          id: '4',
          q: 'Контакти адміністрації',
          a: 'Ми працюємо 24/7. Пошта: support@auction-app.com, Telegram: @auction_support_bot',
        },
      ],
    },
  ];

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
          <Button
            size="small"
            variant="contained"
            color="info"
            sx={{ ml: 'auto', borderRadius: '8px' }}
          >
            Відкрити гайд
          </Button>
        </Stack>
      </Paper>

      {/* Рендер категорій та сторінок довідки */}
      {infoSections.map((section, idx) => (
        <Box key={idx} sx={{ mb: 4 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            {section.icon}
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {section.title}
            </Typography>

            {/* Кнопка редагування для адмінів */}
            <Can roles={['SuperAdmin']}>
              <IconButton size="small" sx={{ ml: 1 }}>
                <Edit fontSize="inherit" />
              </IconButton>
            </Can>
          </Stack>

          {section.pages.map((page) => (
            <Accordion
              key={page.id}
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
                  {page.q}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.6 }}
                >
                  {page.a}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      ))}
    </Box>
  );
}
