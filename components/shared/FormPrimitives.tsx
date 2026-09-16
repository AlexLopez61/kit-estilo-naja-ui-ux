'use client';

/**
 * Primitivos del ALTA de órdenes (OT y OC): las cards apiladas sobre el fondo
 * elevado, los slots opcionales «Agregar…» y el Field con label presente, todo
 * escalado ~1.25x (Alex 02/09/2026: "ese tamaño pero escálalo"). Nacieron en
 * NewWorkOrderDrawer y se extrajeron el 10/09/2026 para que el alta de orden
 * de compra (NewPurchaseOrderDrawer) sea "lo más parecida" al alta de OT sin
 * duplicar chrome.
 */

import * as React from 'react';
import { Plus, X, type LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

/**
 * Escala 1.25x del alta: controles de 44px con texto base en vez de los
 * 36px / text-sm del resto de la app.
 */
export const CONTROL_CLASS = 'h-11 text-base md:text-base';
export const SELECT_CLASS = 'w-full text-base data-[size=default]:h-11';
export const TEXTAREA_CLASS = 'px-3.5 py-2.5 text-base md:text-base';

export const CHIP_CLASS = 'rounded-md border px-3.5 py-2 text-base transition-colors';
export const CHIP_ACTIVE = 'border-border-strong bg-bg-elevated text-text-primary font-medium';
export const CHIP_IDLE =
  'border-border-subtle bg-bg-base text-text-secondary hover:text-text-primary';

/**
 * Card del formulario (molde M6, alta en drawer o página): nivel 0 sobre el
 * piso — surface + borde sutil, sin sombra —, título semibold
 * con icono terciario y hint debajo. Sin título = card hero (el título grande
 * de la orden hace de encabezado). `action` va a la derecha del título.
 */
export function FormCard({
  icon: Icon,
  title,
  hint,
  action,
  children,
}: {
  icon?: LucideIcon;
  title?: string;
  hint?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="border-border-subtle bg-bg-surface rounded-lg border p-6">
      {title && (
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-text-primary inline-flex items-center gap-2 text-base font-semibold">
              {Icon && <Icon className="text-text-tertiary size-4" strokeWidth={2} />}
              {title}
            </h3>
            {hint && <p className="text-text-tertiary mt-0.5 text-sm">{hint}</p>}
          </div>
          {action}
        </div>
      )}
      <div className="space-y-5">{children}</div>
    </section>
  );
}

/**
 * Slot vacío de la card "Vincular": botón punteado que ocupa su celda de la
 * rejilla y, al clic, se convierte en el bloque del opcional.
 */
export function AddOnTile({
  icon: Icon,
  label,
  onClick,
  className,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'border-border-default text-text-secondary hover:text-text-primary hover:bg-bg-elevated flex min-h-14 w-full items-center justify-center gap-2 rounded-lg border border-dashed px-4 text-base transition-colors',
        className ?? '',
      ].join(' ')}
    >
      <Plus className="size-4" strokeWidth={1.5} />
      <Icon className="text-text-tertiary size-4" strokeWidth={1.5} />
      {label}
    </button>
  );
}

/**
 * Bloque de la card "Vincular": un opcional ya agregado — título, hint y ✕
 * para quitarlo (limpia su valor y devuelve el slot a "Agregar…").
 */
export function AddOnBlock({
  title,
  hint,
  onRemove,
  children,
}: {
  title: string;
  hint?: string;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-border-subtle space-y-4 rounded-lg border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-text-primary text-base font-medium">{title}</p>
          {hint && <p className="text-text-tertiary mt-0.5 text-sm">{hint}</p>}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Quitar ${title.toLowerCase()}`}
          onClick={onRemove}
          className="text-text-tertiary hover:text-text-primary -mt-1 -mr-1 shrink-0"
        >
          <X className="size-4" />
        </Button>
      </div>
      {children}
    </div>
  );
}

/**
 * Field del alta: label más presente (text-base medium en primario) que el
 * del molde de modales (`components/shared/StepCard`, text-xs secundario).
 * Alex lo pidió así por legibilidad; se conserva aunque el formulario vaya en
 * cards.
 */
export function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2.5">
      <Label className="text-text-primary text-base font-medium">
        {label}
        {required && <span className="text-brand-text ml-0.5">*</span>}
      </Label>
      {children}
      {error ? (
        <p className="text-danger-text text-sm" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-text-tertiary text-sm">{hint}</p>
      ) : null}
    </div>
  );
}
