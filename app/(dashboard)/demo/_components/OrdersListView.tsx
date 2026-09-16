'use client';

/**
 * M1 + M2 · `/demo/lista`: toolbar fuera del marco (buscador con `Kbd` F y
 * atajo real, `SegmentedControl` switch con conteos, dos `FilterSelect`,
 * primaria negra «Nueva orden» que abre el drawer M6), card nivel 3 con la
 * tabla estilo deployments y `HybridSplit` que abre la ficha M3 con
 * `?ver=<id>` (selección en cliente, `useShallowSearchParam`). Los filtros
 * también viven en la URL (`?vista`, `?estado`, `?cliente`, `?q`).
 */

import * as React from 'react';
import { Plus, Search, SearchX } from 'lucide-react';
import { toast } from 'sonner';

import { EmptyState } from '@/components/patterns/EmptyState';
import { PageContainer } from '@/components/patterns/PageContainer';
import { ConfirmDeleteModal } from '@/components/modals/ConfirmDeleteModal';
import { IconCircle } from '@/components/shared/DetailCard';
import {
  HybridSplit,
  TABLE_HEAD_CLASS,
  TableFooter,
  tableRowClass,
} from '@/components/shared/DetailPanel';
import { FilterSelect, type FilterOption } from '@/components/shared/FilterSelect';
import { SelectedStripe } from '@/components/shared/SelectedStripe';
import { useShallowSearchParam } from '@/components/shared/useShallowSearchParam';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Kbd } from '@/components/ui/kbd';
import { SegmentedControl, type SegmentedOption } from '@/components/ui/segmented-control';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';
import { cn } from '@/lib/utils';

import {
  CLIENTS,
  CURRENT_USER,
  DEMO_TODAY,
  ORDERS,
  ORDER_KIND,
  ORDER_STATUS,
  ORDER_STATUS_LIST,
  clientById,
  clientName,
  nextFolio,
  orderTotal,
  userName,
  type DemoOrder,
} from './data';
import { NewOrderSheet, type NewOrderDraft } from './NewOrderSheet';
import { OrderDetailPanel } from './OrderDetailPanel';
import { StatusDot } from './orderUi';

type Vista = 'todo' | 'abiertas' | 'cerradas';

const VISTAS: Vista[] = ['todo', 'abiertas', 'cerradas'];

const STATUS_OPTIONS: FilterOption[] = ORDER_STATUS_LIST.map((s) => ({
  value: s,
  label: ORDER_STATUS[s].label,
}));

const CLIENT_OPTIONS: FilterOption[] = CLIENTS.map((c) => ({
  value: c.id,
  label: c.name,
  avatar: { name: c.name, square: c.kind === 'empresa' },
}));

/** Columnas: completa (panel cerrado) y comprimida (principal + estado + monto). */
const GRID_FULL =
  'grid-cols-[minmax(0,1fr)_112px_120px] lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_112px_100px_120px]';
const GRID_COMPACT = 'grid-cols-[minmax(0,1fr)_112px_120px]';

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
}

