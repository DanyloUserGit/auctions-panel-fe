import { Autocomplete, Box, Button, CircularProgress, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import BaseModal from '../../../shared/ui/Modal';
import { fetchUserByQuery } from '../../auth/model/api-user';
import { useCreateAuction } from '../model/useAuctions';

interface Auction {
    id: string;
    title: string;
    url: string;
}

interface AddGroupModalProps {
    isModalOpen: boolean;
    handleClose: () => void;
    modal_title: string;
    currentGroupId: string
}

export default function AuctionAddModal({ isModalOpen, handleClose, modal_title, currentGroupId }: AddGroupModalProps) {
    const { mutate, isPending } = useCreateAuction()
    const [title, setTitle] = useState<string>("");
    const [url, setUrl] = useState<string>("")
    const [addedAuctions, setAddedAuctions] = useState<Auction[]>([]);

    const [options, setOptions] = useState<Auction[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        let active = true;

        if (inputValue === '') {
            setOptions(addedAuctions); // Показуємо вже вибрані, якщо пошук порожній
            return undefined;
        }

        setIsLoading(true);
        fetchUserByQuery(inputValue).then((results) => {
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

        mutate({
            title,
            url,
            auctionGroupId: currentGroupId
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
                        disabled={!title.trim() || isPending}
                    >
                        {isPending ? <CircularProgress size={24} /> : "Створити"}
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