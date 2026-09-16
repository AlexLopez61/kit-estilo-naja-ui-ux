'use client';

import * as React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Building2,
  CalendarDays,
  FileText,
  FolderPlus,
  Home,
  Info,
  Link2,
  MapPin,
  MoreHorizontal,
  Plus,
  Receipt,
  RotateCcw,
  Sparkles,
  Trash2,
  User,
  UserPlus,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { NajaModal } from '@/components/ui/naja-modal';
import { SegmentedControl } from '@/components/ui/segmented-control';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import {
  ConfirmDeleteModal,
  DetailModal,
  LogoUploader,
  QuickFormModal,
  WizardModal,
  type WizardStep,
} from '@/components/modals';
import { DETAIL_CARD_CLASS, IconCircle } from '@/components/shared/DetailCard';
import {
  AddOnBlock,
  AddOnTile,
  CHIP_ACTIVE,
  CHIP_CLASS,
  CHIP_IDLE,
  CONTROL_CLASS,
  Field as DrawerField,
  FormCard,
  SELECT_CLASS,
  TEXTAREA_CLASS,
} from '@/components/shared/FormPrimitives';
import { Field, StepCard } from '@/components/shared/StepCard';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';
import { cn } from '@/lib/utils';
import { CopyJSXButton } from '../_components/CopyJSXButton';
import { Section } from '../_components/Section';
import { Subsection } from '../_components/Subsection';

/**
 * Modales y drawers del sistema (02-moldes M6, M8 y M9).
 *
 * - Todo modal de formulario pasa por `NajaModal` con el lenguaje Vercel:
 *   `headerAlign="center"` (chip circular + título + descripción), `footerMuted`
 *   (banda gris con Cancelar outline + primaria negra) y cuerpo con `StepCard`
 *   numeradas cuyos inputs van recesados en `bg-bg-base`.
 * - El destructivo NO usa `NajaModal`: `ConfirmDeleteModal` vive sobre
 *   `AlertDialog` (rol `alertdialog`, sin cierre por clic fuera).
 * - Los drawers (`Sheet` de Radix o `Drawer` de vaul) son cards flotantes con
 *   8 px de margen; el consumidor solo pasa `sm:max-w-*`.
 *
 * `glassHeader` / `glassFooter` son legado y no aparecen aquí.
 */
export function ModalsSection() {
  return (
    <Section
      id="modals"
      title="Modales y drawers"
      description="Todo modal de formulario es un NajaModal con el lenguaje Vercel (chip circular, StepCards numeradas, footer en banda gris con una sola primaria negra). Lo destructivo va sobre AlertDialog. Los drawers son cards flotantes con 8 px de margen. Cada demo abre desde su botón; nada persiste."
    >
      <Subsection
        id="modal-formulario"
        title="11.1 M8 · Modal de formulario"
        caption="Referencia canónica: NajaModal headerAlign=center, size=xl, footerMuted. El body es un <form id> con tres StepCards (la primera incluye LogoUploader) y el botón del footer lo envía con form=…; el body se monta con key para resetear sin useEffect y el estado pending sube al padre para que el footer lo refleje."
      >
        <FormModalDemo />
      </Subsection>

      <Subsection
        id="modal-confirmacion"
        title="11.2 Contexto de solo lectura y desglose"
        caption="Modal de confirmación (size=md): el contexto va en filas-card outline (divide-y rounded-lg border, chip + label + valor a la derecha) y el dinero en una tabla Concepto / Monto con fila total. Al confirmar, el flujo termina dentro del modal con el estado de éxito."
      >
        <ConfirmChargeDemo />
      </Subsection>

      <Subsection
        id="modal-exito"
        title="11.3 Estado de éxito dentro del modal"
        caption="Círculo que escala (200 ms) + palomita que se dibuja (300 ms) + texto que sube (250 ms). Es el cierre de un flujo que termina en el modal (cobro, pago). Sin bounce ni elastic; respeta reduced motion."
      >
        <SuccessStateDemo />
      </Subsection>

      <Subsection
        id="modal-confirm-delete"
        title="11.4 M9 · Modal destructivo"
        caption="ConfirmDeleteModal sobre AlertDialog: título en pregunta, descripción con lo que se pierde, requireTypedConfirmation para lo irreversible, isLoading durante la acción y toast al terminar. El botón que lo abre es ghost o vive en el menú ⋯; nunca es la primaria."
      >
        <ConfirmDeleteDemo />
      </Subsection>

      <Subsection
        id="modal-quick-form"
        title="11.5 QuickFormModal"
        caption="Captura de uno o dos campos (agregar categoría, renombrar). Sin cards de sección: autofocus en el primer campo y Enter envía."
      >
        <QuickFormDemo />
      </Subsection>

      <Subsection
        id="modal-detail"
        title="11.6 DetailModal"
        caption="Lectura de una ficha con avatar y secciones de pares label / valor. Editar es un callback que abre el formulario correspondiente."
      >
        <DetailDemo />
      </Subsection>

      <Subsection
        id="modal-wizard"
        title="11.7 WizardModal"
        caption="Pasos con validez por paso, stepper en el header y transición corta entre pasos. Es el único caso con dismissable=false (ni Esc ni clic fuera cierran; el × sigue disponible)."
      >
        <WizardDemo />
      </Subsection>

      <Subsection
        id="drawer-alta"
        title="11.8 M6 · Alta en drawer (Sheet)"
        caption="Sheet sm:max-w-xl con header fijo, body con FormCards de nivel 0 (surface + borde sutil, sin sombra), opciones excluyentes como chips y opcionales plegados como AddOnTile; footer fijo con Cancelar outline y primaria negra."
      >
        <SheetDrawerDemo />
      </Subsection>

      <Subsection
        id="drawer-vaul"
        title="11.9 Drawer (vaul) equivalente"
        caption="Mismo chrome flotante y misma anatomía con el Drawer de vaul (direction=right). Se usa cuando hace falta gesto de arrastre; en escritorio ambos se ven idénticos."
      >
        <VaulDrawerDemo />
      </Subsection>

      <Subsection
        id="modal-naja-props"
        title="11.10 NajaModal · props y anti-patrones"
        caption="El wrapper que compone el chrome compartido. Lo marcado como legado existe por compatibilidad y no se usa en pantallas nuevas."
      >
        <NajaModalProps />
      </Subsection>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Helpers compartidos por los demos
// ---------------------------------------------------------------------------

function delay(ms: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, ms));
}

