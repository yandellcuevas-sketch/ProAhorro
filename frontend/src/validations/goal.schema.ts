import { z } from 'zod';

const goalStatusValues = ['active', 'paused', 'completed', 'deleted'] as const;

export const createGoalSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre de la meta es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(60, 'El nombre es demasiado largo'),
  description: z
    .string()
    .max(300, 'La descripción no puede superar 300 caracteres')
    .optional(),
  target_amount: z
    .string()
    .min(1, 'El monto objetivo es requerido')
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      'El monto debe ser mayor a 0'
    ),
  currency: z.string().min(1, 'La moneda es requerida'),
  deadline: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const date = new Date(val);
      return date > new Date();
    }, 'La fecha límite debe ser en el futuro'),
  icon: z.string(),
  color: z.string(),
});

export const updateGoalSchema = createGoalSchema.partial().extend({
  status: z.enum(goalStatusValues).optional(),
});

export type CreateGoalFormData = z.infer<typeof createGoalSchema>;
export type UpdateGoalFormData = z.infer<typeof updateGoalSchema>;
