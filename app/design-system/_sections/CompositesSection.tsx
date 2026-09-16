'use client';

/**
 * «Cards y tablas»: las piezas compuestas de vista del sistema, tal como las
 * arman los moldes de `02-moldes.md`. Todo sale de `components/shared`
 * (DetailCard, DetailPanel, SettingsCard, SelectedStripe) y de las primitivas
 * de `components/ui`; aquí solo se componen con datos ficticios.
 */

import {
  ArrowDownLeft,
  ArrowUpRight,
  ClipboardList,
  Landmark,
  Plus,
  Receipt,
  Wallet,
} from 'lucide-react';
import { useState } from 'react';

import {
  DenseList,
  DenseRow,
  DETAIL_CARD_CLASS,
  DetailCard,
  DetailCardHeader,
  IconCircle,
  KpiTile,
  Meter,
  RowPill,
  SignedAmount,
} from '@/components/shared/DetailCard';
import { SettingsCard } from '@/components/shared/SettingsCard';
import { DisclosureRow } from '@/components/patterns/DisclosureRow';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter as ShadcnTableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';
import { cn } from '@/lib/utils';

import { CopyJSXButton } from '../_components/CopyJSXButton';
import { Section } from '../_components/Section';
import { Subsection } from '../_components/Subsection';
import { MOVEMENTS, ORDERS } from './patterns/data';
import { MovementsCard, PendingCard } from './patterns/ListCards';
import { OrderRow, OrdersTableFooter, OrdersTableHead } from './patterns/OrdersTable';

function noop() {
  /* navegación simulada en el showcase */
}

const DETAIL_CARD_JSX = `<DetailCard>
  <DetailCardHeader
    title="Cobros recientes"
    subtitle="Últimos 5 registros"
    href="/cobranza"
    linkLabel="Ver cobranza"
  />
  <DenseList>
    <DenseRow
      lead={<IconCircle icon={ArrowDownLeft} tone="success" />}
      title="Cobro ORD-2026-0027"
      sub="15/09/2026 · transferencia"
      right={<SignedAmount value={18500} className="text-sm font-medium" />}
      href="/cobranza?ver=…"
    />
  </DenseList>
</DetailCard>`;

const TABLE_ROW_JSX = `<div className={DETAIL_CARD_CLASS}>
  <div className={cn(TABLE_HEAD_CLASS, 'grid-cols-[minmax(0,2fr)_120px_112px]')}>
    <span>Orden</span><span>Estado</span><span className="text-right">Monto</span>
  </div>
  {rows.map((row, i) => (
    <Link
      key={row.id}
      href={\`/ordenes?ver=\${row.id}\`}
      className={cn(tableRowClass(row.id === ver, i % 2 === 1), 'grid-cols-[minmax(0,2fr)_120px_112px]')}
    >
      {row.id === ver && <SelectedStripe />}
      …
    </Link>
  ))}
  <TableFooter><span>10 órdenes</span><span>Total …</span></TableFooter>
</div>`;

