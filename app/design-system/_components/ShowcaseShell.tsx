'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { SHOWCASE_NAV, ShowcaseSidebar } from './ShowcaseSidebar';

const STORAGE_KEY = 'showcase:sidebar:collapsed';

type Observable = { id: string; category: string };

export function ShowcaseShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const visible = useRef<Set<string>>(new Set());

  // Mapa plano de todos los anchors observables (secciones + subsecciones).
  const observables = useMemo<Observable[]>(() => {
    const list: Observable[] = [];
    for (const cat of SHOWCASE_NAV) {
      list.push({ id: cat.id, category: cat.id });
      for (const item of cat.items) list.push({ id: item.id, category: cat.id });
    }
    return list;
  }, []);

  const categoryOf = useMemo(() => {
    const map = new Map<string, string>();
    for (const o of observables) map.set(o.id, o.category);
    return map;
  }, [observables]);

  // Restaurar estado colapsado desde localStorage tras la hidratación.
  // Se hace en effect (no en el inicializador de useState) a propósito: así el
  // primer render del servidor y del cliente coinciden (collapsed=false) y no
  // hay hydration mismatch. El setState aquí es el patrón recomendado para
  // estado persistido solo-cliente.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored === 'true') setCollapsed(true);
    } catch {
      /* localStorage no disponible */
    }
  }, []);

  const onToggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        /* noop */
      }
      return next;
    });
  }, []);

  // IntersectionObserver: el anchor más cercano al borde superior gana.
  useEffect(() => {
    const recompute = () => {
      let bestId: string | null = null;
      let bestTop = Number.POSITIVE_INFINITY;
      for (const id of visible.current) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top < bestTop) {
          bestTop = top;
          bestId = id;
        }
      }
      if (!bestId) return;
      const isSection = SHOWCASE_NAV.some((c) => c.id === bestId);
      setActiveCategory(categoryOf.get(bestId) ?? null);
      setActiveId(isSection ? null : bestId);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.current.add(entry.target.id);
          else visible.current.delete(entry.target.id);
        }
        recompute();
      },
      { rootMargin: '-12% 0px -80% 0px', threshold: 0 },
    );

    for (const o of observables) {
      const el = document.getElementById(o.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [observables, categoryOf]);

  const onNavigate = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const isSection = SHOWCASE_NAV.some((c) => c.id === id);
      setActiveCategory(categoryOf.get(id) ?? null);
      setActiveId(isSection ? null : id);
    },
    [categoryOf],
  );

  return (
    <>
      <ShowcaseSidebar
        collapsed={collapsed}
        onToggle={onToggle}
        activeId={activeId}
        activeCategory={activeCategory}
        onNavigate={onNavigate}
      />
      <main
        style={{ marginLeft: collapsed ? 56 : 240 }}
        className="min-w-0 transition-[margin] duration-200 ease-out"
      >
        {children}
      </main>
    </>
  );
}
