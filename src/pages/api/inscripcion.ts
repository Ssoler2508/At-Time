import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
import { leadSchema } from '../../lib/validation';
import { lead as leadType } from '@/types/lead';

export const prerender = false;

export const POST = async (ctx: { request: Request }) => {
  const body = await ctx.request.text();

  // Honeypot: si alguien envía el campo oculto sitoweb, responder 200 sin guardar
  const formData = new FormData();
  // body es texto crudo; intentaremos parsearlo como FormData más abajo.
  // Pero primero, chequear si el body crudo contiene "sitoweb" o "web" como campo oculto.
  // Para simplificar, intentaremos parsear y validar.

  try {
    const fd = new FormData();
    // Si el body viene como application/x-www-form-urlencoded
    if (body && body.includes('sitoweb')) {
      // Campo honeypot presente -> responder 200 sin guardar nada
      return new Response(
        JSON.stringify({ ok: true, mensaje: 'Solicitud procesada' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Parsear fields del body
    const fields = new URLSearchParams(body as string);
    const sitoweb = fields.get('sitoweb');
    if (sitoweb && sitoweb.trim() !== '') {
      // Honeypot lleno -> 200 sin guardar
      return new Response(
        JSON.stringify({ ok: true, mensaje: 'Solicitud procesada' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Los campos del formulario
    const nombre_negocio = fields.get('nombre_negocio');
    const tipo_negocio = fields.get('tipo_negocio');
    const zona_barrio = fields.get('zona_barrio');
    const nombre_contacto = fields.get('nombre_contacto');
    const rol_contacto = fields.get('rol_contacto');
    const contacto_directo = fields.get('contacto_directo');
    const autorizacion_datos = fields.get('autorizacion_datos');

    // Validar con Zod usando el schema compartido
    const result = leadSchema.safeParse({
      nombre_negocio,
      tipo_negocio,
      zona_barrio,
      nombre_contacto,
      rol_contacto,
      contacto_directo,
      autorizacion_datos: autorizacion_datos ? true : false,
    });

    if (!result.success) {
      const errores: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        let msg = issue.message;
        // Traducir mensajes a español CO si es necesario
        if (!msg || msg.includes('must')) {
          msg = 'Campo inválido';
        }
        errores[path] = msg;
      });
      return new Response(
        JSON.stringify({ ok: false, error: 'Datos inválidos', detalles: errores }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const data = result.data;

    // Insertar con service role - servidor pone fecha_autorizacion = now()
    // y fuente = 'web_landing'
    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        nombre_negocio: data.nombre_negocio,
        tipo_negocio: data.tipo_negocio,
        zona_barrio: data.zona_barrio,
        nombre_contacto: data.nombre_contacto,
        rol_contacto: data.rol_contacto,
        contacto_directo: data.contacto_directo,
        autorizacion_datos: data.autorizacion_datos,
        fecha_autorizacion: new Date(),
        fuente: 'web_landing',
      })
      .select()
      .single();

    if (error) {
      // Código 23505 = violación de único (índice que creamos)
      // Tratar como éxito (duplicado no revelado)
      if (error.code === '23505') {
        return new Response(
          JSON.stringify({ ok: true, mensaje: 'Inscripción procesada' }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
      // Errores de BD genéricos
      console.error('Error de base de datos (no mostrar datos personales)');
      return new Response(
        JSON.stringify({ ok: false, error: 'Error del servidor' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Éx: no revelar datos en respuesta, solo ok
    return new Response(
      JSON.stringify({ ok: true, mensaje: 'Inscripción procesada' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (e) {
    // Error inesperado
    console.error('Error inesperado en /api/inscripcion');
    return new Response(
      JSON.stringify({ ok: false, error: 'Error del servidor' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};