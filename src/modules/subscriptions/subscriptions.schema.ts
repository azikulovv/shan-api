import { z } from 'zod'

export const activateSubscriptionSchema = z
  .object({
    planId: z.string().uuid('Некорректный ID тарифа').optional(),

    amount: z
      .number({
        error: 'Сумма обязательна',
      })
      .int('Сумма должна быть целым числом')
      .positive('Сумма должна быть больше 0'),

    months: z
      .number({
        error: 'Количество месяцев обязательно',
      })
      .int('Количество месяцев должно быть целым числом')
      .min(1, 'Минимум 1 месяц')
      .max(24, 'Максимум 24 месяца'),

    provider: z.enum(['CASH', 'KASPI_TRANSFER', 'BANK_TRANSFER', 'ONLINE', 'MANUAL'], {
      error: 'Некорректный способ оплаты',
    }),

    comment: z
      .string()
      .trim()
      .max(500, 'Комментарий не должен быть длиннее 500 символов')
      .optional(),
  })
  .strict()

export type ActivateSubscriptionDto = z.infer<typeof activateSubscriptionSchema>
