import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  FileQuestion,
  MoreHorizontal,
  Plus,
  User,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { CopyJSXButton } from '../_components/CopyJSXButton';
import { Section } from '../_components/Section';
import { Subsection } from '../_components/Subsection';

const KPI_CARD_JSX = `<div className="rounded-lg border border-border-subtle bg-bg-surface p-5">
  <p className="text-xs text-text-tertiary">Cobranza del mes</p>
  <p className="mt-3 text-3xl font-medium tabular-nums tracking-[-0.01em] text-text-primary">
    {formatCurrency(125000)}
  </p>
  <div className="mt-1 flex items-center gap-2">
    <span className="inline-flex items-center gap-0.5 text-xs tabular-nums text-success-text">
      <ArrowUpRight className="size-3" strokeWidth={2} />
      12.5%
    </span>
    <span className="text-xs text-text-tertiary">vs mes anterior</span>
  </div>
</div>`;

type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const TONE_PILL: Record<Tone, string> = {
  success: 'bg-success-subtle text-success-text',
  warning: 'bg-warning-subtle text-warning-text',
  danger: 'bg-danger-subtle text-danger-text',
  info: 'bg-info-subtle text-info-text',
  neutral: 'bg-bg-elevated text-text-secondary',
};

const TONE_TEXT: Record<Tone, string> = {
  success: 'text-success-text',
  warning: 'text-warning-text',
  danger: 'text-danger-text',
  info: 'text-info-text',
  neutral: 'text-text-primary',
};

const formatMXN = (n: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);

const formatInt = (n: number) => new Intl.NumberFormat('es-MX').format(n);

export function PatternsSection() {
  return (
    <Section
      id="patterns"
      title="Patterns del dominio NAJA"
      description="Patrones de UI que se van a usar masivamente en la migración: KPIs, cards de cotización, proyecto y pagaré, estados vacíos y bento dashboard. Cada uno construido sobre los tokens y atoms."
    >
      <Subsection
        title="4.1 KPI Card"
        caption="Tres variantes: monto MXN con sparkline, conteo con cambio absoluto, porcentaje con cambio relativo."
      >
        <div className="space-y-4">
          <div className="flex max-w-5xl justify-end">
            <CopyJSXButton code={KPI_CARD_JSX} label="Copiar JSX · KPI" />
          </div>
          <div className="grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
            <KPIMonto />
            <KPIConteo />
            <KPIPorcentaje />
          </div>
        </div>
      </Subsection>

      <Subsection
        title="4.2 Card de cotización"
        caption="Variante densa para listados (A) y variante bento con monto hero para vista de detalle (B)."
      >
        <div className="grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-2">
          <QuoteCardDense />
          <QuoteCardBento />
        </div>
      </Subsection>

      <Subsection
        title="4.3 Card de proyecto"
        caption="Header con metadata + bento interno con 5 KPIs financieros + footer con responsable y acciones."
      >
        <ProjectCard />
      </Subsection>

      <Subsection
        title="4.4 Card de pagaré"
        caption="Estados del ciclo de vida (Emitido / Custodia / Cobrado / Vencido) en una grilla. Urgencia de la fecha de cobro por color."
      >
        <div className="grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {PAGARE_MOCKS.map((p) => (
            <PagareCard key={p.id} {...p} />
          ))}
        </div>
      </Subsection>

      <Subsection
        title="4.5 Empty state"
        caption="Cuando una lista o sección no tiene datos. Ícono grande en opacity 0.24, título, descripción corta y CTA primario."
      >
        <EmptyState />
      </Subsection>

      <Subsection
        title="4.6 Bento dashboard"
        caption="Mini-dashboard con 6 tiles asimétricos sobre grid de 12 columnas. Demuestra que el sistema funciona como conjunto, no sólo como cards aisladas."
      >
        <BentoDashboard />
      </Subsection>
    </Section>
  );
}

// =============================================================================
// Helpers compartidos
// =============================================================================

