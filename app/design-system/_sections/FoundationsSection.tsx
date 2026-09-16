'use client';

import { Check, X } from 'lucide-react';
import { useCallback, useState, useSyncExternalStore, type ReactNode } from 'react';
import { DETAIL_CARD_CLASS } from '@/components/shared/DetailCard';
import { SelectedStripe } from '@/components/shared/SelectedStripe';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/i18n/formatters';
import { cn } from '@/lib/utils';
import { CopyJSXButton } from '../_components/CopyJSXButton';
import { Section } from '../_components/Section';
import { Subsection } from '../_components/Subsection';

// ---------------------------------------------------------------------------
// Lectura de tokens en tiempo de ejecución
// ---------------------------------------------------------------------------

/**
 * Los valores mostrados NO se escriben a mano: se leen del `:root` con
 * `getComputedStyle` en el cliente y se vuelven a leer cuando next-themes
 * cambia la clase `.dark` del `<html>`. Así la sección nunca se desactualiza
 * respecto a `app/globals.css`.
 */
function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'style', 'data-theme'],
  });
  return () => observer.disconnect();
}

function readCssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** Valor resuelto de una variable CSS en el tema activo; vacío en el servidor. */
function useCssVar(name: string): string {
  return useSyncExternalStore(
    subscribeToTheme,
    () => readCssVar(name),
    () => '',
  );
}

// ---------------------------------------------------------------------------
// Datos
// ---------------------------------------------------------------------------

type SwatchPreview = 'fill' | 'border' | 'text';

type TokenSwatchDef = {
  /** Variable CSS del sistema (`--ds-*`) que se lee en tiempo de ejecución. */
  token: string;
  /** Utilidad de Tailwind que se escribe en los componentes. */
  utility: string;
  preview: SwatchPreview;
};

type TokenGroup = {
  title: string;
  hint: string;
  swatches: TokenSwatchDef[];
};

const COLOR_GROUPS: TokenGroup[] = [
  {
    title: 'Fondos',
    hint: 'Cuatro niveles. Base para la app y la zebra; surface para cards y tablas; elevated para sidebar, panel derecho y fila seleccionada; overlay para hover de menú y tooltips.',
    swatches: [
      { token: '--ds-bg-base', utility: 'bg-bg-base', preview: 'fill' },
      { token: '--ds-bg-surface', utility: 'bg-bg-surface', preview: 'fill' },
      { token: '--ds-bg-elevated', utility: 'bg-bg-elevated', preview: 'fill' },
      { token: '--ds-bg-overlay', utility: 'bg-bg-overlay', preview: 'fill' },
    ],
  },
  {
    title: 'Bordes',
    hint: 'Se sienten, no se ven. Subtle divide filas y secciones; default para inputs y outline; strong para chips activos; card solo en oscuro sobre superficies flotantes.',
    swatches: [
      { token: '--ds-border-subtle', utility: 'border-border-subtle', preview: 'border' },
      { token: '--ds-border-default', utility: 'border-border-default', preview: 'border' },
      { token: '--ds-border-strong', utility: 'border-border-strong', preview: 'border' },
      { token: '--ds-border-card', utility: 'border-border-card', preview: 'border' },
    ],
  },
  {
    title: 'Texto',
    hint: 'Nunca blanco puro. Primary para títulos y valores; secondary para labels; tertiary para metadata y encabezados de tabla; disabled para placeholders.',
    swatches: [
      { token: '--ds-text-primary', utility: 'text-text-primary', preview: 'text' },
      { token: '--ds-text-secondary', utility: 'text-text-secondary', preview: 'text' },
      { token: '--ds-text-tertiary', utility: 'text-text-tertiary', preview: 'text' },
      { token: '--ds-text-disabled', utility: 'text-text-disabled', preview: 'text' },
    ],
  },
  {
    title: 'Marca',
    hint: 'Es un acento, no un fondo. Vale lo mismo que éxito pero es un token independiente: cambiar la marca del kit no mueve el verde de éxito.',
    swatches: [
      { token: '--ds-brand', utility: 'bg-brand', preview: 'fill' },
      { token: '--ds-brand-hover', utility: 'bg-brand-hover', preview: 'fill' },
      { token: '--ds-brand-subtle', utility: 'bg-brand-subtle', preview: 'fill' },
      { token: '--ds-brand-text', utility: 'text-brand-text', preview: 'text' },
    ],
  },
  {
    title: 'Éxito',
    hint: 'Sólido para puntos de estado, barras y franjas; subtle para fondos de badges y chips; text para texto sobre cualquier fondo.',
    swatches: [
      { token: '--ds-success', utility: 'bg-success', preview: 'fill' },
      { token: '--ds-success-subtle', utility: 'bg-success-subtle', preview: 'fill' },
      { token: '--ds-success-text', utility: 'text-success-text', preview: 'text' },
    ],
  },
  {
    title: 'Atención',
    hint: 'Ámbar. Por vencer, pendiente de revisión, saldo bajo.',
    swatches: [
      { token: '--ds-warning', utility: 'bg-warning', preview: 'fill' },
      { token: '--ds-warning-subtle', utility: 'bg-warning-subtle', preview: 'fill' },
      { token: '--ds-warning-text', utility: 'text-warning-text', preview: 'text' },
    ],
  },
  {
    title: 'Peligro',
    hint: 'Rojo. Vencido, error, acciones destructivas. También alimenta --destructive.',
    swatches: [
      { token: '--ds-danger', utility: 'bg-danger', preview: 'fill' },
      { token: '--ds-danger-subtle', utility: 'bg-danger-subtle', preview: 'fill' },
      { token: '--ds-danger-text', utility: 'text-danger-text', preview: 'text' },
    ],
  },
  {
    title: 'Información',
    hint: 'Azul. En curso, en revisión, avisos neutros. También alimenta --ring (el foco).',
    swatches: [
      { token: '--ds-info', utility: 'bg-info', preview: 'fill' },
      { token: '--ds-info-subtle', utility: 'bg-info-subtle', preview: 'fill' },
      { token: '--ds-info-text', utility: 'text-info-text', preview: 'text' },
    ],
  },
];

