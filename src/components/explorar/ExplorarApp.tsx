import { useMemo, useState } from 'react';
import './explorar.css';

type Categoria = 'Restaurante' | 'Cafetería' | 'Comida rápida';
type EstadoLocal = 'Disponible' | 'Pocas mesas' | 'Cerrando pronto';
type Vista = 'comensal' | 'negocio';
type Tono = 'ok' | 'aviso' | 'cerrado';

interface Negocio {
  id: number;
  nombre: string;
  categoria: Categoria;
  zona: string;
  minutos: number;
  detalle: string;
  precioMin: number;
  precioMax: number;
  abierto: boolean;
  imagen?: string; // ruta opcional, por ejemplo "/explorar/negocio-1.jpg"
}

interface Badge {
  texto: string;
  tono: Tono;
}

// Datos de ejemplo FICTICIOS. No representan negocios reales.
const NEGOCIOS: Negocio[] = [
  { id: 1, nombre: 'Restaurante Ejemplo 1', categoria: 'Restaurante', zona: 'El Cable', minutos: 8, detalle: 'Menú del día disponible', precioMin: 8000, precioMax: 15000, abierto: true },
  { id: 2, nombre: 'Cafetería Ejemplo 2', categoria: 'Cafetería', zona: 'Chipre', minutos: 12, detalle: 'Café y postre del día', precioMin: 5000, precioMax: 12000, abierto: true },
  { id: 3, nombre: 'Restaurante Ejemplo 3', categoria: 'Restaurante', zona: 'El Cable', minutos: 5, detalle: 'Plato del día', precioMin: 7000, precioMax: 14000, abierto: true },
  { id: 4, nombre: 'Comida rápida Ejemplo 4', categoria: 'Comida rápida', zona: 'Centro', minutos: 14, detalle: 'Combo del día', precioMin: 10000, precioMax: 20000, abierto: true },
  { id: 5, nombre: 'Restaurante Ejemplo 5', categoria: 'Restaurante', zona: 'Palermo', minutos: 10, detalle: 'Cerrado momentáneamente', precioMin: 9000, precioMax: 18000, abierto: false },
  { id: 6, nombre: 'Restaurante Ejemplo 6', categoria: 'Restaurante', zona: 'Centro', minutos: 6, detalle: 'Menú ejecutiva', precioMin: 8000, precioMax: 16000, abierto: true },
];

const ID_PROPIO = 1; // el negocio que "administra" la vista Negocio
const ESTADOS: EstadoLocal[] = ['Disponible', 'Pocas mesas', 'Cerrando pronto'];

function cop(n: number): string {
  return '$' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/* ---------- Piezas visuales ---------- */

function IconoLupa() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#14323F" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" />
    </svg>
  );
}

function IconoPin() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#F26B38" aria-hidden="true">
      <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
    </svg>
  );
}

function Ilustracion({ categoria }: { categoria: Categoria }) {
  return (
    <svg
      className="ex-ilus"
      viewBox="0 0 160 120"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={'Ilustración de ejemplo: ' + categoria}
    >
      <rect width="160" height="120" fill="#FFF4E6" />
      <circle cx="136" cy="20" r="28" fill="#FFC857" opacity="0.55" />
      <circle cx="20" cy="108" r="32" fill="#F26B38" opacity="0.18" />

      {categoria === 'Restaurante' && (
        <g>
          <circle cx="80" cy="62" r="34" fill="#FFFFFF" stroke="#14323F" strokeWidth="4" />
          <circle cx="80" cy="62" r="20" fill="#F26B38" />
          <line x1="30" y1="34" x2="30" y2="92" stroke="#14323F" strokeWidth="4" strokeLinecap="round" />
          <line x1="130" y1="34" x2="130" y2="92" stroke="#14323F" strokeWidth="4" strokeLinecap="round" />
        </g>
      )}

      {categoria === 'Cafetería' && (
        <g>
          <rect x="50" y="48" width="56" height="44" rx="10" fill="#14323F" />
          <path d="M106 58 h8 a10 10 0 0 1 0 20 h-8" fill="none" stroke="#14323F" strokeWidth="5" />
          <rect x="44" y="94" width="70" height="6" rx="3" fill="#F26B38" />
          <path d="M68 40 q-6 -8 0 -16 M84 40 q-6 -8 0 -16" fill="none" stroke="#F26B38" strokeWidth="4" strokeLinecap="round" />
        </g>
      )}

      {categoria === 'Comida rápida' && (
        <g>
          <rect x="44" y="34" width="72" height="26" rx="13" fill="#F26B38" />
          <rect x="40" y="62" width="80" height="8" rx="4" fill="#FFC857" />
          <rect x="44" y="72" width="72" height="14" rx="7" fill="#14323F" />
          <rect x="44" y="88" width="72" height="16" rx="8" fill="#F26B38" />
        </g>
      )}
    </svg>
  );
}

