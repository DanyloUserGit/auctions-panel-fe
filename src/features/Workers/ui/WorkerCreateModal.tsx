// import {
//     Grid,
//     TextField,
//     MenuItem,
//     FormControl,
//     InputLabel,
//     Select,
//     Typography,
//     Alert,
//     Button,
//     Paper,
//     Autocomplete,
//     CircularProgress,
//     debounce
// } from '@mui/material';
// import { Controller, useForm, type FieldErrors } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useAuth, useCreateUser } from '../../auth/model/useAuth';
// import { type CreateUser, createUserSchema, ROLES } from '../../auth/model/user-schema';
// import BaseModal from '../../../shared/ui/Modal';
// import { useMemo, useState } from 'react';
// import { fetchGroupByQuery } from '../../groups/model/api-groups';
// import type { Group } from '../../groups/model/types';

// interface CreateUserModalProps {
//     open: boolean;
//     onClose: () => void;
// }

// export const WorkerCreateModal = ({ open, onClose }: CreateUserModalProps) => {
//     const { user: currentUser } = useAuth();
//     const { mutate: createUser, isPending, error } = useCreateUser();


//     const [addeGroups, setAddedGroups] = useState<Group[]>([]);
//     const [group, setGroup] = useState<Group | null>(null)

//     const [adminInput, setAdminInput] = useState("");
//     const [isAdminsLoading, setIsAdminsLoading] = useState(false);
//     const [options, setOptions] = useState<Auction[]>([]);
//     const [isLoading, setIsLoading] = useState(false);



//     const isSA = currentUser?.role === "SuperAdmin";

//     const {
//         register,
//         handleSubmit,
//         control,
//         reset,
//         formState: { errors }
//     } = useForm<CreateUser>({
//         resolver: zodResolver(createUserSchema),
//         defaultValues: {
//             rights: "Read",
//             role: "User",
//         }
//     });
//     const onInvalid = (errors: FieldErrors<CreateUser>) => {
//         console.error("Помилки валідації Zod:", errors);
//     };

//     const onSubmit = (data: CreateUser) => {
//         console.log(data)
//         createUser(data, {
//             onSuccess: () => {
//                 reset();
//                 onClose();
//             }
//         });
//     };

//     const debouncedFetch = useMemo(
//         () =>
//             debounce(async (query: string) => {
//                 if (!query) {
//                     setOptions(addeGroups);
//                     return;
//                 }

//                 setIsLoading(true);
//                 try {
//                     const results = await fetchGroupByQuery(query);
//                     // console.log(results, query)
//                     const combined = [...addeGroups, ...(results || [])];
//                     const uniqueOptions = Array.from(new Map(combined.map(item => [item.id, item])).values());

//                     setOptions(uniqueOptions);
//                 } finally {
//                     setIsLoading(false);
//                 }
//             }, 400),
//         [addeGroups]
//     );


//     return (
//         <BaseModal
//             open={open}
//             onClose={onClose}
//             title="Створення нового працівника"
//             maxWidth="sm"
//         >
//             <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
//                 <Grid container spacing={2.5}>
//                     {error && (
//                         <Grid size={12}>
//                             <Alert severity="error">Помилка створення: {error.message}</Alert>
//                         </Grid>
//                     )}

//                     <Grid size={12}>
//                         <TextField
//                             fullWidth
//                             label="Ім'я"
//                             {...register("firstName")}
//                             error={!!errors.firstName}
//                             helperText={errors.firstName?.message}
//                         />
//                     </Grid>
//                     <Grid size={12}>
//                         <TextField
//                             fullWidth
//                             label="Прізвище"
//                             {...register("lastName")}
//                             error={!!errors.lastName}
//                             helperText={errors.lastName?.message}
//                         />
//                     </Grid>

