import { ArrowBack, ArrowForward, Delete, SwapHoriz } from '@mui/icons-material';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { getErrorMessage, resolveFileUrl } from '../../../shared/utils';
import {
  fetchBrands,
  fetchModels,
  uploadCarPhotos,
  type Car,
  type CarPayload,
  type CatalogItem,
} from '../model/api';
import { useCreateCar, useUpdateCar } from '../model/useData';

// VIN: 17 символів без I, O, Q (так само перевіряє сервер).
const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/;

type FormState = Omit<CarPayload, 'brandId' | 'modelId'> & {
  brand: CatalogItem | null;
  model: CatalogItem | null;
};

const emptyForm: FormState = {
  brand: null,
  model: null,
  year: new Date().getFullYear(),
  price: 0,
  mileage: 0,
  engine: '',
  transmission: 'Automatic',
  chassis: '',
  status: 'available',
  location: '',
  photos: [],
};

const toForm = (car: Car): FormState => ({
  brand: { id: car.brandId, name: car.brand },
  model: { id: car.modelId, name: car.model },
  year: car.year ?? new Date().getFullYear(),
  price: car.price,
  mileage: car.mileage,
  engine: car.engine,
  transmission: car.transmission,
  chassis: car.chassis,
  status: car.status,
  location: car.location,
  photos: car.photos,
});

interface Props {
  car: Car | null;
  // Початкові дані нового авто (виставлення з «Покупок») та ID покупки.
  initial?: Partial<FormState>;
  sourcePurchaseId?: number;
  onClose: () => void;
}

