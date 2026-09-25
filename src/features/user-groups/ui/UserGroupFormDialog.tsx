import { useEffect, useState } from 'react';
import {
    Autocomplete,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useAuth } from '../../auth/model/useAuth';
import { useCreateUserGroup, useEditUserGroup, useUsersSearch } from '../model/useUserGroups';
import type { UserGroup, UserSummary } from '../model/types';

const PROFILE_FIELD_OPTIONS = ['firstName', 'lastName', 'phone', 'city'];

interface UserGroupFormDialogProps {
    open: boolean;
    group: UserGroup | null;
    onClose: () => void;
}

export function UserGroupFormDialog({ open, group, onClose }: UserGroupFormDialogProps) {
    const isEdit = !!group;

    const { user } = useAuth();
    const isSuperAdmin = user?.role === 'SuperAdmin';
    const [name, setName] = useState('');
    const [canGaManageAccounts, setCanGaManageAccounts] = useState(false);
    const [canGaManageRules, setCanGaManageRules] = useState(false);
    const [showAccounts, setShowAccounts] = useState(true);
    const [sessionLimit, setSessionLimit] = useState('0');
    const [allowedProfileFields, setAllowedProfileFields] = useState<string[]>(PROFILE_FIELD_OPTIONS);
    const [adminQuery, setAdminQuery] = useState('');
    const [selectedAdmin, setSelectedAdmin] = useState<UserSummary | null>(null);

    const { users: adminOptions, isLoading: isAdminSearchLoading } = useUsersSearch(adminQuery);
    const createGroup = useCreateUserGroup();
    const editGroup = useEditUserGroup();

    useEffect(() => {
        if (!open) return;
        setName(group?.name ?? '');
        setCanGaManageAccounts(group?.canGaManageAccounts ?? false);
        setCanGaManageRules(group?.canGaManageRules ?? false);
        setShowAccounts(group?.showAccounts ?? true);
        setSessionLimit(String(group?.sessionLimit ?? 0));
        setAllowedProfileFields(group?.allowedProfileFields ?? PROFILE_FIELD_OPTIONS);
        setSelectedAdmin(group?.Admin ?? null);
    }, [open, group]);

    const handleSubmit = () => {
        const payload = {
            name,
            canGaManageAccounts,
            canGaManageRules,
            showAccounts,
            sessionLimit: Math.max(0, Number(sessionLimit) || 0),
            allowedProfileFields,
            Admin: selectedAdmin?.id,
        };

        const onSuccess = () => onClose();

        if (isEdit && group) {
            editGroup.mutate({ id: group.id, data: payload }, { onSuccess });
        } else {
            createGroup.mutate(payload, { onSuccess });
        }
    };

    const isSaving = createGroup.isPending || editGroup.isPending;

    const toggleProfileField = (field: string) => {
        setAllowedProfileFields((prev) =>
            prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field],
        );
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isEdit ? 'Редагування групи користувачів' : 'Нова група користувачів'}</DialogTitle>
            <DialogContent>
                <Stack spacing={3} className="mt-2">
                    <TextField
                        label="Назва групи"
                        placeholder="Загальна, Партнери, Особливі умови..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        required
                    />

                    <Autocomplete
                        options={adminOptions}
                        value={selectedAdmin}
                        loading={isAdminSearchLoading}
                        onInputChange={(_e, value) => setAdminQuery(value)}
                        onChange={(_e, value) => setSelectedAdmin(value)}
                        getOptionLabel={(u) => `${u.firstName} ${u.lastName} (${u.email})`}
                        isOptionEqualToValue={(a, b) => a.id === b.id}
                        renderInput={(params) => (
                            <TextField {...params} label="Адміністратор групи" placeholder="Пошук користувача..." />
                        )}
                    />

                    <div>
                        <Typography variant="subtitle2" className="mb-1">
                            Поля профілю, доступні для перегляду/редагування
                        </Typography>
                        <Stack direction="row" flexWrap="wrap">
                            {PROFILE_FIELD_OPTIONS.map((field) => (
                                <FormControlLabel
                                    key={field}
                                    control={
                                        <Checkbox
                                            checked={allowedProfileFields.includes(field)}
                                            onChange={() => toggleProfileField(field)}
                                        />
                                    }
                                    label={field}
                                />
                            ))}
                        </Stack>
                    </div>

                    {/* Ці дозволи для групи встановлює лише SuperAdmin. */}
                    {isSuperAdmin && (
                        <>
                            <TextField
                                type="number"
                                label="Ліміт одночасних сесій групи"
                                value={sessionLimit}
                                onChange={(e) => setSessionLimit(e.target.value)}
                                slotProps={{ htmlInput: { min: 0 } }}
                                helperText="Скільки сесій одночасно можуть мати відкритими учасники групи. 0 - без ліміту."
                                fullWidth
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={showAccounts}
                                        onChange={(e) => setShowAccounts(e.target.checked)}
                                    />
                                }
                                label="Показувати акаунти користувачам цієї групи (якщо вимкнено - лише приєднання до вже запущених сесій)"
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={canGaManageAccounts}
                                        onChange={(e) => setCanGaManageAccounts(e.target.checked)}
                                    />
                                }
                                label="GA групи можуть забороняти окремим учасникам акаунти групи"
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={canGaManageRules}
                                        onChange={(e) => setCanGaManageRules(e.target.checked)}
                                    />
                                }
                                label="GA групи можуть задавати правила заборон для своєї групи"
                            />
                        </>
                    )}

                    <Typography variant="caption" color="text.secondary">
                        Доступ до груп аукціонів, аукціонів та акаунтів для входу налаштовується
                        окремо, у панелі "Доступи" після створення групи.
                    </Typography>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Скасувати</Button>
                <Button variant="contained" onClick={handleSubmit} disabled={!name || isSaving}>
                    {isEdit ? 'Зберегти' : 'Створити'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}