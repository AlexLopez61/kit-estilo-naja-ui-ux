'use client';

/**
 * M5 · Cockpit de la demo (`/demo`): sin `PageHeader`; arriba el periodo
 * (`MonthPicker`, M12) y la única primaria negra «+ Registrar ⌄». Dos cards
 * hero nivel 3 (dona por cuenta · posición con `Meter`), fila de `KpiTile`
 * (uno filtra la bandeja «Por cerrar»), «Últimos movimientos» con la regla
 * del libro y «Por cerrar» con deep links a `/demo/lista?ver=`.
 */

import * as React from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  Clock,
  FolderOpen,
  Inbox,
  Plus,
  Receipt,
  UserPlus,
} from 'lucide-react';
import { toast } from 'sonner';

import { PageContainer } from '@/components/patterns/PageContainer';
import type { DateRangeValue } from '@/components/shared/DateRangePicker';
import {
  DenseList,
  DenseRow,
  DetailCard,
  DetailCardHeader,
  IconCircle,
  KpiTile,
  Meter,
  RowPill,
  SignedAmount,
} from '@/components/shared/DetailCard';
import { MonthPicker } from '@/components/shared/MonthPicker';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';
import { monthWindow } from '@/lib/utils/dateWindow';

import { AccountsDonut } from './AccountsDonut';
import {
  ACCOUNTS,
  DEMO_TODAY,
  MOVEMENTS,
  ORDERS,
  ORDER_KIND,
  ORDER_STATUS,
  accountName,
  isOverdue,
  monthLabel,
  orderBalance,
  orderTotal,
  relativeDay,
} from './data';

const [todayYear, todayMonth] = DEMO_TODAY.split('-').map(Number) as [number, number];

const INITIAL_PERIOD: DateRangeValue = {
  ...monthWindow(todayYear, todayMonth - 1),
  preset: 'custom',
};

