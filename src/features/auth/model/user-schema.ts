import z from 'zod';

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
  auctionGroupId: z.uuid(),
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

export type User = z.infer<typeof userSchema>;

export const updateUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
  phone: z
    .string()
    // .regex(
    //   /^(?:\\+38)?(?:\\(0\\d{2}\\)|0\\d{2})[ -]?\\d{3}[ -]?\\d{2}[ -]?\\d{2}$/,
    // )
    .optional()
    .or(z.literal('')),
  city: z.string().optional(),
  role: z.enum(ROLES).optional(),
  rights: z.enum(RIGHTS).optional(),
  auctionGroupId: z.uuid().optional().nullable().or(z.literal('')),
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
  auctionGroupId: z.uuid().optional(),
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
