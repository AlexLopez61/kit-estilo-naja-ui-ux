'use client';

/**
 * M5 · Cockpit: dos cards hero nivel 3 (dona por cuenta · posición con
 * `Meter`), fila de `KpiTile` (los dos primeros filtran la bandeja de abajo),
 * lista densa «Últimos movimientos» y «Por cerrar».
 *
 * Dona: recharts `Pie` innerRadius 54 / outerRadius 76 / paddingAngle 2 /
 * cornerRadius 3, sin animación ni trazo, dentro de `ChartContainer`; el color
 * sigue a la entidad (tokens `--color-chart-*`: mismo punto en la leyenda,
 * misma rebanada). Leyenda clicable con punto + nombre + % + valor.
 */

import { ArrowDownLeft, ArrowUpRight, ClipboardList, Receipt } from 'lucide-react';
import { useState } from 'react';
import { Cell, Pie, PieChart } from 'recharts';

import { DetailCard, DetailCardHeader, KpiTile, Meter } from '@/components/shared/DetailCard';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { formatCurrency, formatCurrencyCompact } from '@/lib/i18n/formatters';
import { cn } from '@/lib/utils';

import { ACCOUNTS, MOVEMENTS } from './data';
import { MovementsCard, PendingCard } from './ListCards';

function noop() {
  /* navegación simulada en el showcase */
}

const TOTAL = ACCOUNTS.reduce((sum, a) => sum + a.balance, 0);

const CHART_DATA = ACCOUNTS.map((a) => ({ key: a.key, balance: a.balance }));

const CHART_CONFIG = Object.fromEntries(
  ACCOUNTS.map((a) => [a.key, { label: a.name, color: a.cssVar }]),
) satisfies ChartConfig;

type TileFilter = 'entradas' | 'salidas' | null;

export function CockpitDemo() {
  const [activeAccount, setActiveAccount] = useState<string | null>(null);
  const [tileFilter, setTileFilter] = useState<TileFilter>(null);

  const movements =
    tileFilter === 'entradas'
      ? MOVEMENTS.filter((m) => m.amount > 0)
      : tileFilter === 'salidas'
        ? MOVEMENTS.filter((m) => m.amount < 0)
        : MOVEMENTS;

  function toggleTile(next: Exclude<TileFilter, null>) {
    setTileFilter((current) => (current === next ? null : next));
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Hero 1 · dona por cuenta */}
        <DetailCard>
          <DetailCardHeader
            title="Saldo por cuenta"
            subtitle="Posición al cierre de ayer"
            linkLabel="Ver cuentas"
            onLinkClick={noop}
          />
          <div className="flex flex-col items-center gap-6 p-5 sm:flex-row">
            <div className="relative size-44 shrink-0">
              <ChartContainer config={CHART_CONFIG} className="aspect-auto size-full">
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        hideLabel
                        formatter={(value, name) => {
                          const account = ACCOUNTS.find((a) => a.key === String(name));
                          const amount = typeof value === 'number' ? value : Number(value);
                          return (
                            <span className="flex flex-1 items-center justify-between gap-3">
                              <span className="text-muted-foreground">
                                {account?.name ?? String(name)}
                              </span>
                              <span className="font-medium text-foreground tabular-nums">
                                {formatCurrency(amount)}
                              </span>
                            </span>
                          );
                        }}
                      />
                    }
                  />
                  <Pie
                    data={CHART_DATA}
                    dataKey="balance"
                    nameKey="key"
                    innerRadius={54}
                    outerRadius={76}
                    paddingAngle={2}
                    cornerRadius={3}
                    isAnimationActive={false}
                    stroke="none"
                  >
                    {ACCOUNTS.map((a) => (
                      <Cell
                        key={a.key}
                        fill={`var(--color-${a.key})`}
                        fillOpacity={activeAccount && activeAccount !== a.key ? 0.35 : 1}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs text-text-tertiary">Total</span>
                <span className="text-lg font-semibold text-text-primary">
                  {formatCurrencyCompact(TOTAL)}
                </span>
              </div>
            </div>
            <ul className="w-full min-w-0 flex-1 divide-y divide-border-subtle">
              {ACCOUNTS.map((a) => {
                const pct = Math.round((a.balance / TOTAL) * 100);
                const dimmed = activeAccount !== null && activeAccount !== a.key;
                return (
                  <li key={a.key}>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveAccount((current) => (current === a.key ? null : a.key))
                      }
                      aria-pressed={activeAccount === a.key}
                      className={cn(
                        'flex w-full cursor-pointer items-center gap-2.5 px-2 py-2 text-left text-sm transition-colors duration-150 outline-none hover:bg-row-hover focus-visible:shadow-focus motion-reduce:transition-none',
                        dimmed && 'opacity-50',
                      )}
                    >
                      <span aria-hidden className={cn('size-2 shrink-0 rounded-full', a.dotClass)} />
                      <span className="min-w-0 flex-1 truncate text-text-primary">{a.name}</span>
                      <span className="text-xs text-text-tertiary tabular-nums">{pct} %</span>
                      <span className="w-24 text-right font-medium text-text-primary tabular-nums">
                        {formatCurrency(a.balance)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </DetailCard>

        {/* Hero 2 · posición con Meter */}
        <DetailCard>
          <DetailCardHeader
            title="Posición de hoy"
            subtitle="Lo que entra y lo que sale este mes"
            linkLabel="Ver pendientes"
            onLinkClick={noop}
          />
          <div className="space-y-4 p-5">
            <Meter
              label="Por cobrar"
              value={formatCurrency(84300)}
              pct={62}
              tone="success"
              sub="12 órdenes · 62 % ya venció"
              onClick={noop}
              ariaLabel="Ver órdenes por cobrar"
            />
            <Meter
              label="Por pagar"
              value={formatCurrency(31900)}
              pct={38}
              tone="danger"
              sub="5 facturas de proveedor · 38 % vence esta semana"
              onClick={noop}
              ariaLabel="Ver facturas por pagar"
            />
            <Meter
              label="Disponible"
              value={formatCurrency(TOTAL)}
              pct={100}
              tone="neutral"
              sub="Suma de las cuatro cuentas"
            />
          </div>
        </DetailCard>
      </div>

      {/* Fila de tiles: los dos primeros filtran «Últimos movimientos» */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiTile
          label="Entradas de la semana"
          icon={ArrowDownLeft}
          value={formatCurrency(94700)}
          detail="3 cobros"
          onClick={() => toggleTile('entradas')}
          active={tileFilter === 'entradas'}
        />
        <KpiTile
          label="Salidas de la semana"
          icon={ArrowUpRight}
          value={formatCurrency(28540)}
          detail="2 pagos"
          onClick={() => toggleTile('salidas')}
          active={tileFilter === 'salidas'}
        />
        <KpiTile
          label="Cobrado en septiembre"
          icon={Receipt}
          value={formatCurrency(146200)}
          detail="+18 % vs agosto"
        />
        <KpiTile
          label="Órdenes abiertas"
          icon={ClipboardList}
          value="6"
          detail="2 vencen esta semana"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <MovementsCard
          movements={movements}
          subtitle={
            tileFilter === 'entradas'
              ? 'Solo entradas · filtro del tile'
              : tileFilter === 'salidas'
                ? 'Solo salidas · filtro del tile'
                : 'Semana 38 · cuenta operativa'
          }
        />
        <PendingCard />
      </div>
    </div>
  );
}
