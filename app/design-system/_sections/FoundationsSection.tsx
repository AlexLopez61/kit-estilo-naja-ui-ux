import { Check, X } from 'lucide-react';
import { ReactNode } from 'react';
import { Section } from '../_components/Section';
import { Subsection } from '../_components/Subsection';
import { Swatch, type SwatchVariant } from '../_components/Swatch';

type ColorToken = { name: string; value: string; cssVar: string };

type ColorGroup = {
  label: string;
  variant: SwatchVariant;
  tokens: ColorToken[];
};

const COLOR_GROUPS: ColorGroup[] = [
  {
    label: 'Backgrounds',
    variant: 'fill',
    tokens: [
      { name: '--color-bg-base', value: '#000000', cssVar: '--color-bg-base' },
      { name: '--color-bg-surface', value: '#0a0a0c', cssVar: '--color-bg-surface' },
      { name: '--color-bg-elevated', value: '#111114', cssVar: '--color-bg-elevated' },
      { name: '--color-bg-overlay', value: '#17181c', cssVar: '--color-bg-overlay' },
    ],
  },
  {
    label: 'Borders',
    variant: 'border',
    tokens: [
      {
        name: '--color-border-subtle',
        value: 'rgba(255,255,255,0.06)',
        cssVar: '--color-border-subtle',
      },
      {
        name: '--color-border-default',
        value: 'rgba(255,255,255,0.10)',
        cssVar: '--color-border-default',
      },
      {
        name: '--color-border-strong',
        value: 'rgba(255,255,255,0.16)',
        cssVar: '--color-border-strong',
      },
    ],
  },
  {
    label: 'Text',
    variant: 'text',
    tokens: [
      {
        name: '--color-text-primary',
        value: 'rgba(255,255,255,0.92)',
        cssVar: '--color-text-primary',
      },
      {
        name: '--color-text-secondary',
        value: 'rgba(255,255,255,0.64)',
        cssVar: '--color-text-secondary',
      },
      {
        name: '--color-text-tertiary',
        value: 'rgba(255,255,255,0.40)',
        cssVar: '--color-text-tertiary',
      },
      {
        name: '--color-text-disabled',
        value: 'rgba(255,255,255,0.24)',
        cssVar: '--color-text-disabled',
      },
    ],
  },
  {
    label: 'Brand — marca NAJA',
    variant: 'fill',
    tokens: [
      { name: '--color-brand', value: '#10b981', cssVar: '--color-brand' },
      { name: '--color-brand-hover', value: '#059669', cssVar: '--color-brand-hover' },
      {
        name: '--color-brand-subtle',
        value: 'rgba(16,185,129,0.12)',
        cssVar: '--color-brand-subtle',
      },
      { name: '--color-brand-text', value: '#34d399', cssVar: '--color-brand-text' },
    ],
  },
  {
    label: 'Success',
    variant: 'fill',
    tokens: [
      { name: '--color-success', value: '#10b981', cssVar: '--color-success' },
      {
        name: '--color-success-subtle',
        value: 'rgba(16,185,129,0.10)',
        cssVar: '--color-success-subtle',
      },
      { name: '--color-success-text', value: '#34d399', cssVar: '--color-success-text' },
    ],
  },
  {
    label: 'Warning',
    variant: 'fill',
    tokens: [
      { name: '--color-warning', value: '#f59e0b', cssVar: '--color-warning' },
      {
        name: '--color-warning-subtle',
        value: 'rgba(245,158,11,0.10)',
        cssVar: '--color-warning-subtle',
      },
      { name: '--color-warning-text', value: '#fbbf24', cssVar: '--color-warning-text' },
    ],
  },
  {
    label: 'Danger',
    variant: 'fill',
    tokens: [
      { name: '--color-danger', value: '#ef4444', cssVar: '--color-danger' },
      {
        name: '--color-danger-subtle',
        value: 'rgba(239,68,68,0.10)',
        cssVar: '--color-danger-subtle',
      },
      { name: '--color-danger-text', value: '#f87171', cssVar: '--color-danger-text' },
    ],
  },
  {
    label: 'Info',
    variant: 'fill',
    tokens: [
      { name: '--color-info', value: '#3b82f6', cssVar: '--color-info' },
      {
        name: '--color-info-subtle',
        value: 'rgba(59,130,246,0.10)',
        cssVar: '--color-info-subtle',
      },
      { name: '--color-info-text', value: '#60a5fa', cssVar: '--color-info-text' },
    ],
  },
];

