import z from "zod";

export const ROLES = ['GroupAdmin', 'User', 'SuperAdmin', "Admin"] as const;
export type UserRole = (typeof ROLES)[number];

export const RIGHTS = ["Read", "Write", "Admin"] as const;
export type UserRights = (typeof RIGHTS)[number]

export const userSchema = z.object({
    id: z.number(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    role: z.enum(ROLES),
    rights: z.array(z.enum(RIGHTS)),
});
export type User = z.infer<typeof userSchema>;

export const updateUserSchema = z.object({
    id: z.number(),
    email: z.string().email().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    role: z.enum(ROLES).optional(),
    rights: z.array(z.enum(RIGHTS)).optional(),
})
export type UpdateUser = z.infer<typeof updateUserSchema>;