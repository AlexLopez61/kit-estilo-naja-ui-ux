'use client';

import * as React from 'react';
import { Switch as SwitchPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

/**
 * Switch — track con padding fijo y thumb que llena el alto (modelo "snug").
 * Tamaños explícitos por `size` (no variantes group-data) para que el thumb
 * quede siempre proporcionado al pill y viaje justo de extremo a extremo.
 */
function Switch({
  className,
  size = 'default',
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: 'sm' | 'default';
}) {
  const trackSize = size === 'sm' ? 'h-4 w-7' : 'h-5 w-9';
  const thumbSize =
    size === 'sm'
      ? 'size-3 data-[state=checked]:translate-x-3'
      : 'size-4 data-[state=checked]:translate-x-4';

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        'peer inline-flex shrink-0 items-center rounded-full p-0.5 shadow-xs transition-colors outline-none focus-visible:shadow-focus disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
        trackSize,
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'pointer-events-none block rounded-full bg-background shadow-sm ring-0 transition-transform data-[state=unchecked]:translate-x-0',
          thumbSize,
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