const TYPE_SCALE = [
  {
    name: 'text-xs',
    size: 11,
    lineHeight: 1.4,
    weight: 400,
    use: 'Metadata, captions, labels muy pequeños',
  },
  {
    name: 'text-sm',
    size: 13,
    lineHeight: 1.5,
    weight: 400,
    use: 'Body en listas densas, texto secundario',
  },
  { name: 'text-base', size: 14, lineHeight: 1.5, weight: 400, use: 'Body default' },
  { name: 'text-lg', size: 16, lineHeight: 1.5, weight: 400, use: 'Body large, lead paragraphs' },
  { name: 'text-xl', size: 18, lineHeight: 1.4, weight: 500, use: 'Heading 3, card titles' },
  { name: 'text-2xl', size: 22, lineHeight: 1.3, weight: 500, use: 'Heading 2' },
  { name: 'text-3xl', size: 28, lineHeight: 1.2, weight: 500, use: 'Heading 1, section titles' },
  { name: 'text-4xl', size: 36, lineHeight: 1.1, weight: 500, use: 'Heading hero (KPI values)' },
];

const SPACING = [4, 8, 12, 16, 20, 24, 32];

const RADIUS = [
  { name: '--radius-sm', value: 4, utility: 'rounded-sm' },
  { name: '--radius-md', value: 6, utility: 'rounded-md' },
  { name: '--radius-lg', value: 8, utility: 'rounded-lg' },
  { name: '--radius-xl', value: 12, utility: 'rounded-xl' },
];

const SHADOWS = [
  { name: '--shadow-sm', utility: 'shadow-sm' },
  { name: '--shadow-md', utility: 'shadow-md' },
  { name: '--shadow-lg', utility: 'shadow-lg' },
];

