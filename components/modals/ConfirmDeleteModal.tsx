'use client';

/**
 * ConfirmDeleteModal — confirmación destructiva compacta y centrada.
 *
 * NO usa `NajaModal`: vive sobre `AlertDialog` (Radix) a propósito, porque una
 * acción destructiva necesita rol `alertdialog` y NO debe cerrarse por
 * click-fuera (Esc sí cancela, que es seguro). El único elemento rojo sólido
 * del modal es el botón de confirmar.
 *
 * No reutiliza `components/patterns/DestructiveConfirm` porque aquél exige
 * SIEMPRE confirmación por texto, mientras aquí es opcional vía
 * `requireTypedConfirmation`.
 */

import * as React from 'react';
import { AlertTriangle } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ConfirmDeleteModal({
  open,
  onOpenChange,
  title = '¿Eliminar registro?',
  description = 'Esta acción es permanente y no se puede deshacer.',
  confirmLabel = 'Eliminar',
  cancelLabel = 'Cancelar',
  /** Si se pasa, el usuario debe escribir este texto exacto para habilitar el botón. */
  requireTypedConfirmation,
  onConfirm,
  isLoading = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  requireTypedConfirmation?: string;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
}) {
  const [typed, setTyped] = React.useState('');
  const [wasOpen, setWasOpen] = React.useState(open);

  // Limpia el texto al cerrar, sin esperar a un efecto.
  if (wasOpen !== open) {
    setWasOpen(open);
    if (!open) setTyped('');
  }

  const needsTyped = Boolean(requireTypedConfirmation);
  const matches = !needsTyped || typed === requireTypedConfirmation;
  const canConfirm = matches && !isLoading;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        size="sm"
        className="gap-4 rounded-xl border-border bg-background p-6 shadow-lg"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <AlertTriangle className="size-[22px]" strokeWidth={1.5} />
          </span>
          <div className="space-y-1.5">
            <AlertDialogTitle className="text-base font-medium text-foreground">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              {description}
            </AlertDialogDescription>
          </div>
        </div>

        {needsTyped && (
          <div className="space-y-2 text-left">
            <Label htmlFor="confirm-delete-input" className="text-muted-foreground">
              Escribe <span className="font-mono text-foreground">{requireTypedConfirmation}</span>{' '}
              para confirmar
            </Label>
            <Input
              id="confirm-delete-input"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              autoComplete="off"
              autoFocus
              className="bg-card"
            />
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={!canConfirm}
            className="bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/30"
          >
            {isLoading ? 'Eliminando…' : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
