'use client';

/**
 * NajaModal — wrapper sobre el Dialog de shadcn/Radix.
 *
 * Sigue el estándar de dos tonos de los modales: piso del modal en
 * `bg-background` y cards/secciones internas en `bg-card` con borde.
 *
 * Encapsula el "chrome" compartido de los modales del sistema para no repetir
 * los overrides de tokens en cada variante (hoy duplicados inline en, p. ej.,
 * `SupplierFormModal`):
 *
 *   ┌─ header ──────────────────────────────┐  ícono en cuadro emerald + título
 *   │  [▢]  Título                       [×] │  + subtítulo, borde inferior sutil
 *   ├───────────────────────────────────────┤
 *   │  body (scrolleable)                    │  contenido de cada variante
 *   ├───────────────────────────────────────┤
 *   │                       Cancelar  Acción │  footer anclado, borde superior
 *   └───────────────────────────────────────┘
 *
 * Niveles de profundidad (relativos, vía tokens): el contenedor flota a
 * `bg-background`; las variantes apilan cards `bg-card` encima e inputs
 * al mismo tono que la card (`bg-card`).
 *
 * El chrome ESTÁNDAR de los modales de formulario (decisión 26/08/2026) es el
 * lenguaje Vercel: `headerAlign="center"` (chip circular + título centrado) +
 * `footerMuted` (banda gris) con CTA negro; cuerpo con StepCards numeradas
 * (`components/shared/StepCard`) e inputs recesados `bg-bg-base`. Referencia:
 * `WorkOrderCloseModal` (cierre de OT). El liquid glass (`glassHeader` +
 * `glassFooter`) quedó descartado como estándar — NO aplicarlo a modales
 * nuevos; los que lo tengan se migran al tocarlos.
 *
 * El modal destructivo NO usa este wrapper: vive sobre `AlertDialog` (rol
 * `alertdialog`, sin cierre por click-fuera) — ver `ConfirmDeleteModal`.
 */

import * as React from 'react';
import { X, type LucideIcon } from 'lucide-react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const SIZE_CLASS = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-2xl',
  '2xl': 'sm:max-w-3xl',
  '3xl': 'sm:max-w-4xl',
} as const;

const TONE_CLASS = {
  brand: 'bg-primary/10 text-primary',
  danger: 'bg-destructive/10 text-destructive',
} as const;

export type NajaModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Ícono lucide mostrado en el cuadro emerald del header. */
  icon?: LucideIcon;
  /** Color del cuadro del ícono. Default `brand` (emerald). */
  iconTone?: keyof typeof TONE_CLASS;
  /** Nodo libre que reemplaza al cuadro del ícono (ej. avatar en DetailModal). */
  leading?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Contenido extra del header, bajo el título (ej. stepper del wizard). */
  headerAddon?: React.ReactNode;
  /** Acciones ancladas al pie. Si se omite, no se renderiza el footer. */
  footer?: React.ReactNode;
  /** Ancho máximo del contenedor. Default `lg`. */
  size?: keyof typeof SIZE_CLASS;
  /** Si es `false`, no cierra por Esc ni click-fuera (wizard, flujos guiados). */
  dismissable?: boolean;
  /** Muestra el botón × en el header. Default `true`. */
  showClose?: boolean;
  /**
   * Header flotante estilo liquid glass: transparente con blur y degradado
   * que se desvanece hacia abajo; el contenido scrollea por debajo. El body
   * recibe `pt-28` para librar el header — ajústalo con `bodyClassName` si el
   * header es más alto (p. ej. con `headerAddon`).
   */
  glassHeader?: boolean;
  /**
   * Footer flotante con el mismo vidrio, espejado (transparente arriba →
   * sólido abajo). El body recibe `pb-24` para librar el footer.
   */
  glassFooter?: boolean;
  /** Clases extra para el contenedor scrolleable del body. */
  bodyClassName?: string;
  /** Clases extra para el contenedor del modal. */
  className?: string;
  /**
   * Lenguaje Vercel de modales (estándar desde 08/2026): `center` pinta el
   * header centrado con chip circular (`bg-secondary`) + título `text-lg
   * tracking-tight`, como `RegisterChargeModal`. Default `start` (cuadro
   * emerald a la izquierda, molde 11.1).
   */
  headerAlign?: 'start' | 'center';
  /** Footer en banda gris (`bg-muted/30`), molde del footer strip de SettingsCard. */
  footerMuted?: boolean;
  children: React.ReactNode;
};

