'use client';

import * as React from 'react';
import { CalendarIcon, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const MONTHS_SHORT = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
] as const;

const MONTHS_FULL = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
] as const;

export type YearMonth = { year: number; /** 1-12. */ month: number };

function toOrdinal(v: YearMonth): number {
  return v.year * 12 + (v.month - 1);
}

/**
 * Selector controlado de UN mes — molde visual del OwnerReportPeriodSelector
 * de propietarios (control segmentado ‹ | 📅 Mes Año ⌄ | › con popover 4×3),
 * pero sin acoplarse a ninguna ruta: emite onChange(year, month) y el caller
 * decide qué hacer (URL, estado, etc.). Sin trimestres/año/histórico: para
 * flujos estrictamente mensuales (conciliación bancaria).
 *
 * TODO(unificación): OwnerReportPeriodSelector podría reescribirse encima de
 * este componente cuando se toque el módulo propietarios.
 */
export function MonthOnlyPicker({
  year,
  month,
  onChange,
  min,
  max,
  className,
}: {
  year: number;
  /** 1-12. */
  month: number;
  onChange: (year: number, month: number) => void;
  /** Cota inferior inclusive (mes-año); sin cota si se omite. */
  min?: YearMonth;
  /** Cota superior inclusive (mes-año); sin cota si se omite. */
  max?: YearMonth;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  // Año que muestra el grid del popover (navegable sin aplicar).
  const [gridYear, setGridYear] = React.useState(year);

  const now = new Date();
  const current = toOrdinal({ year, month });
  const minOrd = min ? toOrdinal(min) : Number.NEGATIVE_INFINITY;
  const maxOrd = max ? toOrdinal(max) : Number.POSITIVE_INFINITY;

  function select(nextYear: number, nextMonth: number) {
    onChange(nextYear, nextMonth);
    setOpen(false);
  }

  const prev = month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 };
  const next = month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 };

  const stepButton =
    'grid w-8 place-items-center text-muted-foreground outline-none transition-colors hover:bg-muted/40 hover:text-foreground focus-visible:ring-brand focus-visible:ring-2 focus-visible:ring-inset disabled:pointer-events-none disabled:opacity-40';
  const yearNavButton =
    'grid size-7 place-items-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-brand focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-40';

  return (
    <div
      className={cn(
        'inline-flex h-8 items-stretch overflow-hidden rounded-md border bg-card',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onChange(prev.year, prev.month)}
        disabled={toOrdinal(prev) < minOrd}
        aria-label="Mes anterior"
        className={stepButton}
      >
        <ChevronLeft className="size-4" strokeWidth={1.5} />
      </button>

      <Popover
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (o) setGridYear(year);
        }}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            className="focus-visible:ring-brand flex items-center gap-2 border-x px-2.5 text-sm text-foreground outline-none transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-inset"
          >
            <CalendarIcon className="size-3.5 text-muted-foreground" strokeWidth={1.5} />
            <span className="whitespace-nowrap">
              {MONTHS_FULL[month - 1]} {year}
            </span>
            <ChevronDown className="size-3 text-muted-foreground" strokeWidth={1.5} />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" sideOffset={6} className="w-60 p-3">
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setGridYear((y) => y - 1)}
              disabled={min != null && gridYear <= min.year}
              aria-label="Año anterior"
              className={yearNavButton}
            >
              <ChevronLeft className="size-4" strokeWidth={1.5} />
            </button>
            <span className="text-sm font-medium text-foreground tabular-nums">{gridYear}</span>
            <button
              type="button"
              onClick={() => setGridYear((y) => y + 1)}
              disabled={max != null && gridYear >= max.year}
              aria-label="Año siguiente"
              className={yearNavButton}
            >
              <ChevronRight className="size-4" strokeWidth={1.5} />
            </button>
          </div>

          {/* Meses — el seleccionado en negro invertido; el mes actual (hoy)
              con el chip de marca para ubicarse al navegar otros años. */}
          <div className="grid grid-cols-4 gap-1">
            {MONTHS_SHORT.map((label, idx) => {
              const ord = toOrdinal({ year: gridYear, month: idx + 1 });
              const isSelected = ord === current;
              const isCurrent = gridYear === now.getFullYear() && idx === now.getMonth();
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => select(gridYear, idx + 1)}
                  disabled={ord < minOrd || ord > maxOrd}
                  aria-pressed={isSelected}
                  aria-current={isCurrent ? 'date' : undefined}
                  className={cn(
                    'focus-visible:ring-brand rounded-md px-1 py-1.5 text-sm outline-none transition-colors focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-40',
                    isSelected
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    !isSelected &&
                      isCurrent &&
                      'bg-brand-subtle text-brand-text hover:bg-brand-subtle hover:text-brand-text font-medium',
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>

      <button
        type="button"
        onClick={() => onChange(next.year, next.month)}
        disabled={toOrdinal(next) > maxOrd}
        aria-label="Mes siguiente"
        className={stepButton}
      >
        <ChevronRight className="size-4" strokeWidth={1.5} />
      </button>
    </div>
  );
}
