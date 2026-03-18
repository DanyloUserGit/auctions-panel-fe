import {
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { Box, Button, Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export default function PageNotFound() {
  return (
    <Container component="main" maxWidth="md">
      <Box className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <Typography
          variant="h1"
          className="font-extrabold text-blue-600 mb-2 tracking-widest"
          sx={{ fontSize: { xs: '6rem', md: '10rem' } }}
        >
          404
        </Typography>

        <Typography
          variant="h4"
          component="h2"
          className="font-bold text-gray-800 mb-4"
        >
          Упс! Сторінку не знайдено
        </Typography>

        <Typography
          variant="body1"
          className="text-gray-600 mb-8 max-w-md mx-auto"
        >
          Схоже, що шлях, яким ви намагалися пройти, веде в нікуди. Можливо,
          посилання застаріло або в адресі була помилка.
        </Typography>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="contained"
            size="large"
            startIcon={<HomeIcon />}
            component={Link}
            to="/"
            className="bg-blue-600 hover:bg-blue-700 normal-case px-8 py-3 rounded-lg"
          >
            На головну
          </Button>

          <Button
            variant="outlined"
            size="large"
            onClick={() => window.history.back()}
            startIcon={<ArrowBackIcon />}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 normal-case px-8 py-3 rounded-lg"
          >
            Назад
          </Button>
        </div>

        {/* Декоративний елемент (опціонально) */}
        <Box className="mt-16 opacity-10">
          {/* Тут можна додати іконку або SVG-ілюстрацію */}
        </Box>
      </Box>
    </Container>
  );
}
