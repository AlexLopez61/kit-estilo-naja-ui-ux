'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

type Props = {
  code: string;
  label?: string;
};

export function CopyJSXButton({ code, label = 'Copiar JSX' }: Props) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard no disponible (contexto inseguro) — silencioso en el showcase
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      data-inspector-ui
      className="inline-flex h-7 items-center gap-1.5 rounded-md border border-border-default bg-bg-surface px-2.5 text-xs text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
    >
      {copied ? (
        <Check className="size-3.5 text-success-text" strokeWidth={1.75} />
      ) : (
        <Copy className="size-3.5" strokeWidth={1.5} />
      )}
      {copied ? 'Copiado' : label}
    </button>
  );
}
