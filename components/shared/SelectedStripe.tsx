import { cn } from '@/lib/utils';

/**
 * Franja de la fila activa (molde de la vista híbrida: Cuentas, Contratos,
 * Movimientos, Pendientes): pill verde de 3px pegada al borde IZQUIERDO de la
 * fila. El contenedor de la fila debe ser `relative`. Si el padding horizontal
 * vive en la fila y no en la celda, desplázala con `className="-left-4"`.
 */
export function SelectedStripe({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn('bg-success absolute inset-y-1.5 left-0 w-[3px] rounded-r-full', className)}
    />
  );
}