function Pin({ x, y }: { x: number; y: number }) {
  return (
    <g transform={'translate(' + x + ',' + y + ')'}>
      <path d="M0 0 C-10 -12 -14 -18 -14 -25 A14 14 0 0 1 14 -25 C14 -18 10 -12 0 0 Z" fill="#F26B38" />
      <circle cx="0" cy="-25" r="5" fill="#FFF4E6" />
    </g>
  );
}

/* Espacio reservado para el minimapa. Cuando exista el mapa real, solo se cambia este componente. */
function MapaSlot() {
  return (
    <aside className="ex-map" aria-label="Espacio del mapa">
      <div className="ex-map-head">
        <h2 className="ex-map-title">Mapa cercano</h2>
        <span className="ex-tag">Próximamente</span>
      </div>
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Vista previa de ejemplo del mapa">
        <rect width="400" height="300" fill="#FFF4E6" />
        <rect x="20" y="20" width="110" height="80" rx="8" fill="#F3E6D2" />
        <rect x="150" y="20" width="90" height="80" rx="8" fill="#F3E6D2" />
        <rect x="260" y="20" width="120" height="80" rx="8" fill="#F3E6D2" />
        <rect x="20" y="130" width="110" height="70" rx="8" fill="#F3E6D2" />
        <rect x="150" y="130" width="230" height="70" rx="8" fill="#F3E6D2" />
        <rect x="20" y="230" width="200" height="50" rx="8" fill="#F3E6D2" />
        <rect x="240" y="230" width="140" height="50" rx="8" fill="#F3E6D2" />
        <path d="M0 115 H400 M140 0 V300 M250 0 V300 M0 215 H400" stroke="#FFFFFF" strokeWidth="10" fill="none" />
        <Pin x={75} y={85} />
        <Pin x={195} y={120} />
        <Pin x={310} y={90} />
        <Pin x={90} y={200} />
        <Pin x={290} y={215} />
      </svg>
      <p className="ex-map-note">Vista previa de ejemplo. Aquí se verán los negocios cercanos.</p>
    </aside>
  );
}

function Tarjeta({ negocio, badge, detalle }: { negocio: Negocio; badge: Badge; detalle: string }) {
  return (
    <article className="ex-card">
      <div className="ex-media">
        {negocio.imagen ? (
          <img src={negocio.imagen} alt={'Foto de ' + negocio.nombre} loading="lazy" />
        ) : (
          <Ilustracion categoria={negocio.categoria} />
        )}
        <span className="ex-badge" data-tono={badge.tono}>{badge.texto}</span>
      </div>
      <div className="ex-body">
        <h3 className="ex-name">{negocio.nombre}</h3>
        <p className="ex-meta">
          <IconoPin />
          <span>{negocio.zona} · {negocio.minutos} min caminando</span>
        </p>
        <p className="ex-detail">{detalle}</p>
        <div className="ex-card-foot">
          <span className="ex-price">{cop(negocio.precioMin)} - {cop(negocio.precioMax)}</span>
          <button type="button" className="ex-btn-sec">Ver detalle</button>
        </div>
      </div>
    </article>
  );
}

/* ---------- Componente principal ---------- */

