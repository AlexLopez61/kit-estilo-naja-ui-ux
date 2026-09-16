'use client';

import * as React from 'react';
import { CalendarIcon, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

import type { DateRangeValue } from '@/components/shared/DateRangePicker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
  ALL_TIME_FROM,
  ALL_TIME_TO,
  detectClosedPeriod,
  monthWindow,
  quarterWindow,
  yearWindow,
  type ClosedPeriod,
} from '@/lib/utils/dateWindow';

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

const QUARTER_MONTHS = ['Ene – Mar', 'Abr – Jun', 'Jul – Sep', 'Oct – Dic'] as const;

// La detección/construcción de periodos cerrados vive en lib/utils/dateWindow
// (compartida con el server, que la usa para la ventana de comparación de los
// deltas). 'free' = rango libre de URL vieja: se muestra "Personalizado" y el
// stepper re-ancla al mes de inicio.

function triggerLabel(p: ClosedPeriod, allTimeLabel: string): string {
  switch (p.kind) {
    case 'month':
      return `${MONTHS_FULL[p.month]} ${p.year}`;
    case 'quarter':
      return `T${p.quarter + 1} ${p.year}`;
    case 'year':
      return `Año ${p.year}`;
    case 'all':
      return allTimeLabel;
    case 'free':
      return 'Personalizado';
  }
}

/**
 * Selector de periodo del libro mayor. Primario: mes por mes (decisión de
 * Alex 15/07 — el negocio opera mensual: rentas, comisiones, arqueos).
 * Secundario (16/07): periodos CERRADOS mayores — trimestre, año completo e
 * histórico — porque siguen cuadrando contra documentos reales; nunca rangos
 * libres que no concilian con nada.
 *
 * El stepper ‹ › avanza según el periodo activo (mes→mes, trimestre→trimestre,
 * año→año; en histórico se deshabilita). Emite el mismo `DateRangeValue` que
 * DateRangePicker, así el contrato URL/server (?desde&hasta&preset) no cambia
 * y las vistas que siguen usando rangos libres no se ven afectadas.
 */
