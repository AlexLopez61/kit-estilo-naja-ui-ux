import {
  AlertTriangle,
  CheckCircle2,
  Info,
  RefreshCw,
  X,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import { ReactNode } from 'react';
import { Section } from '../_components/Section';
import { Subsection } from '../_components/Subsection';

type Tone = 'success' | 'warning' | 'danger' | 'info';

const TONE_META: Record<
  Tone,
  { icon: LucideIcon; pill: string; text: string; subtle: string; solid: string }
> = {
  success: {
    icon: CheckCircle2,
    pill: 'bg-success-subtle text-success-text',
    text: 'text-success-text',
    subtle: 'bg-success-subtle',
    solid: 'bg-success',
  },
  warning: {
    icon: AlertTriangle,
    pill: 'bg-warning-subtle text-warning-text',
    text: 'text-warning-text',
    subtle: 'bg-warning-subtle',
    solid: 'bg-warning',
  },
  danger: {
    icon: XCircle,
    pill: 'bg-danger-subtle text-danger-text',
    text: 'text-danger-text',
    subtle: 'bg-danger-subtle',
    solid: 'bg-danger',
  },
  info: {
    icon: Info,
    pill: 'bg-info-subtle text-info-text',
    text: 'text-info-text',
    subtle: 'bg-info-subtle',
    solid: 'bg-info',
  },
};

export function StatesSection() {
  return (
    <Section
      id="states"
      title="States"
      description="Estados transitorios que la app muestra todo el tiempo: cargando, error, notificaciones y progreso. Los toasts son mocks visuales para validar el look — la app real usa sonner."
    >
      <Subsection
        title="5.1 Loading states"
        caption="Skeletons con bg-bg-elevated animado (animate-pulse). Replican la silueta del contenido real para evitar saltos de layout. Skeleton sobre spinner para listas y cards."
      >
        <div className="grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-2">
          <LabeledBlock label="Card">
            <SkeletonCard />
          </LabeledBlock>
          <LabeledBlock label="KPI card">
            <SkeletonKpi />
          </LabeledBlock>
          <LabeledBlock label="Lista · 5 rows">
            <SkeletonList />
          </LabeledBlock>
          <LabeledBlock label="Tabla">
            <SkeletonTable />
          </LabeledBlock>
        </div>
      </Subsection>

      <Subsection
        title="5.2 Estados de error"
        caption="Tres niveles de gravedad: error inline contenido en una card con acción de reintento, banner full-width para fallos de página, y toast compacto para fallos de acción puntual."
      >
        <div className="max-w-5xl space-y-5">
          <ErrorBanner />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <ErrorInlineCard />
            <div className="flex items-start">
              <ErrorToast />
            </div>
          </div>
        </div>
      </Subsection>

      <Subsection
        title="5.3 Notificaciones · toasts"
        caption="Cuatro variantes por tono semántico. Container bg-bg-overlay con shadow-lg (flotan sobre el contenido). Ícono en color del tono, título, descripción opcional y cierre. Mock visual, no sonner real."
      >
        <div className="grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
          <Toast
            tone="success"
            title="Cobro registrado"
            description="Se registró el cobro de PAG-2026-041 por $12,500.00."
          />
          <Toast
            tone="warning"
            title="Pagaré próximo a pagar"
            description="PAG-2026-041 se cobra en 4 días."
          />
          <Toast
            tone="danger"
            title="No se pudo guardar"
            description="Revisa tu conexión e intenta de nuevo."
          />
          <Toast tone="info" title="Cotización enviada" description="Se notificó a María Pérez." />
        </div>
      </Subsection>

      <Subsection
        title="5.4 Progress indicators"
        caption="Barras lineales (track bg-bg-elevated, fill bg-brand) en dos grosores, y anillos circulares en dos tamaños. Para acciones determinadas con avance medible; el spinner queda para esperas indeterminadas puntuales."
      >
        <div className="max-w-5xl space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <LabeledBlock label="Barra delgada · 4px">
              <ProgressBar value={35} thin />
            </LabeledBlock>
            <LabeledBlock label="Barra normal · 6px">
              <ProgressBar value={72} />
            </LabeledBlock>
          </div>
          <LabeledBlock label="Anillos · 24px y 40px">
            <div className="flex items-center gap-8">
              <ProgressRing value={35} size={24} />
              <ProgressRing value={72} size={40} />
              <ProgressRing value={100} size={40} tone="success" />
            </div>
          </LabeledBlock>
        </div>
      </Subsection>
    </Section>
  );
}

// =============================================================================
// Helpers
// =============================================================================

function LabeledBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-text-tertiary">{label}</p>
      {children}
    </div>
  );
}

function StateCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-border-subtle bg-bg-surface p-5 ${className}`.trim()}>
      {children}
    </div>
  );
}

function Bar({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-sm bg-bg-elevated ${className}`.trim()} />;
}

// =============================================================================
// 5.1 Loading states
// =============================================================================

function SkeletonCard() {
  return (
    <StateCard>
      <div className="flex items-center gap-3">
        <Bar className="size-9 rounded-full" />
        <div className="flex-1 space-y-2">
          <Bar className="h-3 w-2/5" />
          <Bar className="h-2.5 w-3/5" />
        </div>
      </div>
      <div className="mt-5 space-y-2.5">
        <Bar className="h-2.5 w-full" />
        <Bar className="h-2.5 w-11/12" />
        <Bar className="h-2.5 w-3/4" />
      </div>
      <div className="mt-5 flex gap-2">
        <Bar className="h-8 w-24 rounded-md" />
        <Bar className="h-8 w-20 rounded-md" />
      </div>
    </StateCard>
  );
}

function SkeletonKpi() {
  return (
    <StateCard>
      <div className="flex items-center justify-between">
        <Bar className="h-2.5 w-28" />
        <Bar className="h-7 w-24 rounded-md" />
      </div>
      <Bar className="mt-4 h-8 w-40" />
      <Bar className="mt-2 h-2.5 w-32" />
    </StateCard>
  );
}

function SkeletonList() {
  return (
    <StateCard className="p-0">
      <ul className="divide-y divide-border-subtle">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="flex items-center gap-3 px-4 py-3">
            <Bar className="size-7 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Bar className="h-2.5 w-1/3" />
              <Bar className="h-2 w-1/2" />
            </div>
            <Bar className="h-2.5 w-16" />
          </li>
        ))}
      </ul>
    </StateCard>
  );
}

function SkeletonTable() {
  return (
    <StateCard className="p-0">
      <div className="flex items-center gap-3 border-b border-border-subtle px-4 py-2.5">
        <Bar className="h-2 w-20" />
        <Bar className="h-2 w-24" />
        <Bar className="ml-auto h-2 w-12" />
      </div>
      <div className="divide-y divide-border-subtle">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3">
            <Bar className="h-2.5 w-24" />
            <Bar className="h-2.5 w-32" />
            <Bar className="ml-auto h-2.5 w-14" />
          </div>
        ))}
      </div>
    </StateCard>
  );
}

// =============================================================================
// 5.2 Estados de error
// =============================================================================

function RetryButton({ subtle = false }: { subtle?: boolean }) {
  return (
    <button
      type="button"
      className={
        subtle
          ? 'inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-sm text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
          : 'inline-flex h-8 items-center gap-1.5 rounded-md border border-border-default bg-bg-elevated px-3 text-sm text-text-primary hover:bg-bg-overlay'
      }
    >
      <RefreshCw className="size-3.5" strokeWidth={1.5} />
      Reintentar
    </button>
  );
}

function ErrorInlineCard() {
  return (
    <StateCard className="flex flex-col items-center py-10 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-danger-subtle">
        <XCircle className="size-6 text-danger-text" strokeWidth={1.5} />
      </span>
      <h4 className="mt-4 text-base text-text-primary">No se pudieron cargar los cobros</h4>
      <p className="mt-1 max-w-xs text-sm text-text-secondary">
        Ocurrió un error al consultar la información. Verifica tu conexión e inténtalo otra vez.
      </p>
      <div className="mt-5">
        <RetryButton />
      </div>
    </StateCard>
  );
}