//                     <Grid size={12}>
//                         <TextField
//                             fullWidth
//                             label="Email"
//                             {...register("email")}
//                             error={!!errors.email}
//                             helperText={errors.email?.message}
//                         />
//                     </Grid>
//                     <Grid size={12}>
//                         <TextField
//                             fullWidth
//                             label="Password"
//                             {...register("password")}
//                             error={!!errors.password}
//                             helperText={errors.password?.message}
//                         />
//                     </Grid>

//                     <Grid size={{ xs: 12, sm: 6 }}>
//                         <TextField
//                             fullWidth
//                             label="Місто"
//                             {...register("city")}
//                             error={!!errors.city}
//                             helperText={errors.city?.message}
//                         />
//                     </Grid>

//                     <Grid size={{ xs: 12, sm: 6 }}>
//                         <TextField
//                             fullWidth
//                             label="Телефон"
//                             {...register("phone")}
//                             error={!!errors.phone}
//                             helperText={errors.phone?.message}
//                         />
//                     </Grid>

//                     <Grid size={{ xs: 12, sm: isSA ? 6 : 12 }}>
//                         <FormControl fullWidth error={!!errors.role}>
//                             <InputLabel>Роль</InputLabel>
//                             <Controller
//                                 name="role"
//                                 control={control}
//                                 render={({ field }) => (
//                                     <Select {...field} label="Роль">
//                                         {ROLES.filter(r => r !== "SuperAdmin" || isSA).map(role => (
//                                             <MenuItem key={role} value={role}>{role}</MenuItem>
//                                         ))}
//                                     </Select>
//                                 )}
//                             />
//                         </FormControl>
//                     </Grid>

//                     {/* {isSA && (
//                         <Grid size={{ xs: 12, sm: 6 }}>
//                             <TextField
//                                 fullWidth
//                                 label="Група (Тільки для SA)"
//                                 {...register("group")}
//                                 error={!!errors.group}
//                                 helperText={errors.group?.message}
//                             />
//                         </Grid>
//                     )} */}
//                     <Grid size={12}>
//                         <Autocomplete
//                             value={group}
//                             options={groupOptions || []}
//                             loading={isGroupsLoading}
//                             onInputChange={(_, val) => setAdminInput(val)}
//                             onChange={(_, val) => setGroup(val)}
//                             getOptionLabel={(o) => {
//                                 if (!o) return "";
//                                 return `${o.firstName || ""} ${o.lastName || ""} (${o.email || ""})`;
//                             }}
//                             isOptionEqualToValue={(o, v) => o?.id === v?.id}
//                             renderInput={(params) => (
//                                 <TextField
//                                     {...params}
//                                     label="Адміністратор групи"
//                                     placeholder="Пошук за іменем або email..."
//                                     InputProps={{
//                                         ...params.InputProps,
//                                         endAdornment: (
//                                             <>
//                                                 {isAdminsLoading ? <CircularProgress color="inherit" size={20} /> : null}
//                                                 {params.InputProps.endAdornment}
//                                             </>
//                                         ),
//                                     }}
//                                 />
//                             )}
//                         />
//                     </Grid>

//                     <Grid size={12}>
//                         <Paper variant="outlined" sx={{ p: 2, bgcolor: 'action.hover', borderStyle: 'dashed' }}>
//                             <Typography variant="caption" color="text.secondary" display="block">
//                                 Статус доступу:
//                             </Typography>
//                             <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
//                                 Тільки перегляд (Read Only)
//                             </Typography>
//                         </Paper>
//                     </Grid>

//                     <Grid size={12} sx={{ mt: 2 }}>
//                         <Button
//                             fullWidth
//                             type="submit"
//                             variant="contained"
//                             size="large"
//                             disabled={isPending}
//                         >
//                             {isPending ? "Створення..." : "Створити працівника"}
//                         </Button>
//                     </Grid>
//                 </Grid>
//             </form>
//         </BaseModal>
//     );
// };
interface CreateUserModalProps {
    open: boolean;
    onClose: () => void;
}

export const WorkerCreateModal = ({ open, onClose }: CreateUserModalProps) => {
    return (
        <div onClick={onClose}>{open}</div>
    )
}