type ContextRow = {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
};

/** Filas-card outline: contexto de solo lectura dentro de un modal (M8). */
function ContextRows({ rows }: { rows: ContextRow[] }) {
  return (
    <div className="divide-y divide-border rounded-lg border bg-card">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center gap-3 px-4 py-3">
          <IconCircle icon={row.icon} tone={row.tone} />
          <span className="min-w-0 flex-1 text-sm text-muted-foreground">{row.label}</span>
          <span className="text-right text-sm font-medium text-foreground">{row.value}</span>
        </div>
      ))}
    </div>
  );
}

/** Tabla Concepto / Monto con fila total (desglose de dinero dentro de un modal). */
function BreakdownTable({
  lines,
  total,
}: {
  lines: { concept: string; amount: number }[];
  total: number;
}) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="h-9 text-xs text-muted-foreground">
            <th className="px-4 text-left font-normal">Concepto</th>
            <th className="px-4 text-right font-normal">Monto</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border border-t">
          {lines.map((line) => (
            <tr key={line.concept}>
              <td className="px-4 py-2.5 text-foreground">{line.concept}</td>
              <td className="px-4 py-2.5 text-right tabular-nums text-foreground">
                {formatCurrency(line.amount)}
              </td>
            </tr>
          ))}
          <tr className="bg-muted/30 font-semibold">
            <td className="px-4 py-2.5 text-foreground">Total</td>
            <td className="px-4 py-2.5 text-right tabular-nums text-foreground">
              {formatCurrency(total)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/** Estado de éxito: círculo que escala + palomita que se dibuja + texto que sube. */
function SuccessCheck({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center py-6 text-center">
      <span className="animate-charge-pop flex size-14 items-center justify-center rounded-full bg-success-subtle motion-reduce:animate-none">
        <svg
          viewBox="0 0 24 24"
          className="size-7 text-success-text"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path
            d="M5 12.5l4.5 4.5L19 7.5"
            className="animate-charge-draw motion-reduce:animate-none"
          />
        </svg>
      </span>
      <p className="animate-charge-fade-up mt-4 text-base font-semibold text-foreground motion-reduce:animate-none">
        {title}
      </p>
      {description && (
        <p className="animate-charge-fade-up mt-1 text-sm text-muted-foreground motion-reduce:animate-none">
          {description}
        </p>
      )}
    </div>
  );
}

function RuleNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex max-w-2xl items-start gap-2 rounded-lg border border-border-subtle bg-bg-surface px-4 py-3 text-sm text-text-secondary">
      <Info className="mt-0.5 size-4 shrink-0 text-text-tertiary" strokeWidth={1.5} />
      <span>{children}</span>
    </p>
  );
}

