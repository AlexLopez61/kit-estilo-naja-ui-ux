'use client';

import * as React from 'react';
import {
  AlertTriangle,
  FileText,
  MessageSquareText,
  MoreHorizontal,
  Pencil,
  Plus,
  Receipt,
  RefreshCw,
  User,
  type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NajaModal } from '@/components/ui/naja-modal';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { EmptyState } from '@/components/patterns/EmptyState';
import { ActionErrorAlert, type ActionAlertState } from '@/components/shared/ActionErrorAlert';
import { DETAIL_CARD_CLASS, IconCircle } from '@/components/shared/DetailCard';
import { ProgressRing } from '@/components/shared/ProgressRing';
import { RatingRing, RatingValue } from '@/components/shared/RatingRing';
import { StarRating } from '@/components/shared/StarRating';
import { Field, StepCard } from '@/components/shared/StepCard';
import { CONCURRENCY_CONFLICT_MESSAGE } from '@/lib/concurrency';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';
import { cn } from '@/lib/utils';
import { Section } from '../_components/Section';
import { Subsection } from '../_components/Subsection';

/**
 * Estados (02-moldes M11 y 01-sistema §6.4): vacío con `EmptyState`, carga
 * con `Skeleton` (nunca spinner en listas), spinner solo dentro de un botón,
 * toasts reales de sonner, `ActionErrorAlert` bajo el formulario (genérico y
 * conflicto de concurrencia), progreso y calificación, y el patrón de
 * permisos: alternativa visible en vez de botón deshabilitado.
 */
export function StatesSection() {
  return (
    <Section
      id="states"
      title="Estados"
      description="Vacío, cargando, error y progreso tal como los muestra la app: EmptyState dentro de la card, Skeleton con la silueta real (nunca spinner en listas), spinner solo en el botón que ejecuta, toasts de sonner, ActionErrorAlert bajo el formulario y, en permisos, una alternativa visible en lugar de un botón deshabilitado."
    >
      <Subsection
        id="estado-vacio"
        title="5.1 Vacío (EmptyState)"
        caption="min-h-[400px], icono en círculo, título, descripción y una sola acción. Dentro de una card de lista (M1) ocupa el cuerpo de la card. variant=error pinta el círculo en destructive/10 y ofrece Reintentar."
      >
        <EmptyStateDemo />
      </Subsection>

      <Subsection
        id="loading-states"
        title="5.2 Cargando (Skeleton)"
        caption="Skeleton en bg-bg-elevated con animate-pulse y la silueta exacta del contenido para que no salte el layout: lista de M1 y panel de ficha (M3). Un panel que solo cambia de filtro conserva el contenido anterior; el skeleton aparece solo con key nueva."
      >
        <SkeletonDemo />
      </Subsection>

      <Subsection
        id="spinner"
        title="5.3 Spinner solo en botón"
        caption="El spinner vive dentro del botón que ejecuta la acción, con el label en gerundio, mientras dura la espera. Nunca como estado de carga de una lista o un panel."
      >
        <SpinnerButtonDemo />
      </Subsection>

      <Subsection
        id="toasts"
        title="5.4 Toasts (sonner)"
        caption="Toasts reales: siguen resolvedTheme, mensajes en español, abajo a la derecha. Para confirmar acciones que terminaron y para errores fuera de un formulario; con acción cuando hay deshacer."
      >
        <ToastDemo />
      </Subsection>

      <Subsection
        id="action-error-alert"
        title="5.5 Error de acción y concurrencia (ActionErrorAlert)"
        caption="Bajo el formulario, con la causa en español. El conflicto de concurrencia (VersionField con updated_at) se distingue en ámbar con «Recargar» (recarga esta página). Los errores de campo se muestran junto a cada campo, no aquí."
      >
        <ActionErrorDemo />
      </Subsection>

      <Subsection
        id="progress"
        title="5.6 Progreso y calificación"
        caption="Progress h-1.5 (neutro por defecto; tono semántico solo cuando el avance es un estado), ProgressRing con el número dentro, RatingRing / RatingValue de cinco segmentos y StarRating de solo lectura."
      >
        <ProgressDemo />
      </Subsection>

      <Subsection
        id="permisos"
        title="5.7 Permisos: alternativa, no deshabilitado"
        caption="Lo que un rol no puede hacer no se renderiza. Si existe alternativa se muestra en su lugar: el coordinador no edita registros financieros, así que ve «Solicitar corrección» (modal M8 con el registro en filas-card y un textarea). Nunca un botón deshabilitado sin alternativa."
      >
        <PermissionsDemo />
      </Subsection>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function delay(ms: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, ms));
}

function LabeledBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-text-tertiary">{label}</p>
      {children}
    </div>
  );
}

/** Skeleton con la superficie del sistema (bg-bg-elevated). */
function Bone({ className }: { className?: string }) {
  return <Skeleton className={cn('bg-bg-elevated', className)} />;
}

// 5.1 ------------------------------------------------------------------------

function EmptyStateDemo() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className={DETAIL_CARD_CLASS}>
        <EmptyState
          icon={<FileText strokeWidth={1.5} />}
          title="Aún no hay cotizaciones"
          description="Crea la primera para empezar a dar seguimiento al pipeline."
          action={
            <Button>
              <Plus strokeWidth={1.5} />
              Nueva cotización
            </Button>
          }
        />
      </div>
      <div className={DETAIL_CARD_CLASS}>
        <EmptyState
          variant="error"
          icon={<AlertTriangle strokeWidth={1.5} />}
          title="No se pudieron cargar los cobros"
          description="Ocurrió un error al consultar la información. Verifica tu conexión e inténtalo de nuevo."
          action={
            <Button variant="outline" onClick={() => toast('Reintentando…')}>
              <RefreshCw strokeWidth={1.5} />
              Reintentar
            </Button>
          }
        />
      </div>
    </div>
  );
}

// 5.2 ------------------------------------------------------------------------

function ListSkeleton() {
  return (
    <div className={cn(DETAIL_CARD_CLASS, 'overflow-hidden')}>
      <div className="flex h-9 items-center gap-3 border-b border-border-subtle px-4">
        <Bone className="h-2 w-24" />
        <Bone className="h-2 w-16" />
        <Bone className="ml-auto h-2 w-12" />
      </div>
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          className="flex min-h-16 items-center gap-3 border-b border-border-subtle px-4 last:border-0"
        >
          <Bone className="size-8 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Bone className="h-3 w-1/3" />
            <Bone className="h-2.5 w-1/2" />
          </div>
          <Bone className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

/** Silueta del panel de ficha (M3): hero plano sobre el gris, tile con sombra, rejilla y sub-card. */
function PanelSkeleton() {
  return (
    <div className="rounded-lg bg-bg-elevated p-4 shadow-md dark:border dark:border-border-card">
      <div className="rounded-lg bg-bg-surface p-4 dark:border dark:border-border-card">
        <div className="flex items-center gap-3">
          <Bone className="size-8 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Bone className="h-3 w-2/5" />
            <Bone className="h-2.5 w-1/4" />
          </div>
          <Bone className="h-5 w-16 rounded-sm" />
        </div>
        <div className="mt-4 rounded-lg bg-bg-surface p-4 shadow-md dark:border dark:border-border-card">
          <Bone className="h-2.5 w-20" />
          <Bone className="mt-2 h-7 w-32" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="space-y-1.5">
              <Bone className="h-2 w-1/2" />
              <Bone className="h-3 w-3/4" />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 rounded-lg bg-bg-surface p-4 dark:border dark:border-border-card">
        <Bone className="h-3 w-24" />
        <Bone className="mt-3 h-2.5 w-full" />
        <Bone className="mt-2 h-2.5 w-5/6" />
      </div>
    </div>
  );
}

function SkeletonDemo() {
  return (
    <div className="grid max-w-5xl gap-5 lg:grid-cols-[1fr_380px]">
      <LabeledBlock label="Lista (M1)">
        <ListSkeleton />
      </LabeledBlock>
      <LabeledBlock label="Panel de ficha (M3)">
        <PanelSkeleton />
      </LabeledBlock>
    </div>
  );
}

// 5.3 ------------------------------------------------------------------------

function SpinnerButtonDemo() {
  const [pending, setPending] = React.useState(false);

  async function save() {
    setPending(true);
    await delay(1500);
    setPending(false);
    toast.success('Cambios guardados');
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button onClick={save} disabled={pending}>
        {pending ? (
          <>
            <Spinner />
            Guardando…
          </>
        ) : (
          'Guardar cambios'
        )}
      </Button>
      <Button variant="outline" disabled={pending}>
        Cancelar
      </Button>
    </div>
  );
}

// 5.4 ------------------------------------------------------------------------

function ToastDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        onClick={() =>
          toast.success('Cobro registrado', {
            description: `PAG-2026-041 · ${formatCurrency(12500)}`,
          })
        }
      >
        Éxito
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.error('No se pudo guardar el gasto', {
            description: 'Falta la asignación a un proyecto.',
          })
        }
      >
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast('Cotización archivada', {
            action: { label: 'Deshacer', onClick: () => toast.success('Cotización restaurada') },
          })
        }
      >
        Con acción
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.promise(delay(1500), {
            loading: 'Generando PDF…',
            success: 'PDF listo',
            error: 'No se pudo generar el PDF',
          })
        }
      >
        Promesa
      </Button>
    </div>
  );
}

