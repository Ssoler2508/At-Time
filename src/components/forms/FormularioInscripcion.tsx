import { useEffect, useRef, useState, type SubmitEvent } from 'react';
import {
  ROLES_CONTACTO,
  TIPOS_NEGOCIO,
  type InscripcionInput,
} from '../../lib/validation';

type MedioContacto = InscripcionInput['medio_contacto'];

type CampoFormulario =
  | 'nombre_negocio'
  | 'tipo_negocio'
  | 'zona_barrio'
  | 'nombre_contacto'
  | 'rol_contacto'
  | 'medio_contacto'
  | 'contacto_directo'
  | 'autorizacion_datos'
  | 'sitio_web';

const CAMPOS_EN_ORDEN: readonly CampoFormulario[] = [
  'nombre_negocio',
  'tipo_negocio',
  'zona_barrio',
  'nombre_contacto',
  'rol_contacto',
  'medio_contacto',
  'contacto_directo',
  'autorizacion_datos',
  'sitio_web',
];

const esCampoFormulario = (valor: string): valor is CampoFormulario =>
  (CAMPOS_EN_ORDEN as readonly string[]).includes(valor);

interface ValoresFormulario {
  nombre_negocio: string;
  tipo_negocio: string;
  zona_barrio: string;
  nombre_contacto: string;
  rol_contacto: string;
  medio_contacto: MedioContacto;
  contacto_directo: string;
  autorizacion_datos: boolean;
  sitio_web: string;
}

const VALORES_INICIALES: ValoresFormulario = {
  nombre_negocio: '',
  tipo_negocio: '',
  zona_barrio: '',
  nombre_contacto: '',
  rol_contacto: '',
  medio_contacto: 'whatsapp',
  contacto_directo: '',
  autorizacion_datos: false,
  sitio_web: '',
};

type ErroresFormulario = Partial<Record<CampoFormulario, string>>;

const MENSAJE_ERROR_GENERAL =
  'No pudimos enviar tu inscripción. Revisa tu conexión e inténtalo de nuevo.';

const leerDetallesDeError = (cuerpo: unknown): Record<string, string> => {
  if (typeof cuerpo !== 'object' || cuerpo === null) {
    return {};
  }

  const detalles = (cuerpo as { detalles?: unknown }).detalles;
  if (typeof detalles !== 'object' || detalles === null) {
    return {};
  }

  const salida: Record<string, string> = {};
  for (const [clave, valor] of Object.entries(
    detalles as Record<string, unknown>
  )) {
    if (typeof valor === 'string') {
      salida[clave] = valor;
    }
  }
  return salida;
};

interface ErrorCampoProps {
  id: CampoFormulario;
  mensaje?: string;
}

function ErrorCampo({ id, mensaje }: ErrorCampoProps) {
  return (
    <p className="campo-error" id={`${id}-error`} aria-live="polite">
      {mensaje}
    </p>
  );
}

interface CampoTextoProps {
  id: CampoFormulario;
  etiqueta: string;
  tipo: 'text' | 'tel' | 'email';
  valor: string;
  placeholder?: string;
  inputMode?: 'numeric' | 'email';
  mensajeError?: string;
  onCambio: (valor: string) => void;
  onReferencia: (elemento: HTMLElement | null) => void;
}

function CampoTexto({
  id,
  etiqueta,
  tipo,
  valor,
  placeholder,
  inputMode,
  mensajeError,
  onCambio,
  onReferencia,
}: CampoTextoProps) {
  const idError = `${id}-error`;
  return (
    <div className="campo">
      <label className="campo-etiqueta" htmlFor={id}>
        {etiqueta}
      </label>
      <input
        id={id}
        name={id}
        type={tipo}
        inputMode={inputMode}
        className="campo-control"
        value={valor}
        placeholder={placeholder}
        aria-invalid={mensajeError !== undefined}
        aria-describedby={mensajeError !== undefined ? idError : undefined}
        ref={onReferencia}
        onChange={(evento) => onCambio(evento.target.value)}
      />
      <ErrorCampo id={id} mensaje={mensajeError} />
    </div>
  );
}

