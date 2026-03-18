import { ROLES } from './user-schema';

export type Role = (typeof ROLES)[number];

export const RoleMap = {
  Admin: ROLES[0],
  User: ROLES[1],
  SuperAdmin: ROLES[2],
} as const;
