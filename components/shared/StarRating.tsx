'use client';

import * as React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Visualización de calificación con estrellas. `value` 0-5, redondea a
 * la estrella más cercana para llenar. Solo display — para capturar usa
 * `StarRatingInput`.
 */
export function StarRating({
  value,
  max = 5,
  size = 14,
}: {
  value: number;
  max?: number;
  size?: number;
}) {
  const filledCount = Math.round(value);
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => {
        const filled = i < filledCount;
        return (
          <Star
            key={i}
            size={size}
            strokeWidth={1.5}
            className={cn(filled ? 'fill-brand text-brand' : 'text-muted-foreground')}
          />
        );
      })}
    </span>
  );
}

/**
 * Captura de calificación 1-5 con hover de preview. Repetir click en la misma
 * estrella limpia a 0 (útil cuando la calificación es opcional).
 */
export function StarRatingInput({
  value,
  onChange,
  size = 20,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  size?: number;
  className?: string;
}) {
  const [hover, setHover] = React.useState(0);
  const display = hover > 0 ? hover : value;

  return (
    <span
      className={cn('inline-flex items-center gap-0.5', className)}
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i === value ? 0 : i)}
          onMouseEnter={() => setHover(i)}
          aria-label={`${i} ${i === 1 ? 'estrella' : 'estrellas'}`}
          aria-pressed={value >= i}
          className="rounded-sm p-0.5 transition-colors focus-visible:shadow-focus focus-visible:outline-none"
        >
          <Star
            size={size}
            strokeWidth={1.5}
            className={cn(i <= display ? 'fill-brand text-brand' : 'text-muted-foreground/50')}
          />
        </button>
      ))}
    </span>
  );
}
