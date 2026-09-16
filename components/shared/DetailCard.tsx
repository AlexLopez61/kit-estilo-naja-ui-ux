'use client';

/**
 * Molde de cards del cockpit de Finanzas (UI_UX_VERCEL §Finanzas: Resumen),
 * compartido con el detalle de proyecto (09/09/2026):
 *
 *  - `DetailCard`: nivel 3 de la escala de elevación — blanco + `shadow-md`
 *    SIN borde en claro, `dark:border-border-card` en oscuro.
 *  - `DetailCardHeader`: título `text-sm font-semibold` + subline terciaria +
 *    acción contextual («Ver … ↗» o cualquier nodo) a la derecha, `p-5 pb-0`.
 *  - `DenseList` / `DenseRow`: lista densa `mt-4 divide-y border-t`, fila
 *    `grid 32px · 1fr · auto` con icono circular, título/subline y monto.
 *  - `KpiTile`: tile de KPI (molde Pendientes/Conciliación): label `text-sm`
 *    secundaria + icono, valor `text-2xl font-semibold`, detalle terciario.
 *  - `Meter`: medidor de la card «Posición de hoy»: label + monto, barra
 *    `h-1.5` con pista del mismo ramp y subline.
 *  - `SignedAmount`: monto con la regla del libro — solo los negativos en rojo.
 */

import * as React from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { ArrowUpRight, ChevronRight, type LucideIcon } from 'lucide-react';

import { formatCurrency } from '@/lib/i18n/formatters';
import { cn } from '@/lib/utils';

export const DETAIL_CARD_CLASS =
  'bg-bg-surface rounded-lg shadow-md dark:border dark:border-border-card';

/** Fila clicable de lista densa: fondo en hover y foco visible por teclado. */
export const DENSE_ROW_CLASS =
  'relative grid w-full grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-x-2.5 px-5 py-2.5 text-left transition-colors duration-150 outline-none hover:bg-row-hover focus-visible:shadow-focus motion-reduce:transition-none';

export function DetailCard({ className, children, ...props }: React.ComponentProps<'section'>) {
  return (
    <section className={cn(DETAIL_CARD_CLASS, className)} {...props}>
      {children}
    </section>
  );
}

export function DetailCardHeader({
  title,
  subtitle,
  href,
  linkLabel,
  onLinkClick,
  action,
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Enlace contextual «linkLabel ↗» a la derecha (navegación). */
  href?: Route;
  linkLabel?: string;
  /** Alternativa al href: mismo look, dispara una acción (tab shallow, modal). */
  onLinkClick?: () => void;
  /** Cualquier otro nodo a la derecha (badge, botón). Gana sobre el enlace. */
  action?: React.ReactNode;
  className?: string;
}) {
  const linkClass =
    'text-text-secondary hover:text-text-primary inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-sm text-xs outline-none transition-colors focus-visible:shadow-focus';
  return (
    <div className={cn('flex items-start justify-between gap-3 p-5 pb-0', className)}>
      <div className="min-w-0">
        <h3 className="text-text-primary text-sm font-semibold">{title}</h3>
        {subtitle && <p className="text-text-tertiary mt-0.5 text-xs">{subtitle}</p>}
      </div>
      {action ??
        (linkLabel &&
          (href ? (
            <Link href={href} className={linkClass}>
              {linkLabel}
              <ArrowUpRight aria-hidden className="size-3.5" strokeWidth={1.5} />
            </Link>
          ) : onLinkClick ? (
            <button type="button" onClick={onLinkClick} className={linkClass}>
              {linkLabel}
              <ArrowUpRight aria-hidden className="size-3.5" strokeWidth={1.5} />
            </button>
          ) : null))}
    </div>
  );
}

export function DenseList({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <ul
      className={cn('divide-border-subtle border-border-subtle mt-4 divide-y border-t', className)}
    >
      {children}
    </ul>
  );
}

/**
 * Fila densa. Con `href` navega, con `onClick` actúa, sin ninguno es estática.
 * `lead` es el icono circular o avatar de 32px; `right` va a la derecha.
 */
export function DenseRow({
  lead,
  title,
  sub,
  right,
  href,
  onClick,
  className,
  ariaLabel,
}: {
  lead: React.ReactNode;
  title: React.ReactNode;
  sub?: React.ReactNode;
  right?: React.ReactNode;
  href?: Route;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}) {
  const inner = (
    <>
      {lead}
      <span className="min-w-0">
        <span className="text-text-primary block truncate text-sm font-medium">{title}</span>
        {sub && <span className="text-text-tertiary block truncate text-xs">{sub}</span>}
      </span>
      {right && <span className="flex shrink-0 items-center gap-2">{right}</span>}
    </>
  );
  const rowClass = cn(DENSE_ROW_CLASS, !href && !onClick && 'hover:bg-transparent', className);
  return (
    <li>
      {href ? (
        <Link href={href} className={rowClass} aria-label={ariaLabel}>
          {inner}
        </Link>
      ) : onClick ? (
        <button
          type="button"
          onClick={onClick}
          className={cn(rowClass, 'cursor-pointer')}
          aria-label={ariaLabel}
        >
          {inner}
        </button>
      ) : (
        <div className={rowClass}>{inner}</div>
      )}
    </li>
  );
}

