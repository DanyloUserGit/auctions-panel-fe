import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Chip,
  Box,
  Stack,
} from '@mui/material';
import { Visibility, People, Shield } from '@mui/icons-material';
import {
  type MaterialVisibilityType,
  type TrainingMaterial,
} from '../model/types';

interface Props {
  materials: TrainingMaterial[];
}

export const TrainingList = ({ materials }: Props) => {
  const getVisibilityIcon = (visibility: MaterialVisibilityType) => {
    switch (visibility) {
      case 'All':
        return <Visibility sx={{ fontSize: 14 }} />;
      case 'Groups':
        return <People sx={{ fontSize: 14 }} />;
      case 'Role':
        return <Shield sx={{ fontSize: 14 }} />;
      default:
        return undefined;
    }
  };
  return (
    <Grid container spacing={3}>
      {materials.map((item) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
          <Card
            sx={{
              borderRadius: '16px',
              overflow: 'hidden',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              opacity: item.isPublished ? 1 : 0.7, // Візуально виділяємо чернетки
            }}
          >
            <CardMedia
              component="img"
              height="160"
              image={
                item.imageUrl ||
                `https://picsum.photos/400/200?random=${item.id}`
              }
              alt={item.title}
            />
            <CardContent
              sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <Typography
                  variant="overline"
                  color="primary"
                  sx={{ fontWeight: 700, lineHeight: 1 }}
                >
                  {item.visibility === 'Groups' ? 'Для груп' : 'Загальне'}
                </Typography>

                {!item.isPublished && (
                  <Chip
                    label="Чернетка"
                    size="small"
                    variant="outlined"
                    color="warning"
                    sx={{ height: 20 }}
                  />
                )}
              </Stack>

              <Typography
                variant="h6"
                sx={{ fontWeight: 700, mb: 1, lineHeight: 1.3 }}
              >
                {item.title}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 2,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  flexGrow: 1,
                }}
              >
                {item.content}
              </Typography>

              <Box sx={{ mt: 'auto' }}>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Chip
                    icon={getVisibilityIcon(item.visibility)}
                    label={item.visibility}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '10px' }}
                  />
                  {item.allowedRoles?.map((role) => (
                    <Chip
                      key={role}
                      label={role}
                      size="small"
                      sx={{ fontSize: '10px' }}
                    />
                  ))}
                </Stack>

                <Button
                  size="small"
                  variant="contained"
                  fullWidth
                  sx={{ borderRadius: '8px' }}
                >
                  Читати
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}

      {materials.length === 0 && (
        <Box sx={{ width: '100%', textAlign: 'center', py: 5 }}>
          <Typography color="text.secondary">
            Навчальних матеріалів поки немає
          </Typography>
        </Box>
      )}
    </Grid>
  );
};
