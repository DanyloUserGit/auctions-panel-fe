import { Box } from '@mui/material';
import Sidebar from '../shared/ui/Sidebar';
import { Outlet } from 'react-router';
import Tabs from '../shared/ui/Tabs';

export default function Home() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        <Tabs />

        <Box sx={{ p: 2, flexGrow: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
