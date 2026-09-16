'use client';

import * as React from 'react';
import { AlertTriangle } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DestructiveConfirmProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  /** Texto exacto que el usuario debe escribir para habilitar la confirmación. */
  confirmText: string;
  /** Label del botón de confirmación (ej: "Borrar permanentemente"). */
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
}

function DestructiveConfirm({
  open,
  onOpenChange,
  title,
  description,
  confirmText,
  confirmLabel,
  cancelLabel = 'Cancelar',
  onConfirm,
  isLoading = false,
}: DestructiveConfirmProps) {
  const [typed, setTyped] = React.useState('');
  const [wasOpen, setWasOpen] = React.useState(open);

  if (wasOpen !== open) {
    setWasOpen(open);
    if (!open) setTyped('');
  }

  const matches = typed === confirmText;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle size={20} />
            {title}
          </AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <div className="space-y-3">
          <p className="text-muted-foreground text-sm">Para confirmar, escribe exactamente:</p>
          <div className="bg-muted rounded-md p-3 font-mono text-sm">{confirmText}</div>
          <div className="space-y-2">
            <Label htmlFor="destructive-confirm-input" className="sr-only">
              Confirmación
            </Label>
            <Input
              id="destructive-confirm-input"
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="Escribe el texto exacto"
              autoComplete="off"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={!matches || isLoading}
            className={cn(buttonVariants({ variant: 'destructive' }))}
          >
            {isLoading ? 'Procesando...' : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { DestructiveConfirm };
