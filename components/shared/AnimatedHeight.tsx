'use client';

/**
 * AnimatedHeight — contenedor que ANIMA su altura cuando el contenido cambia
 * de tamaño (03/09/2026, bloque de fotos del problema de la OT: al agregar la
 * primera foto la zona de arrastre se vuelve galería y todo lo de abajo se
 * corre; al quitar la última, vuelve a subir). Mide el contenido con
 * ResizeObserver y transiciona `height` de la medida anterior a la nueva;
 * al terminar vuelve a `auto`. Sin animación en el primer render ni cuando el
 * sistema pide reducir movimiento.
 */

import * as React from 'react';

import { cn } from '@/lib/utils';

export function AnimatedHeight({
  children,
  duration = 300,
  className,
}: {
  children: React.ReactNode;
  /** Duración de la transición en ms. */
  duration?: number;
  className?: string;
}) {
  const outerRef = React.useRef<HTMLDivElement>(null);
  const innerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner || typeof ResizeObserver === 'undefined') return;

    const reduceMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let previous = inner.getBoundingClientRect().height;
    let settle: number | null = null;

    const observer = new ResizeObserver(() => {
      const next = inner.getBoundingClientRect().height;
      if (Math.abs(next - previous) < 0.5) return;
      const from = previous;
      previous = next;
      if (reduceMotion) return;

      // De la altura anterior a la nueva; el contenido de adentro ya cambió.
      if (settle !== null) window.clearTimeout(settle);
      outer.style.transition = 'none';
      outer.style.overflow = 'hidden';
      outer.style.height = `${from}px`;
      void outer.offsetHeight; // reflow para fijar el punto de partida
      outer.style.transition = `height ${duration}ms ease`;
      outer.style.height = `${next}px`;
      settle = window.setTimeout(() => {
        outer.style.transition = '';
        outer.style.height = '';
        outer.style.overflow = '';
        settle = null;
      }, duration + 20);
    });

    observer.observe(inner);
    return () => {
      observer.disconnect();
      if (settle !== null) window.clearTimeout(settle);
      outer.style.transition = '';
      outer.style.height = '';
      outer.style.overflow = '';
    };
  }, [duration]);

  return (
    <div ref={outerRef} className={cn('motion-reduce:transition-none', className)}>
      <div ref={innerRef}>{children}</div>
    </div>
  );
}
