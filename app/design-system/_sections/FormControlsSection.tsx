'use client';

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Building2,
  FileSignature,
  FolderKanban,
  Link2,
  User,
} from 'lucide-react';
import { useState } from 'react';
import { CopyField } from '@/components/shared/CopyField';
import { DateRangePicker, type DateRangeValue } from '@/components/shared/DateRangePicker';
import { FilterCombobox, FilterSelect, type FilterOption } from '@/components/shared/FilterSelect';
import {
  AddOnBlock,
  AddOnTile,
  CHIP_ACTIVE,
  CHIP_CLASS,
  CHIP_IDLE,
  CONTROL_CLASS,
  SELECT_CLASS,
  Field as FormField,
  FormCard,
} from '@/components/shared/FormPrimitives';
import { MonthOnlyPicker } from '@/components/shared/MonthOnlyPicker';
import { MonthPicker } from '@/components/shared/MonthPicker';
import { PasswordField } from '@/components/shared/PasswordField';
import { Field as ModalField, StepCard } from '@/components/shared/StepCard';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { SegmentedControl } from '@/components/ui/segmented-control';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { formatCurrency } from '@/lib/i18n/formatters';
import { cn } from '@/lib/utils';
import { monthWindow } from '@/lib/utils/dateWindow';
import { CopyJSXButton } from '../_components/CopyJSXButton';
import { Section } from '../_components/Section';
import { ShowcaseCombobox } from '../_components/ShowcaseCombobox';
import { Subsection } from '../_components/Subsection';

// ---------------------------------------------------------------------------
// JSX copiable
// ---------------------------------------------------------------------------

const MODAL_FIELD_JSX = `import { Field, StepCard } from '@/components/shared/StepCard';

<StepCard step={1} title="Datos del cobro" hint="Monto y referencia bancaria.">
  <Field label="Monto" required hint="Sin IVA.">
    <Input className="bg-bg-base" inputMode="decimal" placeholder="0.00" />
  </Field>
  <Field label="Referencia" error="La referencia ya existe.">
    <Input className="bg-bg-base" aria-invalid defaultValue="TRX-0042" />
  </Field>
</StepCard>`;

const FORM_FIELD_JSX = `import { CONTROL_CLASS, Field, FormCard } from '@/components/shared/FormPrimitives';

<FormCard icon={User} title="Cliente" hint="Quién paga la obra.">
  <Field label="Nombre" required hint="Como aparece en la factura.">
    <Input className={CONTROL_CLASS} placeholder="Nombre del cliente" />
  </Field>
</FormCard>`;

const ADDON_JSX = `<FormCard icon={Link2} title="Vincular" hint="Opcionales: se despliegan al agregarlos.">
  <div className="grid gap-3 sm:grid-cols-2">
    {linked.project ? (
      <AddOnBlock title="Proyecto" onRemove={() => unlink('project')}>
        <Select>…</Select>
      </AddOnBlock>
    ) : (
      <AddOnTile icon={FolderKanban} label="Agregar proyecto" onClick={() => link('project')} />
    )}
  </div>
</FormCard>`;

const SEGMENTED_JSX = `<SegmentedControl
  className="w-auto"
  aria-label="Filtrar cotizaciones"
  value={status}
  onChange={setStatus}
  options={[
    { value: 'all', label: 'Todo · 24' },
    { value: 'open', label: 'Abiertas · 9' },
    { value: 'due', label: 'Vencidas · 3', tone: 'danger', tintInactive: true },
    { value: 'closed', label: 'Cerradas · 12' },
  ]}
/>`;

const MONTH_PICKER_JSX = `const [period, setPeriod] = useState<DateRangeValue>({ ...monthWindow(2026, 8), preset: 'custom' });

<MonthPicker value={period} onChange={setPeriod} />`;

const FILTER_SELECT_JSX = `<FilterSelect
  label="Propietario"
  allLabel="Todos"
  value={owner}
  onChange={setOwner}
  options={[
    { value: 'o1', label: 'Sofía Cantón', avatar: { name: 'Sofía Cantón' } },
    { value: 'o2', label: 'Luis Ek', avatar: { name: 'Luis Ek' } },
  ]}
/>`;

