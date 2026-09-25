import z from 'zod';
import type { UserGroup } from '../../user-groups/model/types';


export const ROLES = ['Admin', 'User', 'SuperAdmin'] as const;
export type UserRole = (typeof ROLES)[number];

// Статус доступу (ТЗ 12). «Заблокований» - окремий прапорець isBlocked.
export const ACCESS_STATUSES = ['ReadOnly', 'Purchase', 'PurchaseSale', 'PurchaseNoSales'] as const;
export type AccessStatus = (typeof ACCESS_STATUSES)[number];

export const ACCESS_STATUS_LABELS: Record<AccessStatus, string> = {
  ReadOnly: 'Тільки перегляд (Read Only)',
  Purchase: 'Дозволені покупки',
  PurchaseSale: 'Дозволені покупки + дозволені продажі',
  PurchaseNoSales: 'Дозволені покупки без доступу до продажів',
};

export const statusLabel = (user: { accessStatus?: AccessStatus; isBlocked?: boolean }) =>
  user.isBlocked ? 'Заблокований' : ACCESS_STATUS_LABELS[user.accessStatus ?? 'ReadOnly'];

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(ROLES),
  accessStatus: z.enum(ACCESS_STATUSES),
  phone: z.string(),
  city: z.string(),
  userGroupId: z.uuid(),
  managedGroup: z.string().or(z.literal('')),
  sessionLimit: z.number(),
  isActive: z.boolean(),
  isBlocked: z.boolean(),
  telegramChatId: z.string(),
  viberId: z.string(),
  lastLogin: z.date(),
  lastActivity: z.date(),
});

export interface User {
  id: string;
  email: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  role: UserRole;
  accessStatus: AccessStatus;
  phone: string;
  city: string;
  userGroupId: string;
  userGroup?: UserGroup; 
  managedGroup?: UserGroup; 
  sessionLimit: number;
  lastSession?: { id: string; auction: string; startedAt: string; endedAt?: string | null; status: 'active' | 'ended' | 'error' } | null;
  isActive: boolean;
  isBlocked: boolean;
  telegramChatId: string;
  viberId: string;
  lastLogin: string | null;
  lastActivity: string | null;
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
  userGroupId: z.uuid().optional().nullable().or(z.literal('')),
  managedGroup: z.string().or(z.literal('')).optional(),

  sessionLimit: z.number().optional(),
  middleName: z.string().optional(),
  hasContract: z.boolean().optional(),
  contractNumber: z.string().nullish(),
  depositAmount: z.number().nullish(),
  depositMethod: z.string().nullish(),
  adminComment: z.string().nullish(),
  adminExtra: z.string().nullish(),
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
  accessStatus: z.enum(ACCESS_STATUSES),
  statusReason: z.string().optional(),
  middleName: z.string().optional(),
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
});
export type ChangeRole = z.infer<typeof ChangeRoleSchema>;