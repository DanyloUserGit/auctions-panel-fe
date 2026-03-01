import { Autocomplete, Box, Button, CircularProgress, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import BaseModal from '../../../shared/ui/Modal';
import { fetchUserByQuery } from '../../auth/model/api-user';
import type { User } from '../../auth/model/user-schema';
import type { Auction } from '../model/types';
import { useEditAuction } from '../model/useAuctions';

interface DeleteAuctionModalProps {
    isModalOpen: boolean;
    handleClose: () => void;
    currentAuction: Auction
}

export default function AuctionDeleteModal({ isModalOpen, handleClose, currentAuction }: DeleteAuctionModalProps) {
    const { mutate, isPending } = useEditAuction()
    const [title, setTitle] = useState<string>(currentAuction.title);
    const [url, setUrl] = useState<string>(currentAuction.url)
    const [addedAcounts, setAddedAcounts] = useState<User[]>(currentAuction.users);

    const [options, setOptions] = useState<User[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let active = true;

        if (inputValue === '') {
            setOptions(addedAcounts); // Показуємо вже вибрані, якщо пошук порожній
            return undefined;
        }

        setIsLoading(true);
        fetchUserByQuery(inputValue).then((results) => {
            if (active) {

                // Об'єднуємо результати пошуку з уже вибраними, щоб вони не зникали
                setOptions(results.data || []);
                setIsLoading(false);
            }
        });

        return () => { active = false; };
    }, [inputValue, addedAcounts]);

    const handleSubmit = () => {
        if (!title.trim()) return;

        mutate({
            id: currentAuction.id,
            data: {

                auctionGroupId: currentAuction.auctionGroupId,
                title: title,
                url: url,
                users: addedAcounts.map(a => String(a.id))
            }
        }, {
            onSuccess: () => {
                setTitle("");
                setUrl("")
                setAddedAcounts([]);
                handleClose();
            }
        });
    };


    return (
        <BaseModal
            open={isModalOpen}
            onClose={handleClose}
            title="Редагувати аукціон"
            actions={
                <>
                    <Button onClick={handleClose} color="inherit">Скасувати</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={!title.trim() || isPending}
                    >
                        {isPending ? <CircularProgress size={24} /> : "Редагувати"}
                    </Button>
                </>
            }
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
                <TextField
                    label="Назва акукціона"
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
                    value={addedAcounts}
                    options={options}
                    loading={isLoading}
                    onInputChange={(_, newInputValue) => {
                        setInputValue(newInputValue);
                    }}
                    onChange={(_, newValue) => {
                        setAddedAcounts(newValue);
                    }}
                    getOptionLabel={(option) => option.email}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Пошук акаунтів"
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
