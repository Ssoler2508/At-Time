import { useState } from 'react';
import { SessionBar } from './SessionBar';
import { BusinessList } from './BusinessList';
import { BusinessPanel } from './BusinessPanel';

const UBICACIONES_MANIZALES = [
  { id: 'cable', nombre: 'El Cable', distanciaBase: 0 },
  { id: 'palermo', nombre: 'Palermo', distanciaBase: 5 },
  { id: 'centro', nombre: 'Centro', distanciaBase: 12 },
  { id: 'chipre', nombre: 'Chipre', distanciaBase: 18 },
];

export function ExplorarView() {
  const [vistaActual, setVistaActual] = useState<'comensal' | 'negocio'>('comensal');

  return (
    <>
      <SessionBar
        ubicaciones={UBICACIONES_MANIZALES as any}
        vistaActual={vistaActual}
        setVistaActual={setVistaActual}
      />
      <section className="contenido-explorar">
        {vistaActual === 'comensal' && <BusinessList />}
        <BusinessPanel vistaActual={vistaActual} />
      </section>
    </>
  );
}