import { People, Visibility } from '@mui/icons-material';
import { type SvgIconProps } from '@mui/material';
import type { MaterialVisibilityType } from './types';

export const getVisibilityIcon = (
  visibility: MaterialVisibilityType,
  props: SvgIconProps = { sx: { fontSize: 14 } },
) => {
  switch (visibility) {
    case 'All':
      return <Visibility {...props} />;
    case 'Group':
      return <People {...props} />;
    default:
      return undefined;
  }
};
