import { Button } from '@mui/material';
import { useState } from 'react';
import { api } from '../../../shared/http';
import { getErrorMessage } from '../../../shared/utils';
import CarFormDialog from '../../in-stock/ui/CarFormDialog';

type WonCar = {
  id: number;
  brandId: number;
  modelId: number;
  brand: string;
  model: string;
  year: number | null;
  mileage: number;
  engine: string;
  transmission: string;
  chassis: string;
  location: string;
  price: number;
  photos: string[];
};

// Редагування даних авто та виставлення його на продаж у «В наявності» (ТЗ 13.2).
export default function SellPurchaseButton({ carId }: { carId: number }) {
  const [source, setSource] = useState<WonCar | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const open = async () => {
    setIsLoading(true);
    try {
      setSource((await api.get<WonCar>(`/purchases/${carId}`)).data);
    } catch (error) {
      alert(getErrorMessage(error, 'Не вдалося завантажити дані авто'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button variant="outlined" size="small" onClick={open} disabled={isLoading}>
        Виставити на продаж
      </Button>
      {source && (
        <CarFormDialog
          car={null}
          sourcePurchaseId={source.id}
          initial={{
            brand: source.brandId ? { id: source.brandId, name: source.brand } : null,
            model: source.modelId ? { id: source.modelId, name: source.model } : null,
            year: source.year ?? new Date().getFullYear(),
            mileage: source.mileage,
            engine: source.engine,
            transmission: source.transmission,
            chassis: source.chassis,
            location: source.location,
            price: source.price,
            photos: source.photos,
          }}
          onClose={() => setSource(null)}
        />
      )}
    </>
  );
}
