import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppRouter from './app/routes.tsx';
import './styles/index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  </StrictMode>,
);
