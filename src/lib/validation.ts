/**
 * Esquema Zod compartido para validación del formulario de inscripción.
 * Contiene las reglas de negocio y de seguridad definidas en el prompt.
 * Este esquema se comparte entre el validador del endpoint API y el cliente
 * (cuando haya interactividad real en islas de Astro).
 */

import { z } from 'zod';

export const contactoSchema = z.object().refine(
  (val) => {
    // Si tiene @, se trata como correo (normalizar a minúsculas)
    // Si no, se trata como WhatsApp (normalizar a solo dígitos)
    const tieneArroba = val.includes('@');
    if (tieneArroba) {
      // Formato de correo válido
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    } else {
      // WhatsApp: solo dígitos (se normalizarán espacios y prefijo +57)
      const soloDigitos = val.replace(/\s/g, '').replace(/^\+/, '');
      return /^\d{10,15}$/.test(soloDigitos);
    }
  },
  (val) => {
    const tieneArroba = val.includes('@');
    if (tieneArroba) {
      return { message: 'Formato de correo inválido' };
    } else {
      return { message: 'Número de WhatsApp inválido. Debe tener entre 10 y 15 dígitos' };
    }
  }
);

export const autorizacionSchema = z.literal(true, {
  errorMessage: 'Debes dar tu consentimiento explícito para el tratamiento de datos.',
});

export const leadSchema = z.object({
  nombre_negocio: z.string().trim().min(2).max(120),
  tipo_negocio: z.string().trim().min(2).max(80),
  zona_barrio: z.string().trim().min(2).max(80),
  nombre_contacto: z.string().trim().min(2).max(80),
  rol_contacto: z.string().trim().min(2).max(80),
  contacto_directo: contactoSchema,
  autorizacion_datos: autorizacionSchema,
  // honeypot sitoweb se valida por debajo (si viene, se rechaza)
});