import { z } from 'zod';

export const TIPOS_NEGOCIO = [
  'Restaurante',
  'Cafetería',
  'Bar / Gastrobar',
  'Comida rápida',
  'Otro',
] as const;

export const ROLES_CONTACTO = [
  'Dueño / Propietario',
  'Administrador',
  'Gerente',
  'Encargado',
] as const;

export type TipoNegocio = (typeof TIPOS_NEGOCIO)[number];
export type RolContacto = (typeof ROLES_CONTACTO)[number];

const MENSAJE_REQUERIDO = 'Este campo es obligatorio.';

const texto = (
  min: number,
  max: number,
  mensajeMin: string,
  mensajeMax: string
) =>
  z
    .string({
      required_error: MENSAJE_REQUERIDO,
      invalid_type_error: MENSAJE_REQUERIDO,
    })
    .trim()
    .min(min, mensajeMin)
    .max(max, mensajeMax);

export const inscripcionSchema = z
  .object({
    nombre_negocio: texto(
      2,
      120,
      'Ingresa el nombre del negocio.',
      'El nombre del negocio no puede superar 120 caracteres.'
    ),
    tipo_negocio: z.enum(TIPOS_NEGOCIO, {
      errorMap: () => ({ message: 'Selecciona un tipo de negocio.' }),
    }),
    zona_barrio: texto(
      2,
      100,
      'Ingresa la zona o el barrio.',
      'La zona o el barrio no puede superar 100 caracteres.'
    ),
    nombre_contacto: texto(
      2,
      100,
      'Ingresa el nombre de la persona de contacto.',
      'El nombre de contacto no puede superar 100 caracteres.'
    ),
    rol_contacto: z.enum(ROLES_CONTACTO, {
      errorMap: () => ({ message: 'Selecciona tu rol en el negocio.' }),
    }),
    medio_contacto: z.enum(['whatsapp', 'correo'], {
      errorMap: () => ({ message: 'Selecciona WhatsApp o correo.' }),
    }),
    contacto_directo: texto(
      5,
      150,
      'Ingresa un número de celular o un correo electrónico.',
      'El contacto directo no puede superar 150 caracteres.'
    ),
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
