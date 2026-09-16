'use client';

/**
 * Dona «Dinero en cuentas» del cockpit (M5): recharts `Pie` innerRadius 54 /
 * outerRadius 76 / paddingAngle 2 / cornerRadius 3, sin animación ni trazo,
 * dentro de `ChartContainer` (tooltip nivel 3). El color sigue a la entidad:
 * misma cuenta, misma rebanada, mismo punto en la leyenda. La leyenda es
 * clicable (punto + nombre + % + valor) y resalta la rebanada; la identidad
 * nunca depende solo del color.
 */

import * as React from 'react';
import { Cell, Pie, PieChart } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { formatCurrency, formatCurrencyCompact } from '@/lib/i18n/formatters';
import { cn } from '@/lib/utils';

import type { DemoAccount } from './data';

export function AccountsDonut({ accounts }: { accounts: DemoAccount[] }) {
  const [active, setActive] = React.useState<string | null>(null);
  const total = accounts.reduce((sum, a) => sum + a.balance, 0);
  const activeAccount = accounts.find((a) => a.id === active) ?? null;

  const config = Object.fromEntries(
    accounts.map((a) => [a.id, { label: a.name, color: a.color }]),
  ) satisfies ChartConfig;
  const data = accounts.map((a) => ({ id: a.id, name: a.name, balance: a.balance }));

  function toggle(id: string) {
    setActive((current) => (current === id ? null : id));
  }

  // Con menos de dos series no se pinta la dona (01-sistema §3.8 / M5).
  if (accounts.length < 2) {
    return (
      <p className="p-5 text-sm text-text-tertiary">
        Registra al menos dos cuentas para ver la distribución.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 p-5 sm:flex-row">
      <div className="relative size-44 shrink-0">
        <ChartContainer config={config} className="aspect-auto size-full">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name) => {
                    const amount = typeof value === 'number' ? value : Number(value);
                    return (
                      <span className="flex flex-1 items-center justify-between gap-3">
                        <span className="text-muted-foreground">{String(name)}</span>
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
              data={data}
              dataKey="balance"
              nameKey="name"
              innerRadius={54}
              outerRadius={76}
              paddingAngle={2}
              cornerRadius={3}
              isAnimationActive={false}
              stroke="none"
            >
              {accounts.map((a) => (
                <Cell
                  key={a.id}
                  fill={a.color}
                  fillOpacity={active && active !== a.id ? 0.3 : 1}
                  className="cursor-pointer"
                  onClick={() => toggle(a.id)}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-text-tertiary">{activeAccount?.name ?? 'Total'}</span>
          <span className="text-lg font-semibold text-text-primary tabular-nums">
            {formatCurrencyCompact(activeAccount?.balance ?? total)}
          </span>
        </div>
      </div>

      <ul className="w-full min-w-0 flex-1 divide-y divide-border-subtle">
        {accounts.map((a) => {
          const pct = Math.round((a.balance / total) * 100);
          const dimmed = active !== null && active !== a.id;
          return (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => toggle(a.id)}
                aria-pressed={active === a.id}
                className={cn(
                  'flex w-full cursor-pointer items-center gap-2.5 rounded-sm px-2 py-2 text-left text-sm transition-colors duration-150 outline-none hover:bg-row-hover focus-visible:shadow-focus motion-reduce:transition-none',
                  dimmed && 'opacity-50',
                )}
              >
                <span
                  aria-hidden
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: a.color }}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-text-primary">{a.name}</span>
                  <span className="block truncate text-xs text-text-tertiary">{a.bank}</span>
                </span>
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
  );
}
