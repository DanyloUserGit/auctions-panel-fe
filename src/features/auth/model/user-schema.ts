import z from 'zod';
import type { UserGroup } from '../../user-groups/model/types';


export const ROLES = ['Admin', 'User', 'SuperAdmin'] as const;
export type UserRole = (typeof ROLES)[number];

export const RIGHTS = ['Read', 'Write', 'All'] as const;
export type UserRights = (typeof RIGHTS)[number];

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(ROLES),
  rights: z.enum(RIGHTS),
  phone: z.string(),
  city: z.string(),
  userGroupId: z.uuid(),
  managedGroup: z.string().or(z.literal('')),
  sessionLimit: z.number(),
  sessionRights: z.enum(RIGHTS),
  isActive: z.boolean(),
  isBlocked: z.boolean(),
  telegramChatId: z.string(),
  viberId: z.string(),
  lastLogin: z.date(),
  lastActivity: z.date(),
  sessionId: z.string(),
});

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  rights: UserRights;
  phone: string;
  city: string;
  userGroupId: string;
  userGroup?: UserGroup; 
  managedGroup?: UserGroup; 
  sessionLimit: number;
  sessionRights: UserRights;
  isActive: boolean;
  isBlocked: boolean;
  telegramChatId: string;
  viberId: string;
  lastLogin: Date;
  lastActivity: Date;
  sessionId: string;
}
const phoneRegex = /^(?:\+?38)?(?:0\d{9})$/;
export const updateUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
  phone: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => {
        if (!val) return true;
        const cleanPhone = val.replace(/[ \-()]/g, '');
        return phoneRegex.test(cleanPhone);
      },
      {
        message: 'Невірний формат номера телефону',
      },
    ),
  city: z.string().optional(),
  role: z.enum(ROLES).optional(),
  rights: z.enum(RIGHTS).optional(),
  userGroupId: z.uuid().optional().nullable().or(z.literal('')),
  managedGroup: z.string().or(z.literal('')).optional(),

  sessionLimit: z.number().optional(),
});

export type UpdateUser = z.infer<typeof updateUserSchema>;

export const EditProfileSchema = z.object({
  id: z.uuid({ message: 'Id має бути типом uuid' }),
  firstName: z
    .string()
    .min(2, { message: "Ім'я має бути стрічкою, 2 символи та більше." }),
  lastName: z
    .string()
    .min(2, { message: 'Прізвище має бути стрічкою, 2 символи та більше.' }),
});
export type EditProfile = z.infer<typeof EditProfileSchema>;

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(ROLES),
  rights: z.enum(RIGHTS),
  phone: z.string().optional(),
  city: z.string().optional(),
  userGroupId: z.string().uuid().or(z.literal('')).optional(),
  managedGroup: z.string().or(z.literal('')).optional(),
  sessionLimit: z.number().optional(),
});
export type CreateUser = z.infer<typeof createUserSchema>;

export const ChangeRoleSchema = z.object({
  id: z.uuid({ message: 'Id має бути типом uuid' }),
  role: z.enum(ROLES, {
    message: 'Потрібно обрати 1 з наступних ролей: SuperAdmin, Admin, User.',
  }),
  rights: z.enum(RIGHTS, {
    message:
      'Потрібно обрати права зі списку: Read, Write, ReadAndWrite, Buy, Sell, BuyAndSell.',
  }),
});
export type ChangeRole = z.infer<typeof ChangeRoleSchema>;