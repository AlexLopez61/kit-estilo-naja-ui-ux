'use client';

import * as React from 'react';
import { ChevronRight } from 'lucide-react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

/**
 * Fila desplegable estilo "Deployment Settings" de Vercel para usar dentro de
 * cards: trigger con chevron que rota + título + chip/resumen que se desvanece
 * al abrir, y contenido con animación de despliegue/pliegue (Radix Collapsible
 * + animate-collapsible-* de tw-animate-css).
 */
export function DisclosureRow({
  title,
  badge,
  summary,
  defaultOpen,
  persistentBadge,
  className,
  triggerClassName,
  children,
}: {
  title: string;
  /** Chip discreto junto al título (ej. conteo). Se oculta al expandir. */
  badge?: React.ReactNode;
  /** Resumen inline en gris (ej. dirección truncada). Se oculta al expandir. */
  summary?: React.ReactNode;
  defaultOpen?: boolean;
  /** Mantiene badge/summary visibles con el acordeón abierto (diseño 3a). */
  persistentBadge?: boolean;
  className?: string;
  /** Overrides del trigger (ej. padding horizontal distinto al default px-6). */
  triggerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <Collapsible defaultOpen={defaultOpen} className={className}>
      <CollapsibleTrigger
        className={cn(
          'group flex w-full cursor-pointer items-center gap-2 px-6 py-3.5 text-left text-sm font-semibold text-foreground select-none',
          triggerClassName,
        )}
      >
        <ChevronRight
          className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90"
          strokeWidth={1.5}
        />
        {title}
        {(badge || summary) && (
          <span
            className={cn(
              'flex min-w-0 flex-1 items-center gap-2 transition-opacity duration-200',
              !persistentBadge && 'group-data-[state=open]:opacity-0',
              summary && 'text-sm font-normal text-muted-foreground',
            )}
          >
            {badge}
            {summary}
          </span>
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
