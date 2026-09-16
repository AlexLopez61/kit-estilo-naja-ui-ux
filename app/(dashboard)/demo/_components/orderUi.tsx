/**
 * Piezas visuales mínimas compartidas por las páginas de la demo: el estado
 * como «punto + texto» (columna de estado de M1, meta del encabezado M4) y el
 * mapa de tonos a utilidades de token.
 */

import { cn } from '@/lib/utils';

import { ORDER_STATUS, type OrderStatus, type Tone } from './data';

export const DOT_CLASS: Record<Tone, string> = {
  neutral: 'bg-text-tertiary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-info',
};

export const TEXT_CLASS: Record<Tone, string> = {
  neutral: 'text-text-secondary',
  success: 'text-success-text',
  warning: 'text-warning-text',
  danger: 'text-danger-text',
  info: 'text-info-text',
};

/** Estado como punto + texto (`text-*-text`), no como badge, en columnas de estado. */
export function StatusDot({ status, className }: { status: OrderStatus; className?: string }) {
  const meta = ORDER_STATUS[status];
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 text-xs', TEXT_CLASS[meta.tone], className)}
    >
      <span aria-hidden className={cn('size-1.5 shrink-0 rounded-full', DOT_CLASS[meta.tone])} />
      {meta.label}
    </span>
  );
}
