import { z } from 'zod'

export const systemLoginSchema = z
  .object({
    email: z.string().email('Некорректный email'),
    password: z.string().min(8, 'Пароль должен быть минимум 8 символов'),
  })
  .strict()

export type SystemLoginDto = z.infer<typeof systemLoginSchema>