export function CompositesSection() {
  return (
    <Section
      id="composites"
      title="Cards y tablas"
      description="Las piezas de vista con las que se arman los moldes: cards de detalle (nivel 3), tiles y medidores, la tabla estilo deployments, la card de configuración y las listas densas. Todo con datos ficticios y sobre los componentes de components/shared."
    >
      <Subsection
        id="cards"
        title="Cards de vista (nivel 3) y cards planas (nivel 0)"
        caption="DetailCard = bg-bg-surface rounded-lg shadow-md + borde solo en oscuro. DetailCardHeader lleva título semibold, subline terciaria y enlace «Ver … ↗». Un KpiTile dentro de otra card se demota a nivel 0 con className (sin sombra, borde subtle): nunca dos sombras apiladas. Nada vive en el nivel 2 retirado (shadow-sm + border-card) ni en shadow-xs."
      >
        <div className="space-y-4">
          <div className="flex justify-end">
            <CopyJSXButton code={DETAIL_CARD_JSX} label="Copiar JSX · DetailCard" />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <DetailCard className="pb-2">
              <DetailCardHeader
                title="Cobros recientes"
                subtitle="Últimos 4 registros de la cuenta operativa"
                linkLabel="Ver cobranza"
                onLinkClick={noop}
              />
              <DenseList>
                {MOVEMENTS.slice(0, 4).map((m) => (
                  <DenseRow
                    key={m.id}
                    lead={<IconCircle icon={m.icon} tone={m.tone} />}
                    title={m.concept}
                    sub={`${formatDate(m.date)} · ${m.detail}`}
                    right={<SignedAmount value={m.amount} className="text-sm font-medium" />}
                    onClick={noop}
                  />
                ))}
              </DenseList>
            </DetailCard>

            <DetailCard>
              <DetailCardHeader
                title="Pendientes de la semana"
                subtitle="Lo que hay que cobrar y pagar"
                linkLabel="Ver pendientes"
                onLinkClick={noop}
              />
              <div className="grid gap-3 p-5 sm:grid-cols-2">
                <KpiTile
                  label="Por cobrar"
                  icon={ArrowDownLeft}
                  value={formatCurrency(84300)}
                  detail="12 órdenes abiertas"
                  className="border border-border-subtle shadow-none dark:border-border-subtle"
                />
                <KpiTile
                  label="Por pagar"
                  icon={ArrowUpRight}
                  value={formatCurrency(31900)}
                  detail="5 facturas de proveedor"
                  className="border border-border-subtle shadow-none dark:border-border-subtle"
                />
              </div>
              <p className="px-5 pb-5 text-xs text-text-tertiary">
                Los tiles heredan el nivel del contenedor: aquí van planos.
              </p>
            </DetailCard>
          </div>

          <ElevationContrast />
        </div>
      </Subsection>

      <Subsection
        id="tiles"
        title="Tiles, medidores y montos con signo"
        caption="KpiTile: label text-sm secundaria + icono, valor text-2xl semibold, detalle terciario; el clicable sube un nivel en hover (shadow-lg) y marca activo con ring. Meter: barra h-1.5 con relleno y pista del mismo ramp; con onClick es fila clicable con chevron. SignedAmount aplica la regla del libro (solo las salidas en rojo) y la de saldos (rojo solo si negativo)."
      >
        <TilesDemo />
      </Subsection>

      <Subsection
        id="tabla"
        title="Tabla estilo deployments (M1) y Table de shadcn"
        caption="Card nivel 3 con TABLE_HEAD_CLASS (h-9, text-xs terciario, sin fondo) + tableRowClass(selected, zebra) + TableFooter. Columna principal con IconCircle, nombre font-medium y subline «tipo · Creado el dd/MM/yyyy por Nombre»; estado como punto + texto; folio font-mono; monto a la derecha tabular-nums. La fila seleccionada lleva bg-bg-elevated + halo + SelectedStripe. La primitiva Table de shadcn queda para tablas simples dentro de modales (Concepto / Monto con fila total)."
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-end">
              <CopyJSXButton code={TABLE_ROW_JSX} label="Copiar JSX · fila de tabla" />
            </div>
            <DetailCard className="overflow-hidden">
              <OrdersTableHead density="full" />
              {ORDERS.slice(0, 6).map((order, i) => (
                <OrderRow key={order.id} order={order} index={i} density="full" selected={i === 2} />
              ))}
              <OrdersTableFooter orders={ORDERS.slice(0, 6)} />
            </DetailCard>
          </div>
          <SimpleTableDemo />
        </div>
      </Subsection>

      <Subsection
        id="settings-card"
        title="SettingsCard (M10) y DisclosureRow"
        caption="SettingsCard: título y descripción dentro de la card, contenido y footer strip (banda bg-muted/30 con borde superior: hint a la izquierda, acción a la derecha). DisclosureRow: acordeón sobre Radix Collapsible con animate-collapsible-* y chevron que rota; el resumen o el chip se desvanecen al abrir. Nunca <details> nativo."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <SettingsCardDemo />
          <DisclosureDemo />
        </div>
      </Subsection>

      <Subsection
        id="lista-densa"
        title="Listas densas: «Últimos movimientos» y «Por cerrar»"
        caption="DetailCard + DenseList: filas grid 32px · 1fr · auto con px-5 py-2.5, IconCircle a la izquierda, título font-medium con subline terciaria y monto o pill a la derecha. Cada fila navega a donde se resuelve (hover de tinte, chevron en las de «Por cerrar»)."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <MovementsCard />
          <PendingCard />
        </div>
      </Subsection>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Contraste de niveles de elevación
// ---------------------------------------------------------------------------

function ElevationContrast() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className={cn(DETAIL_CARD_CLASS, 'p-5')}>
        <p className="text-sm font-semibold text-text-primary">Nivel 3 · flotante</p>
        <p className="mt-1 text-xs text-text-tertiary">
          Todo contenedor de vista: card de tabla, tile, panel derecho.
        </p>
        <code className="mt-3 block font-mono text-[11px] text-text-tertiary">
          bg-bg-surface rounded-lg shadow-md dark:border dark:border-border-card
        </code>
      </div>
      <div className="rounded-lg bg-bg-elevated p-4 dark:border dark:border-border-card">
        <p className="mb-3 text-xs text-text-tertiary">Gris del panel (bg-bg-elevated)</p>
        <div className="rounded-lg bg-bg-surface p-4 dark:border dark:border-border-card">
          <p className="text-sm font-semibold text-text-primary">Nivel 0 · sobre el gris</p>
          <p className="mt-1 text-xs text-text-tertiary">
            Hero, sub-cards y tile dentro de un panel. Sin borde en claro: blanco sobre gris ya
            separa.
          </p>
          <code className="mt-3 block font-mono text-[11px] text-text-tertiary">
            bg-bg-surface rounded-lg dark:border dark:border-border-card
          </code>
        </div>
      </div>
      <div className="rounded-lg border border-border-subtle bg-bg-surface p-5">
        <p className="text-sm font-semibold text-text-primary">Nivel 0 · sobre el piso</p>
        <p className="mt-1 text-xs text-text-tertiary">
          StepCard y FormCard dentro de modales y drawers.
        </p>
        <code className="mt-3 block font-mono text-[11px] text-text-tertiary">
          bg-bg-surface border border-border-subtle rounded-lg
        </code>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tiles, medidores y montos
// ---------------------------------------------------------------------------

const BOOK_ROWS = [
  { id: 'b1', concept: 'Cobro ORD-2026-0027', amount: 18500 },
  { id: 'b2', concept: 'Pago a proveedor', amount: -6240 },
  { id: 'b3', concept: 'Renta de septiembre', amount: 12000 },
  { id: 'b4', concept: 'Nómina semanal', amount: -22300 },
];

const BALANCE_ROWS = [
  { id: 's1', concept: 'Cuenta operativa', amount: 184200 },
  { id: 's2', concept: 'Caja chica', amount: 8300 },
  { id: 's3', concept: 'Tarjeta empresarial', amount: -12450 },
];

function TilesDemo() {
  const [active, setActive] = useState(false);
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiTile
          label="Por cobrar"
          icon={ArrowDownLeft}
          value={formatCurrency(84300)}
          detail={active ? 'Filtro activo en la bandeja' : '12 órdenes · clic para filtrar'}
          onClick={() => setActive((v) => !v)}
          active={active}
        />
        <KpiTile
          label="Por pagar"
          icon={ArrowUpRight}
          value={formatCurrency(31900)}
          detail="5 facturas de proveedor"
        />
        <KpiTile
          label="Órdenes abiertas"
          icon={ClipboardList}
          value="6"
          detail="2 vencen esta semana"
        />
        <KpiTile
          label="Disponible"
          icon={Landmark}
          value={formatCurrency(349000)}
          detail="4 cuentas"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <DetailCard>
          <DetailCardHeader title="Medidores" subtitle="Relleno y pista del mismo ramp" />
          <div className="space-y-4 p-5">
            <Meter
              label="Por cobrar"
              value={formatCurrency(84300)}
              pct={62}
              tone="success"
              sub="62 % ya venció · clicable"
              onClick={noop}
              ariaLabel="Ver órdenes por cobrar"
            />
            <Meter
              label="Por pagar"
              value={formatCurrency(31900)}
              pct={38}
              tone="danger"
              sub="38 % vence esta semana"
            />
            <Meter
              label="Avance de la orden"
              value="45 %"
              pct={45}
              tone="neutral"
              sub="2 de 3 etapas iniciadas"
            />
          </div>
        </DetailCard>

        <DetailCard className="pb-2">
          <DetailCardHeader title="Regla del libro" subtitle="Solo las salidas en rojo" />
          <DenseList>
            {BOOK_ROWS.map((r) => (
              <DenseRow
                key={r.id}
                lead={
                  <IconCircle
                    icon={r.amount < 0 ? ArrowUpRight : ArrowDownLeft}
                    tone={r.amount < 0 ? 'danger' : 'success'}
                  />
                }
                title={r.concept}
                right={<SignedAmount value={r.amount} className="text-sm font-medium" />}
              />
            ))}
          </DenseList>
        </DetailCard>

        <DetailCard className="pb-2">
          <DetailCardHeader title="Regla de saldos" subtitle="Rojo solo si es negativo" />
          <DenseList>
            {BALANCE_ROWS.map((r) => (
              <DenseRow
                key={r.id}
                lead={<IconCircle icon={r.amount < 0 ? Wallet : Landmark} />}
                title={r.concept}
                sub={r.amount < 0 ? 'Saldo deudor' : 'Saldo a favor'}
                right={<SignedAmount value={r.amount} className="text-sm font-medium" />}
              />
            ))}
          </DenseList>
        </DetailCard>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Table de shadcn (dentro de modales)
// ---------------------------------------------------------------------------

const QUOTE_LINES = [
  { id: 'q1', concept: 'Mano de obra', amount: 18400 },
  { id: 'q2', concept: 'Pintura vinílica (60 L)', amount: 23380 },
  { id: 'q3', concept: 'Andamios y equipo', amount: 6200 },
];

function SimpleTableDemo() {
  const total = QUOTE_LINES.reduce((sum, l) => sum + l.amount, 0);
  const headClass = 'h-9 px-4 text-xs font-normal text-text-tertiary';
  const cellClass = 'px-4 py-2.5 text-sm';
  return (
    <div className="max-w-md space-y-2">
      <p className="text-xs text-text-tertiary">
        Table de shadcn en una card plana (nivel 0), como dentro de un modal
      </p>
      <div className="rounded-lg border border-border-subtle bg-bg-surface">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className={headClass}>Concepto</TableHead>
              <TableHead className={cn(headClass, 'text-right')}>Monto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {QUOTE_LINES.map((line) => (
              <TableRow key={line.id}>
                <TableCell className={cn(cellClass, 'text-text-primary')}>{line.concept}</TableCell>
                <TableCell className={cn(cellClass, 'text-right text-text-primary tabular-nums')}>
                  {formatCurrency(line.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <ShadcnTableFooter className="bg-transparent">
            <TableRow className="hover:bg-transparent">
              <TableCell className={cn(cellClass, 'font-medium text-text-primary')}>Total</TableCell>
              <TableCell
                className={cn(cellClass, 'text-right font-medium text-text-primary tabular-nums')}
              >
                {formatCurrency(total)}
              </TableCell>
            </TableRow>
          </ShadcnTableFooter>
        </Table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SettingsCard y DisclosureRow
// ---------------------------------------------------------------------------

const EXPENSE_CATEGORIES = [
  { id: 'e1', name: 'Materiales', count: 128, active: true },
  { id: 'e2', name: 'Transporte', count: 41, active: true },
  { id: 'e3', name: 'Herramienta', count: 17, active: true },
  { id: 'e4', name: 'Papelería', count: 3, active: false },
];

function SettingsCardDemo() {
  return (
    <SettingsCard
      title="Categorías de gasto"
      description="Catálogo cerrado: cada gasto se clasifica en una de estas categorías."
      footer="Solo el administrador edita este catálogo."
      footerAction={
        <Button variant="outline" size="sm">
          <Plus className="size-3.5" strokeWidth={1.5} />
          Agregar categoría
        </Button>
      }
    >
      <ul className="-mx-6 divide-y divide-border-subtle border-t border-border-subtle">
        {EXPENSE_CATEGORIES.map((c) => (
          <li key={c.id} className="flex h-10 items-center gap-3 px-6 text-sm">
            <span className="min-w-0 flex-1 truncate font-medium text-text-primary">{c.name}</span>
            <RowPill>{c.count}</RowPill>
            {c.active ? (
              <Badge tone="success">Activa</Badge>
            ) : (
              <Badge tone="neutral">Inactiva</Badge>
            )}
          </li>
        ))}
      </ul>
    </SettingsCard>
  );
}

function DisclosureDemo() {
  return (
    <DetailCard className="divide-y divide-border-subtle">
      <DisclosureRow
        title="Dirección fiscal"
        summary="Calle 60 núm. 512, Centro, Mérida"
        defaultOpen
      >
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 px-6 pb-5 text-sm">
          <Field label="Calle y número">Calle 60 núm. 512</Field>
          <Field label="Colonia">Centro</Field>
          <Field label="Ciudad">Mérida, Yucatán</Field>
          <Field label="Código postal">
            <span className="font-mono text-xs">97000</span>
          </Field>
        </dl>
      </DisclosureRow>
      <DisclosureRow title="Datos bancarios" badge={<Badge tone="neutral">Sensible</Badge>}>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 px-6 pb-5 text-sm">
          <Field label="Banco">Banco genérico</Field>
          <Field label="Titular">Grupo Peninsular, S.A. de C.V.</Field>
          <Field label="CLABE">
            <span className="font-mono text-xs">0140 1234 5678 9012 34</span>
          </Field>
          <Field label="Uso">Pagos a proveedores</Field>
        </dl>
      </DisclosureRow>
      <DisclosureRow title="Contactos" badge={<RowPill>2</RowPill>}>
        <ul className="space-y-2 px-6 pb-5 text-sm">
          <li className="flex items-center justify-between gap-3">
            <span className="text-text-primary">Mariana Pech</span>
            <span className="text-xs text-text-tertiary">Administración</span>
          </li>
          <li className="flex items-center justify-between gap-3">
            <span className="text-text-primary">Rodrigo Canul</span>
            <span className="text-xs text-text-tertiary">Compras</span>
          </li>
        </ul>
      </DisclosureRow>
    </DetailCard>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-text-secondary">{label}</dt>
      <dd className="mt-1 break-words text-text-primary">{children}</dd>
    </div>
  );
}
