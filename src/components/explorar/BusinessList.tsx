import { useState } from 'react';

type Categoria =
  | 'Todos'
  | 'Almuerzo'
  | 'Café y trabajo'
  | 'Algo rápido' | 'Panadería'
  | 'Tardeo';

type Negocio = {
  id: string;
  nombre: string;
  categoria: Categoria;
  barrio: string;
  tiempoCaminando: string;
  operativo: boolean;
  ofertaDelMomento: string;
  precioRango: string;
};

type Filtros = {
  categoria: Categoria;
  busqueda: string;
  proximidad: string;
};

const negociosIniciales: Negocio[] = [
  {
    id: '1',
    nombre: 'Restaurante Ejemplo 1',
    categoria: 'Almuerzo',
    barrio: 'El Cable',
    tiempoCaminando: '8 min',
    operativo: true,
    ofertaDelMomento: 'Menú del día disponible',
    precioRango: '$8.000 - $15.000',
  },
  {
    id: '2',
    nombre: 'Restaurante Ejemplo 2',
    categoria: 'Café y trabajo',
    barrio: 'Chipre',
    tiempoCaminando: '12 min',
    operativo: true,
    ofertaDelMomento: 'Café y bollería',
    precioRango: '$5.000 - $12.000',
  },
  {
    id: '3',
    nombre: 'Restaurante Ejemplo 3',
    categoria: 'Almuerzo',
    barrio: 'El Cable',
    tiempoCaminando: '5 min',
    operativo: true,
    ofertaDelMomento: 'Plato del día',
    precioRango: '$7.000 - $14.000',
  },
  {
    id: '4',
    nombre: 'Restaurante Ejemplo 4',
    categoria: 'Tardeo',
    barrio: 'Centro',
    tiempoCaminando: '15 min',
    operativo: true,
    ofertaDelMomento: 'Tapas y copas',
    precioRango: '$6.000 - $13.000',
  },
  {
    id: '5',
    nombre: 'Restaurante Ejemplo 5',
    categoria: 'Café y trabajo',
    barrio: 'Palermo',
    tiempoCaminando: '10 min',
    operativo: false,
    ofertaDelMomento: 'Cerrado momentáneamente',
    precioRango: '$9.000 - $18.000',
  },
  {
    id: '6',
    nombre: 'Restaurante Ejemplo 6',
    categoria: 'Almuerzo',
    barrio: 'Centro',
    tiempoCaminando: '6 min',
    operativo: true,
    ofertaDelMomento: 'Menú ejecutiva',
    precioRango: '$8.000 - $16.000',
  },
];

function BusinessList() {
  const [filtros, setFiltros] = useState<Filtros>({
    categoria: 'Todos',
    busqueda: '',
    proximidad: 'A menos de 10 min',
  });

  const [vista, setVista] = useState<'comensal' | 'negocio'>('comensal');

  const negociosFiltrados = negociosIniciales.filter((negocio) => {
    const coincideCategoria =
      filtros.categoria === 'Todos' || negocio.categoria === filtros.categoria;
    const coincideBusqueda =
      negocio.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      negocio.ofertaDelMomento.toLowerCase().includes(filtros.busqueda.toLowerCase());
    const coincideProximidad =
      filtros.proximidad === 'A menos de 10 min'
        ? parseInt(negocio.tiempoCaminando) <= 10
        : filtros.proximidad === 'A menos de 20 min'
        ? parseInt(negocio.tiempoCaminando) <= 20
        : true;

    return coincideCategoria && coincideBusqueda && coincideProximidad;
  });

  const categoriasUnicas = ['Todos', ...new Set(negociosIniciales.map((n) => n.categoria))];

  return (
    <section
      className="business-list"
      style={{
        maxWidth: 'var(--max-width)',
        margin: '0 auto var(--spacing-xl)',
      }}
    >
      <div className="filtros-bar" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div className="filtro-grupo" style={{ marginRight: 'var(--spacing-md)' }}>
          <label className="filtro-etiqueta" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 'var(--spacing-xs)' }}>
            Categoría
          </label>
          <select
            className="filtro-select"
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--border-radius)',
              color: 'var(--color-text)',
              background: 'var(--color-background)',
            }}
            value={filtros.categoria}
            onChange={(e) =>
              setFiltros((prev) => ({ ...prev, categoria: e.target.value as Categoria }))
            }
          >
            {categoriasUnicas.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filtro-grupo" style={{ marginRight: 'var(--spacing-md)' }}>
          <label className="filtro-etiqueta" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 'var(--spacing-xs)' }}>
            Búsqueda
          </label>
          <input
            type="text"
            className="filtro-input"
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--border-radius)',
              color: 'var(--color-text)',
              background: 'var(--color-background)',
              width: '280px',
            }}
            value={filtros.busqueda}
            onChange={(e) =>
              setFiltros((prev) => ({ ...prev, busqueda: e.target.value }))
            }
            placeholder="Nombre o antojo..."
            aria-placeholder="Nombre o antojo..."
          />
        </div>

        <div className="filtro-grupo">
          <label className="filtro-etiqueta" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 'var(--spacing-xs)' }}>
            Cercanía
          </label>
          <select
            className="filtro-select"
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--border-radius)',
              color: 'var(--color-text)',
              background: 'var(--color-background)',
            }}
            value={filtros.proximidad}
            onChange={(e) =>
              setFiltros((prev) => ({ ...prev, proximidad: e.target.value }))
            }
          >
            <option value="A menos de 10 min">A menos de 10 min</option>
            <option value="A menos de 20 min">A menos de 20 min</option>
            <option value="Cualquier distancia">Cualquier distancia</option>
          </select>
        </div>
      </div>

      <ul className="lista-negocios" style={{ listStyle: 'none', padding: 0 }}>
        {negociosFiltrados.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--spacing-lg)' }}>
            No hay negocios con estos filtros. Intenta cambiar la categoría o la cercanía.
          </p>
        ) : (
          negociosFiltrados.map((negocio) => (
            <li
              key={negocio.id}
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--border-radius-lg)',
                padding: 'var(--spacing-lg)',
                marginBottom: 'var(--spacing-md)',
                transition: 'border-color var(--transition-fast)',
              }}
            >
              <div className="negocio-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--spacing-sm)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-secondary)', margin: 0 }}>
                  {negocio.nombre}
                </h3>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  background: 'rgba(238, 108, 53, 0.1)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--border-radius)',
                }}>
                  {negocio.operativo ? 'Abierto ahora' : 'Cerrado'}
                </span>
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: '0.25rem 0' }}>
                {negocio.barrio} · {negocio.tiempoCaminando} caminando
              </p>

              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: '0.25rem 0' }}>
                {negocio.ofertaDelMomento}
              </p>

              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: '0' }}>
                {negocio.precioRango}
              </p>

              <button
                className="btn"
                style={{
                  width: '100%',
                  marginTop: 'var(--spacing-sm)',
                  background: 'var(--color-primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 'var(--border-radius)',
                  padding: 'var(--spacing-sm) var(--spacing-lg)',
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                Ver detalle
              </button>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}

export { BusinessList };