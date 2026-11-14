import { useState } from 'react';

type Ubicacion = {
  nombre: string;
  barrio: string;
};

type Vista = 'comensal' | 'negocio';

interface SessionBarProps {
  ubicaciones: Ubicacion[];
  vistaActual: Vista;
  setVistaActual: (vista: Vista) => void;
}

function SessionBar({ ubicaciones, vistaActual, setVistaActual }: SessionBarProps) {
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState<Ubicacion | null>(
    ubicaciones[0]
  );

  return (
    <section
      class="session-bar"
      style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        padding: 'var(--spacing-lg) var(--spacing-md)',
        marginBottom: 'var(--spacing-xl)',
      }}
    >
      <div class="session-bar-container" style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
        <div class="session-bar-profile" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <span class="profile-name" style={{ fontWeight: 700, fontSize: '1rem' }}>
            Hola, Mateo
          </span>
          <span class="profile-zona" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Zona {ubicacionSeleccionada?.barrio ?? 'El Cable'}, Manizales
          </span>
        </div>

        <select
          class="ubicacion-selector"
          style={{
            padding: 'var(--spacing-sm) var(--spacing-md)',
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--border-radius)',
            color: 'var(--color-text)',
            background: 'var(--color-background)',
            cursor: 'pointer',
            appearance: 'none',
            backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns=%27http%3A//www.w3.org/2000/svg%27%20width=%2724%27%20height=%2724%27%20viewBox=%270%200%2024%2024%27%20fill=%27none%27%20stroke=%27%234A606A%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3E%3Cpath%20d=%27M6%20L19%20L12%20L6%27%2F%3E%3C%2Fsvg%22)',
            marginLeft: 'var(--spacing-sm)',
          }}
          onChange={(e) => {
            const idx = parseInt(e.target.value, 10);
            setUbicacionSeleccionada(ubicaciones[idx]);
          }}
        >
          {ubicaciones.map((ub, idx) => (
            <option key={ub.nombre} value={idx}>
              {ub.nombre}
            </option>
          ))}
        </select>

        <div class="vista-toggle" style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
          <button
            class="btn-toggle"
            style={{
              padding: 'var(--spacing-xs) var(--spacing-sm)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: vistaActual === 'comensal' ? 'var(--color-primary)' : 'var(--color-text)',
              background: vistaActual === 'comensal' ? 'rgba(238, 108, 53, 0.15)' : 'var(--color-surface)',
              border: `1px solid ${vistaActual === 'comensal' ? 'var(--color-primary)' : 'var(--color-border)'}`,
              borderRadius: 'var(--border-radius)',
              cursor: 'pointer',
            }}
            onClick={() => setVistaActual('comensal')}
          >
            Vista Comensal
          </button>
          <button
            class="btn-toggle"
            style={{
              padding: 'var(--spacing-xs) var(--spacing-sm)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: vistaActual === 'negocio' ? 'var(--color-primary)' : 'var(--color-text)',
              background: vistaActual === 'negocio' ? 'rgba(251, 195, 74, 0.15)' : 'var(--color-surface)',
              border: `1px solid ${vistaActual === 'negocio' ? 'var(--color-primary)' : 'var(--color-border)'}`,
              borderRadius: 'var(--border-radius)',
              cursor: 'pointer',
            }}
            onClick={() => setVistaActual('negocio')}
          >
            Vista Negocio
          </button>
        </div>
      </div>
    </section>
  );
}

export { SessionBar };

const ubicacionesPadra: Ubicacion[] = [
  { nombre: 'El Cable', barrio: 'El Cable' },
  { nombre: 'Chipre', barrio: 'Chipre' },
  { nombre: 'Palermo', barrio: 'Palermo' },
  { nombre: 'Centro', barrio: 'Centro' },
];