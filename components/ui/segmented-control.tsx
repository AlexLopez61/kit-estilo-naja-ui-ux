'use client';

/**
 * SegmentedControl — riel con pastilla activa que se desliza (animación sobre
 * `transform: translateX`, no solo cambio de color). Selección única excluyente.
 *
 * Variantes:
 * - `switch` (default): riel recesado `bg-muted` y pastilla sólida elevada
 *   (`bg-background` + sombra), estilo iOS/Vercel. Es el selector de vista de
 *   toda lista o tabla (Todo / Abiertas / …, Lista / Kanban). El texto activo es
 *   neutro (`text-foreground`) salvo tono explícito por opción.
 * - `tint`: riel `bg-card` y pastilla lavada (`bg-primary/10` + ring del tono).
 *   Solo para opciones excluyentes dentro de un formulario.
 *
 * El indicador es un único elemento absoluto cuyo `translateX` = índice activo
 * × su propio ancho, así un mismo componente sirve para N segmentos de ancho
 * uniforme.
 *
 * `value={null}` = sin selección: ningún segmento activo y sin pastilla (p. ej.
 * un paso que obliga a elegir antes de revelar el resto del formulario). Al
 * elegir por primera vez la pastilla entra con un fade breve.
 */

import * as React from 'react';
import { type LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

export type SegmentedTone = 'brand' | 'success' | 'danger' | 'warning' | 'info';

export type SegmentedOption<T extends string> = {
  value: T;
  label: string;
  icon?: LucideIcon;
  /** Color de la pastilla y del texto activo. Default `brand` (emerald). */
  tone?: SegmentedTone;
  /** Pinta el label con el tono también cuando el segmento está inactivo
   *  (ej. conteo urgente que debe verse aunque no sea el tab activo). */
  tintInactive?: boolean;
};

// Color de la pastilla flotante (fondo + ring) según el tono del segmento
// activo. Mismos tokens semánticos que el Badge (bg-<tone>-subtle +
// text-<tone>-text) para que tabs y pills compartan tono exacto.
const INDICATOR_TONE: Record<SegmentedTone, string> = {
  brand: 'bg-primary/10 ring-ring/40',
  success: 'bg-success-subtle ring-success/40',
  danger: 'bg-danger-subtle ring-danger/40',
  warning: 'bg-warning-subtle ring-warning/40',
  info: 'bg-info-subtle ring-info/40',
};

const TEXT_TONE: Record<SegmentedTone, string> = {
  brand: 'text-primary',
  success: 'text-success-text',
  danger: 'text-danger-text',
  warning: 'text-warning-text',
  info: 'text-info-text',
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
  variant = 'switch',
  'aria-label': ariaLabel,
}: {
  options: SegmentedOption<T>[];
  /** `null` = sin selección (ningún segmento activo, sin pastilla). */
  value: T | null;
  onChange: (value: T) => void;
  className?: string;
  /** `tint` (default) para superficies bg-background; `switch` sobre cards. */
  variant?: 'tint' | 'switch';
  'aria-label'?: string;
}) {
  const count = options.length;
  const activeIndex = options.findIndex((o) => o.value === value);
  const hasActive = activeIndex >= 0;
  const activeTone = options[activeIndex]?.tone ?? 'brand';
  // La pastilla solo se desvanece cuando el usuario elige desde "sin selección";
  // si el control monta ya con valor (el caso común) aparece en seco, como
  // siempre. Se enciende en el click, en el mismo batch que el onChange del
  // padre, así la pastilla monta ya con la clase de entrada.
  const [fadeIn, setFadeIn] = React.useState(false);

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        'relative grid w-full gap-0 rounded-lg p-[3px]',
        variant === 'switch' ? 'bg-muted' : 'bg-card',
        className,
      )}
      style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
    >
      {/* Pastilla activa flotante: anima su translateX al cambiar de segmento.
          Sin selección no se pinta; al elegir por primera vez entra con un fade. */}
      {hasActive && (
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute top-[3px] bottom-[3px] left-[3px] rounded-md ring-1 ring-inset transition-[transform,background-color] duration-200 ease-out',
            variant === 'switch'
              ? 'bg-background shadow-sm ring-border'
              : INDICATOR_TONE[activeTone],
            fadeIn && 'animate-in fade-in-0 motion-reduce:animate-none',
          )}
          style={{
            width: `calc((100% - 6px) / ${count})`,
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />
      )}
      {options.map((opt) => {
        const active = opt.value === value;
        const Icon = opt.icon;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => {
              if (!hasActive) setFadeIn(true);
              onChange(opt.value);
            }}
            className={cn(
              'relative z-10 inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm outline-none transition-colors focus-visible:shadow-focus',
              active
                ? cn(
                    'font-medium',
                    variant === 'switch' && !opt.tone
                      ? 'text-foreground'
                      : TEXT_TONE[opt.tone ?? 'brand'],
                  )
                : cn(
                    'text-muted-foreground hover:text-foreground',
                    opt.tintInactive && opt.tone && TEXT_TONE[opt.tone],
                  ),
            )}
          >
            {Icon && <Icon className="size-3.5" strokeWidth={1.5} />}
            {/* Fantasma en font-medium: reserva el ancho de la etiqueta en
                negritas para que el riel no cambie de tamaño (ni «brinque»)
                cuando el activo cambia de peso (Alex 10/09). */}
            <span className="relative inline-block whitespace-nowrap">
              <span aria-hidden className="invisible block font-medium">
                {opt.label}
              </span>
              <span className="absolute inset-0 flex items-center justify-center">{opt.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
