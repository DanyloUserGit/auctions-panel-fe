import {
  Box,
  Grid,
  Typography
} from '@mui/material';
import { type Training } from '../model/types';
import TrainingItem from './TrainingItem';

interface Props {
  materials: Training[];
}

export const TrainingList = ({ materials }: Props) => {

  return (
    <Grid container spacing={3}>
      {materials.map((item) => (
        <TrainingItem key={item.id} item={item} />
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
