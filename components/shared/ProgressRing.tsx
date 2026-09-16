import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Anillo de progreso (Soft Bento Dark) con el número de avance dentro.
 *
 * Basado en el anillo del showcase del design system (StatesSection). El color
 * del arco se pasa como variable CSS (`color`), p. ej. `var(--color-success)`.
 */
export function ProgressRing({
  value,
  size = 48,
  color = 'var(--color-brand)',
  numberClassName,
  className,
}: {
  /** Porcentaje. El arco se recorta a 0–100, pero el número muestra el valor
   *  real (puede pasar de 100 si te excedes). */
  value: number;
  size?: number;
  /** Color del arco como variable CSS. */
  color?: string;
  /** Clase del número del centro (p. ej. para ponerlo en rojo si te excedes). */
  numberClassName?: string;
  className?: string;
}) {
  const stroke = size >= 40 ? 3 : 2.5;
  const r = 18 - stroke / 2;
  const circumference = 2 * Math.PI * r;
  // El arco no puede pasar del círculo completo; el número sí muestra el real.
  const clamped = Math.min(100, Math.max(0, value));
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className={cn('relative shrink-0', className)} style={{ width: size, height: size }}>
      <svg viewBox="0 0 36 36" className="size-full -rotate-90" aria-hidden>
        <circle
          cx="18"
          cy="18"
          r={r}
          fill="none"
          stroke="var(--color-bg-elevated)"
          strokeWidth={stroke}
        />
        <circle
          cx="18"
          cy="18"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span
        className={cn(
          'text-text-secondary absolute inset-0 flex items-center justify-center text-[11px] font-medium tabular-nums',
          numberClassName,
        )}
      >
        {Math.round(Math.max(0, value))}
      </span>
    </div>
  );
}
