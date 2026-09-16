'use client';

/**
 * M3 · Ficha en panel de una orden (`DetailPanelFrame`): toolbar con cierre y
 * `SplitActionButton` «Editar | ⌄» (Duplicar · Eliminar → M9), `PanelHero`
 * con `PanelHeroHead`, `PanelTile` de monto, rejilla de `PanelField` a dos
 * columnas, `PanelFoot` de auditoría y sub-cards (Partidas · Notas ·
 * Historial con `DisclosureRow`).
 */

import * as React from 'react';
import { Copy, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { DisclosureRow } from '@/components/patterns/DisclosureRow';
import { IconCircle, RowPill } from '@/components/shared/DetailCard';
import {
  DetailPanelFrame,
  PanelFoot,
  PanelHero,
  PanelHeroHead,
  PanelLinkAction,
  PanelSubCard,
  PanelTile,
  SPLIT_ACTION_CLASS,
  SplitActionButton,
} from '@/components/shared/DetailPanel';
import { PanelField } from '@/components/shared/PanelField';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';
import { cn } from '@/lib/utils';

import {
  ORDER_KIND,
  ORDER_STATUS,
  clientName,
  isOverdue,
  orderBalance,
  orderTotal,
  relativeDay,
  userName,
  type DemoOrder,
  type OrderEvent,
} from './data';

export function OrderDetailPanel({
  order,
  onClose,
  onDuplicate,
  onDelete,
}: {
  order: DemoOrder;
  onClose: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const headingId = React.useId();
  const kind = ORDER_KIND[order.kind];
  const status = ORDER_STATUS[order.status];
  const total = orderTotal(order);
  const balance = orderBalance(order);
  const paidPct = total > 0 ? Math.round((order.paid / total) * 100) : 0;
  const late = isOverdue(order);

  return (
    <DetailPanelFrame
      headingId={headingId}
      onClose={onClose}
      actions={
        <SplitActionButton
          primary={
            <button
              type="button"
              className={SPLIT_ACTION_CLASS}
              onClick={() => toast.info('La edición no está en la demo')}
            >
              <Pencil className="size-3.5" strokeWidth={1.5} />
              Editar
            </button>
          }
          menu={[
            <DropdownMenuItem key="duplicate" onSelect={onDuplicate}>
              <Copy />
              Duplicar
            </DropdownMenuItem>,
            <DropdownMenuSeparator key="sep" />,
            <DropdownMenuItem key="delete" variant="destructive" onSelect={onDelete}>
              <Trash2 />
              Eliminar
            </DropdownMenuItem>,
          ]}
        />
      }
    >
      <PanelHero>
        <PanelHeroHead
          headingId={headingId}
          lead={<IconCircle icon={kind.icon} />}
          title={order.title}
          subtitle={`${order.folio} · ${clientName(order.clientId)}`}
          badges={
            <>
              <Badge tone={status.tone}>{status.label}</Badge>
              <Badge tone="neutral">{kind.label}</Badge>
              {late && <Badge tone="danger">Vencida</Badge>}
            </>
          }
        />
        <div className="grid gap-4 p-4 @2xl/detail:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
          <PanelTile
            label="Monto de la orden"
            value={formatCurrency(total)}
            sub={
              balance > 0
                ? `Pagado ${formatCurrency(order.paid)} · Saldo ${formatCurrency(balance)}`
                : 'Pagada al 100 %'
            }
          >
            <div
              aria-hidden
              className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-bg-elevated"
            >
              <div className="h-full rounded-full bg-success" style={{ width: `${paidPct}%` }} />
            </div>
          </PanelTile>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 @3xl/detail:grid-cols-3">
            <PanelField label="Cliente">{clientName(order.clientId)}</PanelField>
            <PanelField label="Responsable">{userName(order.assigneeId)}</PanelField>
            <PanelField label="Ubicación">{order.location}</PanelField>
            <PanelField label="Vence">
              <span className={cn('tabular-nums', late && 'text-danger-text')}>
                {formatDate(order.dueAt)}
              </span>
              <span className="ml-1.5 text-xs text-text-tertiary">
                ({relativeDay(order.dueAt).toLowerCase()})
              </span>
            </PanelField>
            <PanelField label="Tipo">{kind.label}</PanelField>
            <PanelField label="Folio">
              <span className="font-mono text-xs">{order.folio}</span>
            </PanelField>
          </dl>
        </div>
        <PanelFoot>
          <span>Registrado por</span>
          <Avatar name={userName(order.createdById)} size={20} />
          <span className="text-text-secondary">{userName(order.createdById)}</span>
          <span>· {formatDate(order.createdAt)}</span>
        </PanelFoot>
      </PanelHero>

      <div className="grid gap-4 @2xl/detail:grid-cols-2">
        <PanelSubCard
          title="Partidas"
          action={
            <PanelLinkAction
              onClick={() => toast.info('Edición de partidas: solo demo')}
              icon={Pencil}
            >
              Editar partidas
            </PanelLinkAction>
          }
        >
          {order.items.length === 0 ? (
            <p className="text-sm text-text-tertiary">Aún no hay partidas.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-text-tertiary">
                  <th className="pb-2 text-left font-normal">Concepto</th>
                  <th className="pb-2 text-right font-normal">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {order.items.map((it, i) => (
                  <tr key={i}>
                    <td className="py-2 pr-3">
                      <span className="block text-text-primary">{it.concept}</span>
                      <span className="block text-xs text-text-tertiary tabular-nums">
                        {it.qty} × {formatCurrency(it.unitPrice)}
                      </span>
                    </td>
                    <td className="py-2 text-right align-top text-text-primary tabular-nums">
                      {formatCurrency(it.qty * it.unitPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-border-subtle">
                  <td className="pt-2 font-medium text-text-primary">Total</td>
                  <td className="pt-2 text-right font-medium text-text-primary tabular-nums">
                    {formatCurrency(total)}
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
        </PanelSubCard>

        <PanelSubCard
          title="Notas"
          action={
            <PanelLinkAction
              onClick={() => toast.info('Edición de notas: solo demo')}
              icon={Pencil}
            >
              Editar
            </PanelLinkAction>
          }
        >
          <p className="text-sm text-text-secondary">
            {order.notes || 'Sin notas. Agrega instrucciones para la cuadrilla o el cliente.'}
          </p>
        </PanelSubCard>
      </div>

      <PanelSubCard title="Historial">
        <div className="divide-y divide-border-subtle border-t border-border-subtle">
          <DisclosureRow
            title="Cambios de estado"
            badge={<RowPill>{order.history.length}</RowPill>}
            triggerClassName="px-0 py-2.5"
          >
            <EventList events={order.history} />
          </DisclosureRow>
          <DisclosureRow
            title="Comentarios"
            badge={<RowPill>{order.comments.length}</RowPill>}
            triggerClassName="px-0 py-2.5"
          >
            {order.comments.length === 0 ? (
              <p className="pb-3 text-sm text-text-tertiary">Sin comentarios.</p>
            ) : (
              <EventList events={order.comments} />
            )}
          </DisclosureRow>
        </div>
      </PanelSubCard>
    </DetailPanelFrame>
  );
}

function EventList({ events }: { events: OrderEvent[] }) {
  return (
    <ol className="space-y-3 pb-3">
      {[...events].reverse().map((e, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <Avatar name={userName(e.byId)} size={20} className="mt-0.5" />
          <div className="min-w-0">
            <p className="text-sm text-text-primary">{e.text}</p>
            <p className="text-xs text-text-tertiary">
              {userName(e.byId)} · {formatDate(e.at)}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
