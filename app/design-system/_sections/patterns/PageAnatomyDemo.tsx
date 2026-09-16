'use client';

/**
 * M0 · Anatomía de página. Recrea el marco de la app (gris) con la vista
 * flotante y un `PageContainer` simulado: tabs de módulo `line` como primera
 * fila útil (sin `PageHeader`), acción global negra a la derecha y contenido
 * que entra con `animate-in fade-in-0 slide-in-from-bottom-1 duration-300`.
 */

import { ArrowDownLeft, ArrowUpRight, Plus } from 'lucide-react';

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
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';

import { ACCOUNTS, MOVEMENTS, PENDING } from './data';

function noop() {
  /* navegación simulada en el showcase */
}

const TAB_CONTENT_CLASS = 'data-[state=active]:duration-300';

export function PageAnatomyDemo() {
  const total = ACCOUNTS.reduce((sum, a) => sum + a.balance, 0);
  return (
    <div className="rounded-xl bg-bg-elevated p-2 dark:border dark:border-border-card">
      {/* La vista (SidebarInset): rounded-xl + shadow-md sobre el marco gris. */}
      <div className="rounded-xl bg-bg-base shadow-md dark:border dark:border-border-card">
        {/* PageContainer simulado: mx-auto max-w-[1700px] space-y-6 p-6 md:p-8 */}
        <div className="mx-auto w-full max-w-[1700px] space-y-6 p-6 md:p-8">
          <Tabs defaultValue="resumen">
            <div className="flex items-end justify-between gap-4 border-b border-border-subtle">
              <TabsList variant="line" className="border-b-0">
                <TabsTrigger value="resumen">Resumen</TabsTrigger>
                <TabsTrigger value="movimientos">Movimientos</TabsTrigger>
                <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
                <TabsTrigger value="cuentas">Cuentas</TabsTrigger>
              </TabsList>
              <div className="pb-1.5">
                <SplitActionButton
                  primary={
                    <button type="button" className={SPLIT_ACTION_CLASS}>
                      <Plus className="size-3.5" strokeWidth={1.5} />
                      Registrar
                    </button>
                  }
                  menu={[
                    <DropdownMenuItem key="cobro">
                      <ArrowDownLeft />
                      Cobro
                    </DropdownMenuItem>,
                    <DropdownMenuItem key="pago">
                      <ArrowUpRight />
                      Pago
                    </DropdownMenuItem>,
                    <DropdownMenuItem key="gasto">Gasto operativo</DropdownMenuItem>,
                  ]}
                />
              </div>
            </div>

            <TabsContent value="resumen" className={TAB_CONTENT_CLASS}>
              <div className="grid gap-4 pt-4 sm:grid-cols-2 xl:grid-cols-4">
                <KpiTile label="Disponible" value={formatCurrency(total)} detail="4 cuentas" />
                <KpiTile
                  label="Por cobrar"
                  value={formatCurrency(84300)}
                  detail="12 órdenes abiertas"
                />
                <KpiTile
                  label="Por pagar"
                  value={formatCurrency(31900)}
                  detail="5 facturas de proveedor"
                />
                <KpiTile
                  label="Cobrado en septiembre"
                  value={formatCurrency(146200)}
                  detail="+18 % vs agosto"
                />
              </div>
            </TabsContent>

            <TabsContent value="movimientos" className={TAB_CONTENT_CLASS}>
              <DetailCard className="mt-4 pb-2">
                <DetailCardHeader
                  title="Movimientos"
                  subtitle="Semana 38"
                  linkLabel="Ver libro"
                  onLinkClick={noop}
                />
                <DenseList>
                  {MOVEMENTS.slice(0, 3).map((m) => (
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
            </TabsContent>

            <TabsContent value="pendientes" className={TAB_CONTENT_CLASS}>
              <DetailCard className="mt-4 pb-2">
                <DetailCardHeader title="Pendientes" subtitle="Derivados de la operación" />
                <DenseList>
                  {PENDING.slice(0, 3).map((p) => (
                    <DenseRow
                      key={p.id}
                      lead={<IconCircle icon={p.icon} tone={p.tone} />}
                      title={p.title}
                      sub={p.detail}
                      onClick={noop}
                    />
                  ))}
                </DenseList>
              </DetailCard>
            </TabsContent>

            <TabsContent value="cuentas" className={TAB_CONTENT_CLASS}>
              <DetailCard className="mt-4">
                <DetailCardHeader title="Cuentas" subtitle="Saldo al cierre de ayer" />
                <div className="space-y-4 p-5">
                  {ACCOUNTS.slice(0, 3).map((a) => (
                    <Meter
                      key={a.key}
                      label={a.name}
                      value={formatCurrency(a.balance)}
                      pct={Math.round((a.balance / total) * 100)}
                      sub={`${Math.round((a.balance / total) * 100)} % del disponible`}
                    />
                  ))}
                </div>
              </DetailCard>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