export function NajaModal({
  open,
  onOpenChange,
  icon: Icon,
  iconTone = 'brand',
  leading,
  title,
  description,
  headerAddon,
  footer,
  size = 'lg',
  dismissable = true,
  showClose = true,
  glassHeader = false,
  glassFooter = false,
  bodyClassName,
  className,
  headerAlign = 'start',
  footerMuted = false,
  children,
}: NajaModalProps) {
  const blockDismiss = (e: Event) => {
    if (!dismissable) e.preventDefault();
  };
  const centered = headerAlign === 'center' && !glassHeader;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        onEscapeKeyDown={blockDismiss}
        onPointerDownOutside={blockDismiss}
        onInteractOutside={blockDismiss}
        // Sin description explícita evitamos el warning de aria-describedby de Radix.
        aria-describedby={description ? undefined : undefined}
        className={cn(
          'flex max-h-[85vh] flex-col gap-0 overflow-hidden rounded-xl border-border bg-background p-0 shadow-lg',
          // Si `size` cambia con el modal abierto (p. ej. el paso de tipo del
          // Catálogo), el ancho se anima en vez de brincar.
          'transition-[max-width] ease-in-out',
          SIZE_CLASS[size],
          className,
        )}
      >
        {centered ? (
          /* Header centrado estilo drawer de Vercel: chip circular + título. */
          <DialogHeader className="relative items-center gap-0 border-b border-border px-6 pt-8 pb-6 text-center sm:text-center">
            {leading
              ? leading
              : Icon && (
                  <span className="flex size-10 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                    <Icon className="size-[18px]" strokeWidth={1.5} />
                  </span>
                )}
            <DialogTitle className="mt-3 text-lg tracking-tight text-foreground">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="mt-1 text-muted-foreground">
                {description}
              </DialogDescription>
            )}
            {headerAddon && <div className="mt-4 w-full text-left">{headerAddon}</div>}
            {showClose && (
              <DialogClose className="absolute top-3 right-3 inline-flex size-7 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:shadow-focus">
                <X className="size-4" strokeWidth={1.5} />
                <span className="sr-only">Cerrar</span>
              </DialogClose>
            )}
          </DialogHeader>
        ) : (
          <DialogHeader
            className={cn(
              'block space-y-0 px-6 py-4 text-left',
              // pointer-events-none: el header flotante no debe interceptar el
              // scrollbar que corre por debajo; los hijos re-activan sus clicks.
              glassHeader
                ? 'pointer-events-none absolute inset-x-0 top-0 z-10'
                : 'border-b border-border',
            )}
          >
            {glassHeader && (
              // Vidrio: blur sutil + tinte en curva suave (5 paradas tipo ease:
              // transparente abajo → sólido arriba, sin quiebres visibles); la
              // máscara desvanece el blur en el 20% inferior. En desktop respeta
              // el carril del scrollbar (10px, globals.css) para no difuminarlo.
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 right-0 -z-10 bg-[linear-gradient(to_top,transparent,color-mix(in_oklab,var(--background)_20%,transparent)_35%,color-mix(in_oklab,var(--background)_50%,transparent)_55%,color-mix(in_oklab,var(--background)_80%,transparent)_78%,var(--background))] backdrop-blur-[2px] [mask-image:linear-gradient(to_top,transparent,black_20%)] md:right-2.5"
              />
            )}
            <div className={cn('flex items-start gap-3', glassHeader && 'pointer-events-auto')}>
              {leading
                ? leading
                : Icon && (
                    <span
                      className={cn(
                        'inline-flex size-9 shrink-0 items-center justify-center rounded-lg',
                        TONE_CLASS[iconTone],
                      )}
                    >
                      <Icon className="size-[18px]" strokeWidth={1.5} />
                    </span>
                  )}
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-base font-medium text-foreground">{title}</DialogTitle>
                {description && (
                  <DialogDescription className="mt-1 text-muted-foreground">
                    {description}
                  </DialogDescription>
                )}
              </div>
              {showClose && (
                <DialogClose className="-mt-1 -mr-1 inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:shadow-focus">
                  <X className="size-4" strokeWidth={1.5} />
                  <span className="sr-only">Cerrar</span>
                </DialogClose>
              )}
            </div>
            {headerAddon && (
              <div className={cn('mt-4', glassHeader && 'pointer-events-auto')}>{headerAddon}</div>
            )}
          </DialogHeader>
        )}

        <div
          className={cn(
            // isolate: el body forma su propio stacking context para que ningún
            // z-index interno (ej. la línea "Hoy" del timeline de pagarés) se
            // pinte por encima del header/footer glass (z-10).
            'isolate min-h-0 flex-1 overflow-y-auto px-6 py-5',
            glassHeader && 'pt-28',
            glassFooter && 'pb-24',
            bodyClassName,
          )}
        >
          {children}
        </div>

        {footer && (
          <div
            className={cn(
              'shrink-0 px-6 py-4',
              glassFooter
                ? 'pointer-events-none absolute inset-x-0 bottom-0 z-10'
                : 'border-t border-border',
              footerMuted && !glassFooter && 'bg-muted/30',
            )}
          >
            {glassFooter && (
              // Mismo vidrio que el header, espejado (curva suave hacia abajo);
              // la máscara desvanece el blur en el 20% superior. Carril del
              // scrollbar libre en desktop.
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 right-0 -z-10 bg-[linear-gradient(to_bottom,transparent,color-mix(in_oklab,var(--background)_20%,transparent)_35%,color-mix(in_oklab,var(--background)_50%,transparent)_55%,color-mix(in_oklab,var(--background)_80%,transparent)_78%,var(--background))] backdrop-blur-[2px] [mask-image:linear-gradient(to_bottom,transparent,black_20%)] md:right-2.5"
              />
            )}
            <div
              className={cn(
                'flex items-center justify-end gap-2',
                glassFooter && 'pointer-events-auto',
              )}
            >
              {footer}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
