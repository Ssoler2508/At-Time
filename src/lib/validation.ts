import { z } from 'zod';

export const inscripcionSchema = z
  .object({
    nombre_negocio: z.string().trim().min(2).max(120),
    tipo_negocio: z.string().trim().min(2).max(60),
    zona_barrio: z.string().trim().min(2).max(100),
    nombre_contacto: z.string().trim().min(2).max(100),
    rol_contacto: z.string().trim().min(2).max(60),
    medio_contacto: z.enum(['whatsapp', 'correo']),
    contacto_directo: z.string().trim().min(5).max(150),
    autorizacion_datos: z.literal(true, {
      errorMap: () => ({
        message: 'Debes autorizar el tratamiento de datos personales.',
      }),
    }),
    sitio_web: z.string().optional().default(''),
  })
  .superRefine((data, ctx) => {
    if (data.medio_contacto === 'whatsapp') {
      const soloDigitos = data.contacto_directo
        .replace(/\s/g, '')
        .replace(/^\+?57/, '');

      if (!/^3\d{9}$/.test(soloDigitos)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['contacto_directo'],
          message:
            'El celular debe tener 10 dígitos y empezar por 3 (puedes incluir +57).',
        });
        return;
      }

      data.contacto_directo = soloDigitos;
      return;
    }

    const correo = data.contacto_directo.toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['contacto_directo'],
        message: 'Ingresa un correo electrónico válido.',
      });
      return;
    }

    data.contacto_directo = correo;
  });

export type InscripcionInput = z.infer<typeof inscripcionSchema>;
