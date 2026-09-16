'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

/** Última profundidad visitada por módulo (module scope: sobrevive entre
    navegaciones dentro de la sesión de JS). */
const lastDepthByScope = new Map<string, number>();

/**
 * Wrapper de transición direccional para templates de módulo (estilo
 * navegación nativa): al profundizar el contenido entra deslizando desde la
 * derecha; al regresar, desde la izquierda. Cada template calcula la
 * profundidad de su ruta y la pasa como `depth`; `scope` aísla el historial
 * por módulo para que saltar entre módulos no anime.
 *
 * Cuando un módulo anida templates (p. ej. propiedades y propiedades/[id]),
 * `minDepth` evita animar un mismo salto en dos niveles a la vez: el template
 * hijo solo anima si ambos extremos del salto están a su profundidad o más.
 */
export function SlideTransition({
  scope,
  depth,
  minDepth = 0,
  children,
}: {
  scope: string;
  depth: number;
  /** Solo anima si ambos extremos del salto están a esta profundidad o más. */
  minDepth?: number;
  children: React.ReactNode;
}) {
  // Congelada al montar: si el wrapper re-renderiza a media animación, la
  // clase no cambia. El initializer es puro; el registro se actualiza en efecto.
  const [direction] = React.useState<'forward' | 'back' | null>(() => {
    const last = lastDepthByScope.get(scope);
    if (last === undefined || depth === last) return null;
    if (Math.min(last, depth) < minDepth) return null;
    return depth > last ? 'forward' : 'back';
  });

  React.useEffect(() => {
    lastDepthByScope.set(scope, depth);
  }, [scope, depth]);

  return (
    <div
      className={cn(
        direction === 'forward' && 'animate-in duration-300 ease-out fade-in slide-in-from-right-8',
        direction === 'back' && 'animate-in duration-300 ease-out fade-in slide-in-from-left-8',
      )}
    >
      {children}
    </div>
  );
}