// 5.5 ------------------------------------------------------------------------

const GENERIC_ERROR: ActionAlertState = {
  status: 'error',
  message: 'No se pudo guardar el contrato: la unidad ya tiene un contrato vigente.',
};

const CONFLICT_ERROR: ActionAlertState = {
  status: 'error',
  code: 'conflict',
  message: CONCURRENCY_CONFLICT_MESSAGE,
};

function ActionErrorDemo() {
  return (
    <div className="grid max-w-5xl gap-5 lg:grid-cols-2">
      <LabeledBlock label="Error genérico">
        <StepCard
          title="Contrato"
          hint="El mensaje va debajo de los campos, antes de las acciones."
        >
          <Field label="Renta mensual" required>
            <Input defaultValue="12,500.00" className="bg-bg-base tabular-nums" readOnly />
          </Field>
          <ActionErrorAlert state={GENERIC_ERROR} />
        </StepCard>
      </LabeledBlock>
      <LabeledBlock label="Conflicto de concurrencia (VersionField)">
        <StepCard
          title="Contrato"
          hint="Otra persona guardó antes: se ofrece Recargar, no sobrescribir."
        >
          <Field label="Renta mensual" required>
            <Input defaultValue="12,500.00" className="bg-bg-base tabular-nums" readOnly />
          </Field>
          <ActionErrorAlert state={CONFLICT_ERROR} />
        </StepCard>
      </LabeledBlock>
    </div>
  );
}

// 5.6 ------------------------------------------------------------------------

function ProgressLine({
  label,
  value,
  className,
  indicatorClassName,
}: {
  label: string;
  value: number;
  className?: string;
  indicatorClassName?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Progress
        value={value}
        aria-label={label}
        className={cn('h-1.5', className)}
        indicatorClassName={indicatorClassName}
      />
      <div className="flex justify-between text-xs tabular-nums text-text-tertiary">
        <span>{label}</span>
        <span>{value} %</span>
      </div>
    </div>
  );
}

function ProgressDemo() {
  return (
    <div className="grid max-w-5xl gap-8 md:grid-cols-2">
      <LabeledBlock label="Progress · h-1.5">
        <div className="space-y-5">
          <ProgressLine label="Avance de etapa" value={35} />
          <ProgressLine
            label="Cobrado del contrato"
            value={72}
            className="bg-success-subtle"
            indicatorClassName="bg-success"
          />
        </div>
      </LabeledBlock>

      <LabeledBlock label="ProgressRing · número dentro">
        <div className="flex items-center gap-6">
          <ProgressRing value={35} size={40} />
          <ProgressRing value={72} size={48} color="var(--color-success)" />
          <ProgressRing
            value={112}
            size={48}
            color="var(--color-danger)"
            numberClassName="text-danger-text"
          />
        </div>
      </LabeledBlock>

      <LabeledBlock label="RatingRing / RatingValue · cinco segmentos">
        <div className="flex items-center gap-6">
          <RatingValue value={4.6} />
          <RatingValue value={3.2} />
          <RatingValue value={1.4} />
          <RatingRing value={5} size={24} />
        </div>
      </LabeledBlock>

      <LabeledBlock label="StarRating · solo lectura">
        <div className="flex items-center gap-6">
          <StarRating value={5} />
          <StarRating value={3} size={16} />
        </div>
      </LabeledBlock>
    </div>
  );
}

