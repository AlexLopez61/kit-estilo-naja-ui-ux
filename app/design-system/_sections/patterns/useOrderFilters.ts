'use client';

import { useMemo, useState } from 'react';

import { isOpenStatus, ORDERS, type Order } from './data';

export type Pipeline = 'todas' | 'abiertas' | 'cerradas';

/**
 * Estado local de la toolbar de M1/M2 (en la app real vive en la URL). El
 * buscador y los filtros filtran de verdad las filas.
 */
export function useOrderFilters(orders: Order[] = ORDERS) {
  const [query, setQuery] = useState('');
  const [pipeline, setPipeline] = useState<Pipeline>('todas');
  const [assignee, setAssignee] = useState<string | undefined>(undefined);
  const [kind, setKind] = useState<string | undefined>(undefined);

  const counts = useMemo(() => {
    const abiertas = orders.filter((o) => isOpenStatus(o.status)).length;
    return { todas: orders.length, abiertas, cerradas: orders.length - abiertas };
  }, [orders]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (pipeline === 'abiertas' && !isOpenStatus(o.status)) return false;
      if (pipeline === 'cerradas' && isOpenStatus(o.status)) return false;
      if (assignee && o.assigneeId !== assignee) return false;
      if (kind && o.kind !== kind) return false;
      if (q && !`${o.title} ${o.client} ${o.folio}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [orders, query, pipeline, assignee, kind]);

  return {
    query,
    setQuery,
    pipeline,
    setPipeline,
    assignee,
    setAssignee,
    kind,
    setKind,
    counts,
    filtered,
  };
}

export type OrderFilters = ReturnType<typeof useOrderFilters>;