const SYSTEM_FAMILY = [
  'bg-bg-*',
  'text-text-*',
  'border-border-*',
  'bg-brand',
  'bg-*-subtle',
  'text-*-text',
];

const SHADCN_FAMILY = [
  'bg-background',
  'bg-card',
  'text-foreground',
  'text-muted-foreground',
  'border',
  'bg-muted',
  'hover:bg-accent',
];

type TypeStep = {
  utility: string;
  size: number;
  leading: number;
  weights: string;
  use: string;
  sampleClass: string;
  sample: string;
};

const TYPE_SCALE: TypeStep[] = [
  {
    utility: 'text-xs',
    size: 11,
    leading: 1.4,
    weights: '400',
    use: 'Metadata, encabezados de tabla, sublines, badges',
    sampleClass: 'text-xs',
    sample: 'Creado el 12/09/2026 por María Pérez',
  },
  {
    utility: 'text-sm',
    size: 13,
    leading: 1.5,
    weights: '400 · 500 · 600',
    use: 'Cuerpo en listas, labels, títulos de card',
    sampleClass: 'text-sm font-medium',
    sample: 'Pintura de fachada · Casa Montejo',
  },
  {
    utility: 'text-base',
    size: 14,
    leading: 1.5,
    weights: '400',
    use: 'Cuerpo por defecto, labels de formularios grandes',
    sampleClass: 'text-base',
    sample: 'La cotización incluye materiales y mano de obra.',
  },
  {
    utility: 'text-lg',
    size: 16,
    leading: 1.5,
    weights: '500 · 600',
    use: 'Títulos de modal',
    sampleClass: 'text-lg font-semibold',
    sample: 'Registrar cobro',
  },
  {
    utility: 'text-xl',
    size: 18,
    leading: 1.4,
    weights: '600',
    use: 'Heading 3',
    sampleClass: 'text-xl font-semibold',
    sample: 'Cotizaciones aprobadas',
  },
  {
    utility: 'text-2xl',
    size: 22,
    leading: 1.3,
    weights: '600',
    use: 'Heading 2, valor de KPI',
    sampleClass: 'text-2xl font-semibold tracking-tight tabular-nums',
    sample: formatCurrency(48250),
  },
  {
    utility: 'text-3xl',
    size: 28,
    leading: 1.2,
    weights: '500 · 600',
    use: 'Heading 1, tile de monto (500)',
    sampleClass: 'text-3xl font-semibold tracking-tight',
    sample: 'Proyectos',
  },
  {
    utility: 'text-4xl',
    size: 36,
    leading: 1.1,
    weights: '600',
    use: 'Valor hero',
    sampleClass: 'text-4xl font-semibold tracking-tight tabular-nums',
    sample: formatCurrency(1250000),
  },
];

