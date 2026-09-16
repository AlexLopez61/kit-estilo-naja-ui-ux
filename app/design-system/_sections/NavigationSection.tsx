'use client';

import * as React from 'react';
import {
  Banknote,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Info,
  Kanban,
  Landmark,
  List,
} from 'lucide-react';

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DisclosureRow } from '@/components/patterns/DisclosureRow';
import { DETAIL_CARD_CLASS, RowPill } from '@/components/shared/DetailCard';
import { Field, StepCard } from '@/components/shared/StepCard';
import { formatCurrency } from '@/lib/i18n/formatters';
import { cn } from '@/lib/utils';
import { CopyJSXButton } from '../_components/CopyJSXButton';
import { Section } from '../_components/Section';
import { Subsection } from '../_components/Subsection';

/**
 * Navegación (01-sistema §6.3 y §7; 02-moldes M0): tabs de módulo con
 * subrayado negro deslizante, píldoras solo en formularios, SegmentedControl
 * switch como selector de vista, migajas, acordeones animados y paginación.
 * El sidebar no se recrea aquí: solo se documenta.
 */
export function NavigationSection() {
  return (
    <Section
      id="navigation"
      title="Navegación"
      description="Tabs de módulo con subrayado negro que se desliza, píldoras solo dentro de formularios, SegmentedControl switch para cambiar de vista, migajas para Configuración y detalle, acordeones siempre animados (nunca <details>) y paginación. El sidebar vive en el shell de /demo y aquí solo se anota."
    >
      <Subsection
        id="tabs-modulo"
        title="9.1 Tabs de módulo (variant line)"
        caption="Tabs variant=line: fila border-b border-border-subtle, triggers px-3 py-2 text-sm en secundario, activo en primario con subrayado h-0.5 bg-foreground que se desliza (translateX + width medidos, 300 ms). La última pestaña se guarda en memoria de módulo para no saltar al remontar. Tope: siete tabs."
      >
        <LineTabsDemo />
      </Subsection>

      <Subsection
        id="tabs-pildoras"
        title="9.2 Tabs default (píldoras) dentro de un formulario"
        caption="Píldoras sobre bg-muted con la activa en bg-background + shadow-sm. Solo para alternar secciones de un formulario (aquí, el método de pago dentro de un StepCard); nunca como tabs de módulo."
      >
        <PillTabsDemo />
      </Subsection>

      <Subsection
        id="segmented-vista"
        title="9.3 SegmentedControl como selector de vista"
        caption="variant=switch (riel bg-muted, pastilla bg-background con shadow-sm que se desliza) para todo selector de vista de una lista: pipeline con conteos y Lista / Kanban. La variante tint queda para opciones dentro de un formulario; value={null} deja el control sin selección."
      >
        <SegmentedDemo />
      </Subsection>

      <Subsection
        id="breadcrumb"
        title="9.4 Breadcrumb"
        caption="Migaja de PageHeader: solo en Configuración y en páginas de detalle (M4). Los módulos operativos abren con toolbar o tabs, sin título ni migaja. Ruta corta y ruta larga con elipsis en los niveles intermedios."
      >
        <BreadcrumbDemo />
      </Subsection>

      <Subsection
        id="disclosure-row"
        title="9.5 DisclosureRow y Collapsible"
        caption="DisclosureRow: chevron que rota 90°, chip o resumen que se desvanece al abrir y contenido con animate-collapsible-down/up. Debajo, el Collapsible de Radix armado a mano con las mismas clases. Nunca <details> nativo."
      >
        <DisclosureDemo />
      </Subsection>

      <Subsection
        id="pagination"
        title="9.6 Pagination"
        caption="Conteo de resultados a la izquierda, controles a la derecha; la página activa en outline, el resto ghost. En listas largas se prefiere «Cargar anteriores» en el pie de la card (M1)."
      >
        <PaginationDemo />
      </Subsection>

      <Subsection
        id="sidebar"
        title="9.7 Sidebar (nota)"
        caption="No se recrea en el showcase: la primitiva vive en components/ui/sidebar.tsx y se ve en el shell de /demo. Lo que fija el sistema:"
      >
        <SidebarNote />
      </Subsection>
    </Section>
  );
}

// 9.1 ------------------------------------------------------------------------

