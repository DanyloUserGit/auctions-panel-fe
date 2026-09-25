import { CheckCircleOutline, CloudUpload } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useAutoComplete } from '../../../shared/hooks/useAutoComplete';
import BaseModal from '../../../shared/ui/Modal';
import { ROLES, type UserRole } from '../../auth/model/user-schema';
import { fetchGroupByQuery } from '../../groups/model/api-groups';
import type { Group } from '../../groups/model/types';
import {
  MaterialVisibility,
  type MaterialVisibilityType,
} from '../model/types';
import {
  useCreateTraining,
  useUploadMaterialImage,
} from '../model/useTraining';

interface MaterialEditorModalProps {
  open: boolean;
  onClose: () => void;
}

export function MaterialCreateModal({
  open,
  onClose,
}: MaterialEditorModalProps) {
  const { mutate: createTraining, isPending: isCreating } = useCreateTraining();
  const { mutate: uploadImage, isPending: isUploading } =
    useUploadMaterialImage();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<MaterialVisibilityType>('All');
  const [allowedRoles, setAllowedRoles] = useState<UserRole[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isPublished, setIsPublished] = useState(true);

  const [createdMaterialId, setCreatedMaterialId] = useState<string | null>(
    null,
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const groupsSearch = useAutoComplete<Group>({
    fetchFn: fetchGroupByQuery,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement> | null) => {
    if (!e) return;
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    } else {
      setPreview(null);
    }
  };
  const handleCreateText = () => {
    const payload = {
      title,
      content,
      allowedRoles,
      groupId: selectedGroup?.id,
      visibility,
      isPublished,
    };

    createTraining(payload, {
      onSuccess: (data) => {
        setCreatedMaterialId(data.id);
      },
    });
  };

  const handleImageUpload = () => {
    if (!createdMaterialId || !selectedFile) return;

    uploadImage(
      { id: createdMaterialId, file: selectedFile },
      {
        onSuccess: () => {
          handleFullClose();
        },
      },
    );
  };

  const handleFullClose = () => {
    setTitle('');
    setContent('');
    setCreatedMaterialId(null);
    handleFileChange(null);
    setSelectedGroup(null);
    setAllowedRoles([]);
    setVisibility('All');
    onClose();
  };

  return (
    <BaseModal
      open={open}
      onClose={handleFullClose}
      title="Створення навчального матеріалу"
      maxWidth="md"
      actions={
        <Stack direction="row" spacing={2}>
          {!createdMaterialId ? (
            <>
              <Button onClick={onClose} color="inherit">
                Скасувати
              </Button>
              <Button
                variant="contained"
                onClick={handleCreateText}
                disabled={!title.trim() || !content.trim() || isCreating}
              >
                {isCreating ? (
                  <CircularProgress size={24} />
                ) : (
                  'Створити та перейти до фото'
                )}
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleFullClose} color="inherit">
                Пропустити
              </Button>
              <Button
                variant="contained"
                onClick={handleImageUpload}
                disabled={!selectedFile || isUploading}
                startIcon={<CloudUpload />}
              >
                {isUploading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Завантажити фото'
                )}
              </Button>
            </>
          )}
        </Stack>
      }
    >
      <Stack spacing={3}>
        <Box
          sx={{
            opacity: createdMaterialId ? 0.4 : 1,
            pointerEvents: createdMaterialId ? 'none' : 'auto',
            transition: 'opacity 0.3s ease',
          }}
        >
          <Stack spacing={3}>
            <TextField
              label="Заголовок"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              label="Контент матеріалу"
              multiline
              rows={6}
              fullWidth
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
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

            {visibility === 'Group' && (
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
                  <TextField {...params} label="Прив'язати до групи" />
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
        </Box>

        {createdMaterialId && (
          <>
            <Divider>
              <Stack direction="row" alignItems="center" spacing={1}>
                <CheckCircleOutline color="success" />
                <Typography variant="body2" fontWeight="bold">
                  Текст збережено
                </Typography>
              </Stack>
            </Divider>

            <Box
              sx={{
                p: 4,
                border: '2px dashed',
                borderColor: selectedFile ? 'primary.main' : 'divider',
                borderRadius: 3,
                bgcolor: selectedFile
                  ? 'rgba(25, 118, 210, 0.04)'
                  : 'rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Крок 2: Додавання обкладинки
              </Typography>

              <Box sx={{ position: 'relative', width: '100%', maxWidth: 400 }}>
                <Box
                  component="img"
                  src={
                    preview ||
                    'https://placehold.co/600x300?text=Виберіть+зображення'
                  }
                  sx={{
                    width: '100%',
                    height: 200,
                    objectFit: 'cover',
                    borderRadius: 2,
                    boxShadow: 3,
                    display: 'block',
                    bgcolor: 'background.paper',
                  }}
                />
                {selectedFile && (
                  <Chip
                    label="Попередній перегляд"
                    color="primary"
                    size="small"
                    sx={{ position: 'absolute', top: 12, right: 12 }}
                  />
                )}
              </Box>

              <input
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
                id="material-image-upload-create"
                type="file"
              />

              <Stack spacing={1} alignItems="center">
                <label htmlFor="material-image-upload-create">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUpload />}
                    size="large"
                  >
                    {selectedFile ? 'Змінити файл' : 'Вибрати зображення'}
                  </Button>
                </label>

                {selectedFile && (
                  <Typography
                    variant="caption"
                    color="success.main"
                    fontWeight="medium"
                  >
                    {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)}{' '}
                    KB)
                  </Typography>
                )}
              </Stack>
            </Box>
          </>
        )}
      </Stack>
    </BaseModal>
  );
}