export function FoundationsSection() {
  return (
    <Section
      id="foundations"
      title="Foundations"
      description="Tokens base del sistema Soft Bento Dark: paleta de colores, escala tipográfica, espaciado, radius y sombras. Todo el showcase se construye sobre estos primitivos."
    >
      <Subsection title="1.1 Colores" caption="Backgrounds, borders, texto y semánticos.">
        <div className="space-y-10">
          {COLOR_GROUPS.map((group) => (
            <SwatchGroup key={group.label} label={group.label}>
              {group.tokens.map((t) => (
                <Swatch key={t.cssVar} {...t} variant={group.variant} />
              ))}
            </SwatchGroup>
          ))}
        </div>
      </Subsection>

      <Subsection
        title="1.2 Tipografía"
        caption="Geist en pesos 400 y 500. Nunca pesos 600+. Jerarquía vía opacidad de texto."
      >
        <div className="space-y-1">
          {TYPE_SCALE.map((t) => {
            const isHero = t.name === 'text-4xl';
            const sample = isHero ? '$125,000.00' : 'Cotización aprobada — Casa Montejo';
            const sampleClass = [
              t.name,
              t.weight === 500 && 'font-medium',
              t.size >= 18 && 'tracking-[-0.01em]',
              isHero && 'tabular-nums',
              'text-text-primary',
            ]
              .filter(Boolean)
              .join(' ');
            return (
              <div
                key={t.name}
                className="grid grid-cols-[220px_1fr] items-baseline gap-6 border-b border-border-subtle py-3 last:border-0"
              >
                <div>
                  <code className="font-mono text-xs text-text-secondary">{t.name}</code>
                  <p className="mt-0.5 text-xs text-text-tertiary">
                    {t.size} px · line {t.lineHeight} · {t.weight}
                  </p>
                  <p className="mt-0.5 text-xs text-text-tertiary">{t.use}</p>
                </div>
                <span className={sampleClass}>{sample}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-10 grid max-w-3xl grid-cols-2 gap-4">
          <DemoTile>
            <DemoTileHeader tone="success" label="Sentence case" />
            <p className="mt-3 text-base text-text-primary">Cotización aprobada</p>
            <p className="mt-1 text-xs text-text-tertiary">
              Sólo la primera letra y nombres propios en mayúscula.
            </p>
          </DemoTile>
          <DemoTile>
            <DemoTileHeader tone="danger" label="Title Case" />
            <p className="mt-3 text-base text-text-primary">Cotización Aprobada</p>
            <p className="mt-1 text-xs text-text-tertiary">
              Prohibido. Aplica a labels, headers, botones y badges.
            </p>
          </DemoTile>
        </div>

        <div className="mt-6 grid max-w-3xl grid-cols-2 gap-4">
          <DemoTile>
            <DemoTileHeader tone="danger" label="Proporcional" />
            <div className="mt-3 space-y-1 text-base text-text-primary">
              <div className="flex justify-end">$ 4,500.00</div>
              <div className="flex justify-end">$ 12,750.00</div>
              <div className="flex justify-end">$ 156,890.00</div>
            </div>
            <p className="mt-2 text-xs text-text-tertiary">Los dígitos no alinean por columna.</p>
          </DemoTile>
          <DemoTile>
            <DemoTileHeader tone="success" label="Tabular nums" />
            <div className="mt-3 space-y-1 text-base tabular-nums text-text-primary">
              <div className="flex justify-end">$ 4,500.00</div>
              <div className="flex justify-end">$ 12,750.00</div>
              <div className="flex justify-end">$ 156,890.00</div>
            </div>
            <p className="mt-2 text-xs text-text-tertiary">
              Aplica a montos en MXN, contadores y tablas financieras.
            </p>
          </DemoTile>
        </div>
      </Subsection>

      <Subsection title="1.3 Spacing" caption="Escala de 4 px usada en padding, gap y márgenes.">
        <div className="space-y-2.5">
          {SPACING.map((s) => (
            <div key={s} className="flex items-center gap-4">
              <code className="w-14 font-mono text-xs text-text-tertiary">{s} px</code>
              <div className="h-2 rounded-sm bg-text-secondary" style={{ width: `${s}px` }} />
            </div>
          ))}
        </div>
      </Subsection>

      <Subsection
        title="1.4 Border radius"
        caption="Inputs/badges 6 px · Botones 10 px · Cards 14 px · Modales 20 px."
      >
        <div className="grid max-w-3xl grid-cols-4 gap-4">
          {RADIUS.map((r) => (
            <div key={r.name} className="flex flex-col gap-3">
              <div className={`h-24 border border-border-default bg-bg-surface ${r.utility}`} />
              <div>
                <code className="font-mono text-xs text-text-secondary">{r.utility}</code>
                <p className="mt-0.5 text-xs text-text-tertiary">
                  {r.name} · {r.value} px
                </p>
              </div>
            </div>
          ))}
        </div>
      </Subsection>

      <Subsection
        title="1.5 Shadows"
        caption="Casi invisibles. Solo para diferenciar elevación de modales/popovers."
      >
        <div className="rounded-lg bg-bg-base p-10">
          <div className="grid grid-cols-3 gap-10">
            {SHADOWS.map((s) => (
              <div key={s.name} className="flex flex-col items-center gap-4">
                <div
                  className={`h-24 w-full rounded-lg border border-border-subtle bg-bg-elevated ${s.utility}`}
                />
                <div className="text-center">
                  <code className="font-mono text-xs text-text-secondary">{s.utility}</code>
                  <p className="mt-0.5 text-xs text-text-tertiary">{s.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Subsection>
    </Section>
  );
}

function SwatchGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-text-tertiary">{label}</p>
      <div className="flex flex-wrap gap-x-6 gap-y-5">{children}</div>
    </div>
  );
}

function DemoTile({ children }: { children: ReactNode }) {
  return <div className="rounded-lg border border-border-subtle bg-bg-surface p-4">{children}</div>;
}

function DemoTileHeader({ tone, label }: { tone: 'success' | 'danger'; label: string }) {
  const Icon = tone === 'success' ? Check : X;
  const colorClass = tone === 'success' ? 'text-success-text' : 'text-danger-text';
  return (
    <div className={`flex items-center gap-1.5 text-xs ${colorClass}`}>
      <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
      <span>{label}</span>
    </div>
  );
}
