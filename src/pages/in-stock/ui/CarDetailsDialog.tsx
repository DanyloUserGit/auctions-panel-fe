import { ChevronLeft, ChevronRight, Close } from '@mui/icons-material';
import { Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { resolveFileUrl } from '../../../shared/utils';
import type { Car } from '../model/api';

const NO_PHOTO = '/images/no-photo.jpg';

// Картка авто з галереєю (ТЗ 13.3).
export default function CarDetailsDialog({ car, onClose }: { car: Car; onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const photos = car.photos.length ? car.photos : [NO_PHOTO];
  const step = (delta: number) => setIndex((i) => (i + delta + photos.length) % photos.length);

  const rows: [string, string | number | null][] = [
    ['Рік', car.year],
    ['VIN', car.chassis || 'Не вказано'],
    ['Пробіг', `${Number(car.mileage).toLocaleString()} км`],
    ['Двигун', car.engine || 'Не вказано'],
    ['Трансмісія', car.transmission],
    ['Локація', car.location || 'Не вказано'],
    ['Ціна', `€ ${Number(car.price).toLocaleString()}`],
    ['Продавець', car.owner?.name ?? '-'],
  ];

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pr: 6 }}>
        {car.brand} {car.model}
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ position: 'relative', bgcolor: 'grey.100', borderRadius: 2, overflow: 'hidden' }}>
          <Box
            component="img"
            src={resolveFileUrl(photos[index])}
            alt={`${car.brand} ${car.model}`}
            sx={{ width: '100%', maxHeight: 460, objectFit: 'contain', display: 'block' }}
          />
          {photos.length > 1 && (
            <>
              <IconButton onClick={() => step(-1)} sx={{ position: 'absolute', left: 8, top: '50%', bgcolor: 'white' }}>
                <ChevronLeft />
              </IconButton>
              <IconButton onClick={() => step(1)} sx={{ position: 'absolute', right: 8, top: '50%', bgcolor: 'white' }}>
                <ChevronRight />
              </IconButton>
            </>
          )}
        </Box>
        {photos.length > 1 && (
          <Stack direction="row" spacing={1} sx={{ mt: 1, overflowX: 'auto' }}>
            {photos.map((photo, i) => (
              <Box
                key={`${photo}-${i}`}
                component="img"
                src={resolveFileUrl(photo)}
                onClick={() => setIndex(i)}
                sx={{
                  width: 80,
                  height: 56,
                  objectFit: 'cover',
                  borderRadius: 1,
                  cursor: 'pointer',
                  border: '2px solid',
                  borderColor: i === index ? 'primary.main' : 'transparent',
                }}
              />
            ))}
          </Stack>
        )}
        <Grid container spacing={1} sx={{ mt: 2 }}>
          {rows.map(([label, value]) => (
            <Grid size={{ xs: 12, sm: 6 }} key={label}>
              <Typography variant="body2">
                <strong>{label}:</strong> {value}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
