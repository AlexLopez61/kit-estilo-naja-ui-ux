import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
});

export function formatCurrency(n: number): string {
  return currencyFormatter.format(n);
}

const currencyCompactFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  notation: 'compact',
  maximumFractionDigits: 1,
});

// "$1.2 M" / "$85 k" — para medidores y resúmenes donde el monto completo
// no cabe (p. ej. "cobrado / aprobado" en una card angosta).
export function formatCurrencyCompact(n: number): string {
  return currencyCompactFormatter.format(n);
}

// parseISO (no `new Date(str)`): un date-only como '2026-06-05' debe ser
// medianoche LOCAL. `new Date` lo parsea como medianoche UTC y en
// America/Mexico_City (UTC-6) se mostraría el día anterior.
export function formatDate(d: Date | string): string {
  const date = typeof d === 'string' ? parseISO(d) : d;
  return format(date, 'dd/MM/yyyy', { locale: es });
}

export function formatDateTime(d: Date | string): string {
  const date = typeof d === 'string' ? parseISO(d) : d;
  return format(date, 'dd/MM/yyyy HH:mm', { locale: es });
}

// "2026-07-05" → "Julio 2026". Para etiquetar el periodo mensual de un
// pagaré (convención de cobranza: el mes del due_date).
export function formatMonthYear(d: Date | string): string {
  const date = typeof d === 'string' ? parseISO(d) : d;
  const label = format(date, 'MMMM yyyy', { locale: es });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

// "Hoy" como YYYY-MM-DD en America/Mexico_City. En Vercel el server corre en
// UTC, así que `new Date()` de noche en Mérida (UTC-6) devolvería el día
// siguiente; anclamos la fecha del negocio con `Intl` ('en-CA' formatea ISO).
export function todayIsoEnMexico(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Mexico_City' }).format(new Date());
}

/** Tamaño de archivo legible: "—" para 0, "12 KB", "3.4 MB", "1.2 GB". */
export function formatBytes(n: number): string {
  if (n <= 0) return '—';
  if (n >= 1024 ** 3) return `${(n / 1024 ** 3).toFixed(1)} GB`;
  if (n >= 1024 ** 2) return `${(n / 1024 ** 2).toFixed(1)} MB`;
  if (n >= 1024) return `${Math.round(n / 1024)} KB`;
  return `${n} B`;
}
