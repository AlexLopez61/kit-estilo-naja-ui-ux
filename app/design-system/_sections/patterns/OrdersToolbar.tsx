'use client';

/**
 * Toolbar de M1: controles sueltos FUERA del marco de la tabla. Buscador con
 * lupa + `Kbd` F (atajo real cuando `shortcut`), `SegmentedControl` switch con
 * conteos, dos `FilterSelect` y la única primaria negra al final.
 */

import { Plus, Search } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { FilterSelect, type FilterOption } from '@/components/shared/FilterSelect';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Kbd } from '@/components/ui/kbd';
import { SegmentedControl, type SegmentedOption } from '@/components/ui/segmented-control';

import { ORDER_KIND_META, PEOPLE, type OrderKind } from './data';
import type { OrderFilters, Pipeline } from './useOrderFilters';

const KIND_OPTIONS: FilterOption[] = (Object.keys(ORDER_KIND_META) as OrderKind[]).map((k) => ({
  value: k,
  label: ORDER_KIND_META[k].label,
}));

const PEOPLE_OPTIONS: FilterOption[] = PEOPLE.map((p) => ({
  value: p.id,
  label: p.name,
  avatar: { name: p.name },
}));

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
}

export function OrdersToolbar({
  filters,
  shortcut = false,
  actionLabel = 'Nueva orden',
}: {
  filters: OrderFilters;
  /** Registra el atajo de teclado «F» que enfoca el buscador. */
  shortcut?: boolean;
  actionLabel?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!shortcut) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'f' && e.key !== 'F') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;
      e.preventDefault();
      inputRef.current?.focus();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [shortcut]);

  const pipelineOptions: SegmentedOption<Pipeline>[] = [
    { value: 'todas', label: `Todas · ${filters.counts.todas}` },
    { value: 'abiertas', label: `Abiertas · ${filters.counts.abiertas}` },
    { value: 'cerradas', label: `Cerradas · ${filters.counts.cerradas}` },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative w-full sm:w-64">
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-text-tertiary"
          strokeWidth={1.5}
        />
        <Input
          ref={inputRef}
          value={filters.query}
          onChange={(e) => filters.setQuery(e.target.value)}
          placeholder="Buscar orden, cliente o folio…"
          aria-label="Buscar órdenes"
          className="h-8 bg-bg-surface pr-9 pl-8"
        />
        <Kbd className="absolute top-1/2 right-2 -translate-y-1/2">F</Kbd>
      </div>
      <SegmentedControl
        variant="switch"
        className="w-auto"
        aria-label="Pipeline"
        options={pipelineOptions}
        value={filters.pipeline}
        onChange={filters.setPipeline}
      />
      <FilterSelect
        label="Responsable"
        allLabel="Todos"
        options={PEOPLE_OPTIONS}
        value={filters.assignee}
        onChange={filters.setAssignee}
      />
      <FilterSelect
        label="Tipo"
        allLabel="Todos"
        options={KIND_OPTIONS}
        value={filters.kind}
        onChange={filters.setKind}
      />
      <Button size="sm" className="ml-auto">
        <Plus className="size-3.5" strokeWidth={1.5} />
        {actionLabel}
      </Button>
    </div>
  );
}