export default function CarFormDialog({ car, initial, sourcePurchaseId, onClose }: Props) {
  const isEdit = !!car;
  const [form, setForm] = useState<FormState>(() => (car ? toForm(car) : { ...emptyForm, ...initial }));
  const [brandQuery, setBrandQuery] = useState('');
  const [modelQuery, setModelQuery] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const addInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const replaceIndex = useRef<number | null>(null);

  const createCar = useCreateCar();
  const updateCar = useUpdateCar();
  const mutation = isEdit ? updateCar : createCar;

  const { data: brands = [] } = useQuery({
    queryKey: ['in-stock-brands', brandQuery],
    queryFn: () => fetchBrands(brandQuery),
  });
  const { data: models = [] } = useQuery({
    queryKey: ['in-stock-models', form.brand?.id, modelQuery],
    queryFn: () => fetchModels(form.brand!.id, modelQuery),
    enabled: !!form.brand,
  });

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const formError = (() => {
    if (!form.brand) return 'Оберіть марку зі списку';
    if (!form.model) return 'Оберіть модель зі списку';
    if (!form.price || Number(form.price) <= 0) return 'Вкажіть коректну ціну';
    if (!VIN_REGEX.test(form.chassis.trim().toUpperCase())) {
      return 'VIN має містити 17 символів (латинські літери без I, O, Q та цифри)';
    }
    if (!isEdit && form.status === 'sold') return 'Неможливо створити нове авто одразу зі статусом «Продано»';
    return null;
  })();

  const upload = async (files: FileList | null, onDone: (urls: string[]) => void) => {
    if (!files?.length) return;
    setUploadError(null);
    setIsUploading(true);
    try {
      onDone(await uploadCarPhotos(Array.from(files)));
    } catch (error) {
      setUploadError(getErrorMessage(error, 'Не вдалося завантажити фото'));
    } finally {
      setIsUploading(false);
    }
  };

  const movePhoto = (index: number, delta: number) => {
    const photos = [...form.photos];
    const target = index + delta;
    if (target < 0 || target >= photos.length) return;
    [photos[index], photos[target]] = [photos[target], photos[index]];
    set('photos', photos);
  };

  const handleSubmit = () => {
    if (formError || !form.brand || !form.model) return;
    const { brand, model, ...rest } = form;
    const carData: CarPayload = {
      ...rest,
      brandId: brand.id,
      modelId: model.id,
      year: Number(form.year),
      price: Number(form.price),
      mileage: Number(form.mileage),
      chassis: form.chassis.trim().toUpperCase(),
    };
    if (car) {
      updateCar.mutate({ id: car.id, carData }, { onSuccess: onClose });
    } else {
      createCar.mutate({ ...carData, sourcePurchaseId }, { onSuccess: onClose });
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? 'Редагувати авто' : sourcePurchaseId ? 'Виставити покупку на продаж' : 'Додати нове авто'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Autocomplete
              options={brands}
              value={form.brand}
              getOptionLabel={(o) => o.name}
              isOptionEqualToValue={(a, b) => a.id === b.id}
              onInputChange={(_, v) => setBrandQuery(v)}
              onChange={(_, v) => setForm((prev) => ({ ...prev, brand: v, model: null }))}
              renderInput={(params) => <TextField {...params} label="Марка" size="small" />}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Autocomplete
              options={models}
              value={form.model}
              disabled={!form.brand}
              getOptionLabel={(o) => o.name}
              isOptionEqualToValue={(a, b) => a.id === b.id}
              onInputChange={(_, v) => setModelQuery(v)}
              onChange={(_, v) => set('model', v)}
              renderInput={(params) => <TextField {...params} label="Модель" size="small" />}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField fullWidth type="number" label="Рік" value={form.year} onChange={(e) => set('year', Number(e.target.value))} size="small" />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField fullWidth type="number" label="Ціна (€)" value={form.price || ''} onChange={(e) => set('price', Number(e.target.value))} size="small" />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField fullWidth type="number" label="Пробіг (км)" value={form.mileage || ''} onChange={(e) => set('mileage', Number(e.target.value))} size="small" />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField fullWidth label="Двигун (напр. 2.0 Diesel)" value={form.engine} onChange={(e) => set('engine', e.target.value)} size="small" />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              fullWidth
              label="VIN"
              value={form.chassis}
              onChange={(e) => set('chassis', e.target.value.toUpperCase())}
              size="small"
              slotProps={{ htmlInput: { maxLength: 17 } }}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField select fullWidth label="Трансмісія" value={form.transmission} onChange={(e) => set('transmission', e.target.value)} size="small">
              <MenuItem value="Automatic">Automatic</MenuItem>
              <MenuItem value="Mechanic">Mechanic</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField select fullWidth label="Статус" value={form.status} onChange={(e) => set('status', e.target.value as FormState['status'])} size="small">
              <MenuItem value="available">В наявності</MenuItem>
              <MenuItem value="reserved">Резерв</MenuItem>
              {/* «Продано» - лише для наявного авто: нове не можна створити одразу проданим. */}
              {isEdit && <MenuItem value="sold">Продано</MenuItem>}
            </TextField>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField fullWidth label="Локація" value={form.location} onChange={(e) => set('location', e.target.value)} size="small" />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="subtitle2">Фото (перше - головне)</Typography>
              <Button size="small" variant="outlined" disabled={isUploading} onClick={() => addInputRef.current?.click()}>
                {isUploading ? <CircularProgress size={16} /> : 'Додати фото'}
              </Button>
            </Stack>
            <input
              ref={addInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => {
                upload(e.target.files, (urls) => set('photos', [...form.photos, ...urls]));
                e.target.value = '';
              }}
            />
            <input
              ref={replaceInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const index = replaceIndex.current;
                upload(e.target.files, ([url]) => {
                  if (index === null || !url) return;
                  set('photos', form.photos.map((p, i) => (i === index ? url : p)));
                });
                e.target.value = '';
              }}
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {form.photos.map((photo, index) => (
                <Box key={`${photo}-${index}`} sx={{ width: 140, border: '1px solid', borderColor: index === 0 ? 'primary.main' : 'divider', borderRadius: 1, p: 0.5 }}>
                  <Box component="img" src={resolveFileUrl(photo)} alt="" sx={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 0.5 }} />
                  <Stack direction="row" justifyContent="space-between">
                    <IconButton size="small" disabled={index === 0} onClick={() => movePhoto(index, -1)}><ArrowBack fontSize="small" /></IconButton>
                    <Tooltip title="Замінити">
                      <IconButton size="small" onClick={() => { replaceIndex.current = index; replaceInputRef.current?.click(); }}>
                        <SwapHoriz fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Видалити">
                      <IconButton size="small" onClick={() => set('photos', form.photos.filter((_, i) => i !== index))}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <IconButton size="small" disabled={index === form.photos.length - 1} onClick={() => movePhoto(index, 1)}><ArrowForward fontSize="small" /></IconButton>
                  </Stack>
                </Box>
              ))}
              {form.photos.length === 0 && (
                <Typography variant="body2" color="text.secondary">Фото ще не додано</Typography>
              )}
            </Box>
          </Grid>

          {uploadError && (
            <Grid size={{ xs: 12 }}>
              <Alert severity="error">{uploadError}</Alert>
            </Grid>
          )}
          {formError && (
            <Grid size={{ xs: 12 }}>
              <Alert severity="warning">{formError}</Alert>
            </Grid>
          )}
          {mutation.isError && (
            <Grid size={{ xs: 12 }}>
              <Alert severity="error">{getErrorMessage(mutation.error, 'Не вдалося зберегти авто')}</Alert>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">Скасувати</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!!formError || mutation.isPending || isUploading}>
          {mutation.isPending ? 'Збереження...' : 'Зберегти'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
