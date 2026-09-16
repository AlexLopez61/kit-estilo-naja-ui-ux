'use client';

/**
 * QuickFormModal — formulario corto (1-2 campos): "agregar categoría rápida",
 * "renombrar", etc. Sin cards de sección: el body son los campos directos.
 *
 * Genérico: recibe `fields` y construye el schema Zod en runtime. Autofocus en
 * el primer campo; Enter envía (submit del form), Esc cierra (Dialog).
 */

import * as React from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { type LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NajaModal } from '@/components/ui/naja-modal';

export type QuickField = {
  name: string;
  label: string;
  placeholder?: string;
  /** Default `true`. Si es `false`, el campo es opcional. */
  required?: boolean;
  defaultValue?: string;
};

type Values = Record<string, string>;

export function QuickFormModal({
  open,
  onOpenChange,
  title,
  description,
  icon,
  fields,
  submitLabel = 'Guardar',
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  icon?: LucideIcon;
  /** 1-2 campos. */
  fields: QuickField[];
  submitLabel?: string;
  onSubmit?: (values: Values) => void;
}) {
  return (
    <NajaModal
      open={open}
      onOpenChange={onOpenChange}
      icon={icon}
      title={title}
      description={description}
      size="sm"
      headerAlign="center"
      footerMuted
      footer={
        <>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" form="quick-form">
            {submitLabel}
          </Button>
        </>
      }
    >
      {open && <FormBody fields={fields} onSubmit={onSubmit} onClose={() => onOpenChange(false)} />}
    </NajaModal>
  );
}

function FormBody({
  fields,
  onSubmit,
  onClose,
}: {
  fields: QuickField[];
  onSubmit?: (values: Values) => void;
  onClose: () => void;
}) {
  const schema = React.useMemo(
    () =>
      z.object(
        Object.fromEntries(
          fields.map((f) => [
            f.name,
            f.required === false
              ? z.string().trim().optional()
              : z.string().trim().min(1, `${f.label} es obligatorio`),
          ]),
        ),
      ),
    [fields],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema) as Resolver<Values>,
    defaultValues: Object.fromEntries(fields.map((f) => [f.name, f.defaultValue ?? ''])),
  });

  function submit(values: Values) {
    onSubmit?.(values);
    onClose();
  }

  return (
    <form id="quick-form" onSubmit={handleSubmit(submit)} className="space-y-4">
      {fields.map((field, i) => (
        <div key={field.name} className="space-y-1">
          <Label htmlFor={`quick-${field.name}`} className="text-muted-foreground">
            {field.label}
            {field.required !== false && <span className="ml-0.5 text-brand-text">*</span>}
          </Label>
          <Input
            id={`quick-${field.name}`}
            {...register(field.name)}
            placeholder={field.placeholder}
            autoFocus={i === 0}
            aria-invalid={Boolean(errors[field.name])}
            className="bg-bg-base"
          />
          {errors[field.name] && (
            <p className="text-xs text-destructive" role="alert">
              {String(errors[field.name]?.message)}
            </p>
          )}
        </div>
      ))}
    </form>
  );
}
