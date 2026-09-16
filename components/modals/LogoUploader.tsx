'use client';

/**
 * LogoUploader — dropzone 72×72 para el logo/foto de un proveedor.
 *
 * Solo UI: genera un preview local con `URL.createObjectURL` y expone
 * `onLogoChange(file | null)` para conectar la subida real más adelante
 * (NO toca Supabase Storage). Sin preview muestra una dropzone punteada;
 * con preview, un overlay de hover permite reemplazar o quitar.
 *
 * Con `name`, el input file conserva el archivo elegido para que viaje en el
 * FormData del form que lo contiene (forms con `action` nativa).
 */

import * as React from 'react';
import { ImagePlus, RefreshCw, X } from 'lucide-react';

import { cn } from '@/lib/utils';

const ACCEPT = 'image/png,image/jpeg,image/webp';

export function LogoUploader({
  onLogoChange,
  label = 'Logo',
  hint = 'JPG · PNG',
  className,
  initialPreviewUrl = null,
  name,
}: {
  /** Se invoca con el archivo elegido, o `null` al quitarlo. */
  onLogoChange?: (file: File | null) => void;
  label?: string;
  hint?: string;
  className?: string;
  /** Preview inicial (ej. avatar ya guardado al editar). No es un blob local. */
  initialPreviewUrl?: string | null;
  /** name del input file; si se pasa, el archivo se incluye en el submit del form. */
  name?: string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [preview, setPreview] = React.useState<string | null>(initialPreviewUrl);

  // Solo los previews locales (blob:) se revocan; las URLs firmadas no.
  React.useEffect(() => {
    return () => {
      if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function pick(file: File) {
    setPreview((prev) => {
      if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    onLogoChange?.(file);
  }

  function remove() {
    setPreview((prev) => {
      if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
      return null;
    });
    onLogoChange?.(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div className={cn('shrink-0', className)}>
      {preview ? (
        <div className="group relative size-[72px] overflow-hidden rounded-xl border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Logo del proveedor" className="size-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              title="Reemplazar"
              className="inline-flex size-7 items-center justify-center rounded-md text-foreground outline-none transition-colors hover:bg-white/10 focus-visible:shadow-focus"
            >
              <RefreshCw className="size-3.5" strokeWidth={1.5} />
              <span className="sr-only">Reemplazar logo</span>
            </button>
            <button
              type="button"
              onClick={remove}
              title="Quitar"
              className="inline-flex size-7 items-center justify-center rounded-md text-foreground outline-none transition-colors hover:bg-white/10 focus-visible:shadow-focus"
            >
              <X className="size-3.5" strokeWidth={1.5} />
              <span className="sr-only">Quitar logo</span>
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex size-[72px] flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-foreground/20 text-muted-foreground outline-none transition-colors hover:border-primary hover:text-muted-foreground focus-visible:shadow-focus"
        >
          <ImagePlus className="size-5" strokeWidth={1.5} />
          <span className="text-[11px] leading-none">{label}</span>
        </button>
      )}
      <p className="mt-1.5 text-center text-[11px] text-muted-foreground">{hint}</p>

      <input
        ref={inputRef}
        type="file"
        name={name}
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) pick(f);
          // Sin name el input es solo un picker: se limpia para poder re-elegir
          // el mismo archivo. Con name debe conservar el archivo hasta el submit.
          if (!name) e.target.value = '';
        }}
      />
    </div>
  );
}