export function DemoCockpit() {
  const router = useRouter();
  const [period, setPeriod] = React.useState<DateRangeValue>(INITIAL_PERIOD);
  const [onlyToSettle, setOnlyToSettle] = React.useState(false);

  // Movimientos del periodo (regla del libro: solo salidas en rojo).
  const movements = MOVEMENTS.filter((m) => m.at >= period.from && m.at <= period.to).sort((a, b) =>
    b.at.localeCompare(a.at),
  );
  const charged = movements.filter((m) => m.amount > 0).reduce((s, m) => s + m.amount, 0);
  const paidOut = movements.filter((m) => m.amount < 0).reduce((s, m) => s + -m.amount, 0);

  // Posición operativa (no depende del periodo: es «hoy»).
  const openOrders = ORDERS.filter((o) => ORDER_STATUS[o.status].open);
  const receivable = openOrders.reduce((s, o) => s + orderBalance(o), 0);
  const toSettle = ORDERS.filter((o) => o.status === 'por_liquidar');
  const toSettleAmount = toSettle.reduce((s, o) => s + orderBalance(o), 0);
  const overdue = openOrders.filter(isOverdue);
  const closedInPeriod = ORDERS.filter(
    (o) => o.status === 'cerrada' && o.dueAt >= period.from && o.dueAt <= period.to,
  );
  const payable = 31900; // facturas de proveedor por pagar (dato fijo de la demo)
  const payableDue = 12400;

  const pending = openOrders
    .filter((o) => orderBalance(o) > 0)
    .filter((o) => !onlyToSettle || o.status === 'por_liquidar')
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt));

  const periodLabel = monthLabel(period.from);

  return (
    <PageContainer>
      {/* Apertura M0: periodo + acción global; sin título de página. */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <MonthPicker value={period} onChange={setPeriod} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Plus className="size-3.5" strokeWidth={1.5} />
              Registrar
              <ChevronDown className="size-3.5" strokeWidth={1.5} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link href={'/nuevo' as Route}>
                <FolderOpen />
                Nueva orden
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => toast.info('Registro de movimiento: solo demo')}>
              <Receipt />
              Movimiento
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => toast.info('Alta de cliente: solo demo')}>
              <UserPlus />
              Cliente
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid gap-4">
        {/* Dos cards hero nivel 3 */}
        <div className="grid gap-4 lg:grid-cols-2">
          <DetailCard>
            <DetailCardHeader
              title="Dinero en cuentas"
              subtitle="Saldos al cierre de ayer"
              linkLabel="Ver cuentas"
              onLinkClick={() => toast.info('Cuentas: solo demo')}
            />
            <AccountsDonut accounts={ACCOUNTS} />
          </DetailCard>

          <DetailCard>
            <DetailCardHeader
              title="Posición de hoy"
              subtitle="Lo que falta por cobrar y por pagar"
              linkLabel="Ver órdenes"
              href="/demo/lista"
            />
            <div className="space-y-4 p-5">
              <Meter
                label="Por cobrar"
                value={formatCurrency(receivable)}
                pct={Math.round((toSettleAmount / Math.max(receivable, 1)) * 100)}
                tone="success"
                sub={`${openOrders.length} órdenes abiertas · ${formatCurrency(toSettleAmount)} ya está por liquidar`}
                onClick={() => router.push('/demo/lista?vista=abiertas' as Route)}
                ariaLabel="Ver órdenes abiertas"
              />
              <Meter
                label="Por pagar"
                value={formatCurrency(payable)}
                pct={Math.round((payableDue / payable) * 100)}
                tone="danger"
                sub={`${formatCurrency(payableDue)} vence esta semana`}
                onClick={() => toast.info('Pagos a proveedores: solo demo')}
                ariaLabel="Ver pagos a proveedores"
              />
              <Meter
                label="Órdenes cerradas en el periodo"
                value={`${closedInPeriod.length} de ${ORDERS.length}`}
                pct={Math.round((closedInPeriod.length / ORDERS.length) * 100)}
                tone="neutral"
                sub={`Cerradas en ${periodLabel}`}
              />
            </div>
          </DetailCard>
        </div>

        {/* Fila de tiles: «Por liquidar» filtra la bandeja «Por cerrar». */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiTile
            label="Órdenes abiertas"
            icon={FolderOpen}
            value={String(openOrders.length)}
            detail={`${ORDERS.filter((o) => o.status === 'borrador').length} en borrador`}
          />
          <KpiTile
            label="Por liquidar"
            icon={Clock}
            value={formatCurrency(toSettleAmount)}
            detail={`${toSettle.length} órdenes · clic para filtrar abajo`}
            onClick={() => setOnlyToSettle((v) => !v)}
            active={onlyToSettle}
          />
          <KpiTile
            label="Cobrado en el periodo"
            icon={ArrowDownLeft}
            value={formatCurrency(charged)}
            detail={`${formatCurrency(paidOut)} en salidas`}
          />
          <KpiTile
            label="Vencidas"
            icon={AlertTriangle}
            value={String(overdue.length)}
            detail={overdue.length > 0 ? 'Requieren seguimiento' : 'Todo al día'}
            valueClassName={overdue.length > 0 ? 'text-danger-text' : undefined}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Últimos movimientos: solo las salidas en rojo. */}
          <DetailCard className="pb-2">
            <DetailCardHeader
              title="Últimos movimientos"
              subtitle={`Periodo: ${periodLabel}`}
              linkLabel="Ver libro"
              onLinkClick={() => toast.info('Libro de movimientos: solo demo')}
            />
            <DenseList>
              {movements.length === 0 ? (
                <li className="px-5 py-8 text-center text-xs text-text-tertiary">
                  Sin movimientos en {periodLabel}.
                </li>
              ) : (
                movements
                  .slice(0, 7)
                  .map((m) => (
                    <DenseRow
                      key={m.id}
                      lead={
                        <IconCircle
                          icon={m.amount < 0 ? ArrowUpRight : ArrowDownLeft}
                          tone={m.amount < 0 ? 'danger' : 'success'}
                        />
                      }
                      title={m.concept}
                      sub={`${formatDate(m.at)} · ${accountName(m.accountId)}`}
                      right={<SignedAmount value={m.amount} className="text-sm font-medium" />}
                      href={m.orderId ? (`/demo/lista?ver=${m.orderId}` as Route) : undefined}
                    />
                  ))
              )}
            </DenseList>
          </DetailCard>

          {/* Por cerrar: pendientes derivados con deep link a la ficha. */}
          <DetailCard className="pb-2">
            <DetailCardHeader
              title="Por cerrar"
              subtitle={
                onlyToSettle ? 'Solo órdenes por liquidar · filtro del tile' : 'Órdenes con saldo'
              }
              action={
                onlyToSettle ? (
                  <button
                    type="button"
                    onClick={() => setOnlyToSettle(false)}
                    className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-sm text-xs text-text-secondary outline-none transition-colors hover:text-text-primary focus-visible:shadow-focus"
                  >
                    Quitar filtro
                  </button>
                ) : undefined
              }
              linkLabel="Ver todas"
              href={'/demo/lista?vista=abiertas' as Route}
            />
            <DenseList>
              {pending.length === 0 ? (
                <li className="flex flex-col items-center gap-2 px-5 py-8 text-center">
                  <IconCircle icon={Inbox} />
                  <span className="text-xs text-text-tertiary">Nada por cerrar.</span>
                </li>
              ) : (
                pending.slice(0, 7).map((o) => {
                  const late = isOverdue(o);
                  return (
                    <DenseRow
                      key={o.id}
                      lead={
                        <IconCircle
                          icon={ORDER_KIND[o.kind].icon}
                          tone={late ? 'warning' : 'neutral'}
                        />
                      }
                      title={o.title}
                      sub={
                        <>
                          <span className="font-mono">{o.folio}</span> ·{' '}
                          {late
                            ? `Venció ${relativeDay(o.dueAt).toLowerCase()}`
                            : `Vence ${relativeDay(o.dueAt).toLowerCase()}`}
                          {' · '}
                          {formatCurrency(orderTotal(o))}
                        </>
                      }
                      right={
                        <>
                          <RowPill>{formatCurrency(orderBalance(o))}</RowPill>
                          <ChevronRight
                            aria-hidden
                            className="size-4 text-text-tertiary"
                            strokeWidth={1.5}
                          />
                        </>
                      }
                      href={`/demo/lista?ver=${o.id}` as Route}
                      ariaLabel={`Abrir ${o.title}`}
                    />
                  );
                })
              )}
            </DenseList>
          </DetailCard>
        </div>
      </div>
    </PageContainer>
  );
}
