import * as React from 'react';

import { cn } from '@/lib/utils';

const SEGMENTS = 5;
const SEGMENT_SPAN = 360 / SEGMENTS;
const GAP_DEG = 16;

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const s = polar(cx, cy, r, startDeg);
  const e = polar(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${s.x.toFixed(3)} ${s.y.toFixed(3)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(3)} ${e.y.toFixed(3)}`;
}

/**
 * Anillo de calificación 1-5: cinco segmentos que se llenan según el valor
 * (redondeado al entero más cercano) con un color que recorre la escala
 * rojo → naranja → ámbar → verde de forma continua. Los extremos son los
 * tokens del sistema (`destructive` y `success`, mezclados en oklch), así
 * que el verde de un 5 es exactamente el verde de la app y se adapta al
 * tema. Los segmentos vacíos quedan en el gris de borde.
 *
 * Solo display — para capturar sigue usándose `StarRatingInput`.
 */
/**
 * Calificación compacta: anillo + número ("◔ 4.0"), el formato de la tabla de
 * subcontratistas. Para superficies de solo lectura (tablas, headers de
 * ficha, listas); la captura sigue siendo `StarRatingInput`.
 */
export function RatingValue({
  value,
  size = 16,
  className,
}: {
  value: number;
  size?: number;
  className?: string;
}) {
  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <RatingRing value={value} size={size} />
      <span className="text-text-primary text-xs font-medium tabular-nums">{value.toFixed(1)}</span>
    </span>
  );
}

export function RatingRing({ value, size = 16 }: { value: number; size?: number }) {
  const clamped = Math.min(Math.max(value, 0), SEGMENTS);
  const filled = Math.round(clamped);
  // 1 → 0% success (rojo destructive puro) … 5 → 100% success.
  const pct = ((Math.min(Math.max(clamped, 1), SEGMENTS) - 1) / (SEGMENTS - 1)) * 100;
  const color = `color-mix(in oklch, var(--color-success) ${pct.toFixed(0)}%, var(--color-destructive))`;

  return (
    <svg viewBox="0 0 20 20" width={size} height={size} aria-hidden="true" className="shrink-0">
      {Array.from({ length: SEGMENTS }, (_, i) => {
        const start = i * SEGMENT_SPAN + GAP_DEG / 2;
        const end = (i + 1) * SEGMENT_SPAN - GAP_DEG / 2;
        return (
          <path
            key={i}
            d={arcPath(10, 10, 7.5, start, end)}
            fill="none"
            stroke={i < filled ? color : 'var(--color-border-default)'}
            strokeWidth={3}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}
