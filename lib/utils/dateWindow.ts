import type { DateRangePreset } from '@/components/shared/DateRangePicker';
import { todayIsoEnMexico } from '@/lib/i18n/formatters';

/**
 * Resolución server-side canónica de la ventana de fechas URL-driven
 * (searchParams `desde`, `hasta`, `preset`) que comparten las vistas de
 * Finanzas (Balance, Cobros, Gastos, Pagos). Reemplaza a los 3 resolvedores
 * casi idénticos que vivían en cobros/filters.ts, gastos/dateWindow.ts y
 * pagos/filters.ts.
 *
 * `computePresetRange` vive en un módulo 'use client' (DateRangePicker) y no
 * puede ejecutarse en el server, por lo que este archivo replica el cálculo de
 * presets con la misma semántica: fechas locales YYYY-MM-DD, sin UTC shift.
 * El "hoy" se ancla a America/Mexico_City (el server de Vercel corre en UTC,
 * así que `new Date()` de noche en Mérida daría el día siguiente).
 */

const PRESETS: readonly DateRangePreset[] = [
  'today',
  'yesterday',
  'last_7',
  'last_28',
  'last_30',
  'last_90',
  'this_month',
  'last_month',
  'this_year',
  'last_year',
  'all_time',
  'custom',
];