// 11.1 ----------------------------------------------------------------------

const NEW_CLIENT_FORM_ID = 'new-client-form';

const M8_JSX = `<NajaModal
  open={open}
  onOpenChange={setOpen}
  icon={UserPlus}
  headerAlign="center"
  size="xl"
  footerMuted
  title="Nuevo cliente"
  description="Captura los datos básicos; la ficha se completa después."
  footer={
    <>
      <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
      <Button type="submit" form="new-client-form" disabled={pending}>
        {pending ? <><Spinner />Guardando…</> : 'Crear cliente'}
      </Button>
    </>
  }
>
  {open && <NewClientFormBody key={id ?? 'new'} onSubmit={handleSubmit} />}
</NajaModal>

// Body: <form id="new-client-form"> con StepCard step={n} title hint
//   └── <Field label required error> → <Input className="bg-bg-base" />`;

const clientSchema = z.object({
  name: z.string().trim().min(2, 'Escribe al menos 2 caracteres'),
  kind: z.enum(['persona', 'empresa']),
  phone: z.string().trim(),
  email: z.string().trim(),
  street: z.string().trim(),
  number: z.string().trim(),
  neighborhood: z.string().trim(),
  zip: z
    .string()
    .trim()
    .refine((v) => v === '' || /^\d{5}$/.test(v), 'Código postal de 5 dígitos'),
});

type ClientValues = z.infer<typeof clientSchema>;

