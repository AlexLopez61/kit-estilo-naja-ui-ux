'use client';

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  startOfMonth,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, FileText, Grid3x3, LayoutGrid, List } from 'lucide-react';
import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import { DateRangePicker, type DateRangeValue } from '@/components/shared/DateRangePicker';
import { formatCurrency } from '@/lib/i18n/formatters';
import { Section } from '../_components/Section';
import { Subsection } from '../_components/Subsection';

const formatMXN = formatCurrency;

export function FormControlsSection() {
  return (
    <Section
      id="form-controls"
      title="Form controls"
      description="Controles de formulario interactivos: accordion, switch, radio, checkbox, date pickers, calendario, slider y toggle group. Todos funcionales con datos del dominio NAJA."
    >
      <Subsection
        id="accordion"
        title="7.1 Accordion"
        caption="Tres secciones expandibles con contenido real: datos, historial y documentos."
      >
        <AccordionDemo />
      </Subsection>

      <Subsection
        id="switch"
        title="7.2 Switch"
        caption="Label a la izquierda, control a la derecha. Estados on, off y on-disabled."
      >
        <SwitchDemo />
      </Subsection>

      <Subsection
        id="radio-group"
        title="7.3 Radio group"
        caption="Selección única excluyente. Tipo de contrato de renta."
      >
        <RadioDemo />
      </Subsection>

      <Subsection
        id="checkbox"
        title="7.4 Checkbox"
        caption="Checkbox suelto para consentimiento y lista de tareas estilo checklist de etapa."
      >
        <CheckboxDemo />
      </Subsection>

      <Subsection
        id="date-picker"
        title="7.5 Date picker"
        caption="Selección de fecha simple y de rango (período del proyecto) con calendario popover."
      >
        <DatePickerDemo />
      </Subsection>

      <Subsection
        id="calendar"
        title="7.6 Calendar"
        caption="Calendario mensual con navegación funcional, día actual destacado y días con evento."
      >
        <CalendarDemo />
      </Subsection>

      <Subsection
        id="slider"
        title="7.7 Slider"
        caption="Rango simple (margen) y rango doble (precios mín-máx). Fill emerald, thumb blanco."
      >
        <SliderDemo />
      </Subsection>

      <Subsection
        id="toggle-group"
        title="7.8 Toggle group"
        caption="Selector de vista con tres opciones excluyentes. Una activa a la vez."
      >
        <ToggleGroupDemo />
      </Subsection>
    </Section>
  );
}

// 7.1 ------------------------------------------------------------------------

