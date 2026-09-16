'use client';

/**
 * M6 · Alta en drawer: `Sheet sm:max-w-xl` (card flotante) con header fijo,
 * body scrolleable de `FormCard`s (Hero · ¿Dónde? · Fechas · ¿Quién? ·
 * Vincular con `AddOnTile` → `AddOnBlock`) y footer fijo [Cancelar] outline +
 * [Crear orden] negro. react-hook-form + Zod; el body se monta keyed al abrir
 * para resetear sin `useEffect`.
 */

import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarDays, Link2, MapPin, NotebookPen, Receipt, UserRound } from 'lucide-react';

import {
  AddOnBlock,
  AddOnTile,
  CHIP_ACTIVE,
  CHIP_CLASS,
  CHIP_IDLE,
  CONTROL_CLASS,
  Field,
  FormCard,
  SELECT_CLASS,
  TEXTAREA_CLASS,
} from '@/components/shared/FormPrimitives';
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import { CLIENTS, DEMO_TODAY, ORDER_KIND, ORDER_KIND_LIST, USERS } from './data';

const FORM_ID = 'new-order-form';

const Schema = z.object({
  title: z.string().trim().min(3, 'Escribe un título de al menos 3 caracteres'),
  kind: z.enum(ORDER_KIND_LIST, { message: 'Elige el tipo de orden' }),
  clientId: z.string().min(1, 'Elige un cliente'),
  location: z.string().trim().max(80, 'Máximo 80 caracteres').optional(),
  startAt: z.string().optional(),
  dueAt: z.string().min(1, 'Indica la fecha límite'),
  assigneeId: z.string().min(1, 'Elige un responsable'),
  budget: z.string().optional(),
  notes: z.string().optional(),
});

export type NewOrderDraft = z.infer<typeof Schema>;

type AddOn = 'budget' | 'notes';

