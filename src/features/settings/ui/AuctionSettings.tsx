import {
  Paper,
  Typography,
  Stack,
  TextField,
  Chip,
  Autocomplete,
} from '@mui/material';

export function AuctionSettings() {
  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 3, borderRadius: '20px' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Обмеження переходів
        </Typography>
        <Autocomplete
          multiple
          options={['/checkout', '/payment', '/settings', '/profile']}
          defaultValue={['/settings']}
          freeSolo
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                label={option}
                {...getTagProps({ index })}
                color="error"
                variant="outlined"
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Заборонені URL"
              placeholder="Додати шлях..."
            />
          )}
        />
      </Paper>

      <Paper sx={{ p: 3, borderRadius: '20px' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Заблоковані дії (UI кнопки)
        </Typography>
        <Autocomplete
          multiple
          options={['btn-delete', 'btn-export', 'form-submit']}
          freeSolo
          renderInput={(params) => (
            <TextField {...params} label="Селектори заблокованих кнопок" />
          )}
        />
      </Paper>
    </Stack>
  );
}
