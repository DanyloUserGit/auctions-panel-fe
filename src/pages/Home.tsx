import { Box } from '@mui/material';
import { Outlet } from 'react-router';
import Sidebar from '../shared/ui/Sidebar';

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
        {/* <Tabs /> */}

        <Box sx={{ p: 2, flexGrow: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