const MODULE_TABS = [
  { value: 'resumen', label: 'Resumen' },
  { value: 'cotizaciones', label: 'Cotizaciones', count: 3 },
  { value: 'etapas', label: 'Etapas' },
  { value: 'finanzas', label: 'Finanzas' },
  { value: 'documentos', label: 'Documentos' },
] as const;

type ModuleTab = (typeof MODULE_TABS)[number]['value'];

const LINE_TABS_JSX = `<Tabs value={tab} onValueChange={setTab}>
  <TabsList ref={listRef} variant="line" className="relative w-full justify-start gap-0">
    {TABS.map((t) => (
      <TabsTrigger
        key={t.value}
        value={t.value}
        // El subrayado lo pinta el indicador deslizante, no el trigger.
        className="group-data-[variant=line]/tabs-list:data-[state=active]:border-transparent"
      >
        {t.label}
      </TabsTrigger>
    ))}
    <span
      ref={indicatorRef}
      aria-hidden
      className="pointer-events-none absolute -bottom-px left-0 h-0.5 w-0 bg-foreground transition-[transform,width] duration-300 ease-out motion-reduce:transition-none"
    />
  </TabsList>
  <TabsContent value="…">…</TabsContent>
</Tabs>

// En un efecto [tab]: medir el trigger activo (offsetLeft / offsetWidth) y
// escribir transform: translateX(px) + width en el indicador; guardar la última
// pestaña en un Map de módulo para que no salte al remontar.`;

/** Última pestaña por scope, en memoria de módulo: al remontar, el indicador nace en su sitio. */
const lastTabByScope = new Map<string, string>();

function isModuleTab(value: string): value is ModuleTab {
  return MODULE_TABS.some((tab) => tab.value === value);
}

function LineTabsDemo() {
  const scope = 'showcase-project-tabs';
  const [tab, setTab] = React.useState<ModuleTab>(() => {
    const remembered = lastTabByScope.get(scope);
    return remembered && isModuleTab(remembered) ? remembered : 'resumen';
  });
  const listRef = React.useRef<HTMLDivElement>(null);
  const indicatorRef = React.useRef<HTMLSpanElement>(null);

  // Mide el trigger activo y mueve el indicador; imperativo (sin estado) para
  // que el reposicionamiento por resize no re-renderice.
  React.useEffect(() => {
    lastTabByScope.set(scope, tab);
    const list = listRef.current;
    const indicator = indicatorRef.current;
    if (!list || !indicator) return;

    const place = () => {
      const active = list.querySelector<HTMLElement>('[data-state="active"]');
      if (!active) return;
      indicator.style.transform = `translateX(${active.offsetLeft}px)`;
      indicator.style.width = `${active.offsetWidth}px`;
    };
    place();

    const observer = new ResizeObserver(place);
    observer.observe(list);
    return () => observer.disconnect();
  }, [tab]);

  return (
    <div className="space-y-4">
      <Tabs
        value={tab}
        onValueChange={(value) => {
          if (isModuleTab(value)) setTab(value);
        }}
      >
        <TabsList ref={listRef} variant="line" className="relative w-full justify-start gap-0">
          {MODULE_TABS.map((item) => (
            <TabsTrigger
              key={item.value}
              value={item.value}
              className="group-data-[variant=line]/tabs-list:data-[state=active]:border-transparent"
            >
              {item.label}
              {'count' in item && <RowPill>{item.count}</RowPill>}
            </TabsTrigger>
          ))}
          <span
            ref={indicatorRef}
            aria-hidden
            className="pointer-events-none absolute -bottom-px left-0 h-0.5 w-0 bg-foreground transition-[transform,width] duration-300 ease-out motion-reduce:transition-none"
          />
        </TabsList>
        {MODULE_TABS.map((item) => (
          <TabsContent key={item.value} value={item.value} className="pt-2">
            <div className={cn(DETAIL_CARD_CLASS, 'p-5')}>
              <p className="text-sm font-semibold text-text-primary">{item.label}</p>
              <p className="mt-1 text-sm text-text-secondary">
                Contenido del tab «{item.label}». Entra con fade-in y 4 px de subida; cada tab es
                ?tab= en la URL.
              </p>
            </div>
          </TabsContent>
        ))}
      </Tabs>
      <CopyJSXButton code={LINE_TABS_JSX} label="Copiar receta de tabs" />
    </div>
  );
}

