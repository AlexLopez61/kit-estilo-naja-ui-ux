'use client';

/**
 * AutoHideScrollArea — área de scroll con barra propia superpuesta que
 * aparece al scrollear y se desvanece tras `hideDelay` ms sin actividad, con
 * fundido de opacidad en ambos sentidos (Alex 07/09/2026; usada en las listas
 * y fichas de Finanzas › Movimientos, Pendientes y Cuentas).
 *
 * Por qué no la barra nativa: Chromium no anima `::-webkit-scrollbar-*` (las
 * transiciones de opacidad se ignoran), así que la única forma de fundirla es
 * que sea un elemento normal — Radix ScrollArea en modo `type="scroll"`. La
 * barra es overlay (no reserva ancho) y Radix oculta la nativa del viewport
 * por su cuenta. Usa los mismos tokens de color que la barra nativa
 * (`--ds-scrollbar-thumb` / `-hover`) para que se lea igual en ambos temas.
 *
 * Alturas: el Root necesita altura definida (p. ej. `min-h-0 flex-1` dentro
 * de una columna flex acotada). Cuando no la tiene (móvil, o paneles fuera de
 * un marco de altura fija), acota el VIEWPORT con `viewportClassName="max-h-…"`
 * — un max-h en el Root no sirve porque el viewport mide 100% de una altura
 * indefinida y no scrollea.
 *
 * `axis="both"` agrega la barra horizontal (tablas anchas que desbordan en
 * pantallas medianas); por default solo vertical.
 *
 * Ancho del contenido: Radix envuelve a los hijos en un div `display: table;
 * min-width: 100%` para que puedan ser MÁS anchos que el viewport (scroll
 * horizontal). Como tabla, ese wrapper crece hasta el min-content de los hijos:
 * cualquier texto `truncate`/`whitespace-nowrap` (subline de las fichas) lo
 * ensanchaba más allá del panel y la ficha salía cortada por la derecha
 * (Alex 08/09). En modo solo vertical el contenido lleva `contain: inline-size`
 * para que su intrínseco no cuente y el wrapper se quede en el 100% del
 * viewport; con `axis="both"` se respeta el desborde horizontal.
 */

import * as React from 'react';
import { ScrollArea as ScrollAreaPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

/* Presence de Radix mantiene la barra montada hasta que termina la animación
   de salida: por eso el fundido va como animate-in/out (no como transition,
   que Presence no detecta). z-30: el contenido puede elevar elementos (filas
   en hover/seleccionadas con z-10, toolbar y vidrio del chrome glass con
   z-20) y la barra superpuesta debe quedar encima de todos. */
const SCROLLBAR_CLASS =
  'z-30 flex touch-none p-0.5 select-none data-[state=hidden]:animate-out data-[state=hidden]:fade-out-0 data-[state=visible]:animate-in data-[state=visible]:fade-in-0 duration-300 motion-reduce:animate-none';
const THUMB_CLASS =
  'relative flex-1 rounded-full bg-(--ds-scrollbar-thumb) transition-colors hover:bg-(--ds-scrollbar-thumb-hover)';

export function AutoHideScrollArea({
  className,
  viewportClassName,
  contentClassName,
  hideDelay = 2000,
  axis = 'vertical',
  children,
  ...props
}: Omit<React.ComponentProps<typeof ScrollAreaPrimitive.Root>, 'type' | 'scrollHideDelay'> & {
  /** Clases del viewport (el elemento que scrollea): alturas máximas, etc. */
  viewportClassName?: string;
  /** Clases del contenido (padding, space-y): van en un div propio porque el
      viewport de Radix envuelve a los hijos en un wrapper intermedio. */
  contentClassName?: string;
  /** Milisegundos sin scroll antes de fundir la barra. */
  hideDelay?: number;
  /** Ejes con barra: solo vertical (default) o vertical + horizontal. */
  axis?: 'vertical' | 'both';
}) {
  return (
    <ScrollAreaPrimitive.Root
      type="scroll"
      scrollHideDelay={hideDelay}
      data-slot="scroll-area"
      className={cn('relative', className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className={cn('size-full outline-none', viewportClassName)}
      >
        <div className={cn(axis === 'vertical' && '[contain:inline-size]', contentClassName)}>
          {children}
        </div>
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.ScrollAreaScrollbar
        orientation="vertical"
        data-slot="scroll-area-scrollbar"
        className={cn(SCROLLBAR_CLASS, 'h-full w-2.5')}
      >
        <ScrollAreaPrimitive.ScrollAreaThumb
          data-slot="scroll-area-thumb"
          className={THUMB_CLASS}
        />
      </ScrollAreaPrimitive.ScrollAreaScrollbar>
      {axis === 'both' && (
        <ScrollAreaPrimitive.ScrollAreaScrollbar
          orientation="horizontal"
          data-slot="scroll-area-scrollbar"
          className={cn(SCROLLBAR_CLASS, 'h-2.5 flex-col')}
        >
          <ScrollAreaPrimitive.ScrollAreaThumb
            data-slot="scroll-area-thumb"
            className={THUMB_CLASS}
          />
        </ScrollAreaPrimitive.ScrollAreaScrollbar>
      )}
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}