function Delta({
  value,
  direction,
  tone,
}: {
  value: string;
  direction: 'up' | 'down';
  tone: 'success' | 'danger';
}) {
  const Icon = direction === 'up' ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs tabular-nums ${TONE_TEXT[tone]}`}>
      <Icon className="size-3" strokeWidth={2} />
      {value}
    </span>
  );
}

function Sparkline({ tone }: { tone: 'success' | 'danger' | 'info' }) {
  const cssVar =
    tone === 'success'
      ? 'var(--color-success-text)'
      : tone === 'danger'
        ? 'var(--color-danger-text)'
        : 'var(--color-info-text)';
  return (
    <svg viewBox="0 0 100 30" className="h-7 w-24" preserveAspectRatio="none" aria-hidden>
      <polyline
        points="0,22 10,18 20,24 30,15 40,17 50,10 60,12 70,7 80,9 90,4 100,2"
        fill="none"
        stroke={cssVar}
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function PatternCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-border-subtle bg-bg-surface p-5 ${className}`.trim()}>
      {children}
    </div>
  );
}

// =============================================================================
// 4.1 KPI Cards
// =============================================================================

function KPIMonto() {
  return (
    <PatternCard>
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-tertiary">Cobranza del mes</p>
        <Sparkline tone="success" />
      </div>
      <p className="mt-3 text-3xl font-medium tabular-nums tracking-[-0.01em] text-text-primary">
        {formatMXN(125000)}
      </p>
      <div className="mt-1 flex items-center gap-2">
        <Delta value="12.5%" direction="up" tone="success" />
        <span className="text-xs text-text-tertiary">vs mes anterior</span>
      </div>
    </PatternCard>
  );
}

function KPIConteo() {
  return (
    <PatternCard>
      <p className="text-xs text-text-tertiary">Cotizaciones activas</p>
      <p className="mt-3 text-3xl font-medium tabular-nums tracking-[-0.01em] text-text-primary">
        47
      </p>
      <div className="mt-1 flex items-center gap-2">
        <Delta value="+3" direction="up" tone="success" />
        <span className="text-xs text-text-tertiary">esta semana</span>
      </div>
    </PatternCard>
  );
}

function KPIPorcentaje() {
  return (
    <PatternCard>
      <p className="text-xs text-text-tertiary">Tasa de cobranza</p>
      <p className="mt-3 text-3xl font-medium tabular-nums tracking-[-0.01em] text-text-primary">
        89.4<span className="text-text-secondary">%</span>
      </p>
      <div className="mt-1 flex items-center gap-2">
        <Delta value="2.1%" direction="down" tone="danger" />
        <span className="text-xs text-text-tertiary">vs mes anterior</span>
      </div>
    </PatternCard>
  );
}

// =============================================================================
// 4.2 Cotización Cards
// =============================================================================

function QuoteCardDense() {
  return (
    <div className="space-y-2">
      <p className="text-xs text-text-tertiary">Variante A · densa horizontal (listas)</p>
      <div className="flex items-center gap-4 rounded-lg border border-border-subtle bg-bg-surface p-4 transition-colors hover:bg-bg-elevated">
        <div className="w-16 shrink-0 font-mono text-xs text-text-secondary">COT-001</div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-text-primary">Pintura test</p>
          <p className="truncate text-xs text-text-tertiary">Casa Montejo · María Pérez</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium tabular-nums text-text-primary">{formatMXN(48200)}</p>
          <p className="text-[11px] text-text-tertiary">Vence 15/Jun/2026</p>
        </div>
        <div className="flex w-24 shrink-0 justify-start">
          <Badge tone="warning">Pendiente</Badge>
        </div>
      </div>
    </div>
  );
}

