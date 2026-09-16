'use client';

import * as React from 'react';
import { FolderPlus, Sparkles, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ConfirmDeleteModal,
  DetailModal,
  QuickFormModal,
  WizardModal,
  type WizardStep,
} from '@/components/modals';
import { Section } from '../_components/Section';
import { Subsection } from '../_components/Subsection';

/**
 * Decisión de arquitectura — se eligió el wrapper `NajaModal` (opción 2).
 *
 * Las 5 variantes comparten el mismo chrome (header con cuadro emerald, body
 * scrolleable, footer anclado con borde superior), así que centralizarlo en
 * `components/ui/naja-modal.tsx` evita repetir los overrides de tokens en cada
 * una (como hoy ocurre inline en `SupplierFormModal`). Las variantes solo
 * componen su contenido.
 *
 * Excepción documentada: `ConfirmDeleteModal` NO usa `NajaModal`; vive sobre
 * `AlertDialog` para tener rol `alertdialog` y no cerrarse por click-fuera.
 * No se mezclan ambos enfoques dentro de una misma variante.
 */
export function ModalsSection() {
  return (
    <Section
      id="modals"
      title="Modales"
      description="Librería de 5 variantes sobre el wrapper NajaModal (Soft Bento Dark). Cada una abre desde su botón. El uploader es preview local y los forms validan con react-hook-form + Zod sin persistir."
    >
      <Subsection
        id="modal-proveedor-form"
        title="11.1 Formulario largo seccionado"
        caption="Alta de una entidad con varios bloques (ej. proveedor). Segmented control animado + uploader de logo."
      >
        <ProveedorFormDemo />
      </Subsection>

      <Subsection
        id="modal-confirm-delete"
        title="11.2 Confirmación destructiva"
        caption="Borrado permanente. Compacto, centrado, con fricción opcional por texto. Único elemento rojo sólido."
      >
        <ConfirmDeleteDemo />
      </Subsection>

      <Subsection
        id="modal-detail"
        title="11.3 Detalle / lectura"
        caption="Ver una ficha sin editar. Pares label/valor en cards bento. Editar abre el formulario."
      >
        <DetailDemo />
      </Subsection>

      <Subsection
        id="modal-quick-form"
        title="11.4 Formulario corto"
        caption="Captura rápida de 1-2 campos (agregar categoría, renombrar). Autofocus + Enter envía."
      >
        <QuickFormDemo />
      </Subsection>

      <Subsection
        id="modal-wizard"
        title="11.5 Wizard multi-paso"
        caption="Flujo guiado por pasos con stepper, footer dinámico y transición animada."
      >
        <WizardDemo />
      </Subsection>

      <Subsection
        id="modal-naja-props"
        title="11.6 NajaModal · props"
        caption="El wrapper que compone el chrome compartido de las variantes."
      >
        <NajaModalProps />
      </Subsection>
    </Section>
  );
}

// 11.1 ----------------------------------------------------------------------

function ProveedorFormDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Abrir formulario de proveedor
      </Button>
    </>
  );
}

// 11.2 ----------------------------------------------------------------------

function ConfirmDeleteDemo() {
  const [simple, setSimple] = React.useState(false);
  const [typed, setTyped] = React.useState(false);
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => setSimple(true)}>
        Eliminar (simple)
      </Button>
      <Button variant="outline" onClick={() => setTyped(true)}>
        Eliminar (confirmar por texto)
      </Button>

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
    </div>
  );
}

// 11.3 ----------------------------------------------------------------------

function DetailDemo() {
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
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
          setEditing(true);
        }}
        sections={[
          {
            title: 'Contacto',
            rows: [
              { label: 'Persona', value: 'Luis Canul' },
              { label: 'Teléfono', value: <span className="tabular-nums">999 123 4567</span> },
              { label: 'Email', value: 'ventas@ferreteriacentro.mx' },
              { label: 'Categoría', value: 'Mayorista' },
            ],
          },
          {
            title: 'Ubicación',
            rows: [
              { label: 'Dirección', value: 'Calle 60 #480, Centro' },
              { label: 'Ciudad', value: 'Mérida, Yucatán' },
              { label: 'CP', value: <span className="tabular-nums">97000</span> },
            ],
          },
          {
            title: 'Notas',
            rows: [
              { label: 'Internas', value: 'Entrega a domicilio sin costo en pedidos > $2,000.' },
            ],
          },
        ]}
      />

      {/* Editar abre el formulario, demostrando el callback onEdit. */}
    </>
  );
}

