'use client';

/**
 * M1 · Lista plana (estilo deployments): toolbar fuera del marco + card nivel
 * 3 con la tabla + `TableFooter` con conteo y total. El buscador (atajo «F»)
 * y los filtros filtran de verdad las filas.
 */

import { DetailCard } from '@/components/shared/DetailCard';

import { OrderRow, OrdersEmpty, OrdersTableFooter, OrdersTableHead } from './OrdersTable';
import { OrdersToolbar } from './OrdersToolbar';
import { useOrderFilters } from './useOrderFilters';

export function FlatListDemo() {
  const filters = useOrderFilters();
  return (
    <div className="space-y-4">
      <OrdersToolbar filters={filters} shortcut />
      <DetailCard className="overflow-hidden">
        <OrdersTableHead density="full" />
        {filters.filtered.length === 0 ? (
          <OrdersEmpty />
        ) : (
          filters.filtered.map((order, i) => (
            <OrderRow key={order.id} order={order} index={i} density="full" />
          ))
        )}
        <OrdersTableFooter orders={filters.filtered} />
      </DetailCard>
    </div>
  );
}
