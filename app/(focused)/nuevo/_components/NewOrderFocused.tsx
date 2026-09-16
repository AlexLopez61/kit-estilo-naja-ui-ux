'use client';

/**
 * M7 · Alta en página enfocada (`/nuevo`): topbar sticky `h-12` en grid
 * [1fr auto 1fr] (← Volver · título · Cancelar + Guardar negro), `main` de
 * 960 px, tres pasos como tiles con estado, `SettingsCard`s por paso (título,
 * descripción, footer strip con hint + acción) y `DisclosureRow` para las
 * sub-secciones; confirmación con tile resumen. Todo el estado vive en el
 * cliente; «Guardar» valida y regresa a la lista.
 */

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { DisclosureRow } from '@/components/patterns/DisclosureRow';
import { PanelField } from '@/components/shared/PanelField';
import { Field, SettingsCard } from '@/components/shared/SettingsCard';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';
import { cn } from '@/lib/utils';

import {
  CLIENTS,
  DEMO_TODAY,
  ORDERS,
  ORDER_KIND,
  ORDER_KIND_LIST,
  USERS,
  clientName,
  nextFolio,
  type OrderKind,
} from '@/app/(dashboard)/demo/_components/data';

type Step = 1 | 2 | 3;

type DraftItem = { id: number; concept: string; qty: string; unitPrice: string };

type Draft = {
  title: string;
  kind: OrderKind | null;
  clientId: string;
  assigneeId: string;
  street: string;
  number: string;
  neighborhood: string;
  zip: string;
  items: DraftItem[];
  startAt: string;
  dueAt: string;
  remindDayBefore: boolean;
  remindWeekly: boolean;
  notes: string;
};

const STEPS: { n: Step; label: string; hint: string }[] = [
  { n: 1, label: 'Datos', hint: 'Título, tipo y cliente' },
  { n: 2, label: 'Alcance', hint: 'Partidas y fechas' },
  { n: 3, label: 'Confirmación', hint: 'Revisa y guarda' },
];

const INITIAL_DRAFT: Draft = {
  title: '',
  kind: null,
  clientId: '',
  assigneeId: '',
  street: '',
  number: '',
  neighborhood: '',
  zip: '',
  items: [{ id: 1, concept: '', qty: '1', unitPrice: '' }],
  startAt: DEMO_TODAY,
  dueAt: '',
  remindDayBefore: true,
  remindWeekly: false,
  notes: '',
};

const NEXT_FOLIO = nextFolio(ORDERS);

function itemAmount(it: DraftItem): number {
  const qty = Number(it.qty);
  const price = Number(it.unitPrice);
  if (!Number.isFinite(qty) || !Number.isFinite(price)) return 0;
  return Math.round(qty * price);
}

function step1Errors(d: Draft) {
  return {
    title: d.title.trim().length < 3 ? 'Escribe un título de al menos 3 caracteres' : undefined,
    kind: d.kind ? undefined : 'Elige el tipo de orden',
    clientId: d.clientId ? undefined : 'Elige un cliente',
    assigneeId: d.assigneeId ? undefined : 'Elige un responsable',
  };
}

function step2Errors(d: Draft) {
  const badItem = d.items.some(
    (it) => !it.concept.trim() || !(Number(it.qty) > 0) || !(Number(it.unitPrice) >= 0),
  );
  return {
    items:
      d.items.length === 0
        ? 'Agrega al menos una partida'
        : badItem
          ? 'Completa concepto, cantidad y precio de cada partida'
          : undefined,
    dueAt: d.dueAt ? undefined : 'Indica la fecha límite',
  };
}

function hasErrors(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).some(Boolean);
}

function scrollToTop() {
  document.querySelector('[data-scroll-root]')?.scrollTo({ top: 0, behavior: 'smooth' });
}

