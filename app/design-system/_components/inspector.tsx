'use client';

import { ScanSearch } from 'lucide-react';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type InspectorState = { enabled: boolean; toggle: () => void };

const InspectorContext = createContext<InspectorState>({ enabled: false, toggle: () => {} });

export function useInspector() {
  return useContext(InspectorContext);
}

export function InspectorProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  return (
    <InspectorContext.Provider value={{ enabled, toggle: () => setEnabled((v) => !v) }}>
      {children}
    </InspectorContext.Provider>
  );
}

export function InspectorToggle() {
  const { enabled, toggle } = useInspector();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      data-inspector-ui
      className={`inline-flex h-8 items-center gap-1.5 rounded-md border px-3 text-sm transition-colors ${
        enabled
          ? 'border-brand bg-brand-subtle text-brand-text'
          : 'border-border-default bg-bg-surface text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
      }`}
    >
      <ScanSearch className="size-3.5" strokeWidth={1.5} />
      Modo inspector
    </button>
  );
}

// Prefijos de clases que el inspector reconoce como tokens del sistema.
const TOKEN_PREFIXES = [
  'bg-bg-',
  'bg-brand',
  'bg-success',
  'bg-warning',
  'bg-danger',
  'bg-info',
  'text-text-',
  'text-brand',
  'text-success',
  'text-warning',
  'text-danger',
  'text-info',
  'border-border-',
  'divide-border-',
  'ring-brand',
  'ring-danger',
  'rounded-',
  'shadow-sm',
  'shadow-md',
  'shadow-lg',
  'font-medium',
  'font-normal',
];

const TYPE_SCALE = new Set([
  'text-xs',
  'text-sm',
  'text-base',
  'text-lg',
  'text-xl',
  'text-2xl',
  'text-3xl',
  'text-4xl',
]);

function classNameOf(el: Element): string {
  const c = (el as HTMLElement).className;
  return typeof c === 'string' ? c : '';
}

function tokensOf(className: string): string[] {
  const found = new Set<string>();
  for (const raw of className.split(/\s+/)) {
    if (!raw) continue;
    const base = raw.includes(':') ? raw.slice(raw.lastIndexOf(':') + 1) : raw;
    if (TYPE_SCALE.has(base) || TOKEN_PREFIXES.some((p) => base.startsWith(p))) {
      found.add(raw);
    }
  }
  return Array.from(found);
}

type Hit = { rect: DOMRect; tokens: string[] };

export function InspectorLayer() {
  const { enabled } = useInspector();
  const [hit, setHit] = useState<Hit | null>(null);

  useEffect(() => {
    if (!enabled) return;

    function onMove(e: MouseEvent) {
      let el: Element | null = e.target as Element | null;
      while (el && el !== document.body) {
        if (el instanceof HTMLElement && el.dataset.inspectorUi !== undefined) {
          setHit(null);
          return;
        }
        const tokens = tokensOf(classNameOf(el));
        if (tokens.length) {
          setHit({ rect: el.getBoundingClientRect(), tokens });
          return;
        }
        el = el.parentElement;
      }
      setHit(null);
    }

    function clear() {
      setHit(null);
    }

    document.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('scroll', clear, { passive: true });
    return () => {
      document.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', clear);
      clear();
    };
  }, [enabled]);

  if (!enabled || !hit) return null;

  const { rect, tokens } = hit;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const PANEL_W = 264;
  const left = Math.min(Math.max(rect.left, 8), vw - PANEL_W - 8);
  const top = Math.min(rect.bottom + 8, vh - 150);

  return (
    <div data-inspector-ui className="pointer-events-none fixed inset-0 z-50">
      <div
        className="absolute rounded-[2px] border border-brand bg-brand-subtle"
        style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height }}
      />
      <div
        className="absolute rounded-md border border-border-default bg-bg-overlay p-2.5 shadow-lg"
        style={{ left, top, width: PANEL_W }}
      >
        <p className="mb-1.5 text-[11px] text-text-tertiary">Tokens detectados</p>
        <div className="flex flex-wrap gap-1">
          {tokens.map((t) => (
            <code
              key={t}
              className="rounded-sm bg-bg-elevated px-1.5 py-0.5 font-mono text-[11px] text-text-secondary"
            >
              {t}
            </code>
          ))}
        </div>
      </div>
    </div>
  );
}
