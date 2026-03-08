import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { useAutoComplete } from '../../../shared/hooks/useAutoComplete';
import BaseModal from '../../../shared/ui/Modal';
import { fetchGroupByQuery } from '../../groups/model/api-groups';
// import { fetchUsersByQuery } from '../../auth/model/api-user'; // Для пошуку ролей/юзерів за потребою
import { ROLES, type UserRole } from '../../auth/model/user-schema';
import type { Group } from '../../groups/model/types';
import {
  MaterialVisibility,
  type MaterialVisibilityType,
} from '../model/types';
import { useCreateTraining } from '../model/useTraining';

interface MaterialEditorModalProps {
  open: boolean;
  onClose: () => void;
}

export function MaterialEditorModal({
  open,
  onClose,
}: MaterialEditorModalProps) {
  const { mutate } = useCreateTraining();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  // const [imageUrl, setImageUrl] = useState('');
  const [visibility, setVisibility] = useState<MaterialVisibilityType>('All');
  const [allowedRoles, setAllowedRoles] = useState<UserRole[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isPublished, setIsPublished] = useState(true);

  const groupsSearch = useAutoComplete<Group>({
    fetchFn: fetchGroupByQuery,
  });

  const handleSubmit = () => {
    const payload = {
      title,
      content,
    };
    console.log('Відправка матеріалу:', payload);

    mutate(payload);
    // Тут буде виклик вашої мутації
  };

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Створення навчального матеріалу"
      maxWidth="md"
      actions={
        <>
          <Button onClick={onClose} color="inherit">
            Скасувати
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim()}
          >
            Зберегти матеріал
          </Button>
        </>
      }
    >
      <Stack spacing={3}>
        <TextField
          label="Заголовок"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Заглушка під Rich Text Editor */}
        <Box
          sx={{
            height: 250,
            border: '1px solid #ddd',
            borderRadius: '8px',
            p: 2,
            bgcolor: '#fafafa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TextField
            multiline
            rows={8}
            fullWidth
            placeholder="Контент матеріалу..."
            variant="standard"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            InputProps={{ disableUnderline: true }}
          />
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          {/* Вибір видимості */}
          <Autocomplete
            sx={{ flex: 1 }}
            options={MaterialVisibility}
            value={visibility}
            onChange={(_, val) =>
              val && setVisibility(val as MaterialVisibilityType)
            }
            renderInput={(params) => (
              <TextField {...params} label="Видимість" />
            )}
          />

          {/* Вибір ролей через ваш ROLES масив */}
          <Autocomplete
            multiple
            sx={{ flex: 1 }}
            options={ROLES}
            value={allowedRoles}
            onChange={(_, val) => setAllowedRoles(val as UserRole[])}
            renderInput={(params) => (
              <TextField {...params} label="Дозволені ролі" />
            )}
          />
        </Stack>

        {/* Вибір групи через ваш useAutoComplete */}
        {visibility === 'Groups' && (
          <Autocomplete
            options={groupsSearch.getFilteredOptions(selectedGroup)}
            loading={groupsSearch.isLoading}
            onInputChange={(_, val) =>
              groupsSearch.debouncedFetch(val, selectedGroup)
            }
            onChange={(_, val) => setSelectedGroup(val)}
            getOptionLabel={(o) => o.title || ''}
            isOptionEqualToValue={(o, v) => o.id === v.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Прив'язати до групи"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {groupsSearch.isLoading ? (
                        <CircularProgress size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        )}

        <FormControlLabel
          control={
            <Switch
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
            />
          }
          label="Опублікувати відразу"
        />
      </Stack>
    </BaseModal>
  );
}