export function NewOrderSheet({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (draft: NewOrderDraft) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="gap-0 sm:max-w-xl">
        <SheetHeader className="border-b border-border-subtle px-6 py-4 pr-12">
          <SheetTitle className="text-base font-semibold">Nueva orden</SheetTitle>
          <SheetDescription>
            Captura lo esencial; el resto se completa desde la ficha.
          </SheetDescription>
        </SheetHeader>

        {open && (
          <NewOrderForm
            key="new"
            onSubmit={(draft) => {
              onCreate(draft);
              onOpenChange(false);
            }}
          />
        )}

        <SheetFooter className="flex-row items-center justify-end gap-2 border-t border-border-subtle px-6 py-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" form={FORM_ID}>
            Crear orden
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function NewOrderForm({ onSubmit }: { onSubmit: (draft: NewOrderDraft) => void }) {
  const [addOns, setAddOns] = React.useState<AddOn[]>([]);
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<NewOrderDraft>({
    resolver: zodResolver(Schema),
    defaultValues: {
      title: '',
      clientId: '',
      location: '',
      startAt: DEMO_TODAY,
      dueAt: '',
      assigneeId: '',
      budget: '',
      notes: '',
    },
  });

  function removeAddOn(key: AddOn) {
    setAddOns((prev) => prev.filter((k) => k !== key));
    setValue(key, '');
  }

  return (
    <form
      id={FORM_ID}
      onSubmit={handleSubmit(onSubmit)}
      className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5"
      noValidate
    >
      {/* Hero: sin título, el título de la orden hace de encabezado. */}
      <FormCard>
        <Field label="Título de la orden" required error={errors.title?.message}>
          <Input
            {...register('title')}
            placeholder="Ej. Cambio de bomba de agua"
            className={cn(CONTROL_CLASS, 'bg-bg-base')}
            autoFocus
            aria-invalid={Boolean(errors.title)}
          />
        </Field>
        <Field label="Tipo" required error={errors.kind?.message}>
          <Controller
            control={control}
            name="kind"
            render={({ field }) => (
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Tipo de orden">
                {ORDER_KIND_LIST.map((k) => {
                  const active = field.value === k;
                  const Icon = ORDER_KIND[k].icon;
                  return (
                    <button
                      key={k}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => field.onChange(k)}
                      className={cn(
                        CHIP_CLASS,
                        'inline-flex items-center gap-2 outline-none focus-visible:shadow-focus',
                        active ? CHIP_ACTIVE : CHIP_IDLE,
                      )}
                    >
                      <Icon className="size-4 text-text-tertiary" strokeWidth={1.5} />
                      {ORDER_KIND[k].label}
                    </button>
                  );
                })}
              </div>
            )}
          />
        </Field>
      </FormCard>

      <FormCard icon={MapPin} title="¿Dónde?" hint="Cliente y lugar del servicio">
        <Field label="Cliente" required error={errors.clientId?.message}>
          <Controller
            control={control}
            name="clientId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  className={cn(SELECT_CLASS, 'bg-bg-base')}
                  aria-invalid={Boolean(errors.clientId)}
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
            )}
          />
        </Field>
        <Field
          label="Ubicación"
          hint="Unidad, local o dirección corta"
          error={errors.location?.message}
        >
          <Input
            {...register('location')}
            placeholder="Ej. Casa Itzimná · cocina"
            className={cn(CONTROL_CLASS, 'bg-bg-base')}
          />
        </Field>
      </FormCard>

      <FormCard icon={CalendarDays} title="Fechas" hint="Inicio estimado y fecha límite">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Inicio">
            <Input
              type="date"
              {...register('startAt')}
              className={cn(CONTROL_CLASS, 'bg-bg-base')}
            />
          </Field>
          <Field label="Fecha límite" required error={errors.dueAt?.message}>
            <Input
              type="date"
              {...register('dueAt')}
              min={DEMO_TODAY}
              className={cn(CONTROL_CLASS, 'bg-bg-base')}
              aria-invalid={Boolean(errors.dueAt)}
            />
          </Field>
        </div>
      </FormCard>

      <FormCard icon={UserRound} title="¿Quién?" hint="Responsable de ejecutar la orden">
        <Field label="Responsable" required error={errors.assigneeId?.message}>
          <Controller
            control={control}
            name="assigneeId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  className={cn(SELECT_CLASS, 'bg-bg-base')}
                  aria-invalid={Boolean(errors.assigneeId)}
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
            )}
          />
        </Field>
      </FormCard>

      <FormCard icon={Link2} title="Vincular" hint="Opcionales que se agregan solo si hacen falta">
        <div className="grid gap-3 sm:grid-cols-2">
          {addOns.includes('budget') ? (
            <AddOnBlock
              title="Presupuesto"
              hint="Monto estimado en MXN"
              onRemove={() => removeAddOn('budget')}
            >
              <Input
                type="number"
                inputMode="decimal"
                min={0}
                step="0.01"
                {...register('budget')}
                placeholder="0.00"
                className={cn(CONTROL_CLASS, 'bg-bg-base tabular-nums')}
              />
            </AddOnBlock>
          ) : (
            <AddOnTile
              icon={Receipt}
              label="Presupuesto"
              onClick={() => setAddOns((prev) => [...prev, 'budget'])}
            />
          )}
          {addOns.includes('notes') ? (
            <AddOnBlock
              title="Nota interna"
              hint="No se muestra al cliente"
              onRemove={() => removeAddOn('notes')}
            >
              <Textarea
                {...register('notes')}
                placeholder="Instrucciones para la cuadrilla…"
                className={cn(TEXTAREA_CLASS, 'min-h-20 bg-bg-base')}
              />
            </AddOnBlock>
          ) : (
            <AddOnTile
              icon={NotebookPen}
              label="Nota interna"
              onClick={() => setAddOns((prev) => [...prev, 'notes'])}
            />
          )}
        </div>
      </FormCard>
    </form>
  );
}
