import { ArrowBack } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import ProfileEdit from '../features/profile/ui/ProfileEdit';
import { useNavigate } from 'react-router';

export default function Profile() {
  const navigate = useNavigate();

  return <>
    <Box sx={{ display: 'flex', alignItems: 'center', my: 3, gap: 1 }}>
      <IconButton
        onClick={() => navigate(-1)}
        sx={{ color: 'text.secondary' }}
      >
        <ArrowBack />
      </IconButton>
      <Typography
        variant="h5"
        sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}
      >
        Налаштування профілю
      </Typography>

    </Box>
    <ProfileEdit />
  </>
}
