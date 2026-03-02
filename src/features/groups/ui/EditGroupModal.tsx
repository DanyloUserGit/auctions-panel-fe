import { Autocomplete, Box, Button, CircularProgress, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import BaseModal from '../../../shared/ui/Modal';
import { fetchAuctionsByQuery } from '../../auctions/model/api-auctions';
import { useGroups } from '../model/useGroups';
import type { Auction } from '../../auctions/model/types';

interface AddGroupModalProps {
  isModalOpen: boolean;
  handleClose: () => void;
  modal_title: string;
  current_group: {
    id: string;
    title: string;
    auctions: Auction[]
  }
}

export default function AddGroupModal({ current_group, isModalOpen, handleClose, modal_title }: AddGroupModalProps) {
  const { EditGroupMutation } = useGroups();

  const [title, setTitle] = useState<string>(current_group?.title ?? '');

  const [addedAuctions, setAddedAuctions] = useState<Auction[]>(
    current_group?.auctions ? [...current_group.auctions] : []
  );


  // Стан для асинхронного пошуку
  const [options, setOptions] = useState<Auction[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);



  useEffect(() => {
    if (isModalOpen && current_group) {
      setTitle(current_group.title);
      setAddedAuctions([...current_group.auctions]);
    }
  }, [current_group, isModalOpen]);

  useEffect(() => {
    let active = true;

    if (inputValue === '') {
      setOptions(addedAuctions); // Показуємо вже вибрані, якщо пошук порожній
      return undefined;
    }

    setIsLoading(true);
    fetchAuctionsByQuery(inputValue).then((results) => {
      if (active) {
        // Об'єднуємо результати пошуку з уже вибраними, щоб вони не зникали
        setOptions(results || []);
        setIsLoading(false);
      }
    });

    return () => { active = false; };
  }, [inputValue, addedAuctions]);

  const handleSubmit = () => {
    if (!title.trim()) return;

    EditGroupMutation.mutate({
      id: current_group.id,
      data: {
        title,
        auctions: addedAuctions.map(a => a.id)
      }
    }, {
      onSuccess: () => {
        setTitle("");
        setAddedAuctions([]);
        handleClose();
      }
    });
  };


  return (
    <BaseModal
      open={isModalOpen}
      onClose={handleClose}
      title={modal_title}
      actions={
        <>
          <Button onClick={handleClose} color="inherit">Скасувати</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!title.trim() || EditGroupMutation.isPending}
          >
            {EditGroupMutation.isPending ? <CircularProgress size={24} /> : "Редагувати"}
          </Button>
        </>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
        <TextField
          label="Назва групи"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Autocomplete
          multiple
          id="async-auctions-select"
          filterSelectedOptions
          value={addedAuctions}
          options={options}
          loading={isLoading}
          onInputChange={(_, newInputValue) => {
            setInputValue(newInputValue);
          }}
          onChange={(_, newValue) => {
            setAddedAuctions(newValue);
          }}
          getOptionLabel={(option) => option.title}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Пошук аукціонів"
              placeholder="Введіть назву..."
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      </Box>
    </BaseModal>
  );
}