// 11.4 ----------------------------------------------------------------------

function QuickFormDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Agregar categoría
      </Button>
      <QuickFormModal
        open={open}
        onOpenChange={setOpen}
        icon={FolderPlus}
        title="Nueva categoría"
        description="Se usará al clasificar proveedores y materiales."
        fields={[{ name: 'name', label: 'Nombre de la categoría', placeholder: 'Ej: Plomería' }]}
        onSubmit={(values) => toast.success(`Categoría creada: ${values.name}`)}
      />
    </>
  );
}

// 11.5 ----------------------------------------------------------------------

function WizardDemo() {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');

  const steps: WizardStep[] = [
    {
      title: 'Datos',
      isValid: name.trim().length > 0,
      content: (
        <div className="space-y-1">
          <Label htmlFor="wizard-name" className="text-muted-foreground">
            Nombre del proveedor
            <span className="ml-0.5 text-primary">*</span>
          </Label>
          <Input
            id="wizard-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Ferretería del Centro"
            className="bg-card"
          />
          <p className="text-[11px] text-muted-foreground">
            Siguiente se habilita al capturar el nombre.
          </p>
        </div>
      ),
    },
    {
      title: 'Contacto',
      content: (
        <div className="space-y-1">
          <Label htmlFor="wizard-phone" className="text-muted-foreground">
            Teléfono
          </Label>
          <Input
            id="wizard-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Opcional"
            className="bg-card"
          />
        </div>
      ),
    },
    {
      title: 'Confirmar',
      content: (
        <div className="rounded-lg border border-border bg-card p-4 text-sm">
          <p className="text-muted-foreground">Se creará el proveedor:</p>
          <p className="mt-1 text-foreground">{name || '—'}</p>
          <p className="text-muted-foreground tabular-nums">{phone || 'Sin teléfono'}</p>
        </div>
      ),
    },
  ];

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Iniciar onboarding
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

// 11.6 ----------------------------------------------------------------------

const PROPS: { name: string; type: string; desc: string }[] = [
  { name: 'open / onOpenChange', type: 'boolean / fn', desc: 'Estado controlado del modal.' },
  { name: 'icon', type: 'LucideIcon', desc: 'Ícono en el cuadro emerald del header.' },
  { name: 'leading', type: 'ReactNode', desc: 'Reemplaza el cuadro del ícono (ej. avatar).' },
  { name: 'title / description', type: 'ReactNode', desc: 'Encabezado del modal.' },
  {
    name: 'headerAddon',
    type: 'ReactNode',
    desc: 'Extra bajo el título (ej. stepper del wizard).',
  },
  {
    name: 'footer',
    type: 'ReactNode',
    desc: 'Acciones ancladas al pie. Si se omite, no hay footer.',
  },
  { name: 'size', type: "'sm'|'md'|'lg'|'xl'", desc: 'Ancho máximo. Default lg.' },
  { name: 'dismissable', type: 'boolean', desc: 'Cierre por Esc / click-fuera. Default true.' },
  { name: 'showClose', type: 'boolean', desc: 'Botón × del header. Default true.' },
];

function NajaModalProps() {
  return (
    <div className="max-w-3xl overflow-hidden rounded-lg border border-border bg-card">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs text-muted-foreground">
            <th className="px-4 py-2.5 font-normal">Prop</th>
            <th className="px-4 py-2.5 font-normal">Tipo</th>
            <th className="px-4 py-2.5 font-normal">Descripción</th>
          </tr>
        </thead>
        <tbody>
          {PROPS.map((p) => (
            <tr key={p.name} className="border-b border-border last:border-0">
              <td className="px-4 py-2.5 font-mono text-xs text-foreground">{p.name}</td>
              <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{p.type}</td>
              <td className="px-4 py-2.5 text-muted-foreground">{p.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
