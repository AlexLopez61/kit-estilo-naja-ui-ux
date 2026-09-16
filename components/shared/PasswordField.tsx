'use client';

/**
 * PasswordField — input de contraseña con mostrar/ocultar y, opcionalmente, un
 * botón "Generar" (contraseña aleatoria fuerte). Controlado: el valor vive en el
 * padre. Se usa en el alta de usuario, el restablecimiento por admin y el cambio
 * de contraseña propio.
 */

import * as React from 'react';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

/** Contraseña aleatoria legible: sin caracteres ambiguos (0/O, 1/l), con al
 *  menos una minúscula, una mayúscula, un dígito y un símbolo. */
function generatePassword(length = 14): string {
  const lower = 'abcdefghijkmnpqrstuvwxyz';
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const digits = '23456789';
  const symbols = '!@#$%&*?';
  const all = lower + upper + digits + symbols;
  const randomInt = (max: number) => {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0]! % max;
  };
  const pick = (set: string) => set[randomInt(set.length)]!;
  const chars = [pick(lower), pick(upper), pick(digits), pick(symbols)];
  for (let i = chars.length; i < length; i++) chars.push(pick(all));
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j]!, chars[i]!];
  }
  return chars.join('');
}

export function PasswordField({
  id,
  value,
  onChange,
  placeholder = 'Mínimo 8 caracteres',
  error,
  showGenerate = false,
  autoFocus = false,
  autoComplete = 'new-password',
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  /** Muestra el botón "Generar" (sólo en alta/reset por admin). */
  showGenerate?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
}) {
  const [visible, setVisible] = React.useState(false);

  function handleGenerate() {
    onChange(generatePassword());
    setVisible(true);
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
          aria-invalid={error}
          className={cn('bg-card pr-9 font-mono', !value && 'font-sans')}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          title={visible ? 'Ocultar' : 'Mostrar'}
          className="absolute top-1/2 right-2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:shadow-focus"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          <span className="sr-only">{visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}</span>
        </button>
      </div>

      {showGenerate && (
        <Button type="button" variant="outline" onClick={handleGenerate} className="shrink-0">
          <RefreshCw className="size-4" />
          Generar
        </Button>
      )}
    </div>
  );
}
