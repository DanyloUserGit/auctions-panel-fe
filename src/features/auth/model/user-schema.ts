import z from "zod";

export const ROLES = ['GroupAdmin', 'User', 'SuperAdmin'] as const;
export type UserRole = (typeof ROLES)[number];

export const RIGHTS = ["Read", "Write", "All"] as const;
export type UserRights = (typeof RIGHTS)[number]

export const userSchema = z.object({
    id: z.number(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    role: z.enum(ROLES),
    rights: z.enum(RIGHTS),
});
export type User = z.infer<typeof userSchema>;

export const updateUserSchema = z.object({
    id: z.number(),
    email: z.string().email().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    role: z.enum(ROLES).optional(),
    rights: z.enum(RIGHTS).optional(),
})
export type UpdateUser = z.infer<typeof updateUserSchema>;


export const ChangeRoleSchema = z.object({
    id: z.uuid({ message: "Id має бути типом uuid" }),
    role: z.enum(ROLES, {
        message: 'Потрібно обрати 1 з наступних ролей: SuperAdmin, Admin, User.',
    }),
    rights: z.enum(RIGHTS, {
        message: 'Потрібно обрати права зі списку: Read, Write, ReadAndWrite, Buy, Sell, BuyAndSell.',
    }),
});
export type ChangeRole = z.infer<typeof ChangeRoleSchema>