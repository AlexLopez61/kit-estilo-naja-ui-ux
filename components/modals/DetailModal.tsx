'use client';

/**
 * DetailModal — ficha de solo lectura de un registro (ej. un proveedor).
 *
 * Compone sobre `NajaModal`: el header lleva avatar/logo + nombre + badges
 * (tipo y categoría) vía el slot `leading`; el body agrupa pares label/valor en
 * las mismas cards bento, pero como texto plano. El footer ofrece Cerrar y
 * Editar (callback, no navegación cableada).
 */

import * as React from 'react';
import { Building2, Pencil, User } from 'lucide-react';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { NajaModal } from '@/components/ui/naja-modal';

export type DetailRow = { label: string; value: React.ReactNode };
export type DetailSection = { title: string; rows: DetailRow[] };

export function DetailModal({
  open,
  onOpenChange,
  name,
  kind,
  category,
  avatarUrl,
  sections,
  onEdit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  kind?: 'persona' | 'empresa';
  category?: string;
  avatarUrl?: string | null;
  sections: DetailSection[];
  /** Abre el modal de edición. Sin esto, se oculta el botón Editar. */
  onEdit?: () => void;
}) {
  const KindIcon = kind === 'persona' ? User : Building2;

  return (
    <NajaModal
      open={open}
      onOpenChange={onOpenChange}
      leading={<Avatar name={name} src={avatarUrl ?? undefined} size={40} />}
      title={name}
      description={
        (kind || category) && (
          <span className="flex flex-wrap items-center gap-1.5">
            {kind && (
              <span className="inline-flex items-center gap-1 rounded-sm bg-primary/10 px-2 py-0.5 text-xs text-primary">
                <KindIcon className="size-3" strokeWidth={1.5} />
                {kind === 'persona' ? 'Persona' : 'Empresa'}
              </span>
            )}
            {category && (
              <span className="inline-flex items-center rounded-sm bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {category}
              </span>
            )}
          </span>
        )
      }
      footer={
        <>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
          {onEdit && (
            <Button type="button" onClick={onEdit}>
              <Pencil className="size-4" strokeWidth={1.5} />
              Editar
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-3">
        {sections.map((section) => (
          <section
            key={section.title}
            className="space-y-2.5 rounded-lg border border-border bg-card p-4"
          >
            <h3 className="text-xs tracking-wide text-muted-foreground uppercase">
              {section.title}
            </h3>
            <dl className="space-y-2">
              {section.rows.map((row) => (
                <div key={row.label} className="flex items-start justify-between gap-4 text-sm">
                  <dt className="shrink-0 text-muted-foreground">{row.label}</dt>
                  <dd className="min-w-0 text-right text-foreground">{row.value || '—'}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </NajaModal>
  );
}
