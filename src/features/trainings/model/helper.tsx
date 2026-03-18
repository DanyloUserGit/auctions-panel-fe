import { People, Visibility } from '@mui/icons-material';
import { type SvgIconProps } from '@mui/material';
import type { MaterialVisibilityType } from './types';

/**
 * Повертає відповідну іконку залежно від типу видимості матеріалу
 * @param visibility - тип видимості (All, Groups, Role)
 * @param props - додаткові пропси для MUI іконки (наприклад, fontSize, color)
 */
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