export default function FormularioInscripcion() {
  const [valores, setValores] = useState<ValoresFormulario>(VALORES_INICIALES);
  const [errores, setErrores] = useState<ErroresFormulario>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);

  const referencias = useRef<
    Partial<Record<CampoFormulario, HTMLElement | null>>
  >({});
  const tarjetaRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    if (exito) {
      tarjetaRef.current?.focus();
    }
  }, [exito]);

  const asignarReferencia =
    (campo: CampoFormulario) =>
    (elemento: HTMLElement | null): void => {
      referencias.current[campo] = elemento;
    };

  const cambiarCampo = <K extends CampoFormulario>(
    campo: K,
    valor: ValoresFormulario[K]
  ): void => {
    setValores((previos) => {
      const siguientes: ValoresFormulario = { ...previos };
      siguientes[campo] = valor;
      return siguientes;
    });
    setErrores((previos) => {
      if (previos[campo] === undefined) {
        return previos;
      }
      const siguientes: ErroresFormulario = { ...previos };
      delete siguientes[campo];
      return siguientes;
    });
  };

  const reiniciar = (): void => {
    setValores(VALORES_INICIALES);
    setErrores({});
    setErrorGeneral(null);
    setExito(false);
    setEnviando(false);
    window.setTimeout(() => {
      referencias.current.nombre_negocio?.focus();
    }, 0);
  };

  const manejarEnvio = async (
    evento: SubmitEvent<HTMLFormElement>
  ): Promise<void> => {
    evento.preventDefault();
    if (enviando) {
      return;
    }

    setEnviando(true);
    setErrorGeneral(null);
    setErrores({});

    try {
      const respuesta = await fetch('/api/inscripcion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(valores),
      });

      if (respuesta.ok) {
        setExito(true);
        return;
      }

      if (respuesta.status === 400) {
        const detalles = leerDetallesDeError(
          await respuesta.json().catch(() => null)
        );
        const nuevosErrores: ErroresFormulario = {};

        for (const [campo, mensaje] of Object.entries(detalles)) {
          if (esCampoFormulario(campo)) {
            nuevosErrores[campo] = mensaje;
          }
        }

        setErrores(nuevosErrores);

        const primerConError = CAMPOS_EN_ORDEN.find(
          (campo) =>
            campo !== 'sitio_web' && nuevosErrores[campo] !== undefined
        );

        if (primerConError !== undefined) {
          referencias.current[primerConError]?.focus();
        } else {
          setErrorGeneral(MENSAJE_ERROR_GENERAL);
        }
        return;
      }

      setErrorGeneral(MENSAJE_ERROR_GENERAL);
    } catch {
      setErrorGeneral(MENSAJE_ERROR_GENERAL);
    } finally {
      setEnviando(false);
    }
  };

  if (exito) {
    return (
      <div className="inscripcion-tarjeta" role="status">
        <h2 className="inscripcion-tarjeta-titulo" tabIndex={-1} ref={tarjetaRef}>
          ¡Registro recibido!
        </h2>
        <p>Pronto nos pondremos en contacto para coordinar el piloto en Manizales.</p>
        <button type="button" className="btn btn-grande" onClick={reiniciar}>
          Registrar otro negocio
        </button>
      </div>
    );
  }

  const contactoEsWhatsApp = valores.medio_contacto === 'whatsapp';

  return (
    <form className="inscripcion-formulario" onSubmit={manejarEnvio} noValidate>
      <CampoTexto
        id="nombre_negocio"
        etiqueta="Nombre del negocio"
        tipo="text"
        valor={valores.nombre_negocio}
        mensajeError={errores.nombre_negocio}
        onCambio={(valor) => cambiarCampo('nombre_negocio', valor)}
        onReferencia={asignarReferencia('nombre_negocio')}
      />

      <div className="campo">
        <label className="campo-etiqueta" htmlFor="tipo_negocio">
          Tipo de negocio
        </label>
        <select
          id="tipo_negocio"
          name="tipo_negocio"
          className="campo-control"
          value={valores.tipo_negocio}
          aria-invalid={errores.tipo_negocio !== undefined}
          aria-describedby={
            errores.tipo_negocio !== undefined
              ? 'tipo_negocio-error'
              : undefined
          }
          ref={asignarReferencia('tipo_negocio')}
          onChange={(evento) => cambiarCampo('tipo_negocio', evento.target.value)}
        >
          <option value="">Selecciona una opción</option>
          {TIPOS_NEGOCIO.map((opcion) => (
            <option key={opcion} value={opcion}>
              {opcion}
            </option>
          ))}
        </select>
        <ErrorCampo id="tipo_negocio" mensaje={errores.tipo_negocio} />
      </div>

      <CampoTexto
        id="zona_barrio"
        etiqueta="Zona / barrio"
        tipo="text"
        valor={valores.zona_barrio}
        mensajeError={errores.zona_barrio}
        onCambio={(valor) => cambiarCampo('zona_barrio', valor)}
        onReferencia={asignarReferencia('zona_barrio')}
      />

      <CampoTexto
        id="nombre_contacto"
        etiqueta="Nombre de contacto"
        tipo="text"
        valor={valores.nombre_contacto}
        mensajeError={errores.nombre_contacto}
        onCambio={(valor) => cambiarCampo('nombre_contacto', valor)}
        onReferencia={asignarReferencia('nombre_contacto')}
      />

      <div className="campo">
        <label className="campo-etiqueta" htmlFor="rol_contacto">
          Rol en el negocio
        </label>
        <select
          id="rol_contacto"
          name="rol_contacto"
          className="campo-control"
          value={valores.rol_contacto}
          aria-invalid={errores.rol_contacto !== undefined}
          aria-describedby={
            errores.rol_contacto !== undefined
              ? 'rol_contacto-error'
              : undefined
          }
          ref={asignarReferencia('rol_contacto')}
          onChange={(evento) => cambiarCampo('rol_contacto', evento.target.value)}
        >
          <option value="">Selecciona una opción</option>
          {ROLES_CONTACTO.map((opcion) => (
            <option key={opcion} value={opcion}>
              {opcion}
            </option>
          ))}
        </select>
        <ErrorCampo id="rol_contacto" mensaje={errores.rol_contacto} />
      </div>

      <fieldset className="campo">
        <legend className="campo-etiqueta">Medio de contacto</legend>
        <div className="campo-radios">
          <label className="campo-radio">
            <input
              type="radio"
              name="medio_contacto"
              value="whatsapp"
              checked={contactoEsWhatsApp}
              aria-describedby={
                errores.medio_contacto !== undefined
                  ? 'medio_contacto-error'
                  : undefined
              }
              ref={asignarReferencia('medio_contacto')}
              onChange={() => cambiarCampo('medio_contacto', 'whatsapp')}
            />
            WhatsApp
          </label>
          <label className="campo-radio">
            <input
              type="radio"
              name="medio_contacto"
              value="correo"
              checked={!contactoEsWhatsApp}
              aria-describedby={
                errores.medio_contacto !== undefined
                  ? 'medio_contacto-error'
                  : undefined
              }
              onChange={() => cambiarCampo('medio_contacto', 'correo')}
            />
            Correo
          </label>
        </div>
        <ErrorCampo id="medio_contacto" mensaje={errores.medio_contacto} />
      </fieldset>

      <CampoTexto
        id="contacto_directo"
        etiqueta="Contacto directo"
        tipo={contactoEsWhatsApp ? 'tel' : 'email'}
        inputMode={contactoEsWhatsApp ? 'numeric' : 'email'}
        placeholder={
          contactoEsWhatsApp ? '+57 300 123 4567' : 'nombre@correo.com'
        }
        valor={valores.contacto_directo}
        mensajeError={errores.contacto_directo}
        onCambio={(valor) => cambiarCampo('contacto_directo', valor)}
        onReferencia={asignarReferencia('contacto_directo')}
      />

      <div className="campo">
        <label
          className="campo-etiqueta campo-etiqueta-checkbox"
          htmlFor="autorizacion_datos"
        >
          <input
            id="autorizacion_datos"
            name="autorizacion_datos"
            type="checkbox"
            checked={valores.autorizacion_datos}
            aria-invalid={errores.autorizacion_datos !== undefined}
            aria-describedby={
              errores.autorizacion_datos !== undefined
                ? 'autorizacion_datos-error'
                : undefined
            }
            ref={asignarReferencia('autorizacion_datos')}
            onChange={(evento) =>
              cambiarCampo('autorizacion_datos', evento.target.checked)
            }
          />
          <span>
            Autorizo a At Time a tratar mis datos personales y los de mi negocio
            para contactarme sobre el piloto y mejorar el servicio. Puedo
            consultar, corregir o pedir la eliminación de mis datos cuando
            quiera. Más información en la{' '}
            <a href="/privacidad" target="_blank" rel="noopener">
              política de tratamiento de datos
            </a>
            .
          </span>
        </label>
        <ErrorCampo
          id="autorizacion_datos"
          mensaje={errores.autorizacion_datos}
        />
      </div>

      <div className="campo-oculto" aria-hidden="true">
        <label htmlFor="sitio_web">Sitio web</label>
        <input
          id="sitio_web"
          name="sitio_web"
          type="text"
          value={valores.sitio_web}
          tabIndex={-1}
          autoComplete="off"
          ref={asignarReferencia('sitio_web')}
          onChange={(evento) => cambiarCampo('sitio_web', evento.target.value)}
        />
      </div>

      <div className="inscripcion-acciones">
        <p className="inscripcion-error-general" aria-live="polite">
          {errorGeneral}
        </p>
        <button
          type="submit"
          className="btn btn-grande"
          disabled={enviando}
        >
          {enviando ? 'Enviando...' : 'Inscribe tu negocio en el piloto'}
        </button>
      </div>
    </form>
  );
}
