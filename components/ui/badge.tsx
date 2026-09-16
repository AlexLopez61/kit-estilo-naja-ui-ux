import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

/**
 * Badge — Soft Bento Dark.
 *
 * API doble (no-breaking):
 * - `variant`: compat shadcn. Todos los valores remapeados a tokens Soft Bento.
 * - `tone`: API preferida del sistema (`success|warning|danger|info|brand|neutral`).
 *
 * Si se pasan ambos, `tone` gana. Internamente resuelven al mismo set de estilos.
 * Molde visual: la def validada del showcase (pill `rounded-sm`, `text-xs`, sin
 * borde salvo `outline`, peso 400/500).
 */
const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-sm border border-transparent px-2 py-0.5 text-xs whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring/50 focus-visible:shadow-focus aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&>svg]:pointer-events-none [&>svg]:size-3',
  {
    variants: {
      variant: {
        // Compat shadcn — remapeadas a tokens Soft Bento
        default: 'bg-bg-elevated text-text-secondary',
        secondary: 'bg-bg-elevated text-text-secondary',
        destructive: 'bg-danger-subtle text-danger-text',
        outline: 'border-border-default text-text-secondary',
        ghost: 'text-text-secondary',
        link: 'text-brand-text underline-offset-4 [a&]:hover:underline',
        // Semánticas / tones del sistema
        success: 'bg-success-subtle text-success-text',
        warning: 'bg-warning-subtle text-warning-text',
        danger: 'bg-danger-subtle text-danger-text',
        info: 'bg-info-subtle text-info-text',
        brand: 'bg-brand-subtle text-brand-text',
        neutral: 'bg-bg-elevated text-text-secondary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export type BadgeTone = 'success' | 'warning' | 'danger' | 'info' | 'brand' | 'neutral';

function Badge({
  className,
  variant,
  tone,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { tone?: BadgeTone; asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'span';
  const resolved = tone ?? variant ?? 'default';

  return (
    <Comp
      data-slot="badge"
      data-variant={resolved}
      className={cn(badgeVariants({ variant: resolved }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
