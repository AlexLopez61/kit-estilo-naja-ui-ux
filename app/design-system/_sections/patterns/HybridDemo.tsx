'use client';

/**
 * M2 + M3 · Lista + ficha en panel. `HybridSplit` con la tabla de M1 como
 * lista (se comprime al abrir) y `DetailPanelFrame` como ficha: toolbar con
 * cierre (chevron) y `SplitActionButton` «Editar | ⌄», `PanelHero` con
 * `PanelHeroHead`, `PanelTile`, rejilla de `PanelField`, `PanelFoot` y dos
 * `PanelSubCard`. La selección vive en estado local (en la app: `?ver=`).
 */

import { ArrowUpRight, Copy, Pencil, XCircle } from 'lucide-react';
import { useId, useState } from 'react';

import { IconCircle } from '@/components/shared/DetailCard';
import {
  DetailPanelFrame,
  HybridSplit,
  PanelFoot,
  PanelHero,
  PanelHeroHead,
  PanelLinkAction,
  PanelSubCard,
  PanelTile,
  SPLIT_ACTION_CLASS,
  SplitActionButton,
} from '@/components/shared/DetailPanel';
import { InfoRow, PanelField } from '@/components/shared/PanelField';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';

import { ORDER_KIND_META, ORDER_STATUS_META, orderById, personName, type Order } from './data';
import {
  OrderRow,
  OrdersEmpty,
  OrdersTableFooter,
  OrdersTableHead,
  type TableDensity,
} from './OrdersTable';
import { OrdersToolbar } from './OrdersToolbar';
import { useOrderFilters } from './useOrderFilters';

function noop() {
  /* acción simulada en el showcase */
}

export function HybridDemo({
  wide = false,
  initialId = null,
}: {
  /** Panel ancho: la lista se comprime a clamp(300px, 36cqw, 420px). */
  wide?: boolean;
  /** Orden seleccionada al montar (para mostrar el split abierto). */
  initialId?: string | null;
}) {
  const filters = useOrderFilters();
  const [selectedId, setSelectedId] = useState<string | null>(initialId);
  const selected = orderById(selectedId);
  const open = selected !== undefined;
  const density: TableDensity = !open ? 'full' : wide ? 'minimal' : 'compact';

  return (
    <div className="space-y-4">
      <OrdersToolbar filters={filters} />
      <HybridSplit
        open={open}
        panelKey={selectedId}
        wide={wide}
        list={
          <>
            <OrdersTableHead density={density} />
            {filters.filtered.length === 0 ? (
              <OrdersEmpty />
            ) : (
              filters.filtered.map((order, i) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  index={i}
                  density={density}
                  selected={order.id === selectedId}
                  onSelect={setSelectedId}
                />
              ))
            )}
            <OrdersTableFooter orders={filters.filtered} />
          </>
        }
        panel={selected ? <OrderPanel order={selected} onClose={() => setSelectedId(null)} /> : null}
      />
    </div>
  );
}

/** M3 · Ficha en panel de una orden. */
function OrderPanel({ order, onClose }: { order: Order; onClose: () => void }) {
  const headingId = useId();
  const kind = ORDER_KIND_META[order.kind];
  const status = ORDER_STATUS_META[order.status];
  const pending = order.amount - order.charged;

  return (
    <DetailPanelFrame
      headingId={headingId}
      onClose={onClose}
      actions={
        <SplitActionButton
          primary={
            <button type="button" className={SPLIT_ACTION_CLASS}>
              <Pencil className="size-3.5" strokeWidth={1.5} />
              Editar
            </button>
          }
          menu={[
            <DropdownMenuItem key="duplicate">
              <Copy />
              Duplicar orden
            </DropdownMenuItem>,
            <DropdownMenuItem key="close">
              <XCircle />
              Cerrar orden
            </DropdownMenuItem>,
            <DropdownMenuSeparator key="sep" />,
            <DropdownMenuItem key="cancel" variant="destructive">
              Cancelar orden
            </DropdownMenuItem>,
          ]}
        />
      }
    >
      <PanelHero>
        <PanelHeroHead
          headingId={headingId}
          lead={<IconCircle icon={kind.icon} tone={kind.tone} />}
          title={order.title}
          subtitle={`${order.folio} · ${order.client}`}
          badges={
            <>
              <Badge tone={status.tone}>{status.label}</Badge>
              <Badge tone="neutral">{kind.label}</Badge>
            </>
          }
        />
        {/* Desde @2xl del panel (variante wide) tile y rejilla van lado a lado. */}
        <div className="grid gap-4 p-4 @2xl/detail:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
          <PanelTile
            label="Monto de la orden"
            value={formatCurrency(order.amount)}
            sub={pending > 0 ? `Por cobrar ${formatCurrency(pending)}` : 'Cobrada al 100 %'}
          />
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 @3xl/detail:grid-cols-3">
            <PanelField label="Cliente">{order.client}</PanelField>
            <PanelField label="Responsable">{personName(order.assigneeId)}</PanelField>
            <PanelField label="Fecha de creación">{formatDate(order.createdAt)}</PanelField>
            <PanelField label="Vence">{formatDate(order.dueAt)}</PanelField>
            <PanelField label="Ubicación">{order.location}</PanelField>
            <PanelField label="Folio">
              <span className="font-mono text-xs">{order.folio}</span>
            </PanelField>
          </dl>
        </div>
        <PanelFoot>
          <span>Registrado por</span>
          <Avatar name={order.createdBy} size={16} />
          <span className="text-text-secondary">{order.createdBy}</span>
          <span>· {formatDate(order.createdAt)}</span>
        </PanelFoot>
      </PanelHero>

      <div className="grid gap-4 @2xl/detail:grid-cols-2">
        <PanelSubCard
          title="Relación"
          action={
            <PanelLinkAction onClick={noop} icon={ArrowUpRight}>
              Ver cliente
            </PanelLinkAction>
          }
        >
          <dl className="space-y-2">
            <InfoRow label="Cliente">{order.client}</InfoRow>
            <InfoRow label="Cotización">
              <span className="font-mono text-xs">COT-2026-0112</span>
            </InfoRow>
            <InfoRow label="Cobrado">
              <span className="tabular-nums">{formatCurrency(order.charged)}</span>
            </InfoRow>
          </dl>
        </PanelSubCard>
        <PanelSubCard
          title="Notas"
          action={
            <PanelLinkAction onClick={noop} icon={Pencil}>
              Editar
            </PanelLinkAction>
          }
        >
          <p className="text-sm text-text-secondary">{order.notes}</p>
        </PanelSubCard>
      </div>
    </DetailPanelFrame>
  );
}