export default function ExplorarApp() {
  const [vista, setVista] = useState<Vista>('comensal');

  // Filtros de la vista comensal
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState<'Todas' | Categoria>('Todas');
  const [cercania, setCercania] = useState(0); // 0 = cualquiera

  // Estado del negocio de ejemplo, compartido entre las dos vistas
  const [visible, setVisible] = useState(true);
  const [estadoLocal, setEstadoLocal] = useState<EstadoLocal>('Disponible');
  const [borrador, setBorrador] = useState('');
  const [promo, setPromo] = useState('');

  function badgeDe(n: Negocio): Badge {
    if (n.id === ID_PROPIO) {
      if (estadoLocal === 'Disponible') return { texto: 'Abierto ahora', tono: 'ok' };
      return { texto: estadoLocal, tono: 'aviso' };
    }
    return n.abierto ? { texto: 'Abierto ahora', tono: 'ok' } : { texto: 'Cerrado', tono: 'cerrado' };
  }

  function detalleDe(n: Negocio): string {
    if (n.id === ID_PROPIO && promo) return 'Promo: ' + promo;
    return n.detalle;
  }

  const lista = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return NEGOCIOS.filter((n) => {
      if (n.id === ID_PROPIO && !visible) return false;
      if (categoria !== 'Todas' && n.categoria !== categoria) return false;
      if (cercania > 0 && n.minutos > cercania) return false;
      if (q && !(n.nombre + ' ' + n.detalle + ' ' + n.zona).toLowerCase().includes(q)) return false;
      return true;
    });
  }, [busqueda, categoria, cercania, visible]);

  const propio = NEGOCIOS[0];

    function aplicarPromo(e: { preventDefault: () => void }) {
    e.preventDefault();
    setPromo(borrador.trim());
  }

  return (
    <div className="ex-app">
      {/* Barra de sesión */}
      <div className="ex-bar">
        <div className="ex-user">
          <div className="ex-avatar" aria-hidden="true">M</div>
          <div>
            <p className="ex-hello">Hola, Mateo</p>
            <p className="ex-zone">Zona El Cable, Manizales</p>
          </div>
        </div>
        <div className="ex-seg" role="group" aria-label="Cambiar de vista">
          <button type="button" aria-pressed={vista === 'comensal'} onClick={() => setVista('comensal')}>
            Vista Comensal
          </button>
          <button type="button" aria-pressed={vista === 'negocio'} onClick={() => setVista('negocio')}>
            Vista Negocio
          </button>
        </div>
      </div>

      {vista === 'comensal' ? (
        <>
          <div className="ex-filters">
            <div className="ex-search">
              <IconoLupa />
              <input
                type="search"
                aria-label="Buscar por nombre o antojo"
                placeholder="Nombre o antojo..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <select
              aria-label="Categoría"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as 'Todas' | Categoria)}
            >
              <option value="Todas">Todas las categorías</option>
              <option value="Restaurante">Restaurante</option>
              <option value="Cafetería">Cafetería</option>
              <option value="Comida rápida">Comida rápida</option>
            </select>
            <select
              aria-label="Cercanía"
              value={cercania}
              onChange={(e) => setCercania(Number(e.target.value))}
            >
              <option value={0}>Cualquier distancia</option>
              <option value={10}>A menos de 10 min</option>
              <option value={15}>A menos de 15 min</option>
            </select>
          </div>

          <div className="ex-grid">
            <MapaSlot />
            <div className="ex-list">
              {lista.length === 0 ? (
                <div className="ex-empty">
                  No encontramos negocios con esos filtros. Prueba con otra categoría o más cercanía.
                </div>
              ) : (
                lista.map((n) => (
                  <Tarjeta key={n.id} negocio={n} badge={badgeDe(n)} detalle={detalleDe(n)} />
                ))
              )}
            </div>
          </div>
        </>
      ) : (
        <section className="ex-panel" aria-label="Panel del negocio">
          <div className="ex-panel-head">
            <div>
              <h2>Panel del negocio</h2>
              <p className="ex-sub">{propio.nombre} · {propio.zona}</p>
            </div>
            <span className="ex-tag">Prototipo</span>
          </div>

          <div className="ex-switch-row">
            <div>
              <p className="ex-block-title">Visible para clientes cercanos</p>
              <p className="ex-sub">Si lo apagas, tu negocio no aparece en la Vista Comensal.</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={visible}
              aria-label="Visible para clientes cercanos"
              className="ex-switch"
              onClick={() => setVisible(!visible)}
            />
          </div>

          <div>
            <p className="ex-block-title">Estado del local</p>
            <div className="ex-seg" role="group" aria-label="Estado del local">
              {ESTADOS.map((e) => (
                <button key={e} type="button" aria-pressed={estadoLocal === e} onClick={() => setEstadoLocal(e)}>
                  {e}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={aplicarPromo}>
            <p className="ex-block-title">Plato o promoción del momento</p>
            <div className="ex-promo-row">
              <input
                type="text"
                aria-label="Plato o promoción del momento"
                placeholder="Ej. Menú del día con jugo incluido"
                maxLength={80}
                value={borrador}
                onChange={(e) => setBorrador(e.target.value)}
              />
              <button type="submit" className="ex-btn-pri">Actualizar ahora</button>
            </div>
          </form>

          <div className="ex-preview">
            <p className="ex-block-title">Así lo ven los comensales</p>
            {visible ? (
              <Tarjeta negocio={propio} badge={badgeDe(propio)} detalle={detalleDe(propio)} />
            ) : (
              <p className="ex-sub">Tu negocio está oculto. Activa «Visible» para que aparezca.</p>
            )}
          </div>

          <div>
            <p className="ex-block-title">Interacciones de tu perfil (ejemplo)</p>
            <div className="ex-metrics">
              <div className="ex-metric">
                <p className="ex-metric-num">128</p>
                <p className="ex-metric-label">Vistas del perfil</p>
                <span className="ex-tag">Dato simulado</span>
              </div>
              <div className="ex-metric">
                <p className="ex-metric-num">34</p>
                <p className="ex-metric-label">Clics en «llamar»</p>
                <span className="ex-tag">Dato simulado</span>
              </div>
              <div className="ex-metric">
                <p className="ex-metric-num">21</p>
                <p className="ex-metric-label">Clics en «cómo llegar»</p>
                <span className="ex-tag">Dato simulado</span>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
