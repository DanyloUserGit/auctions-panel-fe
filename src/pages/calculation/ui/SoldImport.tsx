import { Alert, Button, Checkbox, FormControlLabel, Stack } from '@mui/material';
import { useRef, useState } from 'react';
import { api } from '../../../shared/http';
import { getErrorMessage } from '../../../shared/utils';
import { Can } from '../../../features/auth/ui/Can';

type ImportResult = { inserted: number; updated: number; skipped: number };

// Імпорт «Проданих авто» з CSV (ТЗ 13.4): колонки country, brand, model, sale_price, sale_date
// (+ detail, mileage_km, first_reg_date). Доступно адміністраторам.
export default function SoldImport({ onImported }: { onImported: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [updateExisting, setUpdateExisting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const upload = async (file?: File) => {
    if (!file) return;
    setError(null);
    setResult(null);
    setIsLoading(true);
    const form = new FormData();
    form.append('file', file);
    form.append('updateExisting', String(updateExisting));
    try {
      setResult((await api.post<ImportResult>('/calc/sold-import', form)).data);
      onImported();
    } catch (e) {
      setError(getErrorMessage(e, 'Не вдалося імпортувати файл'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Can roles={['Admin', 'SuperAdmin']}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} sx={{ mb: 2 }}>
        <Button variant="outlined" disabled={isLoading} onClick={() => inputRef.current?.click()}>
          Імпорт CSV
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          hidden
          onChange={(e) => {
            upload(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
        <FormControlLabel
          control={<Checkbox checked={updateExisting} onChange={(e) => setUpdateExisting(e.target.checked)} />}
          label="Оновлювати існуючі записи"
        />
      </Stack>
      {result && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Додано: {result.inserted}, оновлено: {result.updated}, пропущено: {result.skipped}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
    </Can>
  );
}
