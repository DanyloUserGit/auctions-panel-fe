import { z } from 'zod';

export const createInfoSchema = z.object({
    title: z.string().min(1, { message: "Заголовок обов'язковий" }).max(255, { message: "Заголовок занадто довгий" }),
    slug: z.string().min(1, { message: "Slug обов'язковий" }).regex(/^[a-z0-9-]+$/, { message: "Slug може містити лише малі латинські літери, цифри та дефіси" }),
    content: z.string().min(1, { message: "Контент не може бути порожнім" }),
});

export type CreateInfo = z.infer<typeof createInfoSchema>;

export const infoSchema = z.object({
    id: z.uuid(),
    title: z.string().min(1, { message: "Заголовок обов'язковий" }).max(255, { message: "Заголовок занадто довгий" }),
    slug: z.string().min(1, { message: "Slug обов'язковий" }).regex(/^[a-z0-9-]+$/, { message: "Slug може містити лише малі латинські літери, цифри та дефіси" }),
    content: z.string().min(1, { message: "Контент не може бути порожнім" }),
})
export type Info = z.infer<typeof infoSchema>