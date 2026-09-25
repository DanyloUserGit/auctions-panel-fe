import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  TextField
} from '@mui/material';
import { getErrorMessage } from '../../../shared/utils';
import { useState } from 'react';
import BaseModal from '../../../shared/ui/Modal';
import type { Auction } from '../model/types';
import { useEditAuction } from '../model/useAuctions';

interface EditAuctionModalProps {
  isModalOpen: boolean;
  handleClose: () => void;
  currentAuction: Auction;
}

export default function AuctionEditModal({
  isModalOpen,
  handleClose,
  currentAuction,
}: EditAuctionModalProps) {
  const { mutate, isPending, error, isError } = useEditAuction();
  const [proxyUrl, setProxyUrl] = useState('');
  const [removeProxy, setRemoveProxy] = useState(false);
  const [title, setTitle] = useState<string>(currentAuction.title);
  const [url, setUrl] = useState<string>(currentAuction.url);
  const handleSubmit = () => {
    if (!title.trim()) return;

    mutate(
      {
        id: currentAuction.id,
        data: {
          auctionGroupId: currentAuction.auctionGroupId,
          title: title,
          url: url,
          ...(removeProxy ? { proxyUrl: '' } : proxyUrl.trim() ? { proxyUrl: proxyUrl.trim() } : {}),
        },
      },
      {
        onSuccess: () => {
          setTitle('');
          setUrl('');
          handleClose();
        },
      },
    );
  };

  return (
    <BaseModal
      open={isModalOpen}
      onClose={handleClose}
      title="Редагувати аукціон"
      actions={
        <>
          <Button onClick={handleClose} color="inherit">
            Скасувати
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!title.trim() || isPending}
          >
            {isPending ? <CircularProgress size={24} /> : 'Редагувати'}
          </Button>
        </>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
        <TextField
          label="Назва аукціону"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Посилання"
          fullWidth
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        {/* Проксі для сайтів, що блокують IP сервера (Alcopa). Логін і пароль зберігаються зашифрованими. */}
        <TextField
          label="Проксі (необов'язково)"
          fullWidth
          value={proxyUrl}
          disabled={removeProxy}
          onChange={(e) => setProxyUrl(e.target.value)}
          placeholder="http://логін:пароль@хост:порт"
          helperText={
            currentAuction.proxyHost
              ? `Зараз: ${currentAuction.proxyHost}. Порожнє поле - залишити без змін.`
              : 'Для сайтів, що блокують IP сервера. Діє для нових сесій.'
          }
        />
        {currentAuction.proxyHost && (
          <FormControlLabel
            control={<Checkbox checked={removeProxy} onChange={(e) => setRemoveProxy(e.target.checked)} />}
            label="Прибрати проксі"
          />
        )}
        {isError && <Alert severity="error">{getErrorMessage(error)}</Alert>}

      </Box>
    </BaseModal>
  );
}
