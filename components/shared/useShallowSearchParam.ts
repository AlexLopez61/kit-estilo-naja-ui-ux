'use client';

/**
 * Parámetro de la URL con escritura SHALLOW (`history.pushState` /
 * `replaceState`): Next 15 sincroniza `useSearchParams` con los cambios de
 * history sin ir al server. Para vistas cuyo dataset ya vive en el cliente
 * (detalle de proyecto: `?tab=` y `?ver=`), como el `goToTab` de CobranzaShell
 * y `usePanelParam` de Propiedades, pero reutilizable.
 */

import * as React from 'react';
import { useSearchParams } from 'next/navigation';

export function useShallowSearchParam(
  key: string,
): [string | null, (value: string | null, opts?: { replace?: boolean; clear?: string[] }) => void] {
  const searchParams = useSearchParams();
  const value = searchParams.get(key);

  const set = React.useCallback(
    (next: string | null, opts?: { replace?: boolean; clear?: string[] }) => {
      const params = new URLSearchParams(window.location.search);
      if (next === null || next === '') params.delete(key);
      else params.set(key, next);
      for (const k of opts?.clear ?? []) params.delete(k);
      const qs = params.toString();
      const url = `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`;
      if (opts?.replace) window.history.replaceState(null, '', url);
      else window.history.pushState(null, '', url);
    },
    [key],
  );

  return [value, set];
}
