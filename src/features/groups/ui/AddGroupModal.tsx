import { Autocomplete, Box, Button, CircularProgress, debounce, TextField } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import BaseModal from '../../../shared/ui/Modal';
import { fetchAuctionsByQuery } from '../../auctions/model/api-auctions';
import { useGroups } from '../model/useGroups';
import type { Auction } from '../../auctions/model/types';
import type { User } from '../../auth/model/user-schema';
import { fetchUsersByQuery } from '../../auth/model/api-user';


interface AddGroupModalProps {
    isModalOpen: boolean;
    handleClose: () => void;
    modal_title: string;
}

export default function AddGroupModal({ isModalOpen, handleClose, modal_title }: AddGroupModalProps) {
    const { GroupCreation } = useGroups();

    const [title, setTitle] = useState<string>("");
    const [addedAuctions, setAddedAuctions] = useState<Auction[]>([]);
    const [groupAdmin, setGroupAdmin] = useState<User | null>(null)

    const [options, setOptions] = useState<Auction[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [adminOptions, setAdminOptions] = useState<User[]>([]);
    const [adminInput, setAdminInput] = useState("");
    const [isAdminsLoading, setIsAdminsLoading] = useState(false);


    const debouncedFetch = useMemo(
        () =>
            debounce(async (query: string) => {
                if (!query) {
                    setOptions(addedAuctions);
                    return;
                }

                setIsLoading(true);
                try {
                    const results = await fetchAuctionsByQuery(query);
                    // console.log(results, query)
                    const combined = [...addedAuctions, ...(results || [])];
                    const uniqueOptions = Array.from(new Map(combined.map(item => [item.id, item])).values());

                    setOptions(uniqueOptions);
                } finally {
                    setIsLoading(false);
                }
            }, 400),
        [addedAuctions]
    );




    useEffect(() => {
        let active = true;
        if (adminInput === '') {
            setAdminOptions([]);
            return;
        }
        setIsAdminsLoading(true);
        fetchUsersByQuery(adminInput).then((results) => {
            if (active) {
                setAdminOptions(results.data || []);
                setIsAdminsLoading(false);
            }
        }).catch(() => {
            if (active) setAdminOptions([])
        });
        return () => { active = false; };
    }, [adminInput]);

    const handleSubmit = () => {
        if (!title.trim()) return;
        console.log(groupAdmin)
        GroupCreation.mutate({
            title,
            auctions: addedAuctions.map(a => a.id),
            groupAdminId: groupAdmin ? groupAdmin?.id : null
        }, {
            onSuccess: () => {
                setTitle("");
                setAddedAuctions([]);
                setGroupAdmin(null)
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
                        disabled={!title.trim() || GroupCreation.isPending}
                    >
                        {GroupCreation.isPending ? <CircularProgress size={24} /> : "Створити"}
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
                        debouncedFetch(newInputValue)
                    }}

                    onChange={(_, newValue) => {
                        setAddedAuctions(newValue);
                        setOptions(prev => {
                            const combined = [...newValue, ...prev];
                            return Array.from(new Map(combined.map(item => [item.id, item])).values());
                        });
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
                <Autocomplete
                    value={groupAdmin}
                    options={adminOptions || []}
                    loading={isAdminsLoading}
                    onInputChange={(_, val) => setAdminInput(val)}
                    onChange={(_, val) => setGroupAdmin(val)}
                    getOptionLabel={(o) => {
                        if (!o) return "";
                        return `${o.firstName || ""} ${o.lastName || ""} (${o.email || ""})`;
                    }}
                    isOptionEqualToValue={(o, v) => o?.id === v?.id}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Адміністратор групи"
                            placeholder="Пошук за іменем або email..."
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {isAdminsLoading ? <CircularProgress color="inherit" size={20} /> : null}
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