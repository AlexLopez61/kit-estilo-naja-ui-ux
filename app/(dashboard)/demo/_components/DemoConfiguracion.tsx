'use client';

/**
 * M10 · Página de configuración (`/demo/configuracion`): `PageHeader` con
 * migaja (permitido aquí), tres `SettingsCard` apiladas: Datos generales
 * (inputs, única primaria negra «Guardar»), Catálogo (tabla compacta de
 * shadcn + «Agregar» en el footer strip que abre un M8 con `StepCard`) y
 * Zona de peligro (M9 con confirmación escrita).
 */

import * as React from 'react';
import { MoreHorizontal, Pencil, Plus, Tag, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { PageContainer } from '@/components/patterns/PageContainer';
import { PageHeader } from '@/components/patterns/PageHeader';
import { ConfirmDeleteModal } from '@/components/modals/ConfirmDeleteModal';
import { Field as SettingsField, SettingsCard } from '@/components/shared/SettingsCard';
import { Field, StepCard } from '@/components/shared/StepCard';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { NajaModal } from '@/components/ui/naja-modal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { ORDER_TYPES, type OrderTypeRow } from './data';

const TYPE_FORM_ID = 'order-type-form';

export function DemoConfiguracion() {
  const [types, setTypes] = React.useState<OrderTypeRow[]>(ORDER_TYPES);
  const [editing, setEditing] = React.useState<OrderTypeRow | null>(null);
  const [typeModalOpen, setTypeModalOpen] = React.useState(false);
  const [deleteType, setDeleteType] = React.useState<OrderTypeRow | null>(null);
  const [wipeOpen, setWipeOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  function openNew() {
    setEditing(null);
    setTypeModalOpen(true);
  }

  function openEdit(row: OrderTypeRow) {
    setEditing(row);
    setTypeModalOpen(true);
  }

  function saveType(values: { name: string; key: string }) {
    if (editing) {
      setTypes((prev) => prev.map((t) => (t.id === editing.id ? { ...t, ...values } : t)));
      toast.success(`Tipo «${values.name}» actualizado`);
    } else {
      setTypes((prev) => [
        ...prev,
        { id: `type-${values.key.toLowerCase()}-${prev.length + 1}`, ...values, count: 0 },
      ]);
      toast.success(`Tipo «${values.name}» agregado`);
    }
    setTypeModalOpen(false);
  }

  function confirmDeleteType() {
    if (!deleteType) return;
    setBusy(true);
    window.setTimeout(() => {
      setTypes((prev) => prev.filter((t) => t.id !== deleteType.id));
      toast.success(`Tipo «${deleteType.name}» eliminado`);
      setBusy(false);
      setDeleteType(null);
    }, 450);
  }

  function confirmWipe() {
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      setWipeOpen(false);
      toast.success('Espacio de trabajo eliminado (simulado)');
    }, 600);
  }

  return (
    <PageContainer>
      <PageHeader
        breadcrumb={[{ label: 'Sistema' }, { label: 'Configuración' }]}
        title="Configuración"
        description="Datos de la empresa, catálogos cerrados y acciones sensibles. Solo el admin ve esta página."
      />

      <div className="space-y-6">
        <SettingsCard
          title="Datos generales"
          description="Identidad de la empresa tal como aparece en documentos y PDFs."
          footer="Los cambios aplican a los documentos nuevos."
          footerAction={
            <Button size="sm" onClick={() => toast.success('Datos generales guardados')}>
              Guardar
            </Button>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <SettingsField label="Nombre comercial" htmlFor="company-name">
              <Input id="company-name" defaultValue="Servicios Kit" className="bg-bg-surface" />
            </SettingsField>
            <SettingsField label="RFC" htmlFor="company-rfc">
              <Input
                id="company-rfc"
                defaultValue="SKI240101AB1"
                className="bg-bg-surface font-mono"
              />
            </SettingsField>
            <SettingsField label="Correo de contacto" htmlFor="company-email">
              <Input
                id="company-email"
                type="email"
                defaultValue="hola@ejemplo.com"
                className="bg-bg-surface"
              />
            </SettingsField>
            <SettingsField label="Teléfono" htmlFor="company-phone" hint="10 dígitos, sin espacios">
              <Input
                id="company-phone"
                type="tel"
                inputMode="tel"
                defaultValue="9991234567"
                className="bg-bg-surface tabular-nums"
              />
            </SettingsField>
          </div>
        </SettingsCard>

        <SettingsCard
          title="Tipos de orden"
          description="Catálogo cerrado: define qué clases de orden puede capturar el equipo."
          footer={`${types.length} ${types.length === 1 ? 'tipo' : 'tipos'} · la clave se usa en reportes`}
          footerAction={
            <Button variant="outline" size="sm" onClick={openNew}>
              <Plus className="size-3.5" strokeWidth={1.5} />
              Agregar
            </Button>
          }
        >
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-9 px-0 text-xs font-normal text-text-tertiary">
                  Nombre
                </TableHead>
                <TableHead className="h-9 text-xs font-normal text-text-tertiary">Clave</TableHead>
                <TableHead className="h-9 text-right text-xs font-normal text-text-tertiary">
                  Órdenes
                </TableHead>
                <TableHead className="h-9 w-10 px-0">
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {types.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="h-10 px-0 font-medium text-text-primary">
                    {t.name}
                  </TableCell>
                  <TableCell className="h-10">
                    <span className="font-mono text-xs text-text-secondary">{t.key}</span>
                  </TableCell>
                  <TableCell className="h-10 text-right text-text-secondary tabular-nums">
                    {t.count}
                  </TableCell>
                  <TableCell className="h-10 px-0 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-xs" aria-label={`Acciones de ${t.name}`}>
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem onSelect={() => openEdit(t)}>
                          <Pencil />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onSelect={() => setDeleteType(t)}>
                          <Trash2 />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SettingsCard>

        <SettingsCard
          title="Zona de peligro"
          description="Acciones irreversibles sobre todo el espacio de trabajo."
          footer="Se pedirá escribir el nombre del espacio para confirmar."
          footerAction={
            <Button
              variant="outline"
              size="sm"
              className="text-danger-text hover:text-danger-text"
              onClick={() => setWipeOpen(true)}
            >
              <Trash2 className="size-3.5" strokeWidth={1.5} />
              Eliminar espacio de trabajo
            </Button>
          }
        >
          <p className="text-sm text-text-secondary">
            Borra órdenes, clientes, movimientos y archivos de{' '}
            <span className="font-medium">kit-demo</span>. Los usuarios conservan su cuenta.
          </p>
        </SettingsCard>
      </div>

      {/* M8 · alta / edición de tipo */}
      <NajaModal
        open={typeModalOpen}
        onOpenChange={setTypeModalOpen}
        size="sm"
        headerAlign="center"
        footerMuted
        icon={Tag}
        title={editing ? 'Editar tipo de orden' : 'Nuevo tipo de orden'}
        description="Aparece como opción al crear una orden."
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => setTypeModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" form={TYPE_FORM_ID}>
              {editing ? 'Guardar cambios' : 'Agregar tipo'}
            </Button>
          </>
        }
      >
        {typeModalOpen && (
          <OrderTypeForm
            key={editing?.id ?? 'new'}
            initial={editing}
            taken={types.filter((t) => t.id !== editing?.id).map((t) => t.key.toUpperCase())}
            onSubmit={saveType}
          />
        )}
      </NajaModal>

      {/* M9 · borrar un tipo */}
      <ConfirmDeleteModal
        open={deleteType !== null}
        onOpenChange={(o) => {
          if (!o && !busy) setDeleteType(null);
        }}
        title="¿Eliminar este tipo?"
        description={
          deleteType
            ? deleteType.count > 0
              ? `«${deleteType.name}» se usa en ${deleteType.count} ${deleteType.count === 1 ? 'orden' : 'órdenes'}; esas órdenes quedarán sin tipo.`
              : `«${deleteType.name}» no se usa en ninguna orden.`
            : undefined
        }
        confirmLabel="Eliminar tipo"
        onConfirm={confirmDeleteType}
        isLoading={busy}
      />

      {/* M9 · irreversible con confirmación escrita */}
      <ConfirmDeleteModal
        open={wipeOpen}
        onOpenChange={(o) => {
          if (!busy) setWipeOpen(o);
        }}
        title="¿Eliminar el espacio de trabajo?"
        description="Se borran todas las órdenes, clientes, movimientos y archivos. No hay forma de recuperarlos."
        confirmLabel="Eliminar todo"
        requireTypedConfirmation="kit-demo"
        onConfirm={confirmWipe}
        isLoading={busy}
      />
    </PageContainer>
  );
}

function OrderTypeForm({
  initial,
  taken,
  onSubmit,
}: {
  initial: OrderTypeRow | null;
  taken: string[];
  onSubmit: (values: { name: string; key: string }) => void;
}) {
  const [name, setName] = React.useState(initial?.name ?? '');
  const [key, setKey] = React.useState(initial?.key ?? '');
  const [touched, setTouched] = React.useState(false);

  const nameError =
    name.trim().length < 2 ? 'Escribe un nombre de al menos 2 caracteres' : undefined;
  const cleanKey = key.trim().toUpperCase();
  const keyError = !/^[A-Z]{2,5}$/.test(cleanKey)
    ? 'De 2 a 5 letras, sin espacios'
    : taken.includes(cleanKey)
      ? 'Esa clave ya existe'
      : undefined;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (nameError || keyError) return;
    onSubmit({ name: name.trim(), key: cleanKey });
  }

  return (
    <form id={TYPE_FORM_ID} onSubmit={submit} noValidate className="space-y-4">
      <StepCard step={1} title="Datos del tipo" hint="Nombre visible y clave corta">
        <Field label="Nombre" required error={touched ? nameError : undefined}>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Garantía"
            className="bg-bg-base"
            autoFocus
            aria-invalid={touched && Boolean(nameError)}
          />
        </Field>
        <Field
          label="Clave"
          required
          hint="Se usa en reportes y folios"
          error={touched ? keyError : undefined}
        >
          <Input
            value={key}
            onChange={(e) => setKey(e.target.value.toUpperCase())}
            placeholder="GAR"
            maxLength={5}
            className="bg-bg-base font-mono"
            aria-invalid={touched && Boolean(keyError)}
          />
        </Field>
      </StepCard>
    </form>
  );
}