function QuoteCardBento() {
  return (
    <div className="space-y-2">
      <p className="text-xs text-text-tertiary">Variante B · bento con monto hero (detalle)</p>
      <div className="overflow-hidden rounded-lg border border-border-subtle bg-bg-surface">
        <div className="flex items-start justify-between gap-3 p-5">
          <div className="min-w-0">
            <p className="font-mono text-xs text-text-secondary">COT-001</p>
            <h4 className="mt-1 text-lg text-text-primary">Pintura test</h4>
            <p className="mt-1 text-xs text-text-tertiary">
              <span className="text-text-secondary">Casa Montejo</span> · María Pérez
            </p>
          </div>
          <Badge tone="warning">Pendiente</Badge>
        </div>
        <div className="border-t border-border-subtle bg-bg-elevated p-5">
          <p className="text-xs text-text-tertiary">Monto cotizado</p>
          <p className="mt-1 text-3xl font-medium tabular-nums tracking-[-0.01em] text-text-primary">
            {formatMXN(48200)}
          </p>
          <p className="mt-1 text-xs text-text-tertiary">Vigente hasta 15 de junio de 2026</p>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// 4.3 Proyecto Card
// =============================================================================

type MiniKPIProps = {
  label: string;
  value: string;
  tone?: Tone;
};

function MiniKPI({ label, value, tone = 'neutral' }: MiniKPIProps) {
  return (
    <div className="rounded-md bg-bg-elevated p-3">
      <p className="text-xs text-text-tertiary">{label}</p>
      <p className={`mt-1 text-sm font-medium tabular-nums ${TONE_TEXT[tone]}`}>{value}</p>
    </div>
  );
}

function ProjectCard() {
  return (
    <div className="max-w-5xl rounded-lg border border-border-subtle bg-bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-lg text-text-primary">Pintura fachada Casa Montejo</h4>
            <Badge tone="info">En progreso</Badge>
          </div>
          <p className="mt-1 text-xs text-text-tertiary">
            <span className="text-text-secondary">Casa Montejo</span> · María Pérez · Inicio
            03/Abr/2026
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-5">
        <MiniKPI label="Presupuesto aprobado" value={formatMXN(180000)} />
        <MiniKPI label="Por cobrar" value={formatMXN(60000)} tone="warning" />
        <MiniKPI label="Gastado" value={formatMXN(110000)} />
        <MiniKPI label="Ya cobrado" value={formatMXN(120000)} tone="success" />
        <MiniKPI label="Ganancia" value={formatMXN(70000)} tone="success" />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle pt-4">
        <div className="flex items-center gap-2 text-xs text-text-tertiary">
          <User className="size-3.5" strokeWidth={1.5} />
          <span>Responsable: Roberto García</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="h-8 rounded-md px-3 text-sm text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
          >
            Ver detalle
          </button>
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-md text-text-tertiary hover:bg-bg-elevated hover:text-text-primary"
            aria-label="Acciones"
          >
            <MoreHorizontal className="size-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// 4.4 Pagaré Cards
// =============================================================================

type PagareStatus = 'emitido' | 'custodia' | 'cobrado' | 'vencido';

type PagareMock = {
  id: string;
  status: PagareStatus;
  amount: number;
  tenant: string;
  property: string;
  contract: string;
  dueLabel: string;
  urgency: 'far' | 'soon' | 'today' | 'past';
};

const PAGARE_STATUS_META: Record<
  PagareStatus,
  { label: string; tone: Tone; icon: LucideIcon | null }
> = {
  emitido: { label: 'Emitido', tone: 'neutral', icon: null },
  custodia: { label: 'Custodia', tone: 'info', icon: null },
  cobrado: { label: 'Cobrado', tone: 'success', icon: CheckCircle2 },
  vencido: { label: 'Vencido', tone: 'danger', icon: XCircle },
};

const URGENCY_CLASS: Record<PagareMock['urgency'], string> = {
  far: 'text-text-secondary',
  soon: 'text-warning-text',
  today: 'text-danger-text',
  past: 'text-danger-text',
};

const PAGARE_MOCKS: PagareMock[] = [
  {
    id: 'PAG-2026-040',
    status: 'emitido',
    amount: 12500,
    tenant: 'Pedro Ramírez',
    property: 'Depto Roma Norte 3B',
    contract: 'CTR-2026-08',
    dueLabel: '15/Jul/2026',
    urgency: 'far',
  },
  {
    id: 'PAG-2026-041',
    status: 'custodia',
    amount: 12500,
    tenant: 'Pedro Ramírez',
    property: 'Depto Roma Norte 3B',
    contract: 'CTR-2026-08',
    dueLabel: '05/Jun/2026 · en 4 días',
    urgency: 'soon',
  },
  {
    id: 'PAG-2026-038',
    status: 'cobrado',
    amount: 12500,
    tenant: 'Pedro Ramírez',
    property: 'Depto Roma Norte 3B',
    contract: 'CTR-2026-08',
    dueLabel: '05/May/2026',
    urgency: 'far',
  },
  {
    id: 'PAG-2026-029',
    status: 'vencido',
    amount: 8400,
    tenant: 'Laura Mendoza',
    property: 'Casa Itzimná',
    contract: 'CTR-2025-21',
    dueLabel: '20/May/2026 · vencido hace 12 días',
    urgency: 'past',
  },
];

function PagareCard({
  id,
  status,
  amount,
  tenant,
  property,
  contract,
  dueLabel,
  urgency,
}: PagareMock) {
  const meta = PAGARE_STATUS_META[status];
  return (
    <div className="rounded-lg border border-border-subtle bg-bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="font-mono text-xs text-text-secondary">{id}</p>
        <span
          className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs ${TONE_PILL[meta.tone]}`}
        >
          {meta.icon && <meta.icon className="size-3" strokeWidth={2} />}
          {meta.label}
        </span>
      </div>
      <p className="mt-3 text-2xl font-medium tabular-nums tracking-[-0.01em] text-text-primary">
        {formatMXN(amount)}
      </p>
      <div className="mt-3 space-y-1 text-xs text-text-tertiary">
        <p>
          <span className="text-text-secondary">{tenant}</span> · {property}
        </p>
        <p>
          Contrato:{' '}
          <code className="rounded-sm bg-bg-elevated px-1 py-0.5 font-mono text-[11px] text-text-secondary">
            {contract}
          </code>
        </p>
      </div>
      <div className="mt-3 flex items-center gap-1.5 border-t border-border-subtle pt-3">
        <Calendar className={`size-3.5 ${URGENCY_CLASS[urgency]}`} strokeWidth={1.5} />
        <span className={`text-xs tabular-nums ${URGENCY_CLASS[urgency]}`}>{dueLabel}</span>
      </div>
    </div>
  );
}

// =============================================================================
// 4.5 Empty state
// =============================================================================

function EmptyState() {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-border-subtle bg-bg-surface px-6 py-14 text-center">
      <FileQuestion className="size-16 text-text-disabled" strokeWidth={1} />
      <h4 className="mt-4 text-base text-text-primary">No hay cotizaciones aún</h4>
      <p className="mt-1 max-w-xs text-sm text-text-secondary">
        Crea tu primera cotización para este proyecto y empieza a llevar el control de los costos.
      </p>
      <button
        type="button"
        className="mt-5 inline-flex h-8 items-center gap-1.5 rounded-md bg-brand px-3 text-sm font-medium text-white hover:bg-brand-hover"
      >
        <Plus className="size-4" strokeWidth={1.75} />
        Nueva cotización
      </button>
    </div>
  );
}

// =============================================================================
// 4.6 Bento dashboard
// =============================================================================

const CHART_MONTHS = [
  { label: 'Ene', income: 78, expense: 52 },
  { label: 'Feb', income: 92, expense: 60 },
  { label: 'Mar', income: 85, expense: 70 },
  { label: 'Abr', income: 110, expense: 65 },
  { label: 'May', income: 98, expense: 72 },
  { label: 'Jun', income: 125, expense: 80 },
];

const TOP_PROJECTS = [
  { name: 'Pintura fachada Casa Montejo', amount: 180000 },
  { name: 'Plomería baño principal Roma', amount: 124000 },
  { name: 'Instalación eléctrica Local Itzimná', amount: 96500 },
];

type ActivityKind = 'charge' | 'expense' | 'quote' | 'project';

const ACTIVITY_ICON: Record<ActivityKind, LucideIcon> = {
  charge: Banknote,
  expense: ArrowDownRight,
  quote: CheckCircle2,
  project: Building2,
};

const ACTIVITY_TONE: Record<ActivityKind, Tone> = {
  charge: 'success',
  expense: 'danger',
  quote: 'info',
  project: 'neutral',
};

const RECENT_ACTIVITY: Array<{
  kind: ActivityKind;
  title: string;
  meta: string;
  amount?: string;
}> = [
  {
    kind: 'charge',
    title: 'Cobro renta Pedro Ramírez',
    meta: 'Hace 2 horas · PAG-2026-041',
    amount: formatMXN(12500),
  },
  {
    kind: 'quote',
    title: 'Cotización COT-014 aprobada',
    meta: 'Hace 5 horas · Patricia Solís',
    amount: formatMXN(67900),
  },
  {
    kind: 'expense',
    title: 'Gasto de materiales pintura',
    meta: 'Ayer · Proyecto Casa Montejo',
    amount: formatMXN(8420),
  },
  {
    kind: 'project',
    title: 'Proyecto Casa Tulum iniciado',
    meta: 'Ayer · Diego Castillo',
  },
];

function BentoDashboard() {
  return (
    <div className="grid grid-cols-12 gap-3">
      {/* Hero chart */}
      <div className="col-span-12 rounded-lg border border-border-subtle bg-bg-surface p-5 md:col-span-8">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-xs text-text-tertiary">Ingresos vs egresos</p>
            <p className="text-sm text-text-secondary">Últimos 6 meses · 2026</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-text-tertiary">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-sm bg-success" />
              Ingresos
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-sm bg-danger" />
              Egresos
            </span>
          </div>
        </div>
        <BarChart />
      </div>

      {/* Top proyectos */}
      <div className="col-span-12 rounded-lg border border-border-subtle bg-bg-surface p-5 md:col-span-4">
        <p className="text-xs text-text-tertiary">Top 3 proyectos activos</p>
        <ul className="mt-3 space-y-3">
          {TOP_PROJECTS.map((p, i) => (
            <li key={p.name} className="flex items-start gap-3">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-bg-elevated text-[10px] font-medium text-text-secondary">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-text-primary">{p.name}</p>
                <p className="text-xs tabular-nums text-text-tertiary">{formatMXN(p.amount)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Mini KPI cobranza */}
      <div className="col-span-6 rounded-lg border border-border-subtle bg-bg-surface p-5 md:col-span-3">
        <p className="text-xs text-text-tertiary">Cobranza del mes</p>
        <p className="mt-2 text-xl font-medium tabular-nums tracking-[-0.01em] text-text-primary">
          {formatMXN(125000)}
        </p>
        <Delta value="12.5%" direction="up" tone="success" />
      </div>

      {/* Mini KPI cotizaciones */}
      <div className="col-span-6 rounded-lg border border-border-subtle bg-bg-surface p-5 md:col-span-3">
        <p className="text-xs text-text-tertiary">Cotizaciones pendientes</p>
        <p className="mt-2 text-xl font-medium tabular-nums tracking-[-0.01em] text-text-primary">
          12
        </p>
        <span className="text-xs text-text-tertiary">{formatMXN(284600)} en juego</span>
      </div>

      {/* Actividad reciente */}
      <div className="col-span-12 rounded-lg border border-border-subtle bg-bg-surface p-5 md:col-span-6">
        <div className="flex items-center justify-between">
          <p className="text-xs text-text-tertiary">Actividad reciente</p>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary"
          >
            Ver todo
            <ChevronRight className="size-3" strokeWidth={1.5} />
          </button>
        </div>
        <ul className="mt-3 divide-y divide-border-subtle">
          {RECENT_ACTIVITY.map((a, i) => {
            const Icon = ACTIVITY_ICON[a.kind];
            const tone = ACTIVITY_TONE[a.kind];
            return (
              <li key={i} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                <span
                  className={`flex size-7 shrink-0 items-center justify-center rounded-md ${TONE_PILL[tone]}`}
                >
                  <Icon className="size-3.5" strokeWidth={1.75} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-text-primary">{a.title}</p>
                  <p className="truncate text-xs text-text-tertiary">{a.meta}</p>
                </div>
                {a.amount && (
                  <span
                    className={`shrink-0 text-sm font-medium tabular-nums ${a.kind === 'expense' ? 'text-danger-text' : 'text-text-primary'}`}
                  >
                    {a.kind === 'expense' ? `−${a.amount}` : a.amount}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function BarChart() {
  const maxValue = Math.max(...CHART_MONTHS.flatMap((m) => [m.income, m.expense]));
  return (
    <div className="mt-5 flex h-32 items-end justify-between gap-4">
      {CHART_MONTHS.map((m) => {
        const incomeH = (m.income / maxValue) * 100;
        const expenseH = (m.expense / maxValue) * 100;
        return (
          <div key={m.label} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex h-full w-full items-end justify-center gap-1">
              <div
                className="w-3 rounded-t-sm bg-success"
                style={{ height: `${incomeH}%` }}
                title={`Ingresos ${m.label}: ${formatInt(m.income)}k`}
              />
              <div
                className="w-3 rounded-t-sm bg-danger/70"
                style={{ height: `${expenseH}%` }}
                title={`Egresos ${m.label}: ${formatInt(m.expense)}k`}
              />
            </div>
            <span className="text-[11px] text-text-tertiary">{m.label}</span>
          </div>
        );
      })}
    </div>
  );
}
