'use client';

import * as React from 'react';
import { format, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, ChevronDown } from 'lucide-react';
import type { DateRange as RDPDateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export type DateRangeValue = {
  from: string; // YYYY-MM-DD inclusive
  to: string; // YYYY-MM-DD inclusive
  preset?: DateRangePreset;
};

export type DateRangePreset =
  | 'today'
  | 'yesterday'
  | 'last_7'
  | 'last_28'
  | 'last_30'
  | 'last_90'
  | 'this_month'
  | 'last_month'
  | 'this_year'
  | 'last_year'
  | 'all_time'
  | 'custom';

const PRESET_LABELS: Record<DateRangePreset, string> = {
  today: 'Hoy',
  yesterday: 'Ayer',
  last_7: 'Últimos 7 días',
  last_28: 'Últimos 28 días',
  last_30: 'Últimos 30 días',
  last_90: 'Últimos 90 días',
  this_month: 'Este mes',
  last_month: 'Mes anterior',
  this_year: 'Este año',
  last_year: 'Año anterior',
  all_time: 'Todo el tiempo',
  custom: 'Personalizado',
};

const DEFAULT_PRESETS: DateRangePreset[] = [
  'last_7',
  'last_30',
  'last_90',
  'this_month',
  'last_month',
  'this_year',
  'last_year',
  'all_time',
];

// ---------------------------------------------------------------------------
// Helpers de fechas (locales, sin TZ shifts)
// ---------------------------------------------------------------------------

function toIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function fromIso(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const [y, m, d] = value.split('-').map(Number);
  if (!y || !m || !d) return undefined;
  const date = new Date(y, m - 1, d);
  return isValid(date) ? date : undefined;
}

function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export function computePresetRange(
  preset: DateRangePreset,
  today: Date = new Date(),
): { from: string; to: string } {
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  switch (preset) {
    case 'today':
      return { from: toIso(t), to: toIso(t) };
    case 'yesterday': {
      const y = addDays(t, -1);
      return { from: toIso(y), to: toIso(y) };
    }
    case 'last_7':
      return { from: toIso(addDays(t, -6)), to: toIso(t) };
    case 'last_28':
      return { from: toIso(addDays(t, -27)), to: toIso(t) };
    case 'last_30':
      return { from: toIso(addDays(t, -29)), to: toIso(t) };
    case 'last_90':
      return { from: toIso(addDays(t, -89)), to: toIso(t) };
    case 'this_month':
      return {
        from: toIso(new Date(t.getFullYear(), t.getMonth(), 1)),
        to: toIso(new Date(t.getFullYear(), t.getMonth() + 1, 0)),
      };
    case 'last_month':
      return {
        from: toIso(new Date(t.getFullYear(), t.getMonth() - 1, 1)),
        to: toIso(new Date(t.getFullYear(), t.getMonth(), 0)),
      };
    case 'this_year':
      return {
        from: toIso(new Date(t.getFullYear(), 0, 1)),
        to: toIso(new Date(t.getFullYear(), 11, 31)),
      };
    case 'last_year':
      return {
        from: toIso(new Date(t.getFullYear() - 1, 0, 1)),
        to: toIso(new Date(t.getFullYear() - 1, 11, 31)),
      };
    case 'all_time':
      return { from: '1900-01-01', to: '2999-12-31' };
    default:
      return { from: toIso(t), to: toIso(t) };
  }
}

function formatRangeLabel(value: DateRangeValue): string {
  if (value.preset && value.preset !== 'custom') {
    return PRESET_LABELS[value.preset];
  }
  const from = fromIso(value.from);
  const to = fromIso(value.to);
  if (!from || !to) return 'Selecciona fechas';
  if (toIso(from) === toIso(to)) {
    return format(from, "d 'de' MMM yyyy", { locale: es });
  }
  // Mismo año: omitir año en el "from".
  const sameYear = from.getFullYear() === to.getFullYear();
  return sameYear
    ? `${format(from, 'd MMM', { locale: es })} – ${format(to, "d 'de' MMM yyyy", { locale: es })}`
    : `${format(from, "d 'de' MMM yyyy", { locale: es })} – ${format(to, "d 'de' MMM yyyy", { locale: es })}`;
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

type Props = {
  value: DateRangeValue;
  onChange: (next: DateRangeValue) => void;
  presets?: DateRangePreset[];
  align?: 'start' | 'center' | 'end';
  className?: string;
};

export function DateRangePicker({
  value,
  onChange,
  presets = DEFAULT_PRESETS,
  align = 'end',
  className,
}: Props) {
  const [open, setOpen] = React.useState(false);
  // Estado borrador interno: el rango se aplica solo al click "Aplicar" cuando
  // es custom. Para presets, se aplica inmediato.
  const [draft, setDraft] = React.useState<RDPDateRange | undefined>(() => ({
    from: fromIso(value.from),
    to: fromIso(value.to),
  }));

  // Sincroniza el draft cuando cambia el value desde afuera.
  const valueKey = `${value.from}|${value.to}|${value.preset ?? ''}`;
  const [valueSnapshot, setValueSnapshot] = React.useState(valueKey);
  if (valueKey !== valueSnapshot) {
    setValueSnapshot(valueKey);
    setDraft({ from: fromIso(value.from), to: fromIso(value.to) });
  }

  function applyPreset(preset: DateRangePreset) {
    const range = computePresetRange(preset);
    onChange({ ...range, preset });
    setOpen(false);
  }

  function applyCustom() {
    if (!draft?.from || !draft.to) return;
    onChange({
      from: toIso(draft.from),
      to: toIso(draft.to),
      preset: 'custom',
    });
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className={cn('gap-2', className)}>
          <CalendarIcon className="size-3.5 opacity-60" />
          <span className="font-normal">{formatRangeLabel(value)}</span>
          <ChevronDown className="-mr-1 size-3 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align={align}
        className="w-auto p-0"
        sideOffset={6}
      >
        <div className="flex flex-col sm:flex-row">
          <div className="flex shrink-0 flex-col gap-0.5 border-b p-2 sm:border-b-0 sm:border-r">
            {presets.map((p) => {
              const isActive = value.preset === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className={cn(
                    'hover:bg-muted/60 rounded-md px-3 py-1.5 text-left text-sm transition-colors',
                    isActive && 'bg-muted font-medium',
                  )}
                >
                  {PRESET_LABELS[p]}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col">
            <Calendar
              mode="range"
              locale={es}
              numberOfMonths={2}
              defaultMonth={draft?.from ?? new Date()}
              selected={draft}
              onSelect={setDraft}
              captionLayout="dropdown"
              className="p-2"
            />
            <Separator />
            <div className="text-muted-foreground flex items-center justify-between gap-2 px-3 py-2 text-xs">
              <span className="tabular-nums">
                {draft?.from && draft.to
                  ? `${toIso(draft.from)} → ${toIso(draft.to)}`
                  : 'Selecciona inicio y fin'}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={applyCustom}
                  disabled={!draft?.from || !draft?.to}
                >
                  Aplicar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
