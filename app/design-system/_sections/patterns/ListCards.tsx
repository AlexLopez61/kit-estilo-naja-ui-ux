'use client';

/**
 * Listas densas del cockpit (M5) y de «Cards y tablas»: «Últimos movimientos»
 * (regla del libro: solo las salidas en rojo) y «Por cerrar» (pendientes
 * derivados; cada fila navega, con pill de conteo y chevron).
 */

import { ChevronRight } from 'lucide-react';

import {
  DenseList,
  DenseRow,
  DetailCard,
  DetailCardHeader,
  IconCircle,
  RowPill,
  SignedAmount,
} from '@/components/shared/DetailCard';
import { formatDate } from '@/lib/i18n/formatters';

import { MOVEMENTS, PENDING, type Movement } from './data';

function noop() {
  /* navegación simulada en el showcase */
}

export function MovementsCard({
  movements = MOVEMENTS,
  subtitle = 'Semana 38 · cuenta operativa',
}: {
  movements?: Movement[];
  subtitle?: string;
}) {
  return (
    <DetailCard className="pb-2">
      <DetailCardHeader
        title="Últimos movimientos"
        subtitle={subtitle}
        linkLabel="Ver libro"
        onLinkClick={noop}
      />
      <DenseList>
        {movements.length === 0 ? (
          <li className="px-5 py-6 text-center text-xs text-text-tertiary">
            Sin movimientos con este filtro.
          </li>
        ) : (
          movements.map((m) => (
            <DenseRow
              key={m.id}
              lead={<IconCircle icon={m.icon} tone={m.tone} />}
              title={m.concept}
              sub={`${formatDate(m.date)} · ${m.detail}`}
              right={<SignedAmount value={m.amount} className="text-sm font-medium" />}
              onClick={noop}
            />
          ))
        )}
      </DenseList>
    </DetailCard>
  );
}

export function PendingCard() {
  return (
    <DetailCard className="pb-2">
      <DetailCardHeader
        title="Por cerrar"
        subtitle="Pendientes derivados de la operación"
        linkLabel="Ver todo"
        onLinkClick={noop}
      />
      <DenseList>
        {PENDING.map((p) => (
          <DenseRow
            key={p.id}
            lead={<IconCircle icon={p.icon} tone={p.tone} />}
            title={p.title}
            sub={p.detail}
            right={
              <>
                <RowPill>{p.count}</RowPill>
                <ChevronRight
                  aria-hidden
                  className="size-4 text-text-tertiary"
                  strokeWidth={1.5}
                />
              </>
            }
            onClick={noop}
            ariaLabel={`Abrir ${p.title.toLowerCase()}`}
          />
        ))}
      </DenseList>
    </DetailCard>
  );
}
