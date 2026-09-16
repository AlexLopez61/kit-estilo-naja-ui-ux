'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { Route } from 'next';
import { ArrowLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

/**
 * Control visual de cierre del panel: chevron a la derecha en desktop (el
 * panel se guarda hacia allá); "Volver" en móvil. Sin dependencia del router,
 * para paneles cuya selección vive en estado propio (Pendientes) y para que
 * sea renderizable en tests sin App Router.
 */
export function PanelCloseControl({ label, onClose }: { label?: string; onClose: () => void }) {
  if (label) {
    return (
      <Button variant="ghost" size="sm" onClick={onClose}>
        <ArrowLeft className="size-4" />
        {label}
      </Button>
    );
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={onClose} className="md:hidden">
        <ArrowLeft />
        Volver
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        aria-label="Cerrar ficha"
        className="hidden md:inline-flex"
      >
        <ChevronRight />
      </Button>
    </>
  );
}

/**
 * Cierra la ficha seleccionada por URL (quita ?ver=), como en Movimientos.
 */
export function ClosePanelButton({ label }: { label?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function close() {
    const sp = new URLSearchParams(searchParams.toString());
    sp.delete('ver');
    const qs = sp.toString();
    router.push((qs ? `${pathname}?${qs}` : pathname) as Route);
  }

  return <PanelCloseControl label={label} onClose={close} />;
}