// 9.2 ------------------------------------------------------------------------

function PillTabsDemo() {
  return (
    <div className="max-w-xl">
      <StepCard
        step={2}
        title="Método de pago"
        hint="Píldoras sobre bg-muted: solo dentro de formularios."
      >
        <Tabs defaultValue="transfer">
          <TabsList>
            <TabsTrigger value="transfer">
              <Landmark strokeWidth={1.5} />
              Transferencia
            </TabsTrigger>
            <TabsTrigger value="cash">
              <Banknote strokeWidth={1.5} />
              Efectivo
            </TabsTrigger>
            <TabsTrigger value="card">
              <CreditCard strokeWidth={1.5} />
              Tarjeta
            </TabsTrigger>
          </TabsList>
          <TabsContent value="transfer" className="space-y-3 pt-1">
            <Field label="Referencia" required>
              <Input placeholder="Últimos dígitos o folio" className="bg-bg-base" />
            </Field>
            <Field label="Cuenta destino">
              <Input placeholder="Cuenta de la empresa" className="bg-bg-base" />
            </Field>
          </TabsContent>
          <TabsContent value="cash" className="pt-1">
            <Field label="Recibido por">
              <Input placeholder="Nombre de quien recibe" className="bg-bg-base" />
            </Field>
          </TabsContent>
          <TabsContent value="card" className="pt-1">
            <Field label="Terminal">
              <Input placeholder="Últimos 4 dígitos" className="bg-bg-base tabular-nums" />
            </Field>
          </TabsContent>
        </Tabs>
      </StepCard>
    </div>
  );
}

// 9.3 ------------------------------------------------------------------------

function SegmentedDemo() {
  const [pipeline, setPipeline] = React.useState<'todo' | 'abiertas' | 'cerradas'>('todo');
  const [layout, setLayout] = React.useState<'lista' | 'kanban'>('lista');
  const [kind, setKind] = React.useState<'persona' | 'empresa' | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <SegmentedControl
          variant="switch"
          className="w-auto"
          aria-label="Filtro de estado"
          value={pipeline}
          onChange={setPipeline}
          options={[
            { value: 'todo', label: 'Todo · 24' },
            { value: 'abiertas', label: 'Abiertas · 9' },
            { value: 'cerradas', label: 'Cerradas · 15' },
          ]}
        />
        <SegmentedControl
          variant="switch"
          className="w-auto"
          aria-label="Vista"
          value={layout}
          onChange={setLayout}
          options={[
            { value: 'lista', label: 'Lista', icon: List },
            { value: 'kanban', label: 'Kanban', icon: Kanban },
          ]}
        />
        <p className="text-xs tabular-nums text-text-tertiary">
          {pipeline} · {layout}
        </p>
      </div>

      <div className="max-w-sm space-y-2">
        <p className="text-xs text-text-tertiary">
          variant=tint con value=null: sin selección hasta que el usuario elige
        </p>
        <SegmentedControl
          variant="tint"
          aria-label="Tipo"
          value={kind}
          onChange={setKind}
          options={[
            { value: 'persona', label: 'Persona' },
            { value: 'empresa', label: 'Empresa' },
          ]}
        />
      </div>
    </div>
  );
}

// 9.4 ------------------------------------------------------------------------

function BreadcrumbDemo() {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Ruta corta (página de detalle)</p>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Proyectos</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Casa Montejo</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div>
        <p className="mb-2 text-xs text-text-tertiary">Ruta larga con elipsis (Configuración)</p>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Configuración</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Catálogos</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Categorías de gasto</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}

// 9.5 ------------------------------------------------------------------------

const UNITS = [
  { name: 'Depto 101', rent: 12500 },
  { name: 'Depto 102', rent: 11800 },
  { name: 'Local PB', rent: 18500 },
];

const ADDRESS_FIELDS = [
  { label: 'Calle', value: 'Calle 60 #480' },
  { label: 'Colonia', value: 'Centro' },
  { label: 'Ciudad', value: 'Mérida, Yucatán' },
  { label: 'Código postal', value: '97000' },
];

