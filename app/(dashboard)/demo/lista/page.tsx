import * as React from 'react';
import type { Metadata } from 'next';

import { OrdersListView } from '../_components/OrdersListView';

export const metadata: Metadata = { title: 'Órdenes · Kit' };

/**
 * M1 + M2 + M3 · Lista + ficha en panel. La selección (`?ver=`) y los filtros
 * viven en la URL vía `useSearchParams`, por eso la vista va dentro de un
 * `Suspense` (requisito de Next para páginas estáticas).
 */
export default function Page() {
  return (
    <React.Suspense fallback={null}>
      <OrdersListView />
    </React.Suspense>
  );
}
