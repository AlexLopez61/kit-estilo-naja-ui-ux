'use client';

/**
 * Tabla estilo deployments (M1) sobre las primitivas del master de
 * `DetailPanel.tsx`: `TABLE_HEAD_CLASS` + `tableRowClass(selected, zebra)` +
 * `TableFooter`, con `SelectedStripe` en la fila activa. La densidad controla
 * las columnas visibles cuando la lista se comprime en M2:
 *
 *  - `full`     Orden · Cliente · Estado · Vence · Responsable · Monto
 *  - `compact`  Orden · Estado · Monto              (panel de 380/420 px)
 *  - `minimal`  Orden · Monto                       (panel `wide`)
 */

import { IconCircle } from '@/components/shared/DetailCard';
import { TABLE_HEAD_CLASS, TableFooter, tableRowClass } from '@/components/shared/DetailPanel';
import { SelectedStripe } from '@/components/shared/SelectedStripe';
import { Avatar } from '@/components/ui/avatar';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';
import { cn } from '@/lib/utils';

import { ORDER_KIND_META, ORDER_STATUS_META, personName, type Order, type OrderStatus } from './data';

export type TableDensity = 'full' | 'compact' | 'minimal';

const GRID: Record<TableDensity, string> = {
  full: 'grid-cols-[minmax(0,1fr)_96px_112px] lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1.4fr)_104px_96px_minmax(0,1fr)_112px]',
  compact: 'grid-cols-[minmax(0,1fr)_96px_112px]',
  minimal: 'grid-cols-[minmax(0,1fr)_112px]',
};

/** Columnas secundarias: solo en `full` y desde lg. */
const SECONDARY: Record<TableDensity, string> = {
  full: 'hidden lg:block',
  compact: 'hidden',
  minimal: 'hidden',
};

const STATUS: Record<TableDensity, string> = { full: '', compact: '', minimal: 'hidden' };

/** Estado como punto + texto (`text-*-text`), no como badge, en columnas de estado. */
export function StatusDot({ status, className }: { status: OrderStatus; className?: string }) {
  const meta = ORDER_STATUS_META[status];
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs', meta.text, className)}>
      <span aria-hidden className={cn('size-1.5 shrink-0 rounded-full', meta.dot)} />
      {meta.label}
    </span>
  );
}

export function OrdersTableHead({ density }: { density: TableDensity }) {
  return (
    <div className={cn(TABLE_HEAD_CLASS, GRID[density])}>
      <span className="h-5 leading-5">Orden</span>
      <span className={cn('h-5 leading-5', SECONDARY[density])}>Cliente</span>
      <span className={cn('h-5 leading-5', STATUS[density])}>Estado</span>
      <span className={cn('h-5 leading-5', SECONDARY[density])}>Vence</span>
      <span className={cn('h-5 leading-5', SECONDARY[density])}>Responsable</span>
      <span className="h-5 text-right leading-5">Monto</span>
    </div>
  );
}

export function OrderRow({
  order,
  index,
  selected = false,
  density,
  onSelect,
}: {
  order: Order;
  index: number;
  selected?: boolean;
  density: TableDensity;
  onSelect?: (id: string) => void;
}) {
  const kind = ORDER_KIND_META[order.kind];
  const assignee = personName(order.assigneeId);
  return (
    <button
      type="button"
      onClick={onSelect ? () => onSelect(order.id) : undefined}
      aria-current={selected ? 'true' : undefined}
      className={cn('w-full', tableRowClass(selected, index % 2 === 1), GRID[density])}
    >
      {selected && <SelectedStripe />}
      {/* Celda principal: altura fija h-10 para que no brinque al comprimirse. */}
      <span className="flex h-10 min-w-0 items-center gap-3">
        <IconCircle icon={kind.icon} tone={kind.tone} />
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-text-primary">{order.title}</span>
          <span className="block truncate text-xs text-text-tertiary">
            <span className="font-mono">{order.folio}</span> · {kind.label} · Creado el{' '}
            {formatDate(order.createdAt)} por {order.createdBy}
          </span>
        </span>
      </span>
      <span className={cn('min-w-0 items-center gap-2', SECONDARY[density], 'lg:flex')}>
        <Avatar name={order.client} size={24} square={order.clientIsCompany} />
        <span className="truncate text-sm text-text-secondary">{order.client}</span>
      </span>
      <span className={STATUS[density]}>
        <StatusDot status={order.status} />
      </span>
      <span className={cn('text-sm text-text-secondary tabular-nums', SECONDARY[density])}>
        {formatDate(order.dueAt)}
      </span>
      <span className={cn('min-w-0 items-center gap-2', SECONDARY[density], 'lg:flex')}>
        <Avatar name={assignee} size={20} />
        <span className="truncate text-sm text-text-secondary">{assignee}</span>
      </span>
      <span className="text-right text-sm font-medium text-text-primary tabular-nums">
        {formatCurrency(order.amount)}
      </span>
    </button>
  );
}

export function OrdersTableFooter({ orders }: { orders: Order[] }) {
  const total = orders.reduce((sum, o) => sum + o.amount, 0);
  return (
    <TableFooter>
      <span>
        {orders.length} {orders.length === 1 ? 'orden' : 'órdenes'}
      </span>
      <span className="tabular-nums">Total {formatCurrency(total)}</span>
    </TableFooter>
  );
}

export function OrdersEmpty() {
  return (
    <p className="px-4 py-10 text-center text-sm text-text-tertiary">
      Ninguna orden coincide con la búsqueda o los filtros.
    </p>
  );
}
