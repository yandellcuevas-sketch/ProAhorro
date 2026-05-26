import { z } from 'zod';

const savingMethodValues = ['cash', 'transfer', 'card', 'digital', 'other'] as const;
const savingDestinationValues = ['free', 'goal', 'new_goal', 'split'] as const;

export const addSavingSchema = z
  .object({
    amount: z
      .string()
      .min(1, 'El monto es requerido')
      .refine(
        (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
        'El monto debe ser mayor a 0'
      ),
    currency: z.string().min(1, 'La moneda es requerida'),
    date: z.string().min(1, 'La fecha es requerida'),
    method: z.enum(savingMethodValues, {
      errorMap: () => ({ message: 'Selecciona un método de ahorro' }),
    }),
    note: z.string().max(200, 'La nota no puede superar 200 caracteres').optional(),
    destination: z.enum(savingDestinationValues),
    goal_id: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.destination === 'goal' && !data.goal_id) {
        return false;
      }
      return true;
    },
    {
      message: 'Selecciona una meta',
      path: ['goal_id'],
    }
  );

export const editSavingSchema = z.object({
  amount: z
    .string()
    .min(1, 'El monto es requerido')
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      'El monto debe ser mayor a 0'
    ),
  currency: z.string().min(1, 'La moneda es requerida'),
  date: z.string().min(1, 'La fecha es requerida'),
  method: z.enum(savingMethodValues),
  note: z.string().max(200).optional(),
});

export type AddSavingFormData = z.infer<typeof addSavingSchema>;
export type EditSavingFormData = z.infer<typeof editSavingSchema>;