const WEIGHTS = [
  { utility: 'font-normal', weight: 400, use: 'Cuerpo y sublines' },
  {
    utility: 'font-medium',
    weight: 500,
    use: 'Labels, valores, montos, nombres dentro de filas, botones',
  },
  {
    utility: 'font-semibold',
    weight: 600,
    use: 'Títulos: h1, card, sección, tab de detalle, trigger de acordeón, valor de KPI',
  },
];

const RADII = [
  { utility: 'rounded-sm', token: '--radius-sm', use: 'Badges, chips, kbd' },
  {
    utility: 'rounded-md',
    token: '--radius-md',
    use: 'Inputs, botones, menús, avatares cuadrados',
  },
  { utility: 'rounded-lg', token: '--radius-lg', use: 'Cards, tablas, paneles, filas de lista' },
  {
    utility: 'rounded-xl',
    token: '--radius-xl',
    use: 'Modales, drawers, marco de la vista, tarjeta de cuenta',
  },
];

const SPACING = [
  { px: 4, step: '1' },
  { px: 8, step: '2' },
  { px: 12, step: '3' },
  { px: 16, step: '4' },
  { px: 24, step: '6' },
  { px: 32, step: '8' },
];

const SHADOW_TOKENS = [
  { utility: 'shadow-xs', token: null, level: '1 · controles' },
  { utility: 'shadow-sm', token: '--ds-shadow-sm', level: 'Pastilla del switch' },
  { utility: 'shadow-md', token: '--ds-shadow-md', level: '3 · superficies flotantes' },
  { utility: 'shadow-lg', token: '--ds-shadow-lg', level: '4 · overlays' },
  {
    utility: 'shadow-row-selected',
    token: '--ds-shadow-row-selected',
    level: 'Halo de la fila seleccionada',
  },
  { utility: 'shadow-focus', token: '--ds-shadow-focus', level: 'Foco de cualquier control' },
];

const LEVEL0_PANEL_CLASS = 'bg-bg-surface rounded-lg dark:border dark:border-border-card';
const LEVEL0_FLOOR_CLASS = 'bg-bg-surface border border-border-subtle rounded-lg';
const LEVEL4_CLASS = 'bg-popover rounded-md border border-border shadow-lg';

const FOCUS_CLASS = 'focus-visible:border-ring/50 focus-visible:shadow-focus';
const ROW_BASE_CLASS =
  'relative grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 border-b border-border-subtle px-4 py-3 text-left text-sm transition-colors duration-150 outline-none last:border-0 focus-visible:shadow-focus motion-reduce:transition-none';
const ROW_IDLE_CLASS = 'hover:bg-row-hover';
const ROW_SELECTED_CLASS = 'bg-bg-elevated shadow-row-selected z-10';

const ROWS = [
  { id: 'r1', concept: 'Renta · Departamento 3B', meta: 'Cobro · 05/09/2026', amount: 12500 },
  {
    id: 'r2',
    concept: 'Pintura de fachada · Casa Montejo',
    meta: 'Anticipo · 03/09/2026',
    amount: 48000,
  },
  {
    id: 'r3',
    concept: 'Materiales · Ferretería El Roble',
    meta: 'Gasto · 01/09/2026',
    amount: -3260,
  },
];

// ---------------------------------------------------------------------------
// Sección
// ---------------------------------------------------------------------------

