import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
import { inscripcionSchema } from '../../lib/validation';

export const prerender = false;

const jsonResponse = (body: unknown, status: number): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const respuestaExitosa = (): Response =>
  jsonResponse({ ok: true, mensaje: 'Inscripción procesada' }, 200);

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonResponse(
      { ok: false, error: 'El cuerpo de la solicitud no es JSON válido.' },
      400
    );
  }

  const resultado = inscripcionSchema.safeParse(body);

  if (!resultado.success) {
    const errores: Record<string, string> = {};
    for (const issue of resultado.error.issues) {
      const campo = issue.path.join('.') || 'formulario';
      if (!errores[campo]) {
        errores[campo] = issue.message;
      }
    }
    return jsonResponse(
      { ok: false, error: 'Datos inválidos', detalles: errores },
      400
    );
  }

  const data = resultado.data;

  if (data.sitio_web.trim() !== '') {
    return respuestaExitosa();
  }

  const { data: existente, error: errorConsulta } = await supabase
    .from('leads')
    .select('id')
    .eq('nombre_negocio', data.nombre_negocio)
    .eq('zona_barrio', data.zona_barrio)
    .eq('contacto_directo', data.contacto_directo)
    .maybeSingle();

  if (errorConsulta) {
    console.error('Error al consultar leads en /api/inscripcion');
    return jsonResponse(
      { ok: false, error: 'Ocurrió un error. Intenta de nuevo más tarde.' },
      500
    );
  }

  if (existente) {
    return respuestaExitosa();
  }

  const { error: errorInsercion } = await supabase.from('leads').insert({
    nombre_negocio: data.nombre_negocio,
    tipo_negocio: data.tipo_negocio,
    zona_barrio: data.zona_barrio,
    nombre_contacto: data.nombre_contacto,
    rol_contacto: data.rol_contacto,
    contacto_directo: data.contacto_directo,
    autorizacion_datos: data.autorizacion_datos,
    fecha_autorizacion: new Date().toISOString(),
    fuente: 'web_landing',
  });

  if (errorInsercion) {
    if (errorInsercion.code === '23505') {
      return respuestaExitosa();
    }
    console.error('Error al insertar lead en /api/inscripcion');
    return jsonResponse(
      { ok: false, error: 'Ocurrió un error. Intenta de nuevo más tarde.' },
      500
    );
  }

  return respuestaExitosa();
};
