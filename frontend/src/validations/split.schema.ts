import { z } from 'zod';

const savingMethodValues = ['cash', 'transfer', 'card', 'digital', 'other'] as const;

export const splitItemSchema = z.object({
  goal_id: z.string().min(1, 'La meta es requerida'),
  amount: z
    .number()
    .positive('El monto debe ser mayor a 0'),
});

export const splitSavingSchema = z
  .object({
    total_amount: z
      .string()
      .min(1, 'El monto total es requerido')
      .refine(
        (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
        'El monto total debe ser mayor a 0'
      ),
    currency: z.string().min(1, 'La moneda es requerida'),
    date: z.string().min(1, 'La fecha es requerida'),
    method: z.enum(savingMethodValues),
    note: z.string().max(200).optional(),
    splits: z
      .array(splitItemSchema)
      .min(1, 'Agrega al menos una meta'),
    leftover_as_free: z.boolean().default(false),
  })
  .refine(
    (data) => {
      const total = parseFloat(data.total_amount);
      const distributed = data.splits.reduce((sum, s) => sum + s.amount, 0);
      return distributed <= total;
    },
    {
      message: 'El total repartido no puede superar el monto total',
      path: ['splits'],
    }
  );

export type SplitSavingFormData = z.infer<typeof splitSavingSchema>;
