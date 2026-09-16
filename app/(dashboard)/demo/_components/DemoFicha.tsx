'use client';

/**
 * M4 · Ficha en página (`/demo/ficha`): encabezado "project page" (migaja,
 * h1 + Badge neutral, meta con folio mono · estado editable · autoría con
 * avatar de 20 px; a la derecha [Editar] outline · [Primaria | ⌄] negro ·
 * [⋯] icon-sm), `Tabs variant="line"` con `?tab=` y contenido que entra con
 * fade + subida. Sin hero card: los datos viven en las cards del primer tab.
 */

import * as React from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Ban,
  CheckCircle2,
  ChevronDown,
  Clock,
  Copy,
  FileDown,
  FileQuestion,
  Gauge,
  MoreHorizontal,
  Receipt,
  Upload,
  Wallet,
} from 'lucide-react';
import { toast } from 'sonner';

import { DisclosureRow } from '@/components/patterns/DisclosureRow';
import { EmptyState } from '@/components/patterns/EmptyState';
import { PageContainer } from '@/components/patterns/PageContainer';
import { ConfirmDeleteModal } from '@/components/modals/ConfirmDeleteModal';
import {
  DenseList,
  DenseRow,
  DetailCard,
  DetailCardHeader,
  IconCircle,
  KpiTile,
  Meter,
  SignedAmount,
} from '@/components/shared/DetailCard';
import { SPLIT_ACTION_CLASS, SplitActionButton } from '@/components/shared/DetailPanel';
import { PanelField } from '@/components/shared/PanelField';
import { Field as SettingsField, SettingsCard } from '@/components/shared/SettingsCard';
import { useShallowSearchParam } from '@/components/shared/useShallowSearchParam';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { SegmentedControl, type SegmentedOption } from '@/components/ui/segmented-control';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatBytes, formatCurrency, formatDate } from '@/lib/i18n/formatters';
import { cn } from '@/lib/utils';

import {
  ACTIVITY,
  ACTIVITY_ICON,
  DOCUMENTS,
  DOC_KIND,
  DOC_KIND_LIST,
  FEATURED_ORDER_ID,
  MOVEMENTS,
  ORDERS,
  ORDER_KIND,
  ORDER_STATUS,
  ORDER_STATUS_LIST,
  USERS,
  clientName,
  orderBalance,
  orderTotal,
  relativeDay,
  userName,
  type DocKind,
  type OrderStatus,
} from './data';
import { DOT_CLASS, StatusDot } from './orderUi';

const TABS = ['resumen', 'actividad', 'documentos', 'configuracion'] as const;
type Tab = (typeof TABS)[number];
const TAB_LABEL: Record<Tab, string> = {
  resumen: 'Resumen',
  actividad: 'Actividad',
  documentos: 'Documentos',
  configuracion: 'Configuración',
};

const ORDER = ORDERS.find((o) => o.id === FEATURED_ORDER_ID) ?? ORDERS[0]!;

const STAGES = [
  { id: 's1', label: 'Servicio de los seis equipos', pct: 100, tone: 'success' as const },
  { id: 's2', label: 'Reubicación de unidad exterior', pct: 100, tone: 'success' as const },
  { id: 's3', label: 'Carga de gas y capacitores', pct: 35, tone: 'neutral' as const },
  { id: 's4', label: 'Pruebas y entrega', pct: 0, tone: 'neutral' as const },
];

const PROGRESS_PCT = Math.round(STAGES.reduce((s, st) => s + st.pct, 0) / STAGES.length);

type DocFilter = 'todos' | DocKind;