export function isDateRangePreset(value: string | undefined): value is DateRangePreset {
  return value !== undefined && (PRESETS as readonly string[]).includes(value);
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Formatea a YYYY-MM-DD usando campos locales (estilo toIso de DateRangePicker). */
export function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Parsea YYYY-MM-DD como fecha local (sin UTC shift). */
export function parseIsoDate(value: string): Date {
  const [y = 0, m = 1, d = 1] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** true si es un YYYY-MM-DD válido de calendario (rechaza 2026-02-30). */
export function isValidIsoDate(value: string | undefined): value is string {
  if (!value || !ISO_DATE.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  if (y === undefined || m === undefined || d === undefined) return false;
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function presetRange(
  preset: Exclude<DateRangePreset, 'custom' | 'all_time'>,
  today: Date,
): { from: string; to: string } {
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  switch (preset) {
    case 'today':
      return { from: toIsoDate(t), to: toIsoDate(t) };
    case 'yesterday': {
      const y = addDays(t, -1);
      return { from: toIsoDate(y), to: toIsoDate(y) };
    }
    case 'last_7':
      return { from: toIsoDate(addDays(t, -6)), to: toIsoDate(t) };
    case 'last_28':
      return { from: toIsoDate(addDays(t, -27)), to: toIsoDate(t) };
    case 'last_30':
      return { from: toIsoDate(addDays(t, -29)), to: toIsoDate(t) };
    case 'last_90':
      return { from: toIsoDate(addDays(t, -89)), to: toIsoDate(t) };
    case 'this_month':
      return {
        from: toIsoDate(new Date(t.getFullYear(), t.getMonth(), 1)),
        to: toIsoDate(new Date(t.getFullYear(), t.getMonth() + 1, 0)),
      };
    case 'last_month':
      return {
        from: toIsoDate(new Date(t.getFullYear(), t.getMonth() - 1, 1)),
        to: toIsoDate(new Date(t.getFullYear(), t.getMonth(), 0)),
      };
    case 'this_year':
      return {
        from: toIsoDate(new Date(t.getFullYear(), 0, 1)),
        to: toIsoDate(new Date(t.getFullYear(), 11, 31)),
      };
    case 'last_year':
      return {
        from: toIsoDate(new Date(t.getFullYear() - 1, 0, 1)),
        to: toIsoDate(new Date(t.getFullYear() - 1, 11, 31)),
      };
  }
}

/** Inicio de la ventana previa de igual duración: `from − N días` con N = días(from→to). */
export function computePrevFrom(from: string, to: string): string {
  const f = parseIsoDate(from);
  const t = parseIsoDate(to);
  const days = Math.round((t.getTime() - f.getTime()) / 86_400_000) + 1;
  return toIsoDate(addDays(f, -days));
}

export type ResolvedDateWindow = {
  /** Ventana visible (inclusive), YYYY-MM-DD. En all_time: sentinelas 1900/2999. */
  from: string;
  to: string;
  preset: DateRangePreset;
  /** Inicio de la ventana previa (para deltas client-side); null en all_time. */
  prevFrom: string | null;
  isAllTime: boolean;
};

export function resolveDateWindow(params: {
  desde?: string;
  hasta?: string;
  preset?: string;
}): ResolvedDateWindow {
  const today = parseIsoDate(todayIsoEnMexico());
  const preset = isDateRangePreset(params.preset) ? params.preset : undefined;

  if (preset === 'all_time') {
    // Sentinelas idénticos a los del DateRangePicker para que el filtro
    // client-side (fecha >= from && <= to) deje pasar todo.
    return { from: '1900-01-01', to: '2999-12-31', preset, prevFrom: null, isAllTime: true };
  }

  if (preset && preset !== 'custom') {
    const r = presetRange(preset, today);
    return { ...r, preset, prevFrom: computePrevFrom(r.from, r.to), isAllTime: false };
  }

  // Custom explícito, o desde/hasta sueltos en la URL sin preset.
  if (
    isValidIsoDate(params.desde) &&
    isValidIsoDate(params.hasta) &&
    params.desde <= params.hasta
  ) {
    return {
      from: params.desde,
      to: params.hasta,
      preset: 'custom',
      prevFrom: computePrevFrom(params.desde, params.hasta),
      isAllTime: false,
    };
  }

  // Default: últimos 30 días.
  const r = presetRange('last_30', today);
  return { ...r, preset: 'last_30', prevFrom: computePrevFrom(r.from, r.to), isAllTime: false };
}

// ---------------------------------------------------------------------------
// Periodos cerrados (mes / trimestre / año) — filosofía de Finanzas 2.0:
// los cortes que cuadran contra documentos reales son periodos de calendario
// completos, no rangos arbitrarios de N días.
// ---------------------------------------------------------------------------

/** Sentinelas de "todo el histórico" (mismos que DateRangePicker/all_time). */
export const ALL_TIME_FROM = '1900-01-01';
export const ALL_TIME_TO = '2999-12-31';

const pad2 = (n: number) => String(n).padStart(2, '0');

/** Último día del mes (month 1-12) como número de día. */
export function lastDayOfMonth(year: number, month1: number): number {
  return new Date(year, month1, 0).getDate();
}

/** Primer y último día del mes (month 0-11), como YYYY-MM-DD locales. */
export function monthWindow(year: number, month0: number): { from: string; to: string } {
  return {
    from: `${year}-${pad2(month0 + 1)}-01`,
    to: `${year}-${pad2(month0 + 1)}-${pad2(lastDayOfMonth(year, month0 + 1))}`,
  };
}

/** Primer y último día del trimestre (q: 0-3). */
export function quarterWindow(year: number, q: number): { from: string; to: string } {
  const startMonth1 = q * 3 + 1;
  const endMonth1 = startMonth1 + 2;
  return {
    from: `${year}-${pad2(startMonth1)}-01`,
    to: `${year}-${pad2(endMonth1)}-${pad2(lastDayOfMonth(year, endMonth1))}`,
  };
}

export function yearWindow(year: number): { from: string; to: string } {
  return { from: `${year}-01-01`, to: `${year}-12-31` };
}

/**
 * Periodo cerrado detectado en una ventana [from, to] inclusive. 'free' =
 * rango que no corresponde a mes/trimestre/año/histórico (rangos libres de
 * URLs viejas o presets tipo last_30). year/month anclan al inicio de la
 * ventana; en 'all' no aplican.
 */
export type ClosedPeriod =
  | { kind: 'month'; year: number; month: number }
  | { kind: 'quarter'; year: number; quarter: number }
  | { kind: 'year'; year: number }
  | { kind: 'all' }
  | { kind: 'free'; year: number; month: number };

export function detectClosedPeriod(from: string, to: string): ClosedPeriod {
  if (from <= ALL_TIME_FROM || to >= ALL_TIME_TO) return { kind: 'all' };

  const [fy, fm, fd] = from.split('-').map(Number);
  const [ty, tm, td] = to.split('-').map(Number);
  const now = new Date();
  const year = fy ?? now.getFullYear();
  const month = (fm ?? now.getMonth() + 1) - 1;

  if (fy && fm && fd === 1 && fy === ty && tm && td) {
    if (fm === 1 && tm === 12 && td === 31) return { kind: 'year', year };
    if ((fm - 1) % 3 === 0 && tm === fm + 2 && td === lastDayOfMonth(ty, tm)) {
      return { kind: 'quarter', year, quarter: (fm - 1) / 3 };
    }
    if (tm === fm && td === lastDayOfMonth(ty, tm)) return { kind: 'month', year, month };
  }
  return { kind: 'free', year, month };
}

/**
 * Ventana de comparación "periodo anterior" para deltas de KPIs. Cuando la
 * ventana es un periodo de calendario, el anterior es el periodo CERRADO
 * previo (febrero se compara contra enero completo, aunque duren distinto);
 * para rangos libres cae a misma duración en días; null en histórico (no
 * existe un "anterior a todo").
 */
export function previousComparableWindow(
  from: string,
  to: string,
): { from: string; to: string } | null {
  const p = detectClosedPeriod(from, to);
  switch (p.kind) {
    case 'all':
      return null;
    case 'month': {
      const d = new Date(p.year, p.month - 1, 1);
      return monthWindow(d.getFullYear(), d.getMonth());
    }
    case 'quarter':
      return p.quarter === 0 ? quarterWindow(p.year - 1, 3) : quarterWindow(p.year, p.quarter - 1);
    case 'year':
      return yearWindow(p.year - 1);
    case 'free':
      return {
        from: computePrevFrom(from, to),
        to: toIsoDate(addDays(parseIsoDate(from), -1)),
      };
  }
}
