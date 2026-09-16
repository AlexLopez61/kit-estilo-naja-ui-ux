'use client';

/**
 * Molde de card de settings estilo Vercel — anatomía: título y descripción
 * dentro del card, contenido, y footer strip (banda gris con borde superior:
 * hint a la izquierda + acción a la derecha). Nació en el alta enfocada de
 * propiedades; promovido a shared al reutilizarse en /catalogo/nuevo.
 */

import * as React from 'react';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/** Card de settings estilo Vercel. `footer` (hint) y `footerAction` van en la banda inferior. */
export function SettingsCard({
  title,
  badge,
  description,
  footer,
  footerAction,
  className,
  children,
}: {
  title: string;
  /** Chip discreto junto al título (ej. "Opcional"). */
  badge?: string;
  description?: string;
  /** Hint de la banda inferior. Sin `footer` ni `footerAction` no se renderiza la banda. */
  footer?: React.ReactNode;
  footerAction?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn('overflow-hidden rounded-lg border bg-card', className)}>
      <div className="flex flex-col gap-4 px-6 py-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-medium text-foreground">{title}</h2>
            {badge && (
              <span className="inline-flex items-center rounded-sm bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                {badge}
              </span>
            )}
          </div>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {children}
      </div>
      {(footer || footerAction) && (
        <div className="flex min-h-12 items-center justify-between gap-4 border-t bg-muted/30 px-6 py-2.5">
          <span className="text-[13px] text-muted-foreground">{footer}</span>
          {footerAction}
        </div>
      )}
    </section>
  );
}

/** Campo etiquetado: label gris, requerido en primary, error o hint debajo. */
export function Field({
  label,
  htmlFor,
  required,
  error,
  hint,
  className,
  children,
}: {
  label: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={htmlFor} className="text-[13px] font-normal text-muted-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

/** Micro-etiqueta de subsección dentro de un card (sentence case). */
export function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-medium text-muted-foreground">
      {children}
    </p>
  );
}
