'use client';

import * as React from 'react';
import { XIcon } from 'lucide-react';
import { Dialog as SheetPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({ ...props }: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({ ...props }: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({ ...props }: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0',
        className,
      )}
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  side = 'right',
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: 'top' | 'right' | 'bottom' | 'left';
  showCloseButton?: boolean;
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          // Drawer flotante (Alex 10/09/2026): separado del borde de la pantalla
          // por el mismo margen que el marco de la vista (SidebarInset inset,
          // m-2 = 8px) y con el radio de las superficies grandes (rounded-xl,
          // 12px), borde y sombra como NajaModal: se lee como una card, no como
          // una columna pegada al viewport. La animación recorre ancho + margen
          // para que no asome una lámina del panel al abrir/cerrar.
          // Ancho: lo fija la primitiva (100% - 2 x 8px). Los consumidores solo
          // pasan sm:max-w-*, NUNCA w-full (rompería el margen izquierdo en móvil).
          'fixed z-50 flex flex-col gap-4 overflow-hidden rounded-xl border border-border bg-background shadow-lg transition ease-in-out data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:animate-in data-[state=open]:duration-500',
          side === 'right' &&
            'inset-y-2 right-2 w-[calc(100%-1rem)] data-[state=closed]:slide-out-to-right-[calc(100%+0.5rem)] data-[state=open]:slide-in-from-right-[calc(100%+0.5rem)] sm:max-w-sm',
          side === 'left' &&
            'inset-y-2 left-2 w-[calc(100%-1rem)] data-[state=closed]:slide-out-to-left-[calc(100%+0.5rem)] data-[state=open]:slide-in-from-left-[calc(100%+0.5rem)] sm:max-w-sm',
          side === 'top' &&
            'inset-x-2 top-2 h-auto data-[state=closed]:slide-out-to-top-[calc(100%+0.5rem)] data-[state=open]:slide-in-from-top-[calc(100%+0.5rem)]',
          side === 'bottom' &&
            'inset-x-2 bottom-2 h-auto data-[state=closed]:slide-out-to-bottom-[calc(100%+0.5rem)] data-[state=open]:slide-in-from-bottom-[calc(100%+0.5rem)]',
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close className="absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus-visible:shadow-focus focus-visible:outline-hidden disabled:pointer-events-none data-[state=open]:bg-secondary">
            <XIcon className="size-4" />
            <span className="sr-only">Cerrar</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-header"
      className={cn('flex flex-col gap-1.5 p-4', className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn('mt-auto flex flex-col gap-2 p-4', className)}
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn('font-medium text-foreground', className)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