export function NewOrderFocused() {
  const router = useRouter();
  const [step, setStep] = React.useState<Step>(1);
  const [draft, setDraft] = React.useState<Draft>(INITIAL_DRAFT);
  const [touched, setTouched] = React.useState<Record<Step, boolean>>({
    1: false,
    2: false,
    3: false,
  });
  const nextItemId = React.useRef(2);

  const errors1 = step1Errors(draft);
  const errors2 = step2Errors(draft);
  const valid1 = !hasErrors(errors1);
  const valid2 = !hasErrors(errors2);
  const total = draft.items.reduce((sum, it) => sum + itemAmount(it), 0);

  function patch(partial: Partial<Draft>) {
    setDraft((prev) => ({ ...prev, ...partial }));
  }

  function goTo(next: Step) {
    setStep(next);
    scrollToTop();
  }

  function continueFrom(current: Step) {
    setTouched((t) => ({ ...t, [current]: true }));
    if (current === 1 && !valid1) return;
    if (current === 2 && !valid2) return;
    goTo((current + 1) as Step);
  }

  function save() {
    setTouched({ 1: true, 2: true, 3: true });
    if (!valid1) {
      toast.error('Faltan datos en el paso 1');
      goTo(1);
      return;
    }
    if (!valid2) {
      toast.error('Faltan datos en el paso 2');
      goTo(2);
      return;
    }
    toast.success(`Orden ${NEXT_FOLIO} creada`);
    router.push('/demo/lista');
  }

  const address = [
    [draft.street, draft.number].filter(Boolean).join(' '),
    draft.neighborhood,
    draft.zip && `CP ${draft.zip}`,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <>
      {/* Topbar propio de 48 px */}
      <header className="sticky top-0 z-20 grid h-12 grid-cols-[1fr_auto_1fr] items-center border-b border-border-subtle bg-background px-4">
        <div className="justify-self-start">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/demo/lista">
              <ArrowLeft className="size-4" strokeWidth={1.5} />
              Volver
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-text-primary">Nueva orden</span>
          <span className="hidden font-mono text-xs text-text-tertiary sm:inline">
            {NEXT_FOLIO}
          </span>
        </div>
        <div className="flex items-center gap-2 justify-self-end">
          <Button variant="outline" size="sm" asChild>
            <Link href="/demo/lista">Cancelar</Link>
          </Button>
          <Button size="sm" onClick={save}>
            Guardar
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[960px] px-6 pt-10 pb-24">
        {/* Pasos como tiles con estado */}
        <ol className="grid grid-cols-3 gap-3">
          {STEPS.map((s) => {
            const state: 'done' | 'current' | 'pending' =
              s.n === step ? 'current' : s.n < step ? 'done' : 'pending';
            const stepValid = s.n === 1 ? valid1 : s.n === 2 ? valid2 : valid1 && valid2;
            const showError = touched[s.n] && !stepValid && s.n !== 3;
            return (
              <li key={s.n}>
                <button
                  type="button"
                  onClick={() => goTo(s.n)}
                  aria-current={state === 'current' ? 'step' : undefined}
                  className={cn(
                    'flex w-full cursor-pointer items-start gap-3 rounded-lg border bg-card p-4 text-left transition-colors duration-150 outline-none focus-visible:shadow-focus motion-reduce:transition-none',
                    state === 'current'
                      ? 'border-border-strong'
                      : 'border-border-subtle hover:bg-row-hover',
                  )}
                >
                  <span
                    className={cn(
                      'grid size-6 shrink-0 place-items-center rounded-full text-xs font-medium tabular-nums',
                      state === 'done' && stepValid && 'bg-success-subtle text-success-text',
                      state === 'current' && 'bg-foreground text-background',
                      state === 'pending' && 'bg-bg-elevated text-text-secondary',
                      showError && 'bg-danger-subtle text-danger-text',
                    )}
                  >
                    {state === 'done' && stepValid && !showError ? (
                      <Check className="size-3.5" strokeWidth={2} />
                    ) : (
                      s.n
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-text-primary">{s.label}</span>
                    <span
                      className={cn(
                        'block truncate text-xs',
                        showError ? 'text-danger-text' : 'text-text-tertiary',
                      )}
                    >
                      {showError ? 'Faltan datos' : s.hint}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div
          key={step}
          className="mt-8 space-y-6 animate-in fade-in-0 slide-in-from-bottom-1 duration-300 ease-out motion-reduce:animate-none"
        >
          {step === 1 && (
            <>
              <SettingsCard
                title="Identidad de la orden"
                description="Cómo se llama y de qué tipo es. El folio se asigna al guardar."
                footer="Puedes cambiar el tipo después desde la ficha."
                footerAction={
                  <Button variant="outline" size="sm" onClick={() => continueFrom(1)}>
                    Continuar
                  </Button>
                }
              >
                <Field
                  label="Título"
                  htmlFor="focused-title"
                  required
                  error={touched[1] ? errors1.title : undefined}
                >
                  <Input
                    id="focused-title"
                    value={draft.title}
                    onChange={(e) => patch({ title: e.target.value })}
                    placeholder="Ej. Cambio de bomba de agua"
                    className="bg-bg-surface"
                    autoFocus
                    aria-invalid={touched[1] && Boolean(errors1.title)}
                  />
                </Field>
                <Field label="Tipo" required error={touched[1] ? errors1.kind : undefined}>
                  <div
                    className="flex flex-wrap gap-2"
                    role="radiogroup"
                    aria-label="Tipo de orden"
                  >
                    {ORDER_KIND_LIST.map((k) => {
                      const active = draft.kind === k;
                      const Icon = ORDER_KIND[k].icon;
                      return (
                        <button
                          key={k}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => patch({ kind: k })}
                          className={cn(
                            'inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors outline-none focus-visible:shadow-focus',
                            active
                              ? 'border-border-strong bg-bg-elevated font-medium text-text-primary'
                              : 'border-border-subtle bg-bg-surface text-text-secondary hover:text-text-primary',
                          )}
                        >
                          <Icon className="size-4 text-text-tertiary" strokeWidth={1.5} />
                          {ORDER_KIND[k].label}
                        </button>
                      );
                    })}
                  </div>
                </Field>
              </SettingsCard>

              <SettingsCard
                title="Cliente y ubicación"
                description="Para quién es la orden y dónde se ejecuta."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Cliente"
                    htmlFor="focused-client"
                    required
                    error={touched[1] ? errors1.clientId : undefined}
                  >
                    <Select value={draft.clientId} onValueChange={(v) => patch({ clientId: v })}>
                      <SelectTrigger
                        id="focused-client"
                        className="w-full bg-bg-surface"
                        aria-invalid={touched[1] && Boolean(errors1.clientId)}
                      >
                        <SelectValue placeholder="Elige un cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {CLIENTS.map((c) => (
                          <SelectItem key={c.id} value={c.id} textValue={c.name}>
                            <Avatar name={c.name} size={20} square={c.kind === 'empresa'} />
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field
                    label="Responsable"
                    htmlFor="focused-assignee"
                    required
                    error={touched[1] ? errors1.assigneeId : undefined}
                  >
                    <Select
                      value={draft.assigneeId}
                      onValueChange={(v) => patch({ assigneeId: v })}
                    >
                      <SelectTrigger
                        id="focused-assignee"
                        className="w-full bg-bg-surface"
                        aria-invalid={touched[1] && Boolean(errors1.assigneeId)}
                      >
                        <SelectValue placeholder="Elige un responsable" />
                      </SelectTrigger>
                      <SelectContent>
                        {USERS.map((u) => (
                          <SelectItem key={u.id} value={u.id} textValue={u.name}>
                            <Avatar name={u.name} size={20} />
                            {u.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

                {/* Sub-sección en acordeón: dirección en campos separados (nunca un textarea). */}
                <div className="-mb-2 border-t border-border-subtle">
                  <DisclosureRow
                    title="Dirección del servicio"
                    summary={address || 'Opcional · se toma la del cliente'}
                    triggerClassName="px-0"
                  >
                    <div className="grid gap-4 pb-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                      <Field label="Calle" htmlFor="focused-street">
                        <Input
                          id="focused-street"
                          value={draft.street}
                          onChange={(e) => patch({ street: e.target.value })}
                          className="bg-bg-surface"
                        />
                      </Field>
                      <Field label="Número" htmlFor="focused-number">
                        <Input
                          id="focused-number"
                          value={draft.number}
                          onChange={(e) => patch({ number: e.target.value })}
                          className="bg-bg-surface"
                        />
                      </Field>
                      <Field label="Colonia" htmlFor="focused-neighborhood">
                        <Input
                          id="focused-neighborhood"
                          value={draft.neighborhood}
                          onChange={(e) => patch({ neighborhood: e.target.value })}
                          className="bg-bg-surface"
                        />
                      </Field>
                      <Field label="Código postal" htmlFor="focused-zip">
                        <Input
                          id="focused-zip"
                          inputMode="numeric"
                          maxLength={5}
                          value={draft.zip}
                          onChange={(e) => patch({ zip: e.target.value.replace(/\D/g, '') })}
                          className="bg-bg-surface tabular-nums"
                        />
                      </Field>
                    </div>
                  </DisclosureRow>
                </div>
              </SettingsCard>
            </>
          )}

          {step === 2 && (
            <>
              <SettingsCard
                title="Partidas"
                description="Conceptos con cantidad y precio unitario. El total se calcula solo."
                footer={
                  <span className="tabular-nums">
                    Total {formatCurrency(total)}
                    {touched[2] && errors2.items && (
                      <span className="ml-2 text-danger-text">· {errors2.items}</span>
                    )}
                  </span>
                }
                footerAction={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const id = nextItemId.current++;
                      patch({
                        items: [...draft.items, { id, concept: '', qty: '1', unitPrice: '' }],
                      });
                    }}
                  >
                    <Plus className="size-3.5" strokeWidth={1.5} />
                    Agregar partida
                  </Button>
                }
              >
                {draft.items.length === 0 ? (
                  <p className="text-sm text-text-tertiary">
                    Sin partidas. Agrega la primera abajo.
                  </p>
                ) : (
                  <div className="space-y-2">
                    <div className="hidden grid-cols-[minmax(0,1fr)_88px_128px_112px_32px] gap-2 text-xs text-text-tertiary sm:grid">
                      <span>Concepto</span>
                      <span>Cantidad</span>
                      <span>Precio unitario</span>
                      <span className="text-right">Importe</span>
                      <span />
                    </div>
                    {draft.items.map((it) => (
                      <div
                        key={it.id}
                        className="grid grid-cols-[minmax(0,1fr)_32px] gap-2 sm:grid-cols-[minmax(0,1fr)_88px_128px_112px_32px]"
                      >
                        <Input
                          value={it.concept}
                          onChange={(e) =>
                            patch({
                              items: draft.items.map((x) =>
                                x.id === it.id ? { ...x, concept: e.target.value } : x,
                              ),
                            })
                          }
                          placeholder="Concepto"
                          aria-label="Concepto"
                          className="bg-bg-surface"
                        />
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Quitar partida"
                          className="text-text-tertiary hover:text-text-primary sm:order-last"
                          onClick={() =>
                            patch({ items: draft.items.filter((x) => x.id !== it.id) })
                          }
                        >
                          <Trash2 className="size-4" strokeWidth={1.5} />
                        </Button>
                        <Input
                          type="number"
                          inputMode="decimal"
                          min={0}
                          value={it.qty}
                          onChange={(e) =>
                            patch({
                              items: draft.items.map((x) =>
                                x.id === it.id ? { ...x, qty: e.target.value } : x,
                              ),
                            })
                          }
                          placeholder="1"
                          aria-label="Cantidad"
                          className="bg-bg-surface tabular-nums"
                        />
                        <Input
                          type="number"
                          inputMode="decimal"
                          min={0}
                          step="0.01"
                          value={it.unitPrice}
                          onChange={(e) =>
                            patch({
                              items: draft.items.map((x) =>
                                x.id === it.id ? { ...x, unitPrice: e.target.value } : x,
                              ),
                            })
                          }
                          placeholder="0.00"
                          aria-label="Precio unitario"
                          className="bg-bg-surface tabular-nums"
                        />
                        <span className="flex h-9 items-center justify-end text-sm font-medium text-text-primary tabular-nums">
                          {formatCurrency(itemAmount(it))}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </SettingsCard>

              <SettingsCard
                title="Fechas"
                description="Inicio estimado y fecha límite de entrega."
                footer="Los recordatorios llegan al responsable."
                footerAction={
                  <Button variant="outline" size="sm" onClick={() => continueFrom(2)}>
                    Continuar
                  </Button>
                }
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Inicio" htmlFor="focused-start">
                    <Input
                      id="focused-start"
                      type="date"
                      value={draft.startAt}
                      onChange={(e) => patch({ startAt: e.target.value })}
                      className="bg-bg-surface"
                    />
                  </Field>
                  <Field
                    label="Fecha límite"
                    htmlFor="focused-due"
                    required
                    error={touched[2] ? errors2.dueAt : undefined}
                  >
                    <Input
                      id="focused-due"
                      type="date"
                      min={DEMO_TODAY}
                      value={draft.dueAt}
                      onChange={(e) => patch({ dueAt: e.target.value })}
                      className="bg-bg-surface"
                      aria-invalid={touched[2] && Boolean(errors2.dueAt)}
                    />
                  </Field>
                </div>
                <div className="-mb-2 border-t border-border-subtle">
                  <DisclosureRow
                    title="Recordatorios"
                    badge={
                      <span className="rounded-sm bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                        Opcional
                      </span>
                    }
                    triggerClassName="px-0"
                  >
                    <div className="divide-y divide-border-subtle pb-2">
                      <ToggleRow
                        label="Un día antes de la fecha límite"
                        checked={draft.remindDayBefore}
                        onChange={(v) => patch({ remindDayBefore: v })}
                      />
                      <ToggleRow
                        label="Resumen semanal mientras esté abierta"
                        checked={draft.remindWeekly}
                        onChange={(v) => patch({ remindWeekly: v })}
                      />
                    </div>
                  </DisclosureRow>
                </div>
              </SettingsCard>
            </>
          )}

          {step === 3 && (
            <>
              {/* Tile resumen de confirmación */}
              <section className="overflow-hidden rounded-lg border bg-card">
                <div className="flex flex-col gap-4 px-6 py-5">
                  <div>
                    <h2 className="text-base font-semibold text-foreground">Resumen</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Así quedará la orden. Puedes volver a cualquier paso para corregir.
                    </p>
                  </div>
                  <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                    <PanelField label="Título">{draft.title || '—'}</PanelField>
                    <PanelField label="Tipo">
                      {draft.kind ? ORDER_KIND[draft.kind].label : '—'}
                    </PanelField>
                    <PanelField label="Cliente">
                      {draft.clientId ? clientName(draft.clientId) : '—'}
                    </PanelField>
                    <PanelField label="Responsable">
                      {USERS.find((u) => u.id === draft.assigneeId)?.name ?? '—'}
                    </PanelField>
                    <PanelField label="Dirección">{address || 'La del cliente'}</PanelField>
                    <PanelField label="Fechas">
                      <span className="tabular-nums">
                        {draft.startAt ? formatDate(draft.startAt) : '—'} →{' '}
                        {draft.dueAt ? formatDate(draft.dueAt) : '—'}
                      </span>
                    </PanelField>
                    <PanelField label="Partidas">
                      {draft.items.length} {draft.items.length === 1 ? 'partida' : 'partidas'}
                    </PanelField>
                    <PanelField label="Total">
                      <span className="text-2xl font-semibold tracking-tight tabular-nums">
                        {formatCurrency(total)}
                      </span>
                    </PanelField>
                  </dl>
                </div>
                <div className="flex min-h-12 items-center justify-between gap-4 border-t bg-muted/30 px-6 py-2.5">
                  <span className="text-[13px] text-muted-foreground">
                    {valid1 && valid2
                      ? 'Todo listo. Guarda con el botón de arriba.'
                      : 'Faltan datos en los pasos anteriores.'}
                  </span>
                  <span className="font-mono text-xs text-text-tertiary">{NEXT_FOLIO}</span>
                </div>
              </section>

              <SettingsCard
                title="Notas internas"
                badge="Opcional"
                description="No se muestran al cliente ni salen en el acta."
              >
                <Textarea
                  value={draft.notes}
                  onChange={(e) => patch({ notes: e.target.value })}
                  placeholder="Instrucciones para la cuadrilla, accesos, horarios…"
                  className="min-h-24 bg-bg-surface"
                  aria-label="Notas internas"
                />
              </SettingsCard>
            </>
          )}
        </div>
      </main>
    </>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  const id = React.useId();
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <label htmlFor={id} className="cursor-pointer text-sm text-text-primary">
        {label}
      </label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
