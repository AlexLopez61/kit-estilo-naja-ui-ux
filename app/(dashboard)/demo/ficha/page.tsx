import * as React from 'react';
import type { Metadata } from 'next';

import { DemoFicha } from '../_components/DemoFicha';

export const metadata: Metadata = { title: 'Ficha · Kit' };

/** M4 · Ficha en página con tabs en `?tab=` (por eso el `Suspense`). */
export default function Page() {
  return (
    <React.Suspense fallback={null}>
      <DemoFicha />
    </React.Suspense>
  );
}