export function DemoFicha() {
  const [tabParam, setTabParam] = useShallowSearchParam('tab');
  const tab: Tab = TABS.includes(tabParam as Tab) ? (tabParam as Tab) : 'resumen';
  const [status, setStatus] = React.useState<OrderStatus>(ORDER.status);
  const [cancelOpen, setCancelOpen] = React.useState(false);
  const [cancelling, setCancelling] = React.useState(false);

  const total = orderTotal(ORDER);
  const balance = orderBalance(ORDER);
  const kind = ORDER_KIND[ORDER.kind];

  function confirmCancel() {
    setCancelling(true);
    window.setTimeout(() => {
      setStatus('cancelada');
      setCancelling(false);
      setCancelOpen(false);
      toast.success('Orden cancelada');
    }, 450);
  }

  return (
    <PageContainer>
      {/* Encabezado "project page" */}
      <div className="space-y-1">
        <p className="text-[13px] text-text-tertiary">
          <Link
            href="/demo/lista"
            className="rounded-sm outline-none transition-colors hover:text-text-primary focus-visible:shadow-focus"
          >
            Órdenes
          </Link>
          <span aria-hidden className="mx-1.5">
            ›
          </span>
          {ORDER.title}
        </p>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-[26px] font-semibold tracking-tight text-text-primary">
                {ORDER.title}
              </h1>
              <Badge tone="neutral">{kind.label}</Badge>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-text-tertiary">
              <span className="font-mono text-xs">{ORDER.folio}</span>
              <span aria-hidden>·</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex cursor-pointer items-center gap-1 rounded-sm outline-none focus-visible:shadow-focus"
                    aria-label="Cambiar estado"
                  >
                    <StatusDot status={status} className="text-[13px]" />
                    <ChevronDown className="size-3 text-text-tertiary" strokeWidth={1.5} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuRadioGroup
                    value={status}
                    onValueChange={(v) => setStatus(v as OrderStatus)}
                  >
                    {ORDER_STATUS_LIST.map((s) => (
                      <DropdownMenuRadioItem key={s} value={s}>
                        <span
                          aria-hidden
                          className={cn('size-1.5 rounded-full', DOT_CLASS[ORDER_STATUS[s].tone])}
                        />
                        {ORDER_STATUS[s].label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1.5">
                Creado el {formatDate(ORDER.createdAt)} por
                <Avatar name={userName(ORDER.createdById)} size={20} />
                <span className="text-text-secondary">{userName(ORDER.createdById)}</span>
              </span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info('La edición no está en la demo')}
            >
              Editar
            </Button>
            <SplitActionButton
              primary={
                <button
                  type="button"
                  className={SPLIT_ACTION_CLASS}
                  onClick={() => toast.info('Registro de cobro: solo demo')}
                >
                  <Receipt className="size-3.5" strokeWidth={1.5} />
                  Registrar cobro
                </button>
              }
              menu={[
                <DropdownMenuItem key="close" onSelect={() => setStatus('cerrada')}>
                  <CheckCircle2 />
                  Cerrar orden
                </DropdownMenuItem>,
                <DropdownMenuItem key="pdf" onSelect={() => toast.info('Acta en PDF: solo demo')}>
                  <FileDown />
                  Generar acta
                </DropdownMenuItem>,
              ]}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label="Más acciones">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onSelect={() => toast.info('Duplicar: solo demo')}>
                  <Copy />
                  Duplicar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onSelect={() => setCancelOpen(true)}>
                  <Ban />
                  Cancelar orden
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Tabs de la ficha (tope 7), estado en ?tab= */}
      <Tabs value={tab} onValueChange={(v) => setTabParam(v === 'resumen' ? null : v)}>
        <TabsList variant="line">
          {TABS.map((t) => (
            <TabsTrigger key={t} value={t}>
              {TAB_LABEL[t]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div
        key={tab}
        className="animate-in fade-in-0 slide-in-from-bottom-1 duration-300 ease-out motion-reduce:animate-none"
      >
        {tab === 'resumen' && <ResumenTab total={total} balance={balance} />}
        {tab === 'actividad' && <ActividadTab />}
        {tab === 'documentos' && <DocumentosTab />}
        {tab === 'configuracion' && <ConfiguracionTab onCancel={() => setCancelOpen(true)} />}
      </div>

      <ConfirmDeleteModal
        open={cancelOpen}
        onOpenChange={(o) => {
          if (!cancelling) setCancelOpen(o);
        }}
        title="¿Cancelar la orden?"
        description={`${ORDER.folio} pasará a «Cancelada». Los cobros ya registrados se conservan; las partidas pendientes dejan de contar.`}
        confirmLabel="Cancelar orden"
        cancelLabel="Conservar"
        requireTypedConfirmation={ORDER.folio}
        onConfirm={confirmCancel}
        isLoading={cancelling}
      />
    </PageContainer>
  );
}

// ---------------------------------------------------------------------------
// Resumen
// ---------------------------------------------------------------------------

function ResumenTab({ total, balance }: { total: number; balance: number }) {
  const movements = MOVEMENTS.filter((m) => m.orderId === ORDER.id).sort((a, b) =>
    b.at.localeCompare(a.at),
  );
  const charges = movements.filter((m) => m.amount > 0).length;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiTile
          label="Monto de la orden"
          icon={Receipt}
          value={formatCurrency(total)}
          detail={`${ORDER.items.length} partidas`}
        />
        <KpiTile
          label="Cobrado"
          icon={ArrowDownLeft}
          value={formatCurrency(ORDER.paid)}
          detail={`${charges} ${charges === 1 ? 'cobro' : 'cobros'} · ${Math.round((ORDER.paid / total) * 100)} % del monto`}
        />
        <KpiTile
          label="Saldo"
          icon={Clock}
          value={formatCurrency(balance)}
          detail={`Vence ${relativeDay(ORDER.dueAt).toLowerCase()}`}
        />
        <KpiTile
          label="Avance"
          icon={Gauge}
          value={`${PROGRESS_PCT} %`}
          detail={`${STAGES.filter((s) => s.pct === 100).length} de ${STAGES.length} etapas listas`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <DetailCard className="pb-2">
          <DetailCardHeader
            title="Cobros y gastos"
            subtitle="Movimientos ligados a la orden"
            linkLabel="Ver libro"
            href="/demo"
          />
          <DenseList>
            {movements.map((m) => (
              <DenseRow
                key={m.id}
                lead={
                  <IconCircle
                    icon={m.amount < 0 ? Wallet : ArrowDownLeft}
                    tone={m.amount < 0 ? 'danger' : 'success'}
                  />
                }
                title={m.concept}
                sub={formatDate(m.at)}
                right={<SignedAmount value={m.amount} className="text-sm font-medium" />}
                href={`/demo/lista?ver=${ORDER.id}` as Route}
              />
            ))}
          </DenseList>
        </DetailCard>

        <DetailCard>
          <DetailCardHeader
            title="Avance por etapa"
            subtitle={`${STAGES.length} etapas · ${PROGRESS_PCT} % global`}
            linkLabel="Ver etapas"
            onLinkClick={() => toast.info('Etapas: solo demo')}
          />
          <div className="space-y-4 p-5">
            {STAGES.map((s) => (
              <Meter
                key={s.id}
                label={s.label}
                value={`${s.pct} %`}
                pct={s.pct}
                tone={s.tone}
                onClick={() => toast.info(`Etapa: ${s.label}`)}
                ariaLabel={`Ver etapa ${s.label}`}
              />
            ))}
          </div>
        </DetailCard>

        <DetailCard>
          <DetailCardHeader
            title="Datos de la orden"
            subtitle="Cliente, lugar y responsable"
            linkLabel="Ver en la lista"
            href={`/demo/lista?ver=${ORDER.id}` as Route}
          />
          <dl className="grid grid-cols-2 gap-x-4 gap-y-4 p-5">
            <PanelField label="Cliente">{clientName(ORDER.clientId)}</PanelField>
            <PanelField label="Responsable">
              <span className="inline-flex items-center gap-1.5">
                <Avatar name={userName(ORDER.assigneeId)} size={20} />
                {userName(ORDER.assigneeId)}
              </span>
            </PanelField>
            <PanelField label="Ubicación">{ORDER.location}</PanelField>
            <PanelField label="Fecha límite">
              <span className="tabular-nums">{formatDate(ORDER.dueAt)}</span>
            </PanelField>
            <PanelField label="Notas" className="col-span-2">
              <span className="text-text-secondary">{ORDER.notes}</span>
            </PanelField>
          </dl>
        </DetailCard>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Actividad
// ---------------------------------------------------------------------------

function ActividadTab() {
  const days = Array.from(new Set(ACTIVITY.map((a) => a.at)));
  return (
    <DetailCard className="pb-2">
      <DetailCardHeader
        title="Actividad"
        subtitle="Todo lo que pasó en la orden, por día"
        linkLabel="Exportar"
        onLinkClick={() => toast.info('Exportar actividad: solo demo')}
      />
      {days.map((day) => (
        <React.Fragment key={day}>
          <p className="px-5 pt-4 text-xs text-text-tertiary">
            {relativeDay(day)}
            {relativeDay(day) !== formatDate(day) && (
              <span className="ml-1.5 tabular-nums">· {formatDate(day)}</span>
            )}
          </p>
          <DenseList className="mt-2">
            {ACTIVITY.filter((a) => a.at === day).map((a) => {
              const meta = ACTIVITY_ICON[a.kind];
              return (
                <DenseRow
                  key={a.id}
                  lead={<IconCircle icon={meta.icon} tone={meta.tone} />}
                  title={a.text}
                  sub={`${a.time} · ${userName(a.byId)}`}
                />
              );
            })}
          </DenseList>
        </React.Fragment>
      ))}
    </DetailCard>
  );
}

// ---------------------------------------------------------------------------
// Documentos
// ---------------------------------------------------------------------------

function DocumentosTab() {
  const [filter, setFilter] = React.useState<DocFilter>('todos');
  const options: SegmentedOption<DocFilter>[] = [
    { value: 'todos', label: `Todos · ${DOCUMENTS.length}` },
    ...DOC_KIND_LIST.map((k) => ({
      value: k,
      label: `${DOC_KIND[k].plural} · ${DOCUMENTS.filter((d) => d.kind === k).length}`,
    })),
  ];
  const docs = DOCUMENTS.filter((d) => filter === 'todos' || d.kind === filter);
  const label = filter === 'todos' ? 'documentos' : DOC_KIND[filter].plural.toLowerCase();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <SegmentedControl
          variant="switch"
          className="w-auto"
          aria-label="Tipo de documento"
          options={options}
          value={filter}
          onChange={setFilter}
        />
        <Button
          variant="outline"
          size="sm"
          className="ml-auto"
          onClick={() => toast.info('Subida de archivos: solo demo')}
        >
          <Upload className="size-3.5" strokeWidth={1.5} />
          Subir
        </Button>
      </div>

      {docs.length === 0 ? (
        <DetailCard>
          <EmptyState
            icon={<FileQuestion size={24} strokeWidth={1.5} />}
            title={`Sin ${label}`}
            description={`Cuando subas ${label} a esta orden aparecerán aquí.`}
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.info('Subida de archivos: solo demo')}
              >
                <Upload className="size-3.5" strokeWidth={1.5} />
                Subir {filter === 'todos' ? 'documento' : DOC_KIND[filter].label.toLowerCase()}
              </Button>
            }
          />
        </DetailCard>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {docs.map((d) => {
            const meta = DOC_KIND[d.kind];
            return (
              <DetailCard key={d.id} className="p-0">
                <button
                  type="button"
                  onClick={() => toast.info(`Abrir ${d.name}: solo demo`)}
                  className="flex w-full cursor-pointer items-start gap-3 rounded-lg p-4 text-left transition-shadow duration-150 outline-none hover:shadow-lg focus-visible:shadow-focus motion-reduce:transition-none"
                >
                  <IconCircle icon={meta.icon} tone={d.kind === 'foto' ? 'info' : 'neutral'} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-text-primary">
                      {d.name}
                    </span>
                    <span className="block truncate text-xs text-text-tertiary">
                      {meta.label} · {formatBytes(d.bytes)} · {formatDate(d.at)} ·{' '}
                      {userName(d.byId)}
                    </span>
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className="mt-0.5 size-4 shrink-0 text-text-tertiary"
                    strokeWidth={1.5}
                  />
                </button>
              </DetailCard>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Configuración de la orden
// ---------------------------------------------------------------------------

function ConfiguracionTab({ onCancel }: { onCancel: () => void }) {
  const [title, setTitle] = React.useState(ORDER.title);
  const [assignee, setAssignee] = React.useState(ORDER.assigneeId);
  const [notify, setNotify] = React.useState({ dueSoon: true, charges: true, comments: false });

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Nombre de la orden"
        description="Aparece en la lista, en el acta y en los recibos."
        footer="Máximo 60 caracteres."
        footerAction={
          <Button variant="outline" size="sm" onClick={() => toast.success('Nombre guardado')}>
            Guardar
          </Button>
        }
      >
        <SettingsField label="Nombre" htmlFor="order-title">
          <Input
            id="order-title"
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, 60))}
            className="max-w-md bg-bg-surface"
          />
        </SettingsField>
      </SettingsCard>

      <SettingsCard
        title="Responsable"
        description="Recibe los recordatorios y aparece como contacto de la orden."
        footer="El cambio se notifica al nuevo responsable."
        footerAction={
          <Button variant="outline" size="sm" onClick={() => toast.success('Responsable guardado')}>
            Guardar
          </Button>
        }
      >
        <SettingsField label="Usuario" htmlFor="order-assignee">
          <Select value={assignee} onValueChange={setAssignee}>
            <SelectTrigger id="order-assignee" className="w-full max-w-md bg-bg-surface">
              <SelectValue placeholder="Elige un responsable" />
            </SelectTrigger>
            <SelectContent>
              {USERS.map((u) => (
                <SelectItem key={u.id} value={u.id} textValue={u.name}>
                  <Avatar name={u.name} size={20} />
                  {u.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingsField>
      </SettingsCard>

      <SettingsCard
        title="Notificaciones"
        badge="Opcional"
        description="Qué avisos recibe el responsable sobre esta orden."
      >
        <div className="divide-y divide-border-subtle">
          <ToggleRow
            label="Próxima a vencer"
            hint="Un día antes de la fecha límite"
            checked={notify.dueSoon}
            onChange={(v) => setNotify((n) => ({ ...n, dueSoon: v }))}
          />
          <ToggleRow
            label="Cobros registrados"
            hint="Cada vez que entra dinero a la orden"
            checked={notify.charges}
            onChange={(v) => setNotify((n) => ({ ...n, charges: v }))}
          />
          <DisclosureRow title="Avanzado" triggerClassName="px-0" summary="Comentarios y menciones">
            <div className="pb-2">
              <ToggleRow
                label="Comentarios"
                hint="Cuando alguien comenta en la orden"
                checked={notify.comments}
                onChange={(v) => setNotify((n) => ({ ...n, comments: v }))}
              />
            </div>
          </DisclosureRow>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Zona de peligro"
        description="Cancelar la orden la saca de la operación; los cobros ya registrados se conservan."
        footer="Se pedirá escribir el folio para confirmar."
        footerAction={
          <Button
            variant="outline"
            size="sm"
            className="text-danger-text hover:text-danger-text"
            onClick={onCancel}
          >
            <Ban className="size-3.5" strokeWidth={1.5} />
            Cancelar orden
          </Button>
        }
      >
        <p className="text-sm text-text-secondary">
          Estado actual: <StatusDot status={ORDER.status} className="align-middle" />
        </p>
      </SettingsCard>
    </div>
  );
}

function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  const id = React.useId();
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <label htmlFor={id} className="min-w-0 cursor-pointer">
        <span className="block text-sm font-medium text-text-primary">{label}</span>
        <span className="block text-xs text-text-tertiary">{hint}</span>
      </label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
