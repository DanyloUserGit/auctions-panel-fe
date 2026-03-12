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
import { useEffect, useState } from 'react';
import { useAutoComplete } from '../../../shared/hooks/useAutoComplete';
import BaseModal from '../../../shared/ui/Modal';
import { ROLES, type UserRole } from '../../auth/model/user-schema';
import {
  fetchGroupByid,
  fetchGroupByQuery,
} from '../../groups/model/api-groups';
import type { Group } from '../../groups/model/types';
import {
  MaterialVisibility,
  type MaterialVisibilityType,
  type Training,
} from '../model/types';
import {
  useUpdateTraining,
  useUploadMaterialImage,
} from '../model/useTraining';

interface MaterialEditorModalProps {
  isOpen: boolean;
  close: () => void;
  item: Training;
}

export function TrainingEditModal({
  item,
  isOpen,
  close,
}: MaterialEditorModalProps) {
  const { mutate: editTraining, isPending: isEditing } = useUpdateTraining();
  const { mutate: uploadImage, isPending: isUploading } =
    useUploadMaterialImage();

  const [title, setTitle] = useState(item.title || '');
  const [content, setContent] = useState(item.content || '');
  const [visibility, setVisibility] = useState<MaterialVisibilityType>(
    item.visibility || 'All',
  );
  const [allowedRoles, setAllowedRoles] = useState<UserRole[]>(
    item.allowedRoles || [],
  );
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null); // Спочатку null
  const [isPublished, setIsPublished] = useState(item.isPublished || false);

  const [createdMaterialId, setCreatedMaterialId] = useState<string | null>(
    null,
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && item.groupId) {
      fetchGroupByid(item.groupId).then((data) => {
        setSelectedGroup(data);
      });
    }
  }, [isOpen, item.groupId]);

  const groupsSearch = useAutoComplete<Group>({
    fetchFn: fetchGroupByQuery,
  });

  const handleFileChange = (file: File | null) => {
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

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleUpdateText = () => {
    const payload = {
      title,
      content,
      allowedRoles,
      visibility,
      isPublished,
      // ВАЖЛИВО: додаємо groupId у запит
      groupId: visibility === 'Group' ? selectedGroup?.id : undefined,
    };

    editTraining(
      { id: item.id, data: payload },
      {
        onSuccess: () => setCreatedMaterialId(item.id),
      },
    );
  };

  const handleImageUpload = () => {
    if (!selectedFile) return;

    uploadImage(
      { id: item.id, file: selectedFile },
      {
        onSuccess: () => handleFullClose(),
      },
    );
  };

  const handleFullClose = () => {
    setCreatedMaterialId(null);
    handleFileChange(null);
    close();
  };

  return (
    <BaseModal
      open={isOpen}
      onClose={handleFullClose}
      title="Редагування навчального матеріалу"
      maxWidth="md"
      actions={
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          sx={{ width: '100%' }}
        >
          {!createdMaterialId ? (
            <>
              <Button onClick={close} color="inherit">
                Скасувати
              </Button>
              <Button
                variant="contained"
                onClick={handleUpdateText}
                disabled={!title.trim() || !content.trim() || isEditing}
              >
                {isEditing ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Зберегти та далі'
                )}
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleFullClose} color="inherit">
                Закрити
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
                  'Оновити фото'
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
            opacity: createdMaterialId ? 0.5 : 1,
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

            {/* ВИПРАВЛЕНО: 'Groups' замість 'Group' */}
            {visibility === 'Group' && (
              <Autocomplete
                options={groupsSearch.getFilteredOptions(selectedGroup)}
                loading={groupsSearch.isLoading}
                value={selectedGroup}
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

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                  />
                }
                label="Опублікувати відразу"
              />
            </Box>
          </Stack>
        </Box>

        {createdMaterialId && (
          <Divider>
            <Chip
              icon={<CheckCircleOutline />}
              label="Дані успішно оновлено"
              color="success"
              variant="outlined"
            />
          </Divider>
        )}

        {/* Секція 2: Завантаження зображення з центруванням */}

        {createdMaterialId && (
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

              alignItems: 'center', // Центрування по горизонталі

              textAlign: 'center',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              Крок 2: Оновлення обкладинки
            </Typography>

            <Box
              sx={{ mb: 3, position: 'relative', width: '100%', maxWidth: 450 }}
            >
              <Box
                component="img"
                src={
                  preview ||
                  item.imageUrl ||
                  'https://placehold.co/400x200?text=No+Image'
                }
                sx={{
                  width: '100%',

                  height: 220,

                  objectFit: 'cover',

                  borderRadius: 2,

                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',

                  border: '1px solid',

                  borderColor: 'divider',
                }}
              />

              {selectedFile && (
                <Chip
                  label="Нове фото"
                  color="primary"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    fontWeight: 'bold',
                  }}
                />
              )}
            </Box>

            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="material-image-upload-edit"
              type="file"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            />

            <Stack spacing={2} alignItems="center">
              <label htmlFor="material-image-upload-edit">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUpload />}
                  sx={{ borderRadius: '10px', px: 4 }}
                >
                  Вибрати нове зображення
                </Button>
              </label>

              {selectedFile && (
                <Typography
                  variant="body2"
                  color="success.main"
                  sx={{ fontWeight: 500 }}
                >
                  Вибрано: {selectedFile.name}
                </Typography>
              )}
            </Stack>
          </Box>
        )}
      </Stack>
    </BaseModal>
  );
}
