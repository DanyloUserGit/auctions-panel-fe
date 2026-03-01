import z from "zod";

export const ROLES = ['GroupAdmin', 'User', 'SuperAdmin', "Admin"] as const;
export type UserRole = (typeof ROLES)[number];
export const userSchema = z.object({
    id: z.number(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    role: z.enum(ROLES),
    rights: z.enum(["Read", "Write", "Admin"]),
});
export type User = z.infer<typeof userSchema>;

