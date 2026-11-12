/**
 * Cliente Supabase de servidor SOLO.
 * IMPORTANTE: Nunca importar este archivo en código de cliente (browser),
 * ya que usa SUPABASE_SERVICE_ROLE_KEY que tiene acceso total a la BD.
 * Este archivo debe mantenerse solo en el servidor (API routes, edge functions).
 */
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en las variables de entorno.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});