function DisclosureDemo() {
  return (
    <div className="space-y-4">
      <div className={cn(DETAIL_CARD_CLASS, 'max-w-2xl divide-y divide-border-subtle')}>
        <DisclosureRow title="Unidades" badge={<RowPill>{UNITS.length}</RowPill>} defaultOpen>
          <ul className="divide-y divide-border-subtle border-t border-border-subtle">
            {UNITS.map((unit) => (
              <li
                key={unit.name}
                className="flex items-center justify-between px-6 py-2.5 text-sm transition-colors duration-150 hover:bg-row-hover"
              >
                <span className="text-text-primary">{unit.name}</span>
                <span className="tabular-nums text-text-secondary">
                  {formatCurrency(unit.rent)}
                </span>
              </li>
            ))}
          </ul>
        </DisclosureRow>
        <DisclosureRow title="Dirección" summary="Calle 60 #480, Centro, Mérida">
          <dl className="grid gap-x-6 gap-y-3 px-6 pb-5 sm:grid-cols-2">
            {ADDRESS_FIELDS.map((field) => (
              <div key={field.label}>
                <dt className="text-xs text-text-secondary">{field.label}</dt>
                <dd className="text-sm text-text-primary">{field.value}</dd>
              </div>
            ))}
          </dl>
        </DisclosureRow>
      </div>

      <Collapsible className={cn(DETAIL_CARD_CLASS, 'max-w-2xl')}>
        <CollapsibleTrigger className="group flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-text-primary outline-none focus-visible:shadow-focus">
          <ChevronRight
            className="size-4 shrink-0 text-text-tertiary transition-transform duration-200 group-data-[state=open]:rotate-90 motion-reduce:transition-none"
            strokeWidth={1.5}
          />
          Notas internas
          <span className="ml-auto text-xs font-normal text-text-tertiary">
            Solo para el equipo
          </span>
        </CollapsibleTrigger>
        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down motion-reduce:animate-none">
          <p className="px-4 pb-4 text-sm text-text-secondary">
            El propietario prefiere que los avisos lleguen por WhatsApp y que las visitas se
            programen después de las 10:00.
          </p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

// 9.6 ------------------------------------------------------------------------

function PaginationDemo() {
  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <p className="text-sm tabular-nums text-text-tertiary">Mostrando 21–30 de 87 resultados</p>
      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationLink
              href="#"
              size="default"
              aria-label="Página anterior"
              className="gap-1 px-2.5"
            >
              <ChevronLeft strokeWidth={1.5} />
              <span className="hidden sm:block">Anterior</span>
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              3
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">9</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href="#"
              size="default"
              aria-label="Página siguiente"
              className="gap-1 px-2.5"
            >
              <span className="hidden sm:block">Siguiente</span>
              <ChevronRight strokeWidth={1.5} />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

// 9.7 ------------------------------------------------------------------------

const SIDEBAR_SPEC = [
  {
    term: 'Variante',
    detail:
      'inset: la vista (SidebarInset) lleva m-2 rounded-xl shadow-md z-20 y flota sobre el marco gris bg-sidebar.',
  },
  {
    term: 'Anchos',
    detail: '256 px expandido · 48 px en modo icono · 288 px en móvil (SIDEBAR_WIDTH_*).',
  },
  {
    term: 'Fondo',
    detail:
      'bg-sidebar = bg-elevated en claro y bg-surface en oscuro; ítem activo con bg-sidebar-accent; foco shadow-focus.',
  },
  {
    term: 'Grupos',
    detail:
      'Módulos operativos arriba. «Sistema» (Configuración, Usuarios, Archivos) es un drilldown: reemplaza la lista con un segundo nivel y «← Volver».',
  },
  {
    term: 'Sin topbar',
    detail: 'No hay barra global: las acciones viven junto al contenido (toolbar o tabs, M0).',
  },
];

function SidebarNote() {
  return (
    <div className="flex max-w-2xl items-start gap-3 rounded-lg border border-border-subtle bg-bg-surface px-4 py-4">
      <Info className="mt-0.5 size-4 shrink-0 text-text-tertiary" strokeWidth={1.5} />
      <dl className="grid flex-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-[120px_1fr]">
        {SIDEBAR_SPEC.map((row) => (
          <React.Fragment key={row.term}>
            <dt className="text-text-tertiary">{row.term}</dt>
            <dd className="text-text-secondary">{row.detail}</dd>
          </React.Fragment>
        ))}
      </dl>
    </div>
  );
}
