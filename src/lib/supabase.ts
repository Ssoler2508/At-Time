import { createClient } from '@supabase/supabase-js';

/**
 * Cliente de Supabase para uso EXCLUSIVO del servidor.
 *
 * Este archivo NUNCA debe importarse en componentes cliente (islas de Astro,
 * código que corre en el navegador). Usa SUPABASE_SERVICE_ROLE_KEY, una llave
 * con privilegios administrativos que omite las políticas de RLS. Si se filtrara
 * al frontend, cualquiera podría leer, modificar o borrar toda la base de datos.
 * Mantenlo únicamente en endpoints de servidor (API routes, middleware, etc.).
 */

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
const supabaseServiceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY as
  | string
  | undefined;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    'Faltan PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el entorno del servidor.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