export function OrdersListView() {
  const [orders, setOrders] = React.useState<DemoOrder[]>(ORDERS);

  // Estado en la URL (pushState/replaceState, sin ir al server).
  const [ver, setVer] = useShallowSearchParam('ver');
  const [vistaParam, setVistaParam] = useShallowSearchParam('vista');
  const [estado, setEstado] = useShallowSearchParam('estado');
  const [cliente, setCliente] = useShallowSearchParam('cliente');
  const [q, setQ] = useShallowSearchParam('q');
  const vista: Vista = VISTAS.includes(vistaParam as Vista) ? (vistaParam as Vista) : 'todo';
  const query = q ?? '';

  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const searchRef = React.useRef<HTMLInputElement>(null);

  // Atajo real: «F» enfoca el buscador (fuera de un campo de texto).
  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'f' && e.key !== 'F') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;
      e.preventDefault();
      searchRef.current?.focus();
      searchRef.current?.select();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Conteos del pipeline (sobre búsqueda + filtros, sin la vista).
  const needle = query.trim().toLowerCase();
  const base = orders.filter((o) => {
    if (estado && o.status !== estado) return false;
    if (cliente && o.clientId !== cliente) return false;
    if (needle) {
      const hay = `${o.title} ${o.folio} ${clientName(o.clientId)} ${o.location}`.toLowerCase();
      if (!hay.includes(needle)) return false;
    }
    return true;
  });
  const counts = {
    todo: base.length,
    abiertas: base.filter((o) => ORDER_STATUS[o.status].open).length,
    cerradas: base.filter((o) => !ORDER_STATUS[o.status].open).length,
  };
  const filtered = base
    .filter((o) =>
      vista === 'todo' ? true : ORDER_STATUS[o.status].open === (vista === 'abiertas'),
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.folio.localeCompare(a.folio));

  const selected = ver ? orders.find((o) => o.id === ver) : undefined;
  const open = selected !== undefined;
  const deleteTarget = deleteId ? orders.find((o) => o.id === deleteId) : undefined;
  const hasFilters = Boolean(needle || estado || cliente || vista !== 'todo');

  const vistaOptions: SegmentedOption<Vista>[] = [
    { value: 'todo', label: `Todo · ${counts.todo}` },
    { value: 'abiertas', label: `Abiertas · ${counts.abiertas}` },
    { value: 'cerradas', label: `Cerradas · ${counts.cerradas}` },
  ];

  function clearFilters() {
    setQ(null, { replace: true, clear: ['estado', 'cliente', 'vista'] });
  }

  function createOrder(draft: NewOrderDraft) {
    const folio = nextFolio(orders);
    const order: DemoOrder = {
      id: `ord-${folio.slice(-4)}`,
      folio,
      title: draft.title,
      clientId: draft.clientId,
      kind: draft.kind,
      status: 'borrador',
      createdAt: DEMO_TODAY,
      dueAt: draft.dueAt,
      createdById: CURRENT_USER.id,
      assigneeId: draft.assigneeId,
      location: draft.location?.trim() || clientName(draft.clientId),
      notes: draft.notes?.trim() ?? '',
      items: draft.budget
        ? [{ concept: 'Presupuesto estimado', qty: 1, unitPrice: Number(draft.budget) || 0 }]
        : [],
      paid: 0,
      history: [{ at: DEMO_TODAY, text: 'Orden creada', byId: CURRENT_USER.id }],
      comments: [],
    };
    setOrders((prev) => [order, ...prev]);
    setVer(order.id);
    toast.success(`Orden ${folio} creada`);
  }

  function duplicateOrder(source: DemoOrder) {
    const folio = nextFolio(orders);
    const copy: DemoOrder = {
      ...source,
      id: `ord-${folio.slice(-4)}`,
      folio,
      title: `${source.title} (copia)`,
      status: 'borrador',
      createdAt: DEMO_TODAY,
      createdById: CURRENT_USER.id,
      paid: 0,
      history: [{ at: DEMO_TODAY, text: `Duplicada de ${source.folio}`, byId: CURRENT_USER.id }],
      comments: [],
    };
    setOrders((prev) => [copy, ...prev]);
    setVer(copy.id);
    toast.success(`Orden duplicada como ${folio}`);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    // Simula la latencia de la acción; en la app es la Server Action.
    window.setTimeout(() => {
      setOrders((prev) => prev.filter((o) => o.id !== deleteTarget.id));
      if (ver === deleteTarget.id) setVer(null);
      setDeleting(false);
      setDeleteId(null);
      toast.success(`Orden ${deleteTarget.folio} eliminada`);
    }, 450);
  }

  const grid = open ? GRID_COMPACT : GRID_FULL;
  const secondary = open ? 'hidden' : 'hidden lg:flex';
  const secondaryText = open ? 'hidden' : 'hidden lg:block';
  const total = filtered.reduce((sum, o) => sum + orderTotal(o), 0);

  return (
    <PageContainer>
      {/* Toolbar fuera del marco (M1) */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-64">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-text-tertiary"
            strokeWidth={1.5}
          />
          <Input
            ref={searchRef}
            value={query}
            onChange={(e) => setQ(e.target.value, { replace: true })}
            onKeyDown={(e) => {
              if (e.key === 'Escape') e.currentTarget.blur();
            }}
            placeholder="Buscar orden, cliente o folio…"
            aria-label="Buscar órdenes"
            className="h-8 bg-bg-surface pr-9 pl-8"
          />
          <Kbd className="absolute top-1/2 right-2 -translate-y-1/2">F</Kbd>
        </div>
        <SegmentedControl
          variant="switch"
          className="w-auto"
          aria-label="Vista"
          options={vistaOptions}
          value={vista}
          onChange={(v) => setVistaParam(v === 'todo' ? null : v)}
        />
        <FilterSelect
          label="Estado"
          allLabel="Todos"
          options={STATUS_OPTIONS}
          value={estado ?? undefined}
          onChange={(v) => setEstado(v ?? null)}
        />
        <FilterSelect
          label="Cliente"
          allLabel="Todos"
          options={CLIENT_OPTIONS}
          value={cliente ?? undefined}
          onChange={(v) => setCliente(v ?? null)}
        />
        <Button size="sm" className="ml-auto" onClick={() => setSheetOpen(true)}>
          <Plus className="size-3.5" strokeWidth={1.5} />
          Nueva orden
        </Button>
      </div>

      {/* Lista + ficha (M2) */}
      <HybridSplit
        open={open}
        panelKey={selected?.id ?? null}
        list={
          <>
            <div className={cn(TABLE_HEAD_CLASS, grid)}>
              <span className="h-5 leading-5">Orden</span>
              <span className={cn('h-5 leading-5', secondaryText)}>Cliente</span>
              <span className="h-5 leading-5">Estado</span>
              <span className={cn('h-5 leading-5', secondaryText)}>Vence</span>
              <span className="h-5 text-right leading-5">Monto</span>
            </div>

            {filtered.length === 0 ? (
              <EmptyState
                className="min-h-[320px]"
                icon={<SearchX size={24} strokeWidth={1.5} />}
                title="Sin órdenes con esos filtros"
                description="Prueba con otra búsqueda o limpia los filtros para ver todo."
                action={
                  hasFilters ? (
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                      Limpiar filtros
                    </Button>
                  ) : undefined
                }
              />
            ) : (
              filtered.map((o, i) => {
                const isSelected = o.id === selected?.id;
                const kind = ORDER_KIND[o.kind];
                const client = clientById(o.clientId);
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setVer(o.id)}
                    aria-current={isSelected ? 'true' : undefined}
                    className={cn('w-full', tableRowClass(isSelected, i % 2 === 1), grid)}
                  >
                    {isSelected && <SelectedStripe />}
                    {/* Celda principal: altura fija h-10 para que no brinque al comprimirse. */}
                    <span className="flex h-10 min-w-0 items-center gap-3">
                      <IconCircle icon={kind.icon} />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-text-primary">
                          {o.title}
                        </span>
                        <span className="block truncate text-xs text-text-tertiary">
                          <span className="font-mono">{o.folio}</span> · {kind.label} · Creada el{' '}
                          {formatDate(o.createdAt)} por {userName(o.createdById)}
                        </span>
                      </span>
                    </span>
                    <span className={cn('min-w-0 items-center gap-2', secondary)}>
                      <Avatar
                        name={client?.name ?? 'Cliente'}
                        size={24}
                        square={client?.kind === 'empresa'}
                      />
                      <span className="truncate text-sm text-text-secondary">{client?.name}</span>
                    </span>
                    <span>
                      <StatusDot status={o.status} />
                    </span>
                    <span className={cn('text-sm text-text-secondary tabular-nums', secondaryText)}>
                      {formatDate(o.dueAt)}
                    </span>
                    <span className="text-right text-sm font-medium text-text-primary tabular-nums">
                      {formatCurrency(orderTotal(o))}
                    </span>
                  </button>
                );
              })
            )}

            <TableFooter>
              <span>
                {filtered.length} {filtered.length === 1 ? 'orden' : 'órdenes'}
                {vista === 'todo' && ` · ${counts.abiertas} abiertas`}
              </span>
              <span className="flex items-center gap-3">
                <span className="tabular-nums">Total {formatCurrency(total)}</span>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => toast.info('No hay órdenes anteriores en la demo')}
                >
                  Cargar anteriores
                </Button>
              </span>
            </TableFooter>
          </>
        }
        panel={
          selected ? (
            <OrderDetailPanel
              order={selected}
              onClose={() => setVer(null)}
              onDuplicate={() => duplicateOrder(selected)}
              onDelete={() => setDeleteId(selected.id)}
            />
          ) : null
        }
      />

      <NewOrderSheet open={sheetOpen} onOpenChange={setSheetOpen} onCreate={createOrder} />

      <ConfirmDeleteModal
        open={deleteTarget !== undefined}
        onOpenChange={(o) => {
          if (!o && !deleting) setDeleteId(null);
        }}
        title="¿Eliminar esta orden?"
        description={
          deleteTarget
            ? `Se borrará ${deleteTarget.folio} «${deleteTarget.title}» con sus partidas e historial. Esta acción no se puede deshacer.`
            : undefined
        }
        confirmLabel="Eliminar orden"
        onConfirm={confirmDelete}
        isLoading={deleting}
      />
    </PageContainer>
  );
}
