import { Box } from '@mui/material';
import type { CalculationTab } from '../../pages/calculation/model/types';

export const TabPanel: React.FC<{
  value: CalculationTab;
  current: CalculationTab;
  children: React.ReactNode;
}> = ({ value, current, children }) => {
  if (value !== current) return null;
  return <Box sx={{ mt: 3 }}>{children}</Box>;
};