const CHIP_JSX = `<button
  type="button"
  aria-pressed={active}
  className={cn(
    CHIP_CLASS,
    active ? CHIP_ACTIVE : CHIP_IDLE,
    'outline-none focus-visible:border-ring/50 focus-visible:shadow-focus',
  )}
>
  Plomería
</button>`;

// ---------------------------------------------------------------------------
// Datos
// ---------------------------------------------------------------------------

type PipelineStatus = 'all' | 'open' | 'due' | 'closed';
type ClientKind = 'fisica' | 'moral';
type PaymentMethod = 'cash' | 'transfer' | 'card';
type LinkKey = 'project' | 'contract';

const SPECIALTIES = ['Plomería', 'Electricidad', 'Pintura', 'Albañilería'];

const CHECKLIST = [
  { id: 'fc-c1', label: 'Preparación de superficie y lijado', done: true },
  { id: 'fc-c2', label: 'Aplicación de sellador primario', done: true },
  { id: 'fc-c3', label: 'Primera mano de pintura', done: true },
  { id: 'fc-c4', label: 'Segunda mano de pintura', done: false },
  { id: 'fc-c5', label: 'Limpieza final y entrega', done: false },
];

const OWNER_OPTIONS: FilterOption[] = [
  { value: 'o1', label: 'Sofía Cantón', avatar: { name: 'Sofía Cantón' } },
  { value: 'o2', label: 'Luis Ek', avatar: { name: 'Luis Ek' } },
  { value: 'o3', label: 'Rosa Chan', avatar: { name: 'Rosa Chan' } },
];

const MONTH_OPTIONS: FilterOption[] = [
  { value: '2026-09', label: 'Septiembre 2026', tag: 'Actual' },
  { value: '2026-08', label: 'Agosto 2026' },
  { value: '2026-07', label: 'Julio 2026' },
];

const UNIT_OPTIONS: FilterOption[] = [
  { value: 'u1', label: 'Departamento 3B', avatar: { name: 'Departamento 3B', square: true } },
  { value: 'u2', label: 'Local comercial 1', avatar: { name: 'Local comercial', square: true } },
  { value: 'u3', label: 'Casa Montejo', avatar: { name: 'Casa Montejo', square: true } },
];

const QUOTE_OPTIONS = [
  { value: 'q1', label: 'Pintura de fachada', hint: 'COT-0142' },
  { value: 'q2', label: 'Plomería baño principal', hint: 'COT-0139' },
  { value: 'q3', label: 'Instalación eléctrica', hint: 'COT-0131' },
];

const FOCUS_CLASS = 'outline-none focus-visible:border-ring/50 focus-visible:shadow-focus';

// ---------------------------------------------------------------------------
// Sección
// ---------------------------------------------------------------------------

