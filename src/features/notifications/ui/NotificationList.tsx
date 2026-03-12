import {
  ArrowBack,
  DeleteOutline,
  NotificationsNone,
} from '@mui/icons-material';
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Pagination,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router';

export default function NotificationsList() {
  const navigate = useNavigate();

  const isEmpty = false;
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      {/* Шапка з кнопкою Назад */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{ bgcolor: 'action.hover' }}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" fontWeight={700}>
          Сповіщення
        </Typography>
      </Stack>

      <Paper
        sx={{
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <List sx={{ p: 0 }}>
          {/* Приклад елемента списку */}
          {[1, 2, 3, 4, 5].map((item, index) => (
            <Box key={item}>
              <ListItem
                alignItems="flex-start"
                secondaryAction={
                  <IconButton edge="end" size="small">
                    <DeleteOutline fontSize="small" />
                  </IconButton>
                }
                sx={{
                  py: 2,
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                  cursor: 'pointer',
                }}
              >
                <ListItemText
                  primary={
                    <Typography fontWeight={600} variant="body1">
                      Новий аукціон розпочато!
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        Аукціон "BMW M5" вже доступний для ставок. Не пропустіть
                        свій шанс!
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.disabled"
                        sx={{ mt: 1, display: 'block' }}
                      >
                        Сьогодні, 14:20
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              {index < 4 && <Divider />}
            </Box>
          ))}
        </List>

        {/* Якщо порожньо */}
        {isEmpty && (
          <Box sx={{ py: 10, textAlign: 'center' }}>
            <NotificationsNone
              sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }}
            />
            <Typography color="text.secondary">
              У вас поки немає сповіщень
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Пагінація */}
      <Stack direction="row" justifyContent="center" sx={{ mt: 4 }}>
        <Pagination count={10} color="primary" shape="rounded" />
      </Stack>
    </Box>
  );
}
