'use client';

import * as React from 'react';
import { Avatar as AvatarPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

export type AvatarTone = 'success' | 'warning' | 'danger' | 'info' | 'brand' | 'neutral';

const AVATAR_TONE: Record<AvatarTone, string> = {
  success: 'bg-success-subtle text-success-text',
  warning: 'bg-warning-subtle text-warning-text',
  danger: 'bg-danger-subtle text-danger-text',
  info: 'bg-info-subtle text-info-text',
  brand: 'bg-brand-subtle text-brand-text',
  neutral: 'bg-muted text-muted-foreground',
};

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
}

/**
 * Avatar — API doble (no-breaking):
 * - Ergonómica: `name` / `initials` / `src` / `size` (px, default 32) / `square` / `tone`.
 *   Sin foto, el fallback es negro con iniciales blancas SIEMPRE (decisión de
 *   Alex 15/07: no se invierte al cambiar de tema, como los logos de proyecto
 *   de Vercel). El ring sutil delimita el círculo sobre fondos oscuros.
 *   `tone` explícito lo sobreescribe para call sites con color semántico.
 * - Composición clásica (shadcn): pasar `<AvatarImage>` / `<AvatarFallback>` como children.
 *
 * Si se pasan props ergonómicas, se ignoran los children. `className` siempre se
 * aplica al Root (preserva ring / shadow / grayscale / radius custom de los call sites).
 */
function Avatar({
  className,
  name,
  initials,
  src,
  size,
  square = false,
  tone,
  children,
  style,
  ...props
}: Omit<React.ComponentProps<typeof AvatarPrimitive.Root>, 'children'> & {
  name?: string;
  initials?: string;
  src?: string;
  size?: number;
  square?: boolean;
  tone?: AvatarTone;
  children?: React.ReactNode;
}) {
  const ergonomic = name != null || initials != null || src != null;
  const px = size ?? 32;
  const rootStyle = size != null ? { width: px, height: px, ...style } : style;

  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      style={rootStyle}
      className={cn(
        'group/avatar relative flex shrink-0 overflow-hidden select-none',
        size == null && 'size-8',
        square ? 'rounded-md' : 'rounded-full',
        className,
      )}
      {...props}
    >
      {ergonomic ? (
        <>
          {src ? (
            <AvatarPrimitive.Image
              data-slot="avatar-image"
              src={src}
              alt={name ?? ''}
              className="aspect-square size-full"
            />
          ) : null}
          <AvatarPrimitive.Fallback
            data-slot="avatar-fallback"
            className={cn(
              'flex size-full items-center justify-center font-medium',
              square ? 'rounded-md' : 'rounded-full',
              tone
                ? AVATAR_TONE[tone]
                : 'ring-border-default bg-black text-white ring-1 ring-inset',
            )}
            style={{ fontSize: Math.round(px * 0.34) }}
          >
            {initials ?? (name ? initialsFromName(name) : '')}
          </AvatarPrimitive.Fallback>
        </>
      ) : (
        children
      )}
    </AvatarPrimitive.Root>
  );
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn('aspect-square size-full', className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        'flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground group-data-[size=sm]/avatar:text-xs',
        className,
      )}
      {...props}
    />
  );
}

function AvatarBadge({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        'absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background select-none',
        'group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden',
        'group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2',
        'group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2',
        className,
      )}
      {...props}
    />
  );
}

function AvatarGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        'group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background',
        className,
      )}
      {...props}
    />
  );
}

function AvatarGroupCount({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        'relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground ring-2 ring-background group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3',
        className,
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup, AvatarGroupCount };
