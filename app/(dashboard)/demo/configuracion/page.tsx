import type { Metadata } from 'next';

import { DemoConfiguracion } from '../_components/DemoConfiguracion';

export const metadata: Metadata = { title: 'Configuración · Kit' };

/** M10 · Página de configuración. */
export default function Page() {
  return <DemoConfiguracion />;
}