function AccordionDemo() {
  return (
    <div className="max-w-xl rounded-lg border border-border-subtle bg-bg-surface px-4">
      <Accordion type="single" collapsible defaultValue="datos">
        <AccordionItem value="datos">
          <AccordionTrigger>Datos del cliente</AccordionTrigger>
          <AccordionContent>
            <dl className="grid grid-cols-[7rem_1fr] gap-y-2 text-sm">
              <dt className="text-text-tertiary">Nombre</dt>
              <dd className="text-text-primary">María Pérez</dd>
              <dt className="text-text-tertiary">Email</dt>
              <dd className="text-text-secondary">maria.perez@example.mx</dd>
              <dt className="text-text-tertiary">Teléfono</dt>
              <dd className="tabular-nums text-text-secondary">999 123 4567</dd>
              <dt className="text-text-tertiary">RFC</dt>
              <dd className="font-mono text-text-secondary">PEMA850301AB1</dd>
            </dl>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="pagos">
          <AccordionTrigger>Historial de pagos</AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-2">
              {[
                { label: 'Renta abril 2026', date: '01/04/2026', amount: 12500 },
                { label: 'Renta marzo 2026', date: '03/03/2026', amount: 12500 },
                { label: 'Renta febrero 2026', date: '02/02/2026', amount: 12500 },
              ].map((p) => (
                <li key={p.label} className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">{p.label}</span>
                  <span className="flex items-center gap-3">
                    <span className="text-xs text-text-tertiary">{p.date}</span>
                    <span className="tabular-nums text-text-primary">{formatMXN(p.amount)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="docs" className="border-b-0">
          <AccordionTrigger>Documentos adjuntos</AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-2">
              {[
                { name: 'Contrato_CardínCasa.pdf', size: '248 KB' },
                { name: 'Identificación_oficial.pdf', size: '1.2 MB' },
              ].map((d) => (
                <li
                  key={d.name}
                  className="flex items-center gap-2.5 rounded-md border border-border-subtle bg-bg-base px-3 py-2"
                >
                  <FileText className="size-4 shrink-0 text-text-tertiary" strokeWidth={1.5} />
                  <span className="flex-1 truncate text-sm text-text-secondary">{d.name}</span>
                  <span className="shrink-0 text-xs tabular-nums text-text-tertiary">{d.size}</span>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

// 7.2 ------------------------------------------------------------------------

function SwitchRow({
  label,
  defaultChecked,
  disabled,
}: {
  label: string;
  defaultChecked?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-border-subtle py-3 last:border-0">
      <span className={`text-sm ${disabled ? 'text-text-disabled' : 'text-text-secondary'}`}>
        {label}
      </span>
      <Switch defaultChecked={defaultChecked} disabled={disabled} />
    </div>
  );
}

function SwitchDemo() {
  return (
    <div className="max-w-md rounded-lg border border-border-subtle bg-bg-surface px-4">
      <SwitchRow label="NAJA administra la propiedad" defaultChecked />
      <SwitchRow label="Notificar al cliente por SMS" />
      <SwitchRow label="Auto-renovación de contrato" defaultChecked disabled />
    </div>
  );
}

// 7.3 ------------------------------------------------------------------------

function RadioDemo() {
  return (
    <div className="max-w-md">
      <p className="mb-3 text-sm text-text-secondary">Tipo de contrato</p>
      <RadioGroup defaultValue="mensual" className="gap-0">
        {[
          { value: 'mensual', label: 'Mensual', hint: 'Pago cada mes' },
          { value: 'trimestral', label: 'Trimestral', hint: 'Pago cada 3 meses' },
          { value: 'anual', label: 'Anual', hint: 'Pago una vez al año' },
        ].map((opt) => (
          <label
            key={opt.value}
            htmlFor={`tipo-${opt.value}`}
            className="flex cursor-pointer items-center gap-3 border-b border-border-subtle py-3 last:border-0"
          >
            <RadioGroupItem id={`tipo-${opt.value}`} value={opt.value} />
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

// 7.4 ------------------------------------------------------------------------

const CHECKLIST = [
  { id: 'c1', label: 'Preparación de superficie y lijado', done: true },
  { id: 'c2', label: 'Aplicación de sellador primario', done: true },
  { id: 'c3', label: 'Primera mano de pintura', done: true },
  { id: 'c4', label: 'Segunda mano de pintura', done: false },
  { id: 'c5', label: 'Limpieza final y entrega', done: false },
];

function CheckboxDemo() {
  return (
    <div className="grid max-w-3xl gap-8 md:grid-cols-2">
      <div>
        <p className="mb-3 text-xs text-text-tertiary">Checkbox suelto</p>
        <label htmlFor="terminos" className="flex cursor-pointer items-start gap-2.5">
          <Checkbox id="terminos" className="mt-0.5" />
          <span className="text-sm text-text-secondary">Acepto términos del contrato</span>
        </label>
      </div>

      <div>
        <p className="mb-3 text-xs text-text-tertiary">Checklist de etapa · Pintura fachada</p>
        <div className="overflow-hidden rounded-lg border border-border-subtle bg-bg-surface">
          {CHECKLIST.map((item) => (
            <label
              key={item.id}
              htmlFor={item.id}
              className="flex cursor-pointer items-center gap-2.5 border-b border-border-subtle px-3 py-2.5 last:border-0 hover:bg-bg-elevated"
            >
              <Checkbox id={item.id} defaultChecked={item.done} />
              <span
                className={`text-sm ${
                  item.done ? 'text-text-tertiary line-through' : 'text-text-primary'
                }`}
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

// 7.5 ------------------------------------------------------------------------

function DatePickerDemo() {
  const [range, setRange] = useState<DateRangeValue>({
    from: '2026-06-01',
    to: '2026-08-15',
    preset: 'custom',
  });

  return (
    <div className="grid max-w-2xl gap-6 sm:grid-cols-2">
      <div>
        <Label className="mb-2 block text-sm text-text-secondary">Vigencia de cotización</Label>
        <DatePicker defaultValue="2026-06-30" placeholder="Selecciona fecha" />
      </div>
      <div>
        <Label className="mb-2 block text-sm text-text-secondary">Período del proyecto</Label>
        <DateRangePicker value={range} onChange={setRange} align="start" />
      </div>
    </div>
  );
}

// 7.6 ------------------------------------------------------------------------

const WEEKDAYS = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];

type CalEvent = { day: number; title: string };

function CalendarDemo() {
  const [cursor, setCursor] = useState(() => startOfMonth(new Date(2026, 5, 1)));
  const today = new Date(2026, 5, 12);

  const monthStart = startOfMonth(cursor);
  const monthEnd = endOfMonth(cursor);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  // getDay: 0=domingo. Convertimos a lunes-first.
  const leadingBlanks = (getDay(monthStart) + 6) % 7;

  const events: CalEvent[] = [
    { day: 5, title: 'Cobro de pagaré · Carla Mendoza' },
    { day: 12, title: 'Visita de obra · Casa Cardín' },
    { day: 23, title: 'Cobro de comisión · ICOVI' },
  ];

  return (
    <div className="max-w-sm rounded-lg border border-border-subtle bg-bg-surface p-4">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCursor((c) => addMonths(c, -1))}
          aria-label="Mes anterior"
          className="flex size-7 items-center justify-center rounded-md text-text-tertiary hover:bg-bg-elevated hover:text-text-primary"
        >
          <ChevronLeft className="size-4" strokeWidth={1.5} />
        </button>
        <p className="text-sm text-text-primary first-letter:uppercase">
          {format(cursor, 'MMMM yyyy', { locale: es })}
        </p>
        <button
          type="button"
          onClick={() => setCursor((c) => addMonths(c, 1))}
          aria-label="Mes siguiente"
          className="flex size-7 items-center justify-center rounded-md text-text-tertiary hover:bg-bg-elevated hover:text-text-primary"
        >
          <ChevronRight className="size-4" strokeWidth={1.5} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-1 text-center text-[11px] text-text-tertiary">
            {d}
          </div>
        ))}
        {Array.from({ length: leadingBlanks }, (_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {days.map((day) => {
          const dayNum = day.getDate();
          const isToday = isSameDay(day, today);
          const event = events.find((e) => e.day === dayNum);
          return (
            <div key={dayNum} className="group/day relative flex justify-center">
              <button
                type="button"
                className={`relative flex size-9 flex-col items-center justify-center rounded-md text-sm tabular-nums transition-colors hover:bg-bg-elevated ${
                  isToday ? 'border border-brand text-text-primary' : 'text-text-secondary'
                }`}
              >
                {dayNum}
                {event && <span className="absolute bottom-1 size-1 rounded-full bg-brand" />}
              </button>
              {event && (
                <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded-sm border border-border-default bg-bg-overlay px-2 py-1 text-xs text-text-primary shadow-md group-hover/day:block">
                  {event.title}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 7.7 ------------------------------------------------------------------------

function SliderDemo() {
  const [margin, setMargin] = useState([35]);
  const [prices, setPrices] = useState([20000, 120000]);

  return (
    <div className="max-w-md space-y-8">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <Label className="text-sm text-text-secondary">Margen de ganancia</Label>
          <span className="text-sm tabular-nums text-text-primary">{margin[0]}%</span>
        </div>
        <Slider value={margin} onValueChange={setMargin} min={0} max={100} step={1} />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <Label className="text-sm text-text-secondary">Rango de precios</Label>
          <span className="text-sm tabular-nums text-text-primary">
            {formatMXN(prices[0]!)} – {formatMXN(prices[1]!)}
          </span>
        </div>
        <Slider value={prices} onValueChange={setPrices} min={0} max={200000} step={5000} />
      </div>
    </div>
  );
}

// 7.8 ------------------------------------------------------------------------

function ToggleGroupDemo() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-text-secondary">Vista de la lista</p>
      <ToggleGroup type="single" defaultValue="list" variant="outline">
        <ToggleGroupItem value="list" aria-label="Vista de lista">
          <List className="size-4" strokeWidth={1.5} />
          Lista
        </ToggleGroupItem>
        <ToggleGroupItem value="grid" aria-label="Vista de grilla">
          <Grid3x3 className="size-4" strokeWidth={1.5} />
          Grid
        </ToggleGroupItem>
        <ToggleGroupItem value="cards" aria-label="Vista de cards">
          <LayoutGrid className="size-4" strokeWidth={1.5} />
          Cards
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
