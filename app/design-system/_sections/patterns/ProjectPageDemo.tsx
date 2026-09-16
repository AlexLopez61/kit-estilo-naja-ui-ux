'use client';

/**
 * M4 · Ficha en página (encabezado "project page"): migaja, h1 + Badge
 * neutral, meta con folio mono y autoría con avatar de 20 px, acciones
 * [Editar] outline · [Primaria | ⌄] negro · [⋯]; después tabs `line` y un grid
 * de `DetailCard`s. Sin hero card.
 */

import {
  ArrowDownLeft,
  ChevronDown,
  CheckCircle2,
  FileText,
  MoreHorizontal,
  Receipt,
  Wallet,
} from 'lucide-react';

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
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';

import { ORDERS } from './data';
import { StatusDot } from './OrdersTable';

function noop() {
  /* navegación simulada en el showcase */
}

const PROJECT = ORDERS.find((o) => o.folio === 'ORD-2026-0029') ?? ORDERS[0]!;

const CHARGES = [
  { id: 'c1', concept: 'Anticipo 50 %', detail: '11/09/2026 · transferencia', amount: 64200 },
  { id: 'c2', concept: 'Pago a cuadrilla', detail: '13/09/2026 · efectivo', amount: -18400 },
  { id: 'c3', concept: 'Compra de pintura', detail: '14/09/2026 · tarjeta empresarial', amount: -23380 },
];

const STAGES = [
  { id: 's1', label: 'Preparación de superficie', pct: 100, tone: 'success' as const },
  { id: 's2', label: 'Aplicación de pintura', pct: 45, tone: 'neutral' as const },
  { id: 's3', label: 'Detalles y entrega', pct: 0, tone: 'neutral' as const },
];

const SECONDARY_TABS = ['partidas', 'etapas', 'finanzas', 'documentos', 'historial'] as const;
const TAB_LABEL: Record<(typeof SECONDARY_TABS)[number], string> = {
  partidas: 'Partidas',
  etapas: 'Etapas',
  finanzas: 'Finanzas',
  documentos: 'Documentos',
  historial: 'Historial',
};

export function ProjectPageDemo() {
  const spent = 41780;
  const margin = PROJECT.amount - spent - 47720;

  return (
    <div className="space-y-6">
      {/* Encabezado "project page" */}
      <div className="space-y-1">
        <p className="text-[13px] text-text-tertiary">Órdenes › {PROJECT.title}</p>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-[26px] font-semibold tracking-tight text-text-primary">
                {PROJECT.title} {PROJECT.client}
              </h1>
              <Badge tone="neutral">Servicio</Badge>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-text-tertiary">
              <span className="font-mono">{PROJECT.folio}</span>
              <span aria-hidden>·</span>
              <button
                type="button"
                className="inline-flex cursor-pointer items-center gap-1 rounded-sm outline-none focus-visible:shadow-focus"
                aria-label="Cambiar estado"
              >
                <StatusDot status={PROJECT.status} className="text-[13px]" />
                <ChevronDown className="size-3 text-text-tertiary" strokeWidth={1.5} />
              </button>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1.5">
                Creado el {formatDate(PROJECT.createdAt)} por
                <Avatar name={PROJECT.createdBy} size={20} />
                <span className="text-text-secondary">{PROJECT.createdBy}</span>
              </span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="outline" size="sm">
              Editar
            </Button>
            <SplitActionButton
              primary={
                <button type="button" className={SPLIT_ACTION_CLASS}>
                  <CheckCircle2 className="size-3.5" strokeWidth={1.5} />
                  Cerrar orden
                </button>
              }
              menu={[
                <DropdownMenuItem key="charge">
                  <Receipt />
                  Registrar cobro
                </DropdownMenuItem>,
                <DropdownMenuItem key="report">
                  <FileText />
                  Generar acta
                </DropdownMenuItem>,
              ]}
            />
            <Button variant="ghost" size="icon-sm" aria-label="Más acciones">
              <MoreHorizontal />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs de la ficha (tope 7) */}
      <Tabs defaultValue="resumen">
        <TabsList variant="line">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          {SECONDARY_TABS.map((t) => (
            <TabsTrigger key={t} value={t}>
              {TAB_LABEL[t]}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="resumen" className="data-[state=active]:duration-300">
          <div className="space-y-4 pt-4">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <KpiTile
                label="Monto aprobado"
                icon={FileText}
                value={formatCurrency(PROJECT.amount)}
                detail="Cotización COT-2026-0098"
              />
              <KpiTile
                label="Cobrado"
                icon={ArrowDownLeft}
                value={formatCurrency(PROJECT.charged)}
                detail={`${Math.round((PROJECT.charged / PROJECT.amount) * 100)} % del monto`}
              />
              <KpiTile
                label="Gastado"
                icon={Wallet}
                value={formatCurrency(spent)}
                detail="Materiales y cuadrilla"
              />
              <KpiTile
                label="Margen estimado"
                icon={Receipt}
                value={formatCurrency(margin)}
                detail={`${Math.round((margin / PROJECT.amount) * 100)} % sobre lo aprobado`}
              />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <DetailCard className="pb-2">
                <DetailCardHeader
                  title="Últimos movimientos"
                  subtitle="Cobros y gastos de la orden"
                  linkLabel="Ver finanzas"
                  onLinkClick={noop}
                />
                <DenseList>
                  {CHARGES.map((c) => (
                    <DenseRow
                      key={c.id}
                      lead={
                        <IconCircle
                          icon={c.amount < 0 ? Wallet : ArrowDownLeft}
                          tone={c.amount < 0 ? 'danger' : 'success'}
                        />
                      }
                      title={c.concept}
                      sub={c.detail}
                      right={<SignedAmount value={c.amount} className="text-sm font-medium" />}
                      onClick={noop}
                    />
                  ))}
                </DenseList>
              </DetailCard>
              <DetailCard>
                <DetailCardHeader
                  title="Avance por etapa"
                  subtitle="3 etapas · 48 % global"
                  linkLabel="Ver etapas"
                  onLinkClick={noop}
                />
                <div className="space-y-4 p-5">
                  {STAGES.map((s) => (
                    <Meter
                      key={s.id}
                      label={s.label}
                      value={`${s.pct} %`}
                      pct={s.pct}
                      tone={s.tone}
                      onClick={noop}
                      ariaLabel={`Ver etapa ${s.label}`}
                    />
                  ))}
                </div>
              </DetailCard>
            </div>
          </div>
        </TabsContent>

        {SECONDARY_TABS.map((t) => (
          <TabsContent key={t} value={t} className="data-[state=active]:duration-300">
            <DetailCard className="mt-4 p-5">
              <p className="text-sm text-text-secondary">
                Contenido del tab «{TAB_LABEL[t]}»: cards de detalle en grid o un M2 dentro del
                tab.
              </p>
            </DetailCard>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
