import { Box, Button, Chip, Divider, Stack, Typography } from '@mui/material';
import BaseModal from '../../../shared/ui/Modal';
import { getVisibilityIcon } from '../model/helper';
import type { Training } from '../model/types';
import { resolveFileUrl } from '../../../shared/utils';

interface Props {
  item: Training;
  isOpen: boolean;
  close: () => void;
}
export default function TrainingDetailModal({ item, isOpen, close }: Props) {
  return (
    <BaseModal
      open={isOpen}
      onClose={close}
      title={item.title}
      maxWidth="md"
      actions={
        <Button
          onClick={close}
          variant="contained"
          sx={{ borderRadius: '8px' }}
        >
          Зрозуміло
        </Button>
      }
    >
      <Stack spacing={3}>
        {item.imageUrl && (
          <Box
            component="img"
            src={resolveFileUrl(item.imageUrl)}
            alt={item.title}
            sx={{
              width: '100%',
              maxHeight: 350,
              objectFit: 'cover',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            }}
          />
        )}

        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
          sx={{ gap: 1 }}
        >
          <Chip
            icon={getVisibilityIcon(item.visibility)}
            label={`Доступ: ${item.visibility}`}
            variant="outlined"
            color="primary"
          />
          {item.allowedRoles?.map((role) => (
            <Chip key={role} label={role} color="info" variant="filled" />
          ))}
        </Stack>

        <Divider />

        <Typography
          variant="body1"
          sx={{
            whiteSpace: 'pre-wrap',
            lineHeight: 1.7,
            color: 'text.primary',
            fontSize: '1.05rem',
          }}
        >
          {item.content}
        </Typography>
      </Stack>
    </BaseModal>
  );
}
