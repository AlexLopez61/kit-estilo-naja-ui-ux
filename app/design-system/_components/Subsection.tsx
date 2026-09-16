import { ReactNode } from 'react';

/**
 * Deriva un slug de anchor a partir del título de la subsección.
 * Quita el prefijo numérico ("3.2 ") y normaliza acentos/separadores.
 * El ShowcaseSidebar usa estos mismos slugs como destino de sus enlaces.
 */
export function subsectionSlug(title: string) {
  return title
    .replace(/^[\d.]+\s*/, '')
    .toLowerCase()
    .replace(/[áàä]/g, 'a')
    .replace(/[éèë]/g, 'e')
    .replace(/[íìï]/g, 'i')
    .replace(/[óòö]/g, 'o')
    .replace(/[úùü]/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

type Props = {
  /** Anchor explícito. Si se omite, se deriva del título con subsectionSlug. */
  id?: string;
  title: string;
  caption?: string;
  children: ReactNode;
};

export function Subsection({ id, title, caption, children }: Props) {
  const anchorId = id ?? subsectionSlug(title);
  return (
    <div id={anchorId} className="space-y-6 scroll-mt-20">
      <div>
        <h3 className="text-base font-semibold text-text-primary">{title}</h3>
        {caption && <p className="mt-1 text-sm text-text-secondary">{caption}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
}
