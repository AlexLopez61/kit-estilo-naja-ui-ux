'use client';

import { RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { VERSION_FIELD } from '@/lib/concurrency';

/** Estado mínimo de un Server Action con concurrencia optimista. */
export type ActionAlertState =
  | { status: 'success' }
  | {
      status: 'error';
      message: string;
      fieldErrors?: Record<string, string>;
      code?: 'conflict';
    };

/**
 * Campo oculto que envía el snapshot de versión (`updated_at`) del registro que
 * se edita. Va dentro del `<form>`. En alta (sin valor) no renderiza nada.
 */
export function VersionField({ value }: { value: string | null | undefined }) {
  if (!value) return null;
  return <input type="hidden" name={VERSION_FIELD} value={value} />;
}

/**
 * Alerta al pie de un formulario. Distingue el conflicto de concurrencia (aviso
 * ámbar + "Recargar") del error genérico (rojo). No muestra nada si el estado no
 * es error o si el error es de campos (esos se muestran inline junto a cada uno).
 */
export function ActionErrorAlert({
  state,
  className,
}: {
  state: ActionAlertState;
  className?: string;
}) {
  if (state.status !== 'error') return null;
  if (state.fieldErrors && Object.keys(state.fieldErrors).length > 0) return null;

  if (state.code === 'conflict') {
    return (
      <div
        role="alert"
        className={cn(
          'border-warning/40 bg-warning-subtle flex flex-col gap-2 rounded-md border px-3 py-2.5 text-sm sm:flex-row sm:items-center sm:justify-between',
          className,
        )}
      >
        <span className="text-warning-text">{state.message}</span>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => window.location.reload()}
          className="shrink-0"
        >
          <RefreshCw className="size-3.5" strokeWidth={1.5} />
          Recargar
        </Button>
      </div>
    );
  }

  return (
    <p
      role="alert"
      className={cn('bg-destructive/10 text-destructive rounded-md px-3 py-2 text-sm', className)}
    >
      {state.message}
    </p>
  );
}
