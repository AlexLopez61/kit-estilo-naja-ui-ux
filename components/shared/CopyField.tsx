'use client';

/**
 * CopyField — muestra un valor de solo lectura (email, contraseña) con un botón
 * para copiarlo al portapapeles. Se usa en los paneles de credenciales (alta y
 * restablecimiento de contraseña), donde el admin debe copiar y entregar el dato.
 */

import * as React from 'react';
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export function CopyField({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  const [copied, setCopied] = React.useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error('No se pudo copiar');
    }
  }

  return (
    <div className="space-y-1">
      <Label className="text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-2">
        <code
          className={cn(
            'min-w-0 flex-1 truncate rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground',
            mono && 'font-mono',
          )}
        >
          {value}
        </code>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={copy}
          title={`Copiar ${label}`}
        >
          {copied ? <Check className="size-4 text-success-text" /> : <Copy className="size-4" />}
          <span className="sr-only">Copiar {label}</span>
        </Button>
      </div>
    </div>
  );
}
