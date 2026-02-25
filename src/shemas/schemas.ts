import z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(["SuperAdmin","GroupAdmin", "User"]),
  rights: z.enum(["Read", "Write", "Admin"]),
});
export type User = z.infer<typeof userSchema>;


