import { useTheme, useMediaQuery } from '@mui/material';

export const useMobile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // console.log(isMobile)
  return isMobile;
};