/** Icono circular de 32px por tono (MovementIcon / ClosingCard). */
export function IconCircle({
  icon: Icon,
  tone = 'neutral',
  className,
}: {
  icon: LucideIcon;
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}) {
  const toneClass = {
    neutral: 'bg-bg-elevated text-text-secondary',
    success: 'bg-success-subtle text-success-text',
    warning: 'bg-warning-subtle text-warning-text',
    danger: 'bg-danger-subtle text-danger-text',
    info: 'bg-info-subtle text-info-text',
  }[tone];
  return (
    <span
      className={cn('grid size-8 shrink-0 place-items-center rounded-full', toneClass, className)}
    >
      <Icon aria-hidden className="size-4" strokeWidth={2} />
    </span>
  );
}

/** Pill de conteo o dato corto a la derecha de una fila densa. */
export function RowPill({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'bg-bg-elevated text-text-secondary rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap tabular-nums',
        className,
      )}
    >
      {children}
    </span>
  );
}

export function KpiTile({
  label,
  value,
  detail,
  icon: Icon,
  valueClassName,
  onClick,
  active = false,
  className,
}: {
  label: string;
  value: React.ReactNode;
  detail?: React.ReactNode;
  icon?: LucideIcon;
  valueClassName?: string;
  /** Con onClick el tile es un botón (sube un nivel en hover; activo con ring). */
  onClick?: () => void;
  active?: boolean;
  className?: string;
}) {
  const content = (
    <>
      <span className="text-text-secondary flex items-center justify-between gap-2 text-sm">
        {label}
        {Icon && <Icon aria-hidden className="size-4 shrink-0" strokeWidth={1.5} />}
      </span>
      <span
        className={cn(
          'text-text-primary mt-1 block text-2xl font-semibold tracking-tight tabular-nums',
          valueClassName,
        )}
      >
        {value}
      </span>
      {detail && <span className="text-text-tertiary mt-1 block text-xs">{detail}</span>}
    </>
  );
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={cn(
          DETAIL_CARD_CLASS,
          'block cursor-pointer p-4 text-left transition-shadow duration-150 outline-none hover:shadow-lg focus-visible:shadow-focus motion-reduce:transition-none',
          active && 'ring-1 ring-ring/50',
          className,
        )}
      >
        {content}
      </button>
    );
  }
  return <div className={cn(DETAIL_CARD_CLASS, 'p-4', className)}>{content}</div>;
}

export function Meter({
  label,
  value,
  pct,
  tone = 'neutral',
  sub,
  onClick,
  ariaLabel,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  /** 0..100 */
  pct: number;
  tone?: 'success' | 'danger' | 'neutral';
  sub?: React.ReactNode;
  /** Con onClick el medidor es una fila clicable: hover de tinte normal y
      chevron junto al valor (lleva a la tabla que lo explica). */
  onClick?: () => void;
  ariaLabel?: string;
}) {
  const fill = { success: 'bg-success', danger: 'bg-danger', neutral: 'bg-text-tertiary' }[tone];
  const track = {
    success: 'bg-success-subtle',
    danger: 'bg-danger-subtle',
    neutral: 'bg-bg-elevated',
  }[tone];
  const width = `${Math.round(Math.max(0, Math.min(1, pct / 100)) * 100)}%`;
  const body = (
    <>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-text-primary text-sm">{label}</span>
        <span className="flex items-center gap-1.5">
          <span className="text-sm font-medium tabular-nums">{value}</span>
          {onClick && (
            <ChevronRight
              aria-hidden
              className="text-text-tertiary size-3.5 shrink-0"
              strokeWidth={1.5}
            />
          )}
        </span>
      </div>
      <div aria-hidden className={cn('h-1.5 w-full overflow-hidden rounded-full', track)}>
        <div className={cn('h-full rounded-full', fill)} style={{ width }} />
      </div>
      {sub && <p className="text-text-tertiary text-xs">{sub}</p>}
    </>
  );
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        className="-mx-2 block w-[calc(100%+1rem)] cursor-pointer space-y-1.5 rounded-md px-2 py-1.5 text-left transition-colors duration-150 outline-none hover:bg-row-hover focus-visible:shadow-focus motion-reduce:transition-none"
      >
        {body}
      </button>
    );
  }
  return <div className="space-y-1.5">{body}</div>;
}

/** Monto con la regla del libro: solo los negativos (salidas) en rojo. */
export function SignedAmount({
  value,
  className,
  showPlus = false,
}: {
  value: number;
  className?: string;
  /** Antepone «+» a los positivos (flujos); los estados no lo llevan. */
  showPlus?: boolean;
}) {
  return (
    <span
      className={cn(
        'tabular-nums',
        value < 0 ? 'text-danger-text' : 'text-text-primary',
        className,
      )}
    >
      {value < 0 ? '−' : showPlus && value > 0 ? '+' : ''}
      {formatCurrency(Math.abs(value))}
    </span>
  );
}
