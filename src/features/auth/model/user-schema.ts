import z from "zod";

export const userSchema = z.object({
    id: z.number(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    role: z.enum(["SuperAdmin", "GroupAdmin", "User"]),
    rights: z.enum(["Read", "Write", "Admin"]),
});
export type User = z.infer<typeof userSchema>;