function FormModalDemo() {
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);

  async function handleSubmit(values: ClientValues) {
    setPending(true);
    await delay(900);
    setPending(false);
    setOpen(false);
    toast.success(`Cliente creado: ${values.name}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button onClick={() => setOpen(true)}>
        <UserPlus strokeWidth={1.5} />
        Nuevo cliente
      </Button>
      <CopyJSXButton code={M8_JSX} label="Copiar receta M8" />

      <NajaModal
        open={open}
        onOpenChange={(next) => {
          if (!pending) setOpen(next);
        }}
        icon={UserPlus}
        headerAlign="center"
        size="xl"
        footerMuted
        title="Nuevo cliente"
        description="Captura los datos básicos; la ficha se completa después."
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" form={NEW_CLIENT_FORM_ID} disabled={pending}>
              {pending ? (
                <>
                  <Spinner />
                  Guardando…
                </>
              ) : (
                'Crear cliente'
              )}
            </Button>
          </>
        }
      >
        {/* Keyed por registro: 'new' en alta, el id en edición. Resetea sin useEffect. */}
        {open && <NewClientFormBody key="new" onSubmit={handleSubmit} />}
      </NajaModal>
    </div>
  );
}

function NewClientFormBody({ onSubmit }: { onSubmit: (values: ClientValues) => Promise<void> }) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<ClientValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: '',
      kind: 'persona',
      phone: '',
      email: '',
      street: '',
      number: '',
      neighborhood: '',
      zip: '',
    },
  });
  const kind = useWatch({ control, name: 'kind' });

  return (
    <form id={NEW_CLIENT_FORM_ID} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <StepCard step={1} title="Identidad" hint="Cómo aparecerá en listas y documentos.">
        <div className="flex gap-4">
          <LogoUploader label="Foto" hint="JPG · PNG" />
          <div className="min-w-0 flex-1 space-y-3">
            <Field label="Nombre" required error={errors.name?.message}>
              <Input
                {...register('name')}
                placeholder="Ej. María Pérez"
                autoFocus
                aria-invalid={Boolean(errors.name)}
                className="bg-bg-base"
              />
            </Field>
            <Field label="Tipo">
              <SegmentedControl
                variant="tint"
                aria-label="Tipo de cliente"
                value={kind}
                onChange={(v) => setValue('kind', v)}
                options={[
                  { value: 'persona', label: 'Persona', icon: User },
                  { value: 'empresa', label: 'Empresa', icon: Building2 },
                ]}
              />
            </Field>
          </div>
        </div>
      </StepCard>

      <StepCard
        step={2}
        title="Contacto"
        hint="Opcional. Sirve para recordatorios y envío de cotizaciones."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Teléfono">
            <Input
              {...register('phone')}
              inputMode="tel"
              placeholder="999 000 0000"
              className="bg-bg-base"
            />
          </Field>
          <Field label="Correo">
            <Input
              {...register('email')}
              type="email"
              placeholder="nombre@dominio.mx"
              className="bg-bg-base"
            />
          </Field>
        </div>
      </StepCard>

      <StepCard step={3} title="Dirección" hint="Campos separados; nunca un solo textarea.">
        <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
          <Field label="Calle">
            <Input {...register('street')} placeholder="Calle 60" className="bg-bg-base" />
          </Field>
          <Field label="Número">
            <Input {...register('number')} placeholder="480" className="bg-bg-base" />
          </Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-[1fr_140px]">
          <Field label="Colonia">
            <Input {...register('neighborhood')} placeholder="Centro" className="bg-bg-base" />
          </Field>
          <Field label="Código postal" error={errors.zip?.message}>
            <Input
              {...register('zip')}
              inputMode="numeric"
              placeholder="97000"
              aria-invalid={Boolean(errors.zip)}
              className="bg-bg-base tabular-nums"
            />
          </Field>
        </div>
      </StepCard>
    </form>
  );
}

// 11.2 ----------------------------------------------------------------------

const CHARGE_LINES = [
  { concept: 'Renta de agosto', amount: 12500 },
  { concept: 'Cuota de mantenimiento', amount: 850 },
];
const CHARGE_TOTAL = CHARGE_LINES.reduce((sum, line) => sum + line.amount, 0);

function ConfirmChargeDemo() {
  const [open, setOpen] = React.useState(false);
  const [phase, setPhase] = React.useState<'review' | 'done'>('review');
  const [pending, setPending] = React.useState(false);

  function handleOpenChange(next: boolean) {
    if (pending) return;
    setOpen(next);
    if (next) setPhase('review');
  }

  async function confirm() {
    setPending(true);
    await delay(800);
    setPending(false);
    setPhase('done');
  }

  const done = phase === 'done';

  return (
    <>
      <Button variant="outline" onClick={() => handleOpenChange(true)}>
        <Receipt strokeWidth={1.5} />
        Registrar cobro
      </Button>

      <NajaModal
        open={open}
        onOpenChange={handleOpenChange}
        icon={Receipt}
        headerAlign="center"
        size="md"
        footerMuted
        title={done ? 'Cobro registrado' : 'Confirmar cobro'}
        description={done ? undefined : 'Revisa el contexto antes de registrar el ingreso.'}
        footer={
          done ? (
            <Button type="button" onClick={() => setOpen(false)}>
              Listo
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                disabled={pending}
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="button" disabled={pending} onClick={confirm}>
                {pending ? (
                  <>
                    <Spinner />
                    Registrando…
                  </>
                ) : (
                  'Registrar cobro'
                )}
              </Button>
            </>
          )
        }
      >
        {done ? (
          <SuccessCheck
            title="Cobro registrado"
            description={`${formatCurrency(CHARGE_TOTAL)} · Casa Cardín · Depto 101`}
          />
        ) : (
          <div className="space-y-4">
            <ContextRows
              rows={[
                { icon: User, label: 'Inquilino', value: 'Carla Mendoza' },
                { icon: Home, label: 'Unidad', value: 'Casa Cardín · Depto 101' },
                {
                  icon: FileText,
                  label: 'Pagaré',
                  value: <span className="font-mono text-xs">PAG-2026-041 · 4 de 12</span>,
                },
                {
                  icon: CalendarDays,
                  label: 'Fecha de cobro',
                  value: <span className="tabular-nums">{formatDate('2026-08-01')}</span>,
                  tone: 'info',
                },
              ]}
            />
            <BreakdownTable lines={CHARGE_LINES} total={CHARGE_TOTAL} />
          </div>
        )}
      </NajaModal>
    </>
  );
}

// 11.3 ----------------------------------------------------------------------

function SuccessStateDemo() {
  const [run, setRun] = React.useState(0);
  return (
    <div className="max-w-md space-y-3">
      <div className="rounded-xl border border-border bg-background px-6 py-2 shadow-lg">
        <SuccessCheck
          key={run}
          title="Cobro registrado"
          description={`${formatCurrency(CHARGE_TOTAL)} · Casa Cardín · Depto 101`}
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => setRun((r) => r + 1)}>
          <RotateCcw strokeWidth={1.5} />
          Repetir animación
        </Button>
        <p className="text-xs text-text-tertiary">
          animate-charge-pop · animate-charge-draw · animate-charge-fade-up (globals.css)
        </p>
      </div>
    </div>
  );
}

// 11.4 ----------------------------------------------------------------------

function ConfirmDeleteDemo() {
  const [simple, setSimple] = React.useState(false);
  const [typed, setTyped] = React.useState(false);
  const [loadingOpen, setLoadingOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  // AlertDialogAction cierra en el mismo clic que dispara onConfirm; el ref
  // bloquea ese cierre mientras la acción está en curso.
  const loadingRef = React.useRef(false);

  async function deleteWithLoading() {
    loadingRef.current = true;
    setLoading(true);
    await delay(1200);
    loadingRef.current = false;
    setLoading(false);
    setLoadingOpen(false);
    toast.success('Proveedor eliminado');
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="ghost" onClick={() => setSimple(true)}>
        <Trash2 strokeWidth={1.5} />
        Eliminar
      </Button>
      <Button variant="ghost" onClick={() => setTyped(true)}>
        <Trash2 strokeWidth={1.5} />
        Eliminar con confirmación por texto
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="Más acciones">
            <MoreHorizontal strokeWidth={1.5} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-52 shadow-lg">
          <DropdownMenuItem>Editar</DropdownMenuItem>
          <DropdownMenuItem>Duplicar</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={() => setLoadingOpen(true)}>
            <Trash2 strokeWidth={1.5} />
            Eliminar (con isLoading)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDeleteModal
        open={simple}
        onOpenChange={setSimple}
        title="¿Eliminar proveedor?"
        description="Se eliminará Ferretería del Centro y sus vínculos a materiales. Esta acción es permanente."
        confirmLabel="Eliminar proveedor"
        onConfirm={() => {
          toast.success('Proveedor eliminado');
        }}
      />
      <ConfirmDeleteModal
        open={typed}
        onOpenChange={setTyped}
        title="¿Eliminar proveedor?"
        description="Se perderán los precios y documentos asociados. Escribe el nombre para confirmar."
        requireTypedConfirmation="Ferretería del Centro"
        confirmLabel="Eliminar proveedor"
        onConfirm={() => {
          toast.success('Proveedor eliminado');
        }}
      />
      <ConfirmDeleteModal
        open={loadingOpen}
        onOpenChange={(next) => {
          if (!loadingRef.current) setLoadingOpen(next);
        }}
        title="¿Eliminar proveedor?"
        description="Se eliminará Ferretería del Centro. El botón muestra el progreso mientras la acción termina."
        confirmLabel="Eliminar proveedor"
        isLoading={loading}
        onConfirm={deleteWithLoading}
      />
    </div>
  );
}

// 11.5 ----------------------------------------------------------------------

function QuickFormDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <FolderPlus strokeWidth={1.5} />
        Agregar categoría
      </Button>
      <QuickFormModal
        open={open}
        onOpenChange={setOpen}
        icon={FolderPlus}
        title="Nueva categoría"
        description="Se usará al clasificar proveedores y materiales."
        fields={[{ name: 'name', label: 'Nombre de la categoría', placeholder: 'Ej. Plomería' }]}
        onSubmit={(values) => toast.success(`Categoría creada: ${values.name}`)}
      />
    </>
  );
}

// 11.6 ----------------------------------------------------------------------

function DetailDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Ver ficha de proveedor
      </Button>

      <DetailModal
        open={open}
        onOpenChange={setOpen}
        name="Ferretería del Centro"
        kind="empresa"
        category="Mayorista"
        onEdit={() => {
          setOpen(false);
          toast('Editar abre el modal de formulario (M8) con la ficha precargada.');
        }}
        sections={[
          {
            title: 'Contacto',
            rows: [
              { label: 'Persona', value: 'Luis Canul' },
              { label: 'Teléfono', value: <span className="tabular-nums">999 123 4567</span> },
              { label: 'Correo', value: 'ventas@ferreteriacentro.mx' },
            ],
          },
          {
            title: 'Ubicación',
            rows: [
              { label: 'Dirección', value: 'Calle 60 #480, Centro' },
              { label: 'Ciudad', value: 'Mérida, Yucatán' },
              { label: 'Código postal', value: <span className="tabular-nums">97000</span> },
            ],
          },
          {
            title: 'Notas',
            rows: [
              {
                label: 'Internas',
                value: `Entrega a domicilio sin costo en pedidos mayores a ${formatCurrency(2000)}.`,
              },
            ],
          },
        ]}
      />
    </>
  );
}

// 11.7 ----------------------------------------------------------------------

function WizardDemo() {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');

  const steps: WizardStep[] = [
    {
      title: 'Datos',
      isValid: name.trim().length > 0,
      content: (
        <StepCard title="Proveedor" hint="Siguiente se habilita al capturar el nombre.">
          <Field label="Nombre del proveedor" required>
            <Input
              id="wizard-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Ferretería del Centro"
              className="bg-bg-base"
            />
          </Field>
        </StepCard>
      ),
    },
    {
      title: 'Contacto',
      content: (
        <StepCard title="Contacto" hint="Opcional.">
          <Field label="Teléfono">
            <Input
              id="wizard-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="tel"
              placeholder="999 000 0000"
              className="bg-bg-base"
            />
          </Field>
        </StepCard>
      ),
    },
    {
      title: 'Confirmar',
      content: (
        <ContextRows
          rows={[
            { icon: Building2, label: 'Proveedor', value: name || '—' },
            {
              icon: User,
              label: 'Teléfono',
              value: <span className="tabular-nums">{phone || 'Sin teléfono'}</span>,
            },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Sparkles strokeWidth={1.5} />
        Iniciar alta guiada
      </Button>
      <WizardModal
        open={open}
        onOpenChange={setOpen}
        icon={Sparkles}
        title="Alta guiada de proveedor"
        steps={steps}
        onFinish={() => toast.success('Proveedor dado de alta')}
      />
    </>
  );
}

// 11.8 y 11.9 ---------------------------------------------------------------

const M6_JSX = `<Sheet open={open} onOpenChange={setOpen}>
  <SheetContent side="right" className="gap-0 sm:max-w-xl">
    <SheetHeader className="shrink-0 border-b border-border px-6 py-4 pr-12">
      <SheetTitle className="text-base font-semibold">Nueva orden de trabajo</SheetTitle>
      <SheetDescription>Se crea en borrador; puedes asignarla después.</SheetDescription>
    </SheetHeader>
    <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
      {open && <OrderFormBody key="new" formId="new-order" onSubmit={…} />}
    </div>
    <SheetFooter className="shrink-0 flex-row justify-end gap-2 border-t border-border px-6 py-4">
      <SheetClose asChild><Button variant="outline">Cancelar</Button></SheetClose>
      <Button type="submit" form="new-order">Crear orden</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>

// Body: <form id="new-order"> con FormCard icon title hint (nivel 0)
//   ├── <Field label required hint> → <Input className={CONTROL_CLASS} />
//   ├── chips CHIP_CLASS + CHIP_ACTIVE / CHIP_IDLE para opciones excluyentes
//   └── <AddOnTile /> → <AddOnBlock /> para opcionales plegados`;

const PROPERTIES = ['Casa Cardín', 'Casa Montejo', 'Local Itzimná'];
const PROJECTS = ['Pintura fachada Casa Montejo', 'Plomería baño principal'];
const PEOPLE = ['María Pérez', 'Juan Hernández', 'Roberto García'];
const QUOTES = ['COT-001 · Casa Montejo', 'COT-007 · Casa Tulum'];

/** Cuerpo del alta de orden (M6): compartido por el Sheet y el Drawer. */
function OrderFormBody({ formId, onSubmit }: { formId: string; onSubmit: () => void }) {
  const [where, setWhere] = React.useState<'propiedad' | 'proyecto'>('propiedad');
  const [withOwner, setWithOwner] = React.useState(false);
  const [withQuote, setWithQuote] = React.useState(false);

  const places = where === 'propiedad' ? PROPERTIES : PROJECTS;

  return (
    <form
      id={formId}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-4"
    >
      <FormCard>
        <DrawerField label="Título" required>
          <Input
            className={CONTROL_CLASS}
            placeholder="Ej. Cambio de lámparas en pasillo"
            autoFocus
          />
        </DrawerField>
        <DrawerField label="Descripción" hint="Qué hay que hacer y detalles para quien la ejecuta.">
          <Textarea className={TEXTAREA_CLASS} rows={3} placeholder="Describe el trabajo…" />
        </DrawerField>
      </FormCard>

      <FormCard
        icon={MapPin}
        title="¿Dónde?"
        hint="Elige el lugar; el proyecto manda sobre la unidad."
      >
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Lugar">
          {(
            [
              { value: 'propiedad', label: 'Propiedad', icon: Home },
              { value: 'proyecto', label: 'Proyecto', icon: FileText },
            ] as const
          ).map((option) => {
            const active = where === option.value;
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setWhere(option.value)}
                className={cn(
                  CHIP_CLASS,
                  'inline-flex items-center gap-2 outline-none focus-visible:shadow-focus',
                  active ? CHIP_ACTIVE : CHIP_IDLE,
                )}
              >
                <Icon className="size-4 text-text-tertiary" strokeWidth={1.5} />
                {option.label}
              </button>
            );
          })}
        </div>
        <DrawerField label={where === 'propiedad' ? 'Propiedad' : 'Proyecto'} required>
          <Select key={where}>
            <SelectTrigger className={SELECT_CLASS}>
              <SelectValue placeholder="Selecciona…" />
            </SelectTrigger>
            <SelectContent>
              {places.map((place) => (
                <SelectItem key={place} value={place}>
                  {place}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </DrawerField>
      </FormCard>

      <FormCard
        icon={CalendarDays}
        title="Fechas"
        hint="Opcional. La fecha límite alimenta los recordatorios."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <DrawerField label="Inicio">
            <Input type="date" className={cn(CONTROL_CLASS, 'tabular-nums')} />
          </DrawerField>
          <DrawerField label="Fecha límite">
            <Input type="date" className={cn(CONTROL_CLASS, 'tabular-nums')} />
          </DrawerField>
        </div>
      </FormCard>

      <FormCard
        icon={Link2}
        title="Vincular"
        hint="Opcionales plegados: el slot punteado se convierte en bloque al agregarlo."
      >
        <div className="grid items-start gap-3 sm:grid-cols-2">
          {withOwner ? (
            <AddOnBlock title="Responsable" onRemove={() => setWithOwner(false)}>
              <Select>
                <SelectTrigger className={SELECT_CLASS}>
                  <SelectValue placeholder="Selecciona…" />
                </SelectTrigger>
                <SelectContent>
                  {PEOPLE.map((person) => (
                    <SelectItem key={person} value={person}>
                      {person}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </AddOnBlock>
          ) : (
            <AddOnTile
              icon={Users}
              label="Agregar responsable"
              onClick={() => setWithOwner(true)}
            />
          )}
          {withQuote ? (
            <AddOnBlock
              title="Cotización"
              hint="Una orden amparada por cotización no cobra por separado."
              onRemove={() => setWithQuote(false)}
            >
              <Select>
                <SelectTrigger className={SELECT_CLASS}>
                  <SelectValue placeholder="Selecciona…" />
                </SelectTrigger>
                <SelectContent>
                  {QUOTES.map((quote) => (
                    <SelectItem key={quote} value={quote}>
                      {quote}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </AddOnBlock>
          ) : (
            <AddOnTile
              icon={FileText}
              label="Agregar cotización"
              onClick={() => setWithQuote(true)}
            />
          )}
        </div>
      </FormCard>
    </form>
  );
}

function SheetDrawerDemo() {
  const [open, setOpen] = React.useState(false);
  const formId = 'new-order-sheet';

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => setOpen(true)}>
          <Plus strokeWidth={1.5} />
          Nueva orden
        </Button>
        <CopyJSXButton code={M6_JSX} label="Copiar receta M6" />
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="gap-0 sm:max-w-xl">
          <SheetHeader className="shrink-0 border-b border-border px-6 py-4 pr-12">
            <SheetTitle className="text-base font-semibold">Nueva orden de trabajo</SheetTitle>
            <SheetDescription>
              Se crea en borrador; puedes asignarla y programarla después.
            </SheetDescription>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            {open && (
              <OrderFormBody
                key="sheet"
                formId={formId}
                onSubmit={() => {
                  setOpen(false);
                  toast.success('Orden creada');
                }}
              />
            )}
          </div>
          <SheetFooter className="shrink-0 flex-row justify-end gap-2 border-t border-border px-6 py-4">
            <SheetClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </SheetClose>
            <Button type="submit" form={formId}>
              Crear orden
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <RuleNote>
        La primitiva fija el chrome: card flotante con 8 px de margen (inset-y-2 right-2),
        rounded-xl, borde y shadow-lg. El consumidor solo pasa sm:max-w-md (formularios),
        sm:max-w-xl (fichas) o sm:max-w-2xl (resúmenes); nunca w-full, que rompería el margen en
        móvil.
      </RuleNote>
    </div>
  );
}

function VaulDrawerDemo() {
  const [open, setOpen] = React.useState(false);
  const formId = 'new-order-drawer';

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Plus strokeWidth={1.5} />
        Nueva orden (vaul)
      </Button>

      <Drawer direction="right" open={open} onOpenChange={setOpen}>
        <DrawerContent className="sm:max-w-xl">
          <DrawerHeader className="shrink-0 border-b border-border px-6 py-4 text-left">
            <DrawerTitle className="text-base">Nueva orden de trabajo</DrawerTitle>
            <DrawerDescription>
              Se crea en borrador; puedes asignarla y programarla después.
            </DrawerDescription>
          </DrawerHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            {open && (
              <OrderFormBody
                key="drawer"
                formId={formId}
                onSubmit={() => {
                  setOpen(false);
                  toast.success('Orden creada');
                }}
              />
            )}
          </div>
          <DrawerFooter className="shrink-0 flex-row justify-end gap-2 border-t border-border px-6 py-4">
            <DrawerClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DrawerClose>
            <Button type="submit" form={formId}>
              Crear orden
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

// 11.10 ---------------------------------------------------------------------

const PROPS: { name: string; type: string; desc: string; legacy?: boolean }[] = [
  { name: 'open / onOpenChange', type: 'boolean / fn', desc: 'Estado controlado del modal.' },
  {
    name: 'headerAlign',
    type: "'start' | 'center'",
    desc: 'center = lenguaje Vercel: chip circular + título + descripción centrados. Es el estándar.',
  },
  {
    name: 'footerMuted',
    type: 'boolean',
    desc: 'Footer en banda bg-muted/30 con borde superior. Va siempre con headerAlign=center.',
  },
  { name: 'icon', type: 'LucideIcon', desc: 'Icono del chip del header.' },
  {
    name: 'iconTone',
    type: "'brand' | 'danger'",
    desc: 'Tono del cuadro del icono en headerAlign=start. El chip centrado es neutro.',
  },
  {
    name: 'leading',
    type: 'ReactNode',
    desc: 'Reemplaza el chip del icono (ej. avatar en DetailModal).',
  },
  { name: 'title / description', type: 'ReactNode', desc: 'Encabezado. Sentence case, text-lg.' },
  {
    name: 'headerAddon',
    type: 'ReactNode',
    desc: 'Extra bajo el título (ej. stepper del wizard).',
  },
  {
    name: 'footer',
    type: 'ReactNode',
    desc: 'Acciones ancladas al pie: Cancelar outline + una primaria negra. Sin footer no se renderiza.',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'",
    desc: '384 · 448 · 512 · 672 · 768 · 896 px. Default lg.',
  },
  {
    name: 'dismissable',
    type: 'boolean',
    desc: 'Cierre por Esc / clic fuera. Default true; false solo en wizards.',
  },
  { name: 'showClose', type: 'boolean', desc: 'Botón × del header. Default true.' },
  {
    name: 'bodyClassName / className',
    type: 'string',
    desc: 'Clases extra para el body scrolleable y para el contenedor.',
  },
  {
    name: 'glassHeader / glassFooter',
    type: 'boolean',
    desc: 'Legado (liquid glass con backdrop-blur). No usar en pantallas nuevas.',
    legacy: true,
  },
];

const AVOID = [
  'Dialog crudo con overrides de tokens en cada modal.',
  'glassHeader / glassFooter (blur y degradado) fuera del panel de ficha.',
  'Títulos en mayúsculas o Title Case; eyebrows uppercase en las secciones.',
  'Un tercer tono dentro del modal: solo piso bg-background y cards bg-card / inputs bg-bg-base.',
  'w-full en Sheet o Drawer; la primitiva ya fija el ancho y el margen.',
  'Primaria de color en el footer o dos primarias visibles a la vez.',
];

function NajaModalProps() {
  return (
    <div className="max-w-3xl space-y-6">
      <div className={cn(DETAIL_CARD_CLASS, 'overflow-hidden')}>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="h-9 border-b border-border-subtle text-xs text-text-tertiary">
              <th className="px-4 font-normal">Prop</th>
              <th className="px-4 font-normal">Tipo</th>
              <th className="px-4 font-normal">Descripción</th>
            </tr>
          </thead>
          <tbody>
            {PROPS.map((prop) => (
              <tr key={prop.name} className="border-b border-border-subtle last:border-0">
                <td className="px-4 py-2.5 align-top font-mono text-xs text-text-primary">
                  {prop.name}
                </td>
                <td className="px-4 py-2.5 align-top font-mono text-xs text-text-secondary">
                  {prop.type}
                </td>
                <td className="px-4 py-2.5 align-top text-text-secondary">
                  {prop.legacy && (
                    <span className="mr-1.5 rounded-sm bg-warning-subtle px-1.5 py-0.5 text-xs text-warning-text">
                      legado
                    </span>
                  )}
                  {prop.desc}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-text-primary">Así no</p>
        <ul className="space-y-1.5">
          {AVOID.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
              <X className="mt-0.5 size-4 shrink-0 text-danger-text" strokeWidth={1.5} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
