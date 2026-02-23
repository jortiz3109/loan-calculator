import { z } from 'zod'

export const creditFormSchema = z.object({
  amount: z.coerce
    .number()
    .positive('El monto del crédito debe ser un número mayor a 0.'),
  installments: z.coerce
    .number()
    .int('El número de cuotas debe ser un entero mayor o igual a 1.')
    .min(1, 'El número de cuotas debe ser un entero mayor o igual a 1.'),
  installmentAmount: z.coerce
    .number()
    .positive('El valor de la cuota debe ser un número mayor a 0.')
    .optional(),
  rate: z.coerce
    .number()
    .min(0, 'La tasa de interés debe ser un número mayor o igual a 0.'),
})

export type CreditFormValues = z.infer<typeof creditFormSchema>
