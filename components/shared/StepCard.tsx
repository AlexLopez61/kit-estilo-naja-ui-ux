'use client';

/**
 * StepCard + Field — primitivas del lenguaje Vercel de modales (referencia:
 * WorkOrderCloseModal, cierre de OT): card `bg-bg-surface` con chip numerado,
 * título semibold y hint terciario; Field con label chico, asterisco brand y
 * error/hint debajo. Los inputs dentro van recesados (`bg-bg-base`).
 */

import * as React from 'react';

import { Label } from '@/components/ui/label';

export function StepCard({
  step,
  title,
  hint,
  action,
  children,
}: {
  /** Chip numerado del wizard; sin número = card de sección simple. */
  step?: number;
  title: string;
  hint?: string;
  /** Nodo a la derecha del título (ej. botón "Agregar variante"). */
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="border-border-subtle bg-bg-surface space-y-3 rounded-lg border p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          {step !== undefined && (
            <span className="bg-bg-elevated text-text-secondary grid size-5 shrink-0 place-items-center rounded-full text-[11px] font-medium tabular-nums">
              {step}
            </span>
          )}
          <div className="min-w-0">
            <h3 className="text-text-primary text-sm leading-5 font-semibold">{title}</h3>
            {hint && <p className="text-text-tertiary text-xs">{hint}</p>}
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

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
    <div className="space-y-1">
      <Label className="text-text-secondary text-xs">
        {label}
        {required && <span className="text-brand-text ml-0.5">*</span>}
      </Label>
      {children}
      {error ? (
        <p className="text-danger-text text-xs" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-text-tertiary text-xs">{hint}</p>
      ) : null}
    </div>
  );
}