// 5.7 ------------------------------------------------------------------------

type RecordRow = { icon: LucideIcon; label: string; value: React.ReactNode };

const CHARGE_ROWS: RecordRow[] = [
  { icon: Receipt, label: 'Cobro', value: 'Renta de agosto' },
  { icon: User, label: 'Inquilino', value: 'Carla Mendoza' },
  {
    icon: FileText,
    label: 'Monto',
    value: <span className="tabular-nums">{formatCurrency(12500)}</span>,
  },
];

function RecordRows({ rows }: { rows: RecordRow[] }) {
  return (
    <div className="divide-y divide-border rounded-lg border bg-card">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center gap-3 px-4 py-3">
          <IconCircle icon={row.icon} />
          <span className="min-w-0 flex-1 text-sm text-muted-foreground">{row.label}</span>
          <span className="text-right text-sm font-medium text-foreground">{row.value}</span>
        </div>
      ))}
    </div>
  );
}

function RoleCard({
  role,
  hint,
  children,
}: {
  role: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn(DETAIL_CARD_CLASS, 'p-5')}>
      <p className="text-sm font-semibold text-text-primary">{role}</p>
      <p className="mt-0.5 text-xs text-text-tertiary">{hint}</p>
      <div className="mt-4 flex items-center gap-3 border-t border-border-subtle pt-4">
        <IconCircle icon={Receipt} tone="success" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-text-primary">Renta de agosto</p>
          <p className="text-xs text-text-tertiary">
            Carla Mendoza · Registrado el {formatDate('2026-08-01')}
          </p>
        </div>
        <p className="text-sm font-medium tabular-nums text-text-primary">
          {formatCurrency(12500)}
        </p>
      </div>
      <div className="mt-4 flex items-center gap-2">{children}</div>
    </div>
  );
}

const CORRECTION_FORM_ID = 'correction-request-form';

function PermissionsDemo() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="grid max-w-5xl gap-5 lg:grid-cols-3">
      <RoleCard role="Admin" hint="Edita registros financieros y ve el menú ⋯ con Borrar.">
        <Button variant="outline" size="sm">
          <Pencil strokeWidth={1.5} />
          Editar
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="Más acciones">
          <MoreHorizontal strokeWidth={1.5} />
        </Button>
      </RoleCard>

      <RoleCard
        role="Coordinador"
        hint="No edita cobros ya creados: en su lugar ve la alternativa."
      >
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <MessageSquareText strokeWidth={1.5} />
          Solicitar corrección
        </Button>
      </RoleCard>

      <div className={cn(DETAIL_CARD_CLASS, 'p-5')}>
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-text-primary">Así no</p>
          <Badge tone="danger">evitar</Badge>
        </div>
        <p className="mt-0.5 text-xs text-text-tertiary">
          Botón deshabilitado sin alternativa ni explicación: el usuario no sabe qué hacer.
        </p>
        <div className="mt-4 flex items-center gap-2 border-t border-border-subtle pt-4">
          <Button variant="outline" size="sm" disabled>
            <Pencil strokeWidth={1.5} />
            Editar
          </Button>
        </div>
      </div>

      <NajaModal
        open={open}
        onOpenChange={setOpen}
        icon={MessageSquareText}
        headerAlign="center"
        size="md"
        footerMuted
        title="Solicitar corrección"
        description="El admin recibe un recordatorio con tu solicitud y corrige el registro."
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" form={CORRECTION_FORM_ID}>
              Enviar solicitud
            </Button>
          </>
        }
      >
        {open && (
          <form
            key="new"
            id={CORRECTION_FORM_ID}
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              setOpen(false);
              toast.success('Solicitud enviada al admin');
            }}
          >
            <RecordRows rows={CHARGE_ROWS} />
            <Field label="¿Qué hay que corregir?" required>
              <Textarea
                name="reason"
                required
                rows={3}
                autoFocus
                placeholder="Ej. El monto correcto es $12,000; se capturó con el recargo."
                className="bg-bg-base"
              />
            </Field>
          </form>
        )}
      </NajaModal>
    </div>
  );
}
