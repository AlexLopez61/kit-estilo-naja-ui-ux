import * as React from 'react';

import { cn } from '@/lib/utils';

export type SegmentState = 'filled' | 'empty' | 'muted';

const SEGMENT_CLASS: Record<SegmentState, string> = {
  filled: 'bg-success',
  /* Pendiente: blanco 10% — token más cercano al 8% de la referencia. */
  empty: 'bg-border-default',
  /* Apagado (ej. pagaré cancelado): blanco 6%. */
  muted: 'bg-border-subtle',
};

/**
 * SegmentGrid — grid de cuadritos de progreso discreto (un cuadrito por
 * unidad, ej. un pagaré). Se llenan de izquierda a derecha, de arriba hacia
 * abajo; el grid crece verticalmente y los cuadritos NUNCA cambian de tamaño
 * (14×14px).
 */
export function SegmentGrid({
  segments,
  cols = 6,
  className,
  'aria-label': ariaLabel,
}: {
  segments: SegmentState[];
  cols?: number;
  className?: string;
  'aria-label'?: string;
}) {
  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={cn('grid w-fit gap-1', className)}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {segments.map((state, i) => (
        <span key={i} className={cn('size-3.5 rounded-[2px]', SEGMENT_CLASS[state])} />
      ))}
    </div>
  );
}
