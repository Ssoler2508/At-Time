import { useState, useEffect } from 'react';

type EstadoLocal = 'Disponible' | 'Pocas mesas' | 'Cerrando pronto';

interface BusinessPanelProps {
  vistaActual: 'comensal' | 'negocio';
}

function BusinessPanel({ vistaActual }: BusinessPanelProps) {
  const [visibleParaClientes, setVisibleParaClientes] = useState(true);
  const [estadoLocal, setEstadoLocal] = useState<EstadoLocal>('Disponible');
  const [platoDelMomento, setPlatoDelMomento] = useState<string>('');
  const [ultimaActualizacao, setUltimaActualizacao] = useState<Date | null>(null);
  const [metricas, setMetricas] = useState<string>('Dato simulado: —');

  useEffect(() => {
    const intervalo = setInterval(() => {
      setUltimaActualizacao(new Date());
      setMetricas(`42 personas cerca vieron tu perfil hoy · 9 indicaron que van en camino`);
    }, 10000);

    return () => clearInterval(intervalo);
  }, []);

  const actualizarPlato = () => {
    const promos = [
      'Tapas de temporada y copa $9.500',
      'Menú del día $18.500',
      'Bocadillo de queso recién horneado',
      'Café single origin y trabajo',
    ];
    const indice = Math.floor(Math.random() * promos.length);
    const nuevaPromo = promos[indice];
    setPlatoDelMomento(nuevaPromo);
    setMetricas(`Dato simulado: 42 personas cerca vieron tu perfil hoy · 9 indicaron que van en camino`);
  };

  useEffect(() => {
    if (vistaActual === 'negocio') {
      actualizarPlato();
    }
  }, [vistaActual]);

  return (
    <section
      className="business-panel"
      style={{
        maxWidth: 'var(--max-width)',
        margin: '0 auto var(--spacing-xl)',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--border-radius-lg)',
        padding: 'var(--spacing-xl)',
      }}
    >
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-secondary)', marginBottom: 'var(--spacing-xl)' }}>
        Panel del negocio
      </h2>

      <div className="panel-seccion" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <label className="panel-etiqueta" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 'var(--spacing-sm)' }}>
          Visible para clientes cercanos
        </label>
        <label className="panel-interruptor" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--spacing-sm)',
          padding: 'var(--spacing-sm) var(--spacing-md)',
          background: visibleParaClientes ? 'rgba(30, 126, 78, 0.15)' : 'rgba(200, 50, 50, 0.15)',
          border: `1px solid ${visibleParaClientes ? 'var(--color-success)' : 'var(--color-error)'}`,
          borderRadius: 'var(--border-radius)',
          cursor: 'pointer',
        }}>
          <input
            type="checkbox"
            checked={visibleParaClientes}
            onChange={() => setVisibleParaClientes((ant) => !ant)}
            style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--color-primary)' }}
          />
          <span>Activar ahora</span>
        </label>
      </div>

      <div className="panel-seccion" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <label className="panel-etiqueta" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 'var(--spacing-sm)' }}>
          Estado del local
        </label>
        <div className="panel-estados" style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-sm)' }}>
          <label className="panel-estado" style={{
            flex: 1,
            padding: 'var(--spacing-sm)',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--color-text)',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--border-radius)',
            textAlign: 'center',
            cursor: 'pointer',
          }}
          onClick={() => setEstadoLocal('Disponible')}
          >
            Disponible
          </label>
          <label className="panel-estado" style={{
            flex: 1,
            padding: 'var(--spacing-sm)',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--color-text)',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--border-radius)',
            textAlign: 'center',
            cursor: 'pointer',
          }}
          onClick={() => setEstadoLocal('Pocas mesas')}
          >
            Pocas mesas
          </label>
          <label className="panel-estado" style={{
            flex: 1,
            padding: 'var(--spacing-sm)',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--color-text)',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--border-radius)',
            textAlign: 'center',
            cursor: 'pointer',
          }}
          onClick={() => setEstadoLocal('Cerrando pronto')}
          >
            Cerrando pronto
          </label>
        </div>
      </div>

      <div className="panel-seccion" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <label className="panel-etiqueta" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 'var(--spacing-sm)' }}>
          Plato o promoción del momento
        </label>
        <input
          type="text"
          className="panel-input"
          style={{
            width: '100%',
            padding: 'var(--spacing-sm) var(--spacing-md)',
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--border-radius)',
            color: 'var(--color-text)',
            background: 'var(--color-background)',
            marginBottom: 'var(--spacing-sm)',
          }}
          value={platoDelMomento}
          onChange={(e) => setPlatoDelMomento(e.target.value)}
          placeholder="Ej. Tapas de temporada y copa $9.500"
          aria-placeholder="Ej. Tapas de temporada y copa $9.500"
        />
        <button
          className="btn"
          style={{
            width: '100%',
            background: 'var(--color-accent)',
            color: '#102B38',
            border: 'none',
            borderRadius: 'var(--border-radius)',
            padding: 'var(--spacing-sm) var(--spacing-lg)',
            fontFamily: 'var(--font-headline)',
            fontWeight: 700,
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
          onClick={actualizarPlato}
        >
          Actualizar ahora
        </button>
      </div>

      {ultimaActualizacao && (
        <div className="panel-metricas" style={{
          marginTop: 'var(--spacing-xl)',
          paddingTop: 'var(--spacing-md)',
          borderTop: '1px solid var(--color-border)',
          fontSize: '0.875rem',
          color: 'var(--color-text-muted)',
        }}>
          <p style={{ margin: '0 0 var(--spacing-sm)' }}>Actualizado {new Date().toLocaleTimeString('es-CO')}</p>
          <p>{metricas}</p>
        </div>
      )}
    </section>
  );
}

export { BusinessPanel };