function ErrorBanner() {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-danger-subtle bg-danger-subtle px-4 py-3">
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-danger-text" strokeWidth={1.75} />
      <div className="min-w-0 flex-1">
        <p className="text-sm text-text-primary">No se pudo conectar con el servidor</p>
        <p className="mt-0.5 text-xs text-text-secondary">
          Algunos datos pueden estar desactualizados. Se reintentará automáticamente en segundo
          plano.
        </p>
      </div>
      <RetryButton subtle />
    </div>
  );
}

function ErrorToast() {
  return (
    <div className="flex w-full max-w-sm items-start gap-3 rounded-md border border-border-default bg-bg-overlay p-3 shadow-lg">
      <XCircle className="mt-0.5 size-4 shrink-0 text-danger-text" strokeWidth={1.75} />
      <div className="min-w-0 flex-1">
        <p className="text-sm text-text-primary">No se pudo guardar el gasto</p>
        <p className="mt-0.5 text-xs text-text-secondary">Falta la asignación a un proyecto.</p>
      </div>
      <button
        type="button"
        className="-m-1 shrink-0 rounded-sm p-1 text-text-tertiary hover:text-text-primary"
        aria-label="Cerrar"
      >
        <X className="size-3.5" strokeWidth={1.75} />
      </button>
    </div>
  );
}

// =============================================================================
// 5.3 Toasts
// =============================================================================

function Toast({ tone, title, description }: { tone: Tone; title: string; description?: string }) {
  const meta = TONE_META[tone];
  const Icon = meta.icon;
  return (
    <div className="flex items-start gap-3 rounded-md border border-border-default bg-bg-overlay p-3 shadow-lg">
      <Icon className={`mt-0.5 size-4 shrink-0 ${meta.text}`} strokeWidth={1.75} />
      <div className="min-w-0 flex-1">
        <p className="text-sm text-text-primary">{title}</p>
        {description && <p className="mt-0.5 text-xs text-text-secondary">{description}</p>}
      </div>
      <button
        type="button"
        className="-m-1 shrink-0 rounded-sm p-1 text-text-tertiary hover:text-text-primary"
        aria-label="Cerrar"
      >
        <X className="size-3.5" strokeWidth={1.75} />
      </button>
    </div>
  );
}

// =============================================================================
// 5.4 Progress indicators
// =============================================================================

function ProgressBar({ value, thin = false }: { value: number; thin?: boolean }) {
  return (
    <div className="space-y-1.5">
      <div
        className={`w-full overflow-hidden rounded-full bg-bg-elevated ${thin ? 'h-1' : 'h-1.5'}`}
      >
        <div className="h-full rounded-full bg-brand" style={{ width: `${value}%` }} />
      </div>
      <div className="flex justify-between text-xs tabular-nums text-text-tertiary">
        <span>Avance de etapa</span>
        <span>{value}%</span>
      </div>
    </div>
  );
}

function ProgressRing({
  value,
  size,
  tone = 'info',
}: {
  value: number;
  size: number;
  tone?: 'info' | 'success';
}) {
  const stroke = size >= 40 ? 3 : 2.5;
  const r = 18 - stroke / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - value / 100);
  const valueColor = tone === 'success' ? 'var(--color-success)' : 'var(--color-brand)';
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 36 36" className="size-full -rotate-90" aria-hidden>
          <circle
            cx="18"
            cy="18"
            r={r}
            fill="none"
            stroke="var(--color-bg-elevated)"
            strokeWidth={stroke}
          />
          <circle
            cx="18"
            cy="18"
            r={r}
            fill="none"
            stroke={valueColor}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        {size >= 40 && (
          <span className="absolute inset-0 flex items-center justify-center text-[11px] tabular-nums text-text-secondary">
            {value}
          </span>
        )}
      </div>
      <span className="text-xs tabular-nums text-text-tertiary">{value}%</span>
    </div>
  );
}
