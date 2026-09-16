import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Par label/valor apilado de las fichas en panel (molde MovementDetailPanel /
 * CuentaDetailPanel): label `text-xs` secundaria arriba, valor `text-sm`
 * primario debajo. Va dentro de un `<dl>` en rejilla.
 */
export function PanelField({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('min-w-0', className)}>
      <dt className="text-text-secondary text-xs">{label}</dt>
      <dd className="text-text-primary mt-1 text-sm break-words">{children}</dd>
    </div>
  );
}

/** Fila label · valor en una línea (sub-cards «Relación»). */
export function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <dt className="text-text-secondary shrink-0">{label}</dt>
      <dd className="text-text-primary min-w-0 text-right break-words">{children}</dd>
    </div>
  );
}