export function MonthPicker({
  value,
  onChange,
  className,
  allTimeLabel = 'Histórico',
}: {
  value: DateRangeValue;
  onChange: (next: DateRangeValue) => void;
  className?: string;
  /** Etiqueta de la opción de todo el histórico ("Histórico", "Todo"…). */
  allTimeLabel?: string;
}) {
  const [open, setOpen] = React.useState(false);

  const period = detectClosedPeriod(value.from, value.to);
  const now = new Date();
  const anchorYear = period.kind === 'all' ? now.getFullYear() : period.year;
  const anchorMonth =
    period.kind === 'month' || period.kind === 'free' ? period.month : now.getMonth();

  // Año que muestra el grid del popover (navegable sin aplicar).
  const [gridYear, setGridYear] = React.useState(anchorYear);

  function apply(range: { from: string; to: string }, preset: 'custom' | 'all_time' = 'custom') {
    onChange({ ...range, preset });
    setOpen(false);
  }

  function selectMonth(nextYear: number, nextMonth: number) {
    apply(monthWindow(nextYear, nextMonth));
  }

  /** Avanza un periodo del tamaño activo (mes/trimestre/año). */
  function step(delta: number) {
    if (period.kind === 'quarter') {
      const q = period.quarter + delta;
      const year = period.year + Math.floor(q / 4);
      apply(quarterWindow(year, ((q % 4) + 4) % 4));
      return;
    }
    if (period.kind === 'year') {
      apply(yearWindow(period.year + delta));
      return;
    }
    // month / free (re-ancla al mes de inicio); en 'all' el botón va disabled.
    const d = new Date(anchorYear, anchorMonth + delta, 1);
    selectMonth(d.getFullYear(), d.getMonth());
  }

  const stepDisabled = period.kind === 'all';
  const stepLabel =
    period.kind === 'quarter' ? 'trimestre' : period.kind === 'year' ? 'año' : 'mes';

  // Dentro del popover el hover usa bg-overlay: el fondo del popover ES
  // bg-elevated (#111114), así que bg-elevated ahí resulta invisible.
  const periodButton = (selected: boolean) =>
    cn(
      'focus-visible:shadow-focus rounded-md px-1 py-1.5 text-sm outline-none transition-colors',
      selected
        ? 'bg-foreground text-background'
        : 'text-text-secondary hover:bg-bg-overlay hover:text-text-primary',
    );

  return (
    <div
      className={cn(
        'border-border-default bg-bg-surface inline-flex h-8 items-stretch overflow-hidden rounded-md border',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => step(-1)}
        disabled={stepDisabled}
        aria-label={`${stepLabel === 'año' ? 'Año' : stepLabel === 'trimestre' ? 'Trimestre' : 'Mes'} anterior`}
        className="text-text-tertiary hover:bg-bg-elevated hover:text-text-primary focus-visible:shadow-focus grid w-8 place-items-center outline-none transition-colors disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeft className="size-4" strokeWidth={1.5} />
      </button>

      <Popover
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (o) setGridYear(anchorYear);
        }}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            className="border-border-subtle text-text-primary hover:bg-bg-elevated focus-visible:shadow-focus flex items-center gap-2 border-x px-2.5 text-sm outline-none transition-colors"
          >
            <CalendarIcon className="text-text-tertiary size-3.5" strokeWidth={1.5} />
            <span className="whitespace-nowrap">{triggerLabel(period, allTimeLabel)}</span>
            <ChevronDown className="text-text-tertiary size-3" strokeWidth={1.5} />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" sideOffset={6} className="w-60 p-3">
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setGridYear((y) => y - 1)}
              aria-label="Año anterior"
              className="text-text-tertiary hover:bg-bg-overlay hover:text-text-primary focus-visible:shadow-focus grid size-7 place-items-center rounded-md outline-none transition-colors"
            >
              <ChevronLeft className="size-4" strokeWidth={1.5} />
            </button>
            <span className="text-text-primary text-sm font-medium tabular-nums">{gridYear}</span>
            <button
              type="button"
              onClick={() => setGridYear((y) => y + 1)}
              aria-label="Año siguiente"
              className="text-text-tertiary hover:bg-bg-overlay hover:text-text-primary focus-visible:shadow-focus grid size-7 place-items-center rounded-md outline-none transition-colors"
            >
              <ChevronRight className="size-4" strokeWidth={1.5} />
            </button>
          </div>

          {/* Meses — el periodo primario. El mes actual (hoy) va marcado con
              el estilo de hover para ubicarse al navegar otros años. */}
          <div className="grid grid-cols-4 gap-1">
            {MONTHS_SHORT.map((label, idx) => {
              const isSelected =
                period.kind === 'month' && gridYear === period.year && idx === period.month;
              const isCurrent = gridYear === now.getFullYear() && idx === now.getMonth();
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => selectMonth(gridYear, idx)}
                  aria-pressed={isSelected}
                  aria-current={isCurrent ? 'date' : undefined}
                  className={cn(
                    periodButton(isSelected),
                    // Mes actual: chip con el acento de marca — bg/gris sobre
                    // el popover (que ya es bg-elevated) no alcanza contraste.
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

          {/* Periodos cerrados mayores: trimestres, año completo e histórico.
              Cierran contra documentos reales (a diferencia de un rango libre). */}
          <div className="border-border-subtle mt-2 border-t pt-2">
            <div className="grid grid-cols-4 gap-1">
              {QUARTER_MONTHS.map((months, q) => {
                const isSelected =
                  period.kind === 'quarter' && gridYear === period.year && q === period.quarter;
                return (
                  <button
                    key={months}
                    type="button"
                    onClick={() => apply(quarterWindow(gridYear, q))}
                    aria-pressed={isSelected}
                    aria-label={`Trimestre ${q + 1} (${months}) de ${gridYear}`}
                    title={months}
                    className={periodButton(isSelected)}
                  >
                    T{q + 1}
                  </button>
                );
              })}
            </div>
            <div className="mt-1 grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => apply(yearWindow(gridYear))}
                aria-pressed={period.kind === 'year' && gridYear === period.year}
                className={periodButton(period.kind === 'year' && gridYear === period.year)}
              >
                Año {gridYear}
              </button>
              <button
                type="button"
                onClick={() => apply({ from: ALL_TIME_FROM, to: ALL_TIME_TO }, 'all_time')}
                aria-pressed={period.kind === 'all'}
                className={periodButton(period.kind === 'all')}
              >
                {allTimeLabel}
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <button
        type="button"
        onClick={() => step(1)}
        disabled={stepDisabled}
        aria-label={`${stepLabel === 'año' ? 'Año' : stepLabel === 'trimestre' ? 'Trimestre' : 'Mes'} siguiente`}
        className="text-text-tertiary hover:bg-bg-elevated hover:text-text-primary focus-visible:shadow-focus grid w-8 place-items-center outline-none transition-colors disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronRight className="size-4" strokeWidth={1.5} />
      </button>
    </div>
  );
}
