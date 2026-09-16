'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Tabs as TabsPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

function Tabs({
  className,
  orientation = 'horizontal',
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={cn('group/tabs flex gap-2 data-[orientation=horizontal]:flex-col', className)}
      {...props}
    />
  );
}

const tabsListVariants = cva(
  'group/tabs-list items-center text-muted-foreground group-data-[orientation=vertical]/tabs:flex-col',
  {
    variants: {
      variant: {
        default:
          'inline-flex w-fit justify-center rounded-lg bg-muted p-[3px] group-data-[orientation=horizontal]/tabs:h-9 group-data-[orientation=vertical]/tabs:h-fit',
        // Molde de tabs de módulo (M0): línea inferior sutil y un subrayado
        // negro que se DESLIZA entre pestañas (indicador absoluto medido).
        line: 'relative flex gap-6 border-b border-border-subtle',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

/**
 * Indicador del subrayado de la variante `line`. Se posiciona midiendo el
 * trigger activo (`translateX` + `width`); la primera colocación va sin
 * transición y a partir del siguiente frame desliza en 300 ms. Sigue cambios
 * de pestaña (MutationObserver sobre `data-state`) y de tamaño (ResizeObserver).
 */
function useLineIndicator(enabled: boolean) {
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const indicatorRef = React.useRef<HTMLSpanElement | null>(null);

  React.useLayoutEffect(() => {
    if (!enabled) return;
    const list = listRef.current;
    const indicator = indicatorRef.current;
    if (!list || !indicator) return;

    const place = () => {
      const active = list.querySelector<HTMLElement>(
        '[data-slot="tabs-trigger"][data-state="active"]',
      );
      if (!active) {
        indicator.style.width = '0px';
        return;
      }
      indicator.style.transform = `translateX(${active.offsetLeft}px)`;
      indicator.style.width = `${active.offsetWidth}px`;
    };

    place();
    const frame = requestAnimationFrame(() => {
      indicator.dataset.ready = 'true';
    });
    const mutations = new MutationObserver(place);
    mutations.observe(list, {
      attributes: true,
      attributeFilter: ['data-state'],
      subtree: true,
      childList: true,
    });
    let resize: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined') {
      resize = new ResizeObserver(place);
      resize.observe(list);
    }
    return () => {
      cancelAnimationFrame(frame);
      mutations.disconnect();
      resize?.disconnect();
    };
  }, [enabled]);

  return { listRef, indicatorRef };
}

function TabsList({
  className,
  variant = 'default',
  children,
  ref,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>) {
  const isLine = variant === 'line';
  const { listRef, indicatorRef } = useLineIndicator(isLine);

  const setRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      listRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [listRef, ref],
  );

  return (
    <TabsPrimitive.List
      ref={setRef}
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    >
      {children}
      {isLine && (
        <span
          ref={indicatorRef}
          aria-hidden
          data-ready="false"
          className="bg-foreground pointer-events-none absolute -bottom-px left-0 h-0.5 w-0 duration-300 ease-out data-[ready=true]:transition-[transform,width] motion-reduce:transition-none!"
        />
      )}
    </TabsPrimitive.List>
  );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        // Base compartida por ambas variantes
        "relative inline-flex items-center justify-center gap-1.5 text-sm font-medium whitespace-nowrap outline-none transition-all duration-150 group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        // Variante default (píldoras sobre bg-muted): solo dentro de formularios
        'group-data-[variant=default]/tabs-list:h-[calc(100%-1px)] group-data-[variant=default]/tabs-list:flex-1 group-data-[variant=default]/tabs-list:rounded-md group-data-[variant=default]/tabs-list:border group-data-[variant=default]/tabs-list:border-transparent group-data-[variant=default]/tabs-list:px-2 group-data-[variant=default]/tabs-list:py-1 group-data-[variant=default]/tabs-list:text-foreground/60 group-data-[variant=default]/tabs-list:hover:text-foreground group-data-[variant=default]/tabs-list:focus-visible:border-ring/50 group-data-[variant=default]/tabs-list:focus-visible:shadow-focus group-data-[variant=default]/tabs-list:data-[state=active]:bg-background group-data-[variant=default]/tabs-list:data-[state=active]:text-foreground group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm',
        // Variante line: el subrayado lo pinta el indicador deslizante de TabsList;
        // el trigger solo reserva el alto con un borde transparente.
        'group-data-[variant=line]/tabs-list:-mb-px group-data-[variant=line]/tabs-list:border-b-2 group-data-[variant=line]/tabs-list:border-transparent group-data-[variant=line]/tabs-list:px-3 group-data-[variant=line]/tabs-list:py-2 group-data-[variant=line]/tabs-list:text-text-secondary group-data-[variant=line]/tabs-list:hover:text-text-primary group-data-[variant=line]/tabs-list:focus-visible:text-text-primary group-data-[variant=line]/tabs-list:data-[state=active]:text-text-primary',
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        'flex-1 outline-none',
        // Entrada del contenido del tab (M0): fade + 4 px de subida en 300 ms.
        'data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-1 data-[state=active]:duration-300 data-[state=active]:ease-out motion-reduce:animate-none',
        className,
      )}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