export function FormControlsSection() {
  return (
    <Section
      id="form-controls"
      title="Formularios"
      description="Labels, fields y cards de formulario en sus dos escalas (modal y drawer), selectores excluyentes, controles de shadcn con foco glow, pickers de fecha y periodo, comboboxes de filtro y campos de credenciales. Todo funcional."
    >
      <Subsection
        id="labels-y-fields"
        title="Label y Field"
        caption="Dos tamaños de label: text-xs text-text-secondary en el Field de StepCard (modales) y text-base font-medium text-text-primary en el Field de FormPrimitives (drawer y página). Requerido con asterisco brand-text; hint terciario; error en danger-text."
      >
        <div className="space-y-4">
          <div className="flex flex-wrap justify-end gap-2">
            <CopyJSXButton code={MODAL_FIELD_JSX} label="Copiar JSX · Field de modal" />
            <CopyJSXButton code={FORM_FIELD_JSX} label="Copiar JSX · Field de drawer" />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Floor label="Modal (M8) · Field de components/shared/StepCard">
              <StepCard title="Datos del cobro" hint="Inputs recesados en bg-bg-base.">
                <ModalField label="Monto" required hint="Sin IVA.">
                  <Input className="bg-bg-base" inputMode="decimal" placeholder="0.00" />
                </ModalField>
                <ModalField label="Referencia" error="La referencia ya existe.">
                  <Input className="bg-bg-base" aria-invalid defaultValue="TRX-0042" />
                </ModalField>
                <ModalField label="Notas" hint="Visible solo para el equipo.">
                  <Textarea className="bg-bg-base" placeholder="Opcional" />
                </ModalField>
              </StepCard>
            </Floor>
            <Floor label="Drawer o página (M6, M7) · Field de components/shared/FormPrimitives">
              <FormCard icon={User} title="Cliente" hint="Quién paga la obra.">
                <FormField label="Nombre" required hint="Como aparece en la factura.">
                  <Input className={CONTROL_CLASS} placeholder="Nombre del cliente" />
                </FormField>
                <FormField label="Correo" error="Escribe un correo válido.">
                  <Input className={CONTROL_CLASS} aria-invalid defaultValue="alex@" />
                </FormField>
              </FormCard>
            </Floor>
          </div>
        </div>
      </Subsection>

      <Subsection
        id="step-card-y-form-card"
        title="StepCard y FormCard"
        caption="Ambas son nivel 0 sobre el piso (bg-bg-surface border-border-subtle). StepCard lleva chip numerado y vive en modales (M8); FormCard lleva icono y hint, escala 1.25x (h-11) y vive en drawers y páginas enfocadas (M6, M7) con AddOnTile para los opcionales."
      >
        <div className="space-y-4">
          <div className="flex flex-wrap justify-end gap-2">
            <CopyJSXButton code={ADDON_JSX} label="Copiar JSX · FormCard con AddOnTile" />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Floor label="Cuerpo de modal · StepCard numerada">
              <div className="space-y-3">
                <StepCard step={1} title="¿Qué cobras?" hint="Elige el pagaré o la cotización.">
                  <ModalField label="Origen" required>
                    <Select defaultValue="pagare">
                      <SelectTrigger className="w-full bg-bg-base">
                        <SelectValue placeholder="Selecciona" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pagare">Pagaré · Septiembre 2026</SelectItem>
                        <SelectItem value="quote">Cotización · COT-0142</SelectItem>
                      </SelectContent>
                    </Select>
                  </ModalField>
                  <ModalField label="Monto" required>
                    <Input className="bg-bg-base" inputMode="decimal" defaultValue="12500" />
                  </ModalField>
                </StepCard>
                <StepCard step={2} title="¿Cómo?" hint="Método y comprobante.">
                  <PaymentMethodField />
                </StepCard>
              </div>
            </Floor>
            <Floor label="Cuerpo de drawer · FormCard con opcionales">
              <LinkFormCard />
            </Floor>
          </div>
        </div>
      </Subsection>

      <Subsection
        id="segmented-control"
        title="SegmentedControl"
        caption="switch (default): riel bg-muted y pastilla bg-background con sombra, para todo selector de vista de una lista. tint: pastilla lavada del tono, solo para opciones dentro de un formulario. value={null} = sin selección."
      >
        <div className="space-y-4">
          <div className="flex justify-end">
            <CopyJSXButton code={SEGMENTED_JSX} label="Copiar JSX · switch" />
          </div>
          <SegmentedDemo />
        </div>
      </Subsection>

      <Subsection
        id="checkbox"
        title="Checkbox"
        caption="Suelto para consentimientos; en lista para checklists. Marcado en bg-primary (negro); foco glow; fila con hover:bg-row-hover."
      >
        <CheckboxDemo />
      </Subsection>

      <Subsection
        id="radio-group"
        title="Radio group"
        caption="Selección única con hint por opción. Para dos o tres opciones cortas dentro de un formulario, un SegmentedControl tint o chips suelen leerse mejor."
      >
        <RadioDemo />
      </Subsection>

      <Subsection
        id="switch"
        title="Switch"
        caption="Label a la izquierda, control a la derecha, filas divididas por border-subtle. Encendido en bg-primary; tamaño sm para tablas."
      >
        <SwitchDemo />
      </Subsection>

      <Subsection
        id="slider"
        title="Slider"
        caption="Rango simple y doble. Relleno bg-primary, pista bg-muted, thumb con shadow-focus al enfocar. El valor siempre visible a la derecha en tabular-nums."
      >
        <SliderDemo />
      </Subsection>

      <Subsection
        id="toggle-group"
        title="Toggle group"
        caption="Para conmutar iconos (alineación, formato, densidad). Un selector de vista de lista no va aquí: usa SegmentedControl switch."
      >
        <ToggleGroupDemo />
      </Subsection>

      <Subsection
        id="date-picker"
        title="Date picker y rango"
        caption="DatePicker emite YYYY-MM-DD y muestra dd/MM/yyyy; allowedDaysOfMonth restringe a días de cobro. DateRangePicker solo donde el rango libre ya existía y no es la cara principal de una vista financiera."
      >
        <DatePickerDemo />
      </Subsection>

      <Subsection
        id="month-picker"
        title="MonthPicker y MonthOnlyPicker"
        caption="M12: mes como periodo primario con stepper, y trimestre, año e histórico como periodos cerrados en el menú; emite {from, to, preset} a la URL. MonthOnlyPicker para estados de cuenta estrictamente mensuales."
      >
        <div className="space-y-4">
          <div className="flex justify-end">
            <CopyJSXButton code={MONTH_PICKER_JSX} label="Copiar JSX · MonthPicker" />
          </div>
          <MonthPickerDemo />
        </div>
      </Subsection>

      <Subsection
        id="combobox"
        title="Combobox y FilterSelect"
        caption="Combobox sobre cmdk con búsqueda y check en la opción activa. FilterSelect y FilterCombobox para la toolbar de M1: label terciario + control de 32 px, opción «Todos», avatar o tag opcional por opción."
      >
        <div className="space-y-4">
          <div className="flex justify-end">
            <CopyJSXButton code={FILTER_SELECT_JSX} label="Copiar JSX · FilterSelect" />
          </div>
          <ComboboxDemo />
        </div>
      </Subsection>

      <Subsection
        id="password-y-copy-field"
        title="PasswordField y CopyField"
        caption="PasswordField controlado con mostrar/ocultar y «Generar» (solo en alta o reset por admin). CopyField para credenciales de solo lectura que el admin copia y entrega."
      >
        <CredentialsDemo />
      </Subsection>

      <Subsection
        id="chips"
        title="Chips de opción excluyente"
        caption="CHIP_CLASS con CHIP_ACTIVE (border-strong, bg-elevated, medium) o CHIP_IDLE. Para opciones excluyentes en altas (M6); el contexto prellenado desde una ficha se muestra como chip fijo sin ✕."
      >
        <div className="space-y-4">
          <div className="flex justify-end">
            <CopyJSXButton code={CHIP_JSX} label="Copiar JSX · chip" />
          </div>
          <ChipsDemo />
        </div>
      </Subsection>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Piezas locales
// ---------------------------------------------------------------------------

/** Piso de modal o drawer (bg-background) para que las cards de nivel 0 se lean en contexto. */
function Floor({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border-subtle bg-background p-4">
      <p className="mb-3 text-xs text-text-tertiary">{label}</p>
      {children}
    </div>
  );
}

function PaymentMethodField() {
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  return (
    <ModalField label="Método" required hint="Elige uno para continuar.">
      <SegmentedControl
        variant="tint"
        aria-label="Método de pago"
        value={method}
        onChange={setMethod}
        options={[
          { value: 'cash', label: 'Efectivo' },
          { value: 'transfer', label: 'Transferencia' },
          { value: 'card', label: 'Tarjeta' },
        ]}
      />
    </ModalField>
  );
}

function LinkFormCard() {
  const [linked, setLinked] = useState<Record<LinkKey, boolean>>({
    project: true,
    contract: false,
  });
  const set = (key: LinkKey, value: boolean) => setLinked((prev) => ({ ...prev, [key]: value }));

  return (
    <FormCard icon={Link2} title="Vincular" hint="Opcionales: se despliegan al agregarlos.">
      <div className="grid gap-3 sm:grid-cols-2">
        {linked.project ? (
          <AddOnBlock
            title="Proyecto"
            hint="La orden hereda su unidad."
            onRemove={() => set('project', false)}
          >
            <Select defaultValue="p1">
              <SelectTrigger className={SELECT_CLASS}>
                <SelectValue placeholder="Selecciona un proyecto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="p1">Pintura de fachada · Casa Montejo</SelectItem>
                <SelectItem value="p2">Plomería · Departamento 3B</SelectItem>
              </SelectContent>
            </Select>
          </AddOnBlock>
        ) : (
          <AddOnTile
            icon={FolderKanban}
            label="Agregar proyecto"
            onClick={() => set('project', true)}
          />
        )}
        {linked.contract ? (
          <AddOnBlock title="Contrato" onRemove={() => set('contract', false)}>
            <Select defaultValue="c1">
              <SelectTrigger className={SELECT_CLASS}>
                <SelectValue placeholder="Selecciona un contrato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="c1">Departamento 3B · vigente</SelectItem>
              </SelectContent>
            </Select>
          </AddOnBlock>
        ) : (
          <AddOnTile
            icon={FileSignature}
            label="Agregar contrato"
            onClick={() => set('contract', true)}
          />
        )}
      </div>
      <FormField label="Lugar" hint="Contexto fijo desde la ficha: chip sin ✕.">
        <div className="flex flex-wrap gap-2">
          <span className={cn(CHIP_CLASS, CHIP_ACTIVE, 'inline-flex items-center gap-2')}>
            <Building2 className="size-4 text-text-tertiary" strokeWidth={1.5} />
            Casa Montejo
          </span>
        </div>
      </FormField>
    </FormCard>
  );
}

function SegmentedDemo() {
  const [status, setStatus] = useState<PipelineStatus>('all');
  const [kind, setKind] = useState<ClientKind>('fisica');
  const [method, setMethod] = useState<PaymentMethod | null>(null);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-3">
        <p className="text-sm font-semibold text-text-primary">switch · selector de vista</p>
        <SegmentedControl
          className="w-auto"
          aria-label="Filtrar cotizaciones"
          value={status}
          onChange={setStatus}
          options={[
            { value: 'all', label: 'Todo · 24' },
            { value: 'open', label: 'Abiertas · 9' },
            { value: 'due', label: 'Vencidas · 3', tone: 'danger', tintInactive: true },
            { value: 'closed', label: 'Cerradas · 12' },
          ]}
        />
        <p className="text-xs text-text-tertiary">
          Conteos en el label; tone con tintInactive para el segmento que debe verse aunque no esté
          activo.
        </p>
      </div>
      <div className="space-y-3">
        <p className="text-sm font-semibold text-text-primary">tint · dentro de un formulario</p>
        <div className="rounded-lg border border-border-subtle bg-bg-surface p-4">
          <FormField label="Tipo de cliente" required>
            <SegmentedControl
              variant="tint"
              aria-label="Tipo de cliente"
              value={kind}
              onChange={setKind}
              options={[
                { value: 'fisica', label: 'Persona física' },
                { value: 'moral', label: 'Persona moral' },
              ]}
            />
          </FormField>
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-sm font-semibold text-text-primary">value = null · sin selección</p>
        <SegmentedControl
          aria-label="Método de pago"
          value={method}
          onChange={setMethod}
          options={[
            { value: 'cash', label: 'Efectivo' },
            { value: 'transfer', label: 'Transferencia' },
            { value: 'card', label: 'Tarjeta' },
          ]}
        />
        <p className="text-xs text-text-tertiary">
          Ningún segmento activo hasta elegir; la pastilla entra con un fade breve.
        </p>
      </div>
    </div>
  );
}

function CheckboxDemo() {
  return (
    <div className="grid max-w-3xl gap-8 md:grid-cols-2">
      <div>
        <p className="mb-3 text-xs text-text-tertiary">Suelto</p>
        <label htmlFor="fc-terms" className="flex cursor-pointer items-start gap-2.5">
          <Checkbox id="fc-terms" className="mt-0.5" />
          <span className="text-sm text-text-primary">Acepto los términos del contrato</span>
        </label>
      </div>
      <div>
        <p className="mb-3 text-xs text-text-tertiary">Checklist de etapa · Pintura de fachada</p>
        <div className="overflow-hidden rounded-lg border border-border-subtle bg-bg-surface">
          {CHECKLIST.map((item) => (
            <label
              key={item.id}
              htmlFor={item.id}
              className="flex cursor-pointer items-center gap-2.5 border-b border-border-subtle px-3 py-2.5 transition-colors duration-150 last:border-0 hover:bg-row-hover motion-reduce:transition-none"
            >
              <Checkbox id={item.id} defaultChecked={item.done} />
              <span
                className={cn(
                  'text-sm',
                  item.done ? 'text-text-tertiary line-through' : 'text-text-primary',
                )}
              >
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function RadioDemo() {
  return (
    <div className="max-w-md">
      <p className="mb-3 text-sm font-medium text-text-primary">Periodicidad del cobro</p>
      <RadioGroup defaultValue="mensual" className="gap-0">
        {[
          { value: 'mensual', label: 'Mensual', hint: 'Un pagaré por mes' },
          { value: 'trimestral', label: 'Trimestral', hint: 'Un pagaré cada tres meses' },
          { value: 'anual', label: 'Anual', hint: 'Un solo pagaré por año' },
        ].map((opt) => (
          <label
            key={opt.value}
            htmlFor={`fc-period-${opt.value}`}
            className="flex cursor-pointer items-center gap-3 border-b border-border-subtle py-3 last:border-0"
          >
            <RadioGroupItem id={`fc-period-${opt.value}`} value={opt.value} />
            <span className="flex-1">
              <span className="block text-sm text-text-primary">{opt.label}</span>
              <span className="block text-xs text-text-tertiary">{opt.hint}</span>
            </span>
          </label>
        ))}
      </RadioGroup>
    </div>
  );
}

function SwitchRow({
  id,
  label,
  defaultChecked,
  size,
}: {
  id: string;
  label: string;
  defaultChecked?: boolean;
  size?: 'sm' | 'default';
}) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-border-subtle py-3 last:border-0">
      <Label htmlFor={id} className="font-normal text-text-primary">
        {label}
      </Label>
      <Switch id={id} defaultChecked={defaultChecked} size={size} />
    </div>
  );
}

function SwitchDemo() {
  return (
    <div className="max-w-md rounded-lg border border-border-subtle bg-bg-surface px-4">
      <SwitchRow id="fc-sw-1" label="Administrada por la empresa" defaultChecked />
      <SwitchRow id="fc-sw-2" label="Recordatorio de cobro por WhatsApp" />
      <SwitchRow id="fc-sw-3" label="Tamaño sm" defaultChecked size="sm" />
    </div>
  );
}

function SliderDemo() {
  const [margin, setMargin] = useState([35]);
  const [prices, setPrices] = useState([20000, 120000]);
  const [minPrice, maxPrice] = prices;

  return (
    <div className="max-w-md space-y-8">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <Label className="text-text-primary">Margen</Label>
          <span className="text-sm tabular-nums text-text-primary">{margin[0] ?? 0} %</span>
        </div>
        <Slider value={margin} onValueChange={setMargin} min={0} max={100} step={1} />
      </div>
      <div>
        <div className="mb-3 flex items-center justify-between">
          <Label className="text-text-primary">Rango de precios</Label>
          <span className="text-sm tabular-nums text-text-primary">
            {formatCurrency(minPrice ?? 0)} – {formatCurrency(maxPrice ?? 0)}
          </span>
        </div>
        <Slider value={prices} onValueChange={setPrices} min={0} max={200000} step={5000} />
      </div>
    </div>
  );
}

function ToggleGroupDemo() {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-text-primary">Alineación</p>
      <ToggleGroup type="single" defaultValue="left" variant="outline">
        <ToggleGroupItem value="left" aria-label="Alinear a la izquierda">
          <AlignLeft className="size-4" strokeWidth={1.5} />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Centrar">
          <AlignCenter className="size-4" strokeWidth={1.5} />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Alinear a la derecha">
          <AlignRight className="size-4" strokeWidth={1.5} />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

function DatePickerDemo() {
  const [range, setRange] = useState<DateRangeValue>({
    from: '2026-06-01',
    to: '2026-08-15',
    preset: 'custom',
  });

  return (
    <div className="grid max-w-3xl gap-6 sm:grid-cols-3">
      <div className="space-y-2">
        <Label htmlFor="fc-date" className="text-text-primary">
          Vigencia de la cotización
        </Label>
        <DatePicker id="fc-date" defaultValue="2026-06-30" placeholder="Selecciona fecha" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fc-payday" className="text-text-primary">
          Día de cobro
        </Label>
        <DatePicker
          id="fc-payday"
          placeholder="Solo días de cobro"
          allowedDaysOfMonth={[1, 5, 10, 15, 20, 25]}
        />
        <p className="text-xs text-text-tertiary">allowedDaysOfMonth: 1, 5, 10, 15, 20, 25.</p>
      </div>
      <div className="space-y-2">
        <Label className="text-text-primary">Periodo del proyecto</Label>
        <div>
          <DateRangePicker value={range} onChange={setRange} align="start" />
        </div>
        <p className="font-mono text-xs tabular-nums text-text-tertiary">
          {range.from} → {range.to}
        </p>
      </div>
    </div>
  );
}

function MonthPickerDemo() {
  const [period, setPeriod] = useState<DateRangeValue>({
    ...monthWindow(2026, 8),
    preset: 'custom',
  });
  const [month, setMonth] = useState({ year: 2026, month: 9 });

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-text-primary">MonthPicker</p>
        <MonthPicker value={period} onChange={setPeriod} />
        <p className="font-mono text-xs tabular-nums text-text-tertiary">
          {`{ from: '${period.from}', to: '${period.to}', preset: '${period.preset ?? ''}' }`}
        </p>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-semibold text-text-primary">MonthOnlyPicker</p>
        <MonthOnlyPicker
          year={month.year}
          month={month.month}
          onChange={(year, m) => setMonth({ year, month: m })}
          min={{ year: 2024, month: 1 }}
        />
        <p className="font-mono text-xs tabular-nums text-text-tertiary">
          {`{ year: ${month.year}, month: ${month.month} }`}
        </p>
      </div>
    </div>
  );
}

function ComboboxDemo() {
  const [owner, setOwner] = useState<string | undefined>(undefined);
  const [month, setMonth] = useState<string | undefined>('2026-09');
  const [unit, setUnit] = useState<string | undefined>(undefined);

  return (
    <div className="space-y-6">
      <div className="grid max-w-2xl gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-text-primary">Cotización</Label>
          <ShowcaseCombobox
            options={QUOTE_OPTIONS}
            placeholder="Busca una cotización"
            searchPlaceholder="Buscar por nombre o folio…"
          />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs text-text-tertiary">Toolbar de M1 · filtros en la URL</p>
        <div className="flex flex-wrap items-center gap-2">
          <FilterSelect
            label="Propietario"
            allLabel="Todos"
            options={OWNER_OPTIONS}
            value={owner}
            onChange={setOwner}
          />
          <FilterSelect
            label="Mes"
            allLabel="Todos"
            options={MONTH_OPTIONS}
            value={month}
            onChange={setMonth}
          />
          <FilterCombobox
            label="Unidad"
            allLabel="Todas"
            options={UNIT_OPTIONS}
            value={unit}
            onChange={setUnit}
            searchPlaceholder="Buscar unidad…"
          />
        </div>
      </div>
    </div>
  );
}

function CredentialsDemo() {
  const [password, setPassword] = useState('');

  return (
    <div className="grid max-w-3xl gap-6 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="fc-password" className="text-text-primary">
          Contraseña
        </Label>
        <PasswordField
          id="fc-password"
          value={password}
          onChange={setPassword}
          showGenerate
          error={password.length > 0 && password.length < 8}
        />
        <p className="text-xs text-text-tertiary">
          «Generar» produce una contraseña legible sin caracteres ambiguos y la muestra.
        </p>
      </div>
      <div className="space-y-4">
        <CopyField label="Correo" value="alex@naja.mx" />
        <CopyField label="Contraseña temporal" value={password || 'Kq7#mR2vLp9w'} mono />
      </div>
    </div>
  );
}

function ChipsDemo() {
  const [specialty, setSpecialty] = useState('Plomería');

  return (
    <div className="max-w-xl rounded-lg border border-border-subtle bg-bg-surface p-4">
      <FormField label="Especialidad" required>
        <div className="flex flex-wrap gap-2">
          {SPECIALTIES.map((name) => {
            const active = name === specialty;
            return (
              <button
                key={name}
                type="button"
                aria-pressed={active}
                onClick={() => setSpecialty(name)}
                className={cn(CHIP_CLASS, active ? CHIP_ACTIVE : CHIP_IDLE, FOCUS_CLASS)}
              >
                {name}
              </button>
            );
          })}
        </div>
      </FormField>
    </div>
  );
}
