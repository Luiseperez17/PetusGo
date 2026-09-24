import { z } from 'zod';

const dmy = z
  .string()
  .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'dd/mm/aaaa')
  .transform((s) => s.split('/').reverse().join('-'))
  .optional()
  .or(z.literal('').transform(() => undefined));

export const registerSchema = z.object({
  tutor: z.object({
    nombreCompleto: z.string().min(3).max(120),
    correo: z.string().trim().toLowerCase().email(),
    telefono: z.string().min(7).max(20),
    direccion: z.string().min(5).max(200),
    cedula: z.string().min(5).max(20)
  }),
  mascota: z.object({
    nombre: z.string().min(1).max(60),
    especie: z.enum(['canino', 'felino']),
    sexo: z.enum(['macho', 'hembra']).optional(),
    tamano: z.enum(['pequeño', 'mediano', 'grande']).optional(),
    peso: z.coerce.number().positive().max(120).optional(),
    edad: z.string().max(30).optional(),
    fechaDesparasitacion: dmy,
    fechaVacuna: dmy,
    esterilizado: z.enum(['si', 'no']).optional(),
    // data URL (jpg/png, <=5MB) — el backend lo sube a Storage
    foto: z.string().regex(/^data:image\/(png|jpe?g);base64,/).max(7_000_000).optional()
  }),
  aceptaTerminos: z.literal(true)
});

export const foodPurchaseSchema = z.object({
  membershipCode: z.string(),
  presentationId: z.string().uuid()
});

export const redeemSchema = z.object({
  membershipCode: z.string(),
  benefit: z.enum(['bolsa_gratis', 'bano', 'consulta'])
});

export const pharmacyPurchaseSchema = z.object({
  membershipCode: z.string(),
  items: z.array(z.object({ productId: z.string(), qty: z.number().int().positive() })).min(1)
});

export const requestCodeSchema = z.object({ email: z.string().trim().toLowerCase().email() });
export const verifyCodeSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  code: z.string().trim().regex(/^\d{6,8}$/)
});

export const staffLoginSchema = z.object({ email: z.string().trim().toLowerCase().email(), password: z.string().min(1) });
export const statusSchema = z.object({ status: z.enum(['pendiente', 'activa', 'vencida', 'cancelada']) });