export function FoundationsSection() {
  return (
    <Section
      id="foundations"
      title="Fundamentos"
      description="Tokens del sistema: colores, tipografía, radios, elevación, espaciado e interacción. Los valores se leen del CSS en tiempo de ejecución y cambian con el tema; lo que se escribe en los componentes es siempre la utilidad, nunca el valor."
    >
      <Subsection
        id="colores"
        title="Colores"
        caption="Superficies neutras y bordes que separan sin dibujar. Cada muestra está pintada con su utilidad; el valor de abajo es el resuelto en el tema activo."
      >
        <div className="space-y-10">
          <TwoFamiliesNote />
          {COLOR_GROUPS.map((group) => (
            <div key={group.title} className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-text-primary">{group.title}</h4>
                <p className="mt-0.5 max-w-3xl text-xs text-text-tertiary">{group.hint}</p>
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-x-5 gap-y-6">
                {group.swatches.map((swatch) => (
                  <TokenSwatch key={swatch.token} {...swatch} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Subsection>

      <Subsection
        id="tipografia"
        title="Tipografía"
        caption="Geist Sans y Geist Mono. Escala un paso más chica que la de Tailwind; pesos 400, 500 y 600, nunca 700. Sentence case siempre. La única medida fuera de la escala es el encabezado de ficha: text-[26px] tracking-tight."
      >
        <div className="space-y-10">
          <div className="space-y-1">
            {TYPE_SCALE.map((step) => (
              <div
                key={step.utility}
                className="grid grid-cols-[220px_minmax(0,1fr)] items-baseline gap-6 border-b border-border-subtle py-3 last:border-0"
              >
                <div className="min-w-0">
                  <code className="font-mono text-xs text-text-primary">{step.utility}</code>
                  <p className="mt-0.5 text-xs tabular-nums text-text-tertiary">
                    {step.size} px · interlínea {step.leading} · peso {step.weights}
                  </p>
                  <p className="mt-0.5 text-xs text-text-tertiary">{step.use}</p>
                </div>
                <span className={cn('truncate text-text-primary', step.sampleClass)}>
                  {step.sample}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-text-primary">Pesos</h4>
            <div className="grid gap-4 md:grid-cols-3">
              {WEIGHTS.map((w) => (
                <DemoTile key={w.utility}>
                  <p className={cn('text-lg text-text-primary', w.utility)}>Cotización aprobada</p>
                  <code className="mt-2 block font-mono text-xs text-text-secondary">
                    {w.utility} · {w.weight}
                  </code>
                  <p className="mt-1 text-xs text-text-tertiary">{w.use}</p>
                </DemoTile>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <DemoTile>
              <DemoTileHeader tone="danger" label="Proporcional" />
              <div className="mt-3 space-y-1 text-base text-text-primary">
                <div className="flex justify-end">{formatCurrency(4500)}</div>
                <div className="flex justify-end">{formatCurrency(12750)}</div>
                <div className="flex justify-end">{formatCurrency(156890)}</div>
              </div>
              <p className="mt-2 text-xs text-text-tertiary">Los dígitos no alinean por columna.</p>
            </DemoTile>
            <DemoTile>
              <DemoTileHeader tone="success" label="tabular-nums" />
              <div className="mt-3 space-y-1 text-base tabular-nums text-text-primary">
                <div className="flex justify-end">{formatCurrency(4500)}</div>
                <div className="flex justify-end">{formatCurrency(12750)}</div>
                <div className="flex justify-end">{formatCurrency(156890)}</div>
              </div>
              <p className="mt-2 text-xs text-text-tertiary">
                En todo número que se alinee con otro: montos, fechas, folios, conteos.
              </p>
            </DemoTile>
            <DemoTile>
              <DemoTileHeader tone="success" label="font-mono" />
              <div className="mt-3 space-y-1 font-mono text-sm text-text-primary">
                <div>COT-2026-0142</div>
                <div>ART-00021</div>
                <div className="tabular-nums">012 345 678 901 234 567</div>
              </div>
              <p className="mt-2 text-xs text-text-tertiary">
                Geist Mono para identificadores: folios, SKU, CLABE, coordenadas, atajos.
              </p>
            </DemoTile>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <DemoTile>
              <DemoTileHeader tone="success" label="Sentence case" />
              <p className="mt-3 text-base text-text-primary">Cotización aprobada</p>
              <p className="mt-1 text-xs text-text-tertiary">
                Solo la primera letra y los nombres propios en mayúscula. La etiqueta pequeña sobre
                un valor es text-xs text-text-tertiary, sin eyebrows en mayúsculas.
              </p>
            </DemoTile>
            <DemoTile>
              <DemoTileHeader tone="danger" label="Title Case y MAYÚSCULAS" />
              <p className="mt-3 text-base text-text-primary">Cotización Aprobada</p>
              <p className="mt-1 text-xs text-text-tertiary">
                Prohibido en labels, encabezados de tabla, botones, badges y tabs.
              </p>
            </DemoTile>
          </div>
        </div>
      </Subsection>

      <Subsection
        id="radios"
        title="Radios"
        caption="Cuatro utilidades, tres valores: sm 4 px, md y lg 6 px, xl 12 px. Se escribe siempre la utilidad según el tipo de superficie, nunca rounded-[6px]. El valor de cada tile está medido en tiempo de ejecución."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {RADII.map((r) => (
            <RadiusTile key={r.utility} {...r} />
          ))}
        </div>
      </Subsection>

      <Subsection
        id="elevacion"
        title="Escala de elevación"
        caption="Cinco niveles. Cada superficie pertenece a uno y no cambia de nivel salvo en hover, donde sube uno. Elevación por sombra, no por borde; el borde aparece solo en oscuro, donde la sombra pierde contraste."
      >
        <div className="space-y-6">
          <LevelRow
            level="0"
            name="Plano · sobre el gris del panel"
            lives="Hero, sub-cards y tile dentro de un panel. Sin borde en claro: blanco sobre gris ya separa."
            recipe={LEVEL0_PANEL_CLASS}
            floor="bg-bg-elevated"
            floorLabel="panel · bg-bg-elevated"
          >
            <div className={cn(LEVEL0_PANEL_CLASS, 'p-4')}>
              <DemoCardBody />
            </div>
          </LevelRow>

          <LevelRow
            level="0"
            name="Plano · sobre el piso de un modal o drawer"
            lives="StepCard y FormCard dentro de modales y drawers; toolbars, tabs, chips y filas en reposo."
            recipe={LEVEL0_FLOOR_CLASS}
            floor="bg-background"
            floorLabel="piso · bg-background"
          >
            <div className={cn(LEVEL0_FLOOR_CLASS, 'p-4')}>
              <DemoCardBody />
            </div>
          </LevelRow>

          <LevelRow
            level="1"
            name="Control"
            lives="Inputs, selects, botones outline y primario. El hover de un control es de fondo, no de sombra."
            recipe="shadow-xs"
            floor="bg-background"
            floorLabel="piso · bg-background"
          >
            <div className="flex flex-wrap items-center gap-3">
              <Input placeholder="Nombre del cliente" className="max-w-56 bg-bg-surface" />
              <Button variant="outline">Cancelar</Button>
              <Button>Guardar</Button>
            </div>
          </LevelRow>

          <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
            <div>
              <p className="text-2xl font-semibold tabular-nums text-text-disabled">2</p>
              <p className="text-sm font-semibold text-text-tertiary">Retirado</p>
            </div>
            <div className="rounded-lg border border-dashed border-border-default p-4 text-xs text-text-tertiary">
              Existió como shadow-sm + border-border-card (02/09/2026). Nada vive aquí; se conserva
              el token border-card para el nivel 3 en oscuro.
            </div>
          </div>

          <LevelRow
            level="3"
            name="Flotante"
            lives="Todo contenedor de vista: card de tabla, KPI tiles, cards del dashboard, panel derecho, tile de monto, popover de filtros. Es DETAIL_CARD_CLASS."
            recipe={DETAIL_CARD_CLASS}
            floor="bg-background"
            floorLabel="página · bg-bg-base"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className={cn(DETAIL_CARD_CLASS, 'p-4')}>
                <DemoCardBody />
              </div>
              <div
                className={cn(
                  DETAIL_CARD_CLASS,
                  'cursor-pointer p-4 transition-shadow duration-150 hover:shadow-lg motion-reduce:transition-none',
                )}
              >
                <p className="text-sm font-semibold text-text-primary">Card clicable</p>
                <p className="mt-1 text-xs text-text-tertiary">
                  Pasa el cursor: sube un nivel con hover:shadow-lg y transition-shadow
                  duration-150. Nunca dos niveles ni translate.
                </p>
              </div>
            </div>
          </LevelRow>

          <LevelRow
            level="4"
            name="Overlay"
            lives="Modales, drawers, menús, barra flotante de acciones. Solo lo que flota sobre la página; el contenido de la página no pasa de 3."
            recipe="shadow-lg + border border-border"
            floor="bg-background"
            floorLabel="página · bg-bg-base"
          >
            <div className={cn(LEVEL4_CLASS, 'w-48 p-1')}>
              {['Editar', 'Duplicar', 'Exportar PDF'].map((item) => (
                <div
                  key={item}
                  className="rounded-sm px-2 py-1.5 text-sm text-text-primary hover:bg-accent"
                >
                  {item}
                </div>
              ))}
            </div>
          </LevelRow>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-text-primary">Sombras del sistema</h4>
            <div className="overflow-x-auto rounded-lg border border-border-subtle">
              <div className="grid min-w-[640px] grid-cols-[150px_200px_minmax(0,1fr)] gap-x-4 border-b border-border-subtle px-4 py-2 text-xs text-text-tertiary">
                <span>Utilidad</span>
                <span>Nivel</span>
                <span>Valor resuelto</span>
              </div>
              {SHADOW_TOKENS.map((s) => (
                <ShadowRow key={s.utility} {...s} />
              ))}
            </div>
            <p className="text-xs text-text-tertiary">
              Sin sombras internas, con tinte ni decorativas. shadow-row (halo en hover) se retira:
              el hover de fila es tinte de fondo. Cuando una superficie anima su ancho dentro de un
              overflow-hidden, la sombra va en el envoltorio. El foco es siempre shadow-focus y no
              se mezcla con sombra de elevación en el mismo estado.
            </p>
          </div>
        </div>
      </Subsection>

      <Subsection
        id="espaciado"
        title="Espaciado"
        caption="Escala de 4 px para padding, gap y márgenes. Gutter mínimo de 16 px; cards de página con p-4 o p-5; PageContainer con p-6 md:p-8."
      >
        <div className="space-y-2.5">
          {SPACING.map((s) => (
            <div key={s.px} className="flex items-center gap-4">
              <code className="w-24 font-mono text-xs tabular-nums text-text-secondary">
                {s.px} px · p-{s.step}
              </code>
              <div className="h-2 rounded-sm bg-text-secondary" style={{ width: `${s.px}px` }} />
            </div>
          ))}
        </div>
      </Subsection>

      <Subsection
        id="interaccion"
        title="Interacción"
        caption="Foco con glow azul, nunca línea. Hover de fila con tinte, nunca halo; el halo es solo de la fila seleccionada. 150 ms para color y fondo, 300 ms para paneles y tabs."
      >
        <div className="space-y-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-text-primary">Foco</h4>
              <Input
                placeholder="Haz clic o tabula hasta aquí"
                className="max-w-sm bg-bg-surface"
              />
              <Recipe code={FOCUS_CLASS} />
              <p className="text-xs text-text-tertiary">
                Ya viene en todas las primitivas; un control custom lo copia. Prohibido ring-2,
                ring-[3px], ring-brand y el borde azul al 100 %. Un input sin caja lleva border
                border-transparent border-b-border-subtle en reposo y al enfocar muestra la caja
                completa con glow.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-text-primary">Movimiento</h4>
              <ul className="space-y-1.5 text-xs text-text-secondary">
                <li>
                  Hover de color o fondo: <code className="font-mono">duration-150</code>.
                </li>
                <li>
                  Paneles, anchos, columnas: 300 ms ease-out sobre{' '}
                  <code className="font-mono">transition-[width,opacity,visibility]</code>.
                </li>
                <li>
                  Entrada de contenido:{' '}
                  <code className="font-mono">
                    animate-in fade-in-0 slide-in-from-bottom-1 duration-300 ease-out
                  </code>
                  .
                </li>
                <li>
                  Acordeones con Radix Collapsible y{' '}
                  <code className="font-mono">animate-collapsible-down/up</code>; nunca details
                  nativo.
                </li>
                <li>
                  Siempre <code className="font-mono">motion-reduce:transition-none</code> o{' '}
                  <code className="font-mono">motion-reduce:animate-none</code>. Sin scale, bounce
                  ni elastic; nada mayor a 300 ms.
                </li>
              </ul>
            </div>
          </div>

          <RowsDemo />
        </div>
      </Subsection>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Piezas locales
// ---------------------------------------------------------------------------

function TwoFamiliesNote() {
  return (
    <div className="rounded-lg border border-border-subtle bg-bg-surface p-5">
      <h4 className="text-sm font-semibold text-text-primary">Regla de las dos familias</h4>
      <p className="mt-1 max-w-3xl text-xs text-text-secondary">
        Tres capas en globals.css: variables por tema en :root y .dark, @theme inline que las expone
        como colores de Tailwind, y utilidades en los componentes. Hay dos familias de variables y
        apuntan a los mismos valores.
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-xs font-medium text-text-primary">Vistas y moldes</p>
          <p className="mt-0.5 text-xs text-text-tertiary">
            Listas, fichas, paneles, cards de página: la familia del sistema.
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {SYSTEM_FAMILY.map((u) => (
              <CodeChip key={u}>{u}</CodeChip>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-text-primary">
            Primitivas de components/ui e interior de modales
          </p>
          <p className="mt-0.5 text-xs text-text-tertiary">El espejo shadcn.</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {SHADCN_FAMILY.map((u) => (
              <CodeChip key={u}>{u}</CodeChip>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-4 text-xs text-text-secondary">
        Lo prohibido es la tercera vía: literales de color de Tailwind o hex escritos en el
        componente. Espejo: background = base, card y popover = surface, muted y accent = overlay,
        secondary = elevated, ring = info, destructive = danger, primary = foreground.
      </p>
    </div>
  );
}

function CodeChip({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-sm bg-bg-elevated px-1.5 py-0.5 font-mono text-xs text-text-secondary">
      {children}
    </code>
  );
}

function TokenSwatch({ token, utility, preview }: TokenSwatchDef) {
  const value = useCssVar(token);
  return (
    <div className="flex min-w-0 flex-col gap-2">
      {preview === 'fill' && (
        <div className={cn('h-14 w-full rounded-md border border-border-subtle', utility)} />
      )}
      {preview === 'border' && (
        <div className={cn('h-14 w-full rounded-md border bg-bg-surface', utility)} />
      )}
      {preview === 'text' && (
        <div
          className={cn(
            'flex h-14 w-full items-center justify-center rounded-md border border-border-subtle bg-bg-surface text-2xl font-medium',
            utility,
          )}
        >
          Aa
        </div>
      )}
      <div className="min-w-0 space-y-0.5">
        <code className="block truncate font-mono text-xs text-text-primary">{utility}</code>
        <code className="block truncate font-mono text-xs text-text-tertiary">{token}</code>
        <code
          className="block truncate font-mono text-xs tabular-nums text-text-secondary"
          title={value}
        >
          {value || '…'}
        </code>
      </div>
    </div>
  );
}

function RadiusTile({ utility, token, use }: { utility: string; token: string; use: string }) {
  const [measured, setMeasured] = useState<string | null>(null);
  const measure = useCallback((node: HTMLDivElement | null) => {
    if (node) setMeasured(getComputedStyle(node).borderRadius);
  }, []);
  return (
    <div className="flex flex-col gap-3">
      <div
        ref={measure}
        className={cn('h-20 border border-border-default bg-bg-surface', utility)}
      />
      <div>
        <code className="font-mono text-xs text-text-primary">{utility}</code>
        <p className="mt-0.5 font-mono text-xs tabular-nums text-text-tertiary">
          {token} · {measured ?? '…'}
        </p>
        <p className="mt-0.5 text-xs text-text-tertiary">{use}</p>
      </div>
    </div>
  );
}

function LevelRow({
  level,
  name,
  lives,
  recipe,
  floor,
  floorLabel,
  children,
}: {
  level: string;
  name: string;
  lives: string;
  recipe: string;
  floor: string;
  floorLabel: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
      <div>
        <p className="text-2xl font-semibold tabular-nums text-text-primary">{level}</p>
        <p className="text-sm font-semibold text-text-primary">{name}</p>
        <p className="mt-1 text-xs text-text-tertiary">{lives}</p>
      </div>
      <div className="space-y-3">
        <div className={cn('rounded-lg border border-border-subtle p-5', floor)}>
          <p className="mb-3 text-xs text-text-tertiary">{floorLabel}</p>
          {children}
        </div>
        <Recipe code={recipe} />
      </div>
    </div>
  );
}

function DemoCardBody() {
  return (
    <>
      <p className="text-sm font-semibold text-text-primary">Título de la card</p>
      <p className="mt-1 text-xs text-text-tertiary">Subline terciaria con el dato de apoyo.</p>
    </>
  );
}

function Recipe({ code, label = 'Copiar clases' }: { code: string; label?: string }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-md bg-bg-elevated px-3 py-2">
      <code className="min-w-0 break-all font-mono text-xs text-text-secondary">{code}</code>
      <CopyJSXButton code={code} label={label} />
    </div>
  );
}

function ShadowRow({
  utility,
  token,
  level,
}: {
  utility: string;
  token: string | null;
  level: string;
}) {
  const value = useCssVar(token ?? '');
  return (
    <div className="grid min-w-[640px] grid-cols-[150px_200px_minmax(0,1fr)] items-center gap-x-4 border-b border-border-subtle px-4 py-2.5 last:border-0">
      <div className="flex items-center gap-3">
        <div className={cn('size-6 shrink-0 rounded-md bg-bg-surface', utility)} />
        <code className="font-mono text-xs text-text-primary">{utility}</code>
      </div>
      <span className="text-xs text-text-secondary">{level}</span>
      <code className="truncate font-mono text-xs text-text-tertiary" title={value}>
        {token ? value || '…' : 'Tailwind'}
      </code>
    </div>
  );
}

function RowsDemo() {
  const [selectedId, setSelectedId] = useState<string>('r2');
  const rowHover = useCssVar('--ds-row-hover');
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-text-primary">Filas y listas</h4>
      <div className={cn(DETAIL_CARD_CLASS, 'max-w-2xl overflow-hidden')}>
        <div className="grid h-9 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 border-b border-border-subtle px-4 text-xs text-text-tertiary">
          <span>Concepto</span>
          <span>Monto</span>
        </div>
        {ROWS.map((row) => {
          const selected = row.id === selectedId;
          return (
            <button
              key={row.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setSelectedId(row.id)}
              className={cn(ROW_BASE_CLASS, selected ? ROW_SELECTED_CLASS : ROW_IDLE_CLASS)}
            >
              {selected && <SelectedStripe />}
              <span className="min-w-0">
                <span className="block truncate font-medium text-text-primary">{row.concept}</span>
                <span className="block truncate text-xs text-text-tertiary">{row.meta}</span>
              </span>
              <span
                className={cn(
                  'tabular-nums',
                  row.amount < 0 ? 'text-danger-text' : 'text-text-primary',
                )}
              >
                {row.amount < 0 ? '−' : ''}
                {formatCurrency(Math.abs(row.amount))}
              </span>
            </button>
          );
        })}
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <Recipe code={ROW_IDLE_CLASS} />
        <Recipe code={`${ROW_SELECTED_CLASS} + <SelectedStripe />`} />
      </div>
      <p className="text-xs text-text-tertiary">
        Reposo: border-b border-border-subtle, zebra opcional odd:bg-bg-base. Hover: tinte{' '}
        <code className="font-mono">--ds-row-hover</code> = {rowHover || '…'}. Seleccionada:
        comparte bg-bg-elevated con el panel y lleva la franja bg-success de 3 px dentro de la
        primera celda relative. Clicable = cursor-pointer explícito. Sin bordes verticales; montos a
        la derecha con la regla del libro: solo las salidas en rojo.
      </p>
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
    <div className={cn('flex items-center gap-1.5 text-xs', colorClass)}>
      <Icon className="size-3.5" strokeWidth={1.5} />
      <span>{label}</span>
    </div>
  );
}
