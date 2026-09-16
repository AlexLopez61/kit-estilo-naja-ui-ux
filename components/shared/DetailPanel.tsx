'use client';

/**
 * Molde de la vista híbrida "lista + ficha en panel" de Finanzas (Movimientos,
 * Pendientes, Cuentas; UI_UX_VERCEL §Finanzas), compartido con el detalle de
 * proyecto (Cotizaciones, Etapas, Cobros y pagos; 09/09/2026):
 *
 *  - `HybridSplit`: dos cards independientes (nivel 3, `shadow-md`, sin
 *    borde) separadas por `gap-4`; la lista se comprime y el panel de
 *    380/420px entra por la derecha con la transición de 300 ms. La sombra del
 *    panel va en el ENVOLTORIO que anima el ancho (overflow-hidden recortaría
 *    la del hijo). El último detalle se retiene durante la salida.
 *  - `DetailPanelFrame`: cuerpo scrolleable (AutoHideScrollArea) con toolbar
 *    liquid glass sticky (cerrar a la izquierda, acciones a la derecha) y
 *    vidrio inferior espejado.
 *  - `PanelHero`, `PanelHeroHead`, `PanelTile`, `PanelFoot`, `PanelSubCard`:
 *    hero plano (bg-surface sin borde ni sombra en claro), tile de monto con
 *    `shadow-md`, pie de auditoría y sub-cards planas.
 *  - `SplitActionButton`: primario negro «Acción | ⌄» con el resto detrás del
 *    chevron (panelChrome.ts).
 */

import * as React from 'react';
import { ChevronDown, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AutoHideScrollArea } from '@/components/shared/AutoHideScrollArea';
import { DETAIL_CARD_CLASS } from '@/components/shared/DetailCard';
import {
  PANEL_GLASS_BOTTOM_CLASS,
  PANEL_GLASS_TOP_CLASS,
  SPLIT_MENU_TRIGGER_CLASS,
} from '@/components/shared/panelChrome';
import { PanelCloseControl } from '@/components/shared/PanelCloseControl';
import { cn } from '@/lib/utils';

export { SPLIT_ACTION_CLASS } from '@/components/shared/panelChrome';

// ---------------------------------------------------------------------------
// Split lista + panel
// ---------------------------------------------------------------------------

export function HybridSplit({
  open,
  panelKey,
  list,
  panel,
  containerName = 'detail',
  className,
  wide = false,
}: {
  open: boolean;
  /** Identidad del detalle: remonta la entrada al cambiar de selección. */
  panelKey: string | null;
  list: React.ReactNode;
  panel: React.ReactNode;
  /** Nombre del @container del panel (queries `@2xl/<name>`). */
  containerName?: string;
  className?: string;
  /**
   * Panel ANCHO (molde del split de Órdenes de trabajo): la lista se comprime
   * a `clamp(300px, 36cqw, 420px)` y el panel toma el resto. Para fichas
   * grandes (WorkOrderDetail) que no caben en 380/420 px.
   */
  wide?: boolean;
}) {
  // Retiene el último detalle durante la animación de salida.
  const [retained, setRetained] = React.useState<React.ReactNode>(null);
  if (panel && panel !== retained) setRetained(panel);
  const displayed = panel ?? retained;
  const [retainedKey, setRetainedKey] = React.useState(panelKey);
  if (panelKey && panelKey !== retainedKey) setRetainedKey(panelKey);

  return (
    <div className={cn('@container relative flex min-h-0 flex-col', className)}>
      <div
        className={cn(
          'relative flex min-h-0 flex-col transition-[column-gap] duration-300 ease-out motion-reduce:transition-none lg:flex-row lg:items-start',
          open ? 'lg:gap-x-4' : 'lg:gap-x-0',
        )}
      >
        <div
          className={cn(
            DETAIL_CARD_CLASS,
            'min-w-0 flex-col overflow-hidden transition-[width,opacity,visibility] duration-300 ease-out motion-reduce:transition-none lg:flex lg:shrink-0',
            open
              ? wide
                ? 'hidden lg:w-[clamp(300px,36cqw,420px)]'
                : 'hidden lg:w-[calc(100cqw-396px)] xl:w-[calc(100cqw-436px)]'
              : 'flex lg:w-full',
          )}
        >
          {list}
        </div>

        <div
          aria-hidden={!open}
          inert={!open}
          className={cn(
            'min-h-0 min-w-0 overflow-hidden rounded-lg shadow-md transition-[width,opacity,transform,visibility] duration-300 ease-out motion-reduce:transform-none motion-reduce:transition-none lg:sticky lg:top-4 lg:self-start',
            wide ? 'lg:min-w-0 lg:flex-1' : 'lg:shrink-0',
            open
              ? cn(
                  'visible flex shrink-0 translate-x-0 opacity-100',
                  !wide && 'lg:w-[380px] xl:w-[420px]',
                )
              : 'invisible absolute inset-x-0 top-0 translate-x-3 opacity-0 lg:static lg:w-0',
          )}
        >
          {displayed && (
            <div
              className={cn(
                'bg-bg-elevated relative flex w-full min-w-0 shrink-0 flex-col overflow-hidden rounded-lg dark:border dark:border-border-card',
                !wide && 'lg:w-[380px] xl:w-[420px]',
              )}
              style={{ containerType: 'inline-size', containerName }}
            >
              <div
                key={retainedKey ?? 'panel'}
                className="animate-in fade-in slide-in-from-bottom-2 min-h-0 duration-300 motion-reduce:animate-none"
              >
                {displayed}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Marco de la ficha
// ---------------------------------------------------------------------------

export function DetailPanelFrame({
  headingId,
  onClose,
  actions,
  children,
}: {
  headingId?: string;
  onClose: () => void;
  /** Acciones a la derecha del toolbar (SplitActionButton, ghost…). */
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={headingId} className="relative flex min-h-0 flex-col">
      <AutoHideScrollArea
        className="min-h-0 flex-1"
        viewportClassName="max-h-[70vh] lg:max-h-[calc(100vh-7rem)]"
        contentClassName="space-y-4 p-4 pb-16"
      >
        <div className="pointer-events-none sticky top-0 z-20 -mx-4 -mt-4 px-4 py-3">
          <div aria-hidden className={PANEL_GLASS_TOP_CLASS} />
          <div className="pointer-events-auto flex items-center gap-2">
            <PanelCloseControl onClose={onClose} />
            <div className="ml-auto flex min-w-0 items-center gap-2">{actions}</div>
          </div>
        </div>
        {children}
      </AutoHideScrollArea>
      <div aria-hidden className={PANEL_GLASS_BOTTOM_CLASS} />
    </section>
  );
}

// ---------------------------------------------------------------------------
// Hero, tile, pie, sub-cards
// ---------------------------------------------------------------------------

/** Card plana del hero (blanco sobre el gris del panel; borde solo en oscuro). */
export function PanelHero({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('bg-bg-surface rounded-lg dark:border dark:border-border-card', className)}>
      {children}
    </div>
  );
}

/** Franja de identidad: icono/avatar + título + subline, y badges debajo. */
export function PanelHeroHead({
  lead,
  title,
  subtitle,
  badges,
  headingId,
  headingRef,
}: {
  lead: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badges?: React.ReactNode;
  headingId?: string;
  headingRef?: React.Ref<HTMLHeadingElement>;
}) {
  return (
    <div className="border-border-subtle flex flex-col gap-2.5 border-b px-4 py-3">
      <div className="flex min-w-0 items-center gap-2.5">
        {lead}
        <div className="min-w-0">
          <h2
            id={headingId}
            ref={headingRef}
            tabIndex={-1}
            className="text-text-primary text-sm font-semibold break-words outline-none"
          >
            {title}
          </h2>
          {subtitle && <p className="text-text-tertiary text-xs break-words">{subtitle}</p>}
        </div>
      </div>
      {badges && <div className="flex flex-wrap items-center gap-1.5">{badges}</div>}
    </div>
  );
}

/** Tile del valor principal: mismo fondo de la card, sin borde, shadow-md. */
export function PanelTile({
  label,
  value,
  sub,
  valueClassName,
  children,
  className,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  valueClassName?: string;
  /** Contenido extra bajo el valor (barra de avance, etc.). */
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'bg-bg-surface flex flex-col gap-1 rounded-lg p-4 shadow-md dark:border dark:border-border-card',
        className,
      )}
    >
      <p className="text-text-secondary text-xs">{label}</p>
      <p
        className={cn(
          'text-text-primary text-3xl font-medium tracking-tight tabular-nums',
          valueClassName,
        )}
      >
        {value}
      </p>
      {children}
      {sub && <p className="text-text-tertiary text-xs">{sub}</p>}
    </div>
  );
}

/** Pie de auditoría del hero («Registrado por · avatar · fecha»). */
export function PanelFoot({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-border-subtle text-text-tertiary flex flex-wrap items-center gap-1.5 border-t px-4 py-2.5 text-xs">
      {children}
    </div>
  );
}

/** Sub-card plana: h3 semibold + acción opcional + contenido. */
export function PanelSubCard({
  title,
  action,
  children,
  className,
}: {
  title: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn('bg-bg-surface rounded-lg p-4 dark:border dark:border-border-card', className)}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-text-primary text-sm font-semibold">{title}</h3>
        {action}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

/** Enlace pequeño de acción en cabeceras de sub-card («Editar partidas ✎»). */
export function PanelLinkAction({
  onClick,
  icon: Icon,
  children,
}: {
  onClick: () => void;
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-text-secondary hover:text-text-primary inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-sm text-xs outline-none transition-colors focus-visible:shadow-focus"
    >
      {children}
      {Icon && <Icon className="size-3.5" strokeWidth={1.5} />}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Botón dividido
// ---------------------------------------------------------------------------

/**
 * «Acción | ⌄»: `primary` es el segmento principal (button o Link con
 * SPLIT_ACTION_CLASS); `menu` son DropdownMenuItem. Sin primario, el menú se
 * abre desde un botón ⋯ ghost; sin menú, el primario va solo.
 */
export function SplitActionButton({
  primary,
  menu,
  menuLabel = 'Más acciones',
}: {
  primary: React.ReactNode | null;
  menu?: React.ReactNode[];
  menuLabel?: string;
}) {
  const items = (menu ?? []).filter(Boolean);
  if (!primary) {
    if (items.length === 0) return null;
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label={menuLabel}>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {items}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  return (
    <span className="inline-flex h-8 shrink-0 items-stretch overflow-hidden rounded-md bg-foreground text-background shadow-xs">
      {primary}
      {items.length > 0 && (
        <>
          <span className="w-px bg-background/30" aria-hidden="true" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" aria-label={menuLabel} className={SPLIT_MENU_TRIGGER_CLASS}>
                <ChevronDown className="size-3.5" strokeWidth={1.5} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {items}
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Tabla del master (molde Movimientos): header delgado, filas con halo
// ---------------------------------------------------------------------------

export const TABLE_HEAD_CLASS =
  'border-border-subtle text-text-tertiary grid h-9 items-center gap-x-4 border-b px-4 text-xs';

/**
 * Fila de la tabla: zebra, hover NORMAL (tinte de fondo, como Pendientes y
 * el resto de las listas; Alex 10/09: "el hover de las rows quiero que sea
 * el normal, no con el de sombra"), seleccionada con fondo + halo.
 */
export function tableRowClass(selected: boolean, zebra: boolean): string {
  return cn(
    'border-border-subtle relative grid min-h-16 cursor-pointer items-center gap-x-4 border-b px-4 text-left outline-none transition-[background-color,box-shadow] duration-150 last:border-0 focus-visible:shadow-focus motion-reduce:transition-none',
    selected
      ? 'bg-bg-elevated shadow-row-selected z-10'
      : cn('hover:bg-row-hover', zebra && 'bg-bg-base'),
  );
}

export function TableFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-border-subtle text-text-tertiary flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t px-4 py-2.5 text-xs">
      {children}
    </div>
  );
}
