import {
  Building2,
  Calendar,
  ChevronDown,
  ChevronRight,
  Copy,
  Edit,
  MoreHorizontal,
  Share2,
  Trash2,
  User,
  X,
} from 'lucide-react';
import { ReactNode } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CopyJSXButton } from '../_components/CopyJSXButton';
import { Section } from '../_components/Section';
import { ShowcaseTabs } from '../_components/ShowcaseTabs';
import { Subsection } from '../_components/Subsection';

const BASIC_CARD_JSX = `<div className="rounded-lg border border-border-subtle bg-bg-surface p-5">
  <h4 className="text-base text-text-primary">Card básica</h4>
  <p className="mt-2 text-sm text-text-secondary">
    Header + body. El patrón más común para presentar resúmenes de entidades.
  </p>
</div>`;

type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const formatMXN = (n: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);

type Project = {
  initial: string;
  name: string;
  meta: string;
  status: string;
  statusTone: Tone;
};

const PROJECTS_LIST: Project[] = [
  {
    initial: 'CM',
    name: 'Pintura fachada Casa Montejo',
    meta: 'Iniciado hace 3 días · María Pérez',
    status: 'En progreso',
    statusTone: 'info',
  },
  {
    initial: 'GG',
    name: 'Plomería baño principal',
    meta: 'Iniciado hace 1 semana · Juan Hernández',
    status: 'En revisión',
    statusTone: 'warning',
  },
  {
    initial: 'LI',
    name: 'Instalación eléctrica local Itzimná',
    meta: 'Cotización aprobada · Roberto García',
    status: 'Por iniciar',
    statusTone: 'neutral',
  },
  {
    initial: 'CT',
    name: 'Mantenimiento techo Casa Centro',
    meta: 'Iniciado hace 5 días · Ana Martínez',
    status: 'En progreso',
    statusTone: 'info',
  },
  {
    initial: 'CC',
    name: 'Reparación impermeable Cancún',
    meta: 'Iniciado hace 2 semanas · Carlos Rivera',
    status: 'Finalizando',
    statusTone: 'success',
  },
  {
    initial: 'MN',
    name: 'Pintura interior Depto Mérida Norte',
    meta: 'Cotización pendiente · Patricia Solís',
    status: 'Cotizando',
    statusTone: 'warning',
  },
  {
    initial: 'CT',
    name: 'Cambio de pisos Casa Tulum',
    meta: 'Iniciado hace 1 día · Diego Castillo',
    status: 'En progreso',
    statusTone: 'info',
  },
  {
    initial: 'LP',
    name: 'Persiana Local Polanco',
    meta: 'Vencido · Sofía Mendoza',
    status: 'Atrasado',
    statusTone: 'danger',
  },
  {
    initial: 'CM',
    name: 'Mantenimiento jardín Casa Montejo',
    meta: 'Recurrente mensual · Luis Cruz',
    status: 'Finalizado',
    statusTone: 'success',
  },
  {
    initial: 'GG',
    name: 'Reparación calentador Depto García',
    meta: 'Hace 2 horas · Gabriela Ruiz',
    status: 'En progreso',
    statusTone: 'info',
  },
];

type Quote = {
  id: string;
  client: string;
  property: string;
  amount: number;
  status: string;
  tone: Tone;
};

const QUOTES_TABLE: Quote[] = [
  {
    id: 'COT-001',
    client: 'María Pérez',
    property: 'Casa Montejo',
    amount: 156890,
    status: 'Aprobada',
    tone: 'success',
  },
  {
    id: 'COT-002',
    client: 'Juan Hernández',
    property: 'Depto García Ginerés',
    amount: 48200,
    status: 'Pendiente',
    tone: 'warning',
  },
  {
    id: 'COT-003',
    client: 'Roberto García',
    property: 'Local Itzimná',
    amount: 84500,
    status: 'En revisión',
    tone: 'info',
  },
  {
    id: 'COT-004',
    client: 'Ana Martínez',
    property: 'Casa Centro',
    amount: 21300,
    status: 'Aprobada',
    tone: 'success',
  },
  {
    id: 'COT-005',
    client: 'Carlos Rivera',
    property: 'Casa Cancún',
    amount: 124750,
    status: 'Vencida',
    tone: 'danger',
  },
  {
    id: 'COT-006',
    client: 'Patricia Solís',
    property: 'Depto Mérida Norte',
    amount: 16400,
    status: 'Pendiente',
    tone: 'warning',
  },
  {
    id: 'COT-007',
    client: 'Diego Castillo',
    property: 'Casa Tulum',
    amount: 92800,
    status: 'Aprobada',
    tone: 'success',
  },
  {
    id: 'COT-008',
    client: 'Sofía Mendoza',
    property: 'Local Polanco',
    amount: 32100,
    status: 'Archivada',
    tone: 'neutral',
  },
  {
    id: 'COT-009',
    client: 'Luis Cruz',
    property: 'Casa Montejo',
    amount: 4500,
    status: 'Pendiente',
    tone: 'warning',
  },
  {
    id: 'COT-010',
    client: 'Gabriela Ruiz',
    property: 'Depto García Ginerés',
    amount: 67900,
    status: 'Aprobada',
    tone: 'success',
  },
];

export function CompositesSection() {
  return (
    <Section
      id="composites"
      title="Composites"
      description="Componentes compuestos: cards, listas densas, tablas, tabs, dropdown menus, modales y tooltips. Pensados como bloques de página."
    >
      <Subsection
        title="3.1 Cards"
        caption="Cuatro variantes: básica, clickeable con hover real, con dropdown de acciones, y compuesta con header + body + footer."
      >
        <div className="space-y-4">
          <div className="flex justify-end">
            <CopyJSXButton code={BASIC_CARD_JSX} label="Copiar JSX · card básica" />
          </div>
          <CardsGrid />
        </div>
      </Subsection>

      <Subsection
        title="3.2 Lista densa"
        caption="Rows compactas estilo Linear: avatar, título, metadata, badge y acción derecha. Hover funcional."
      >
        <DenseList />
      </Subsection>

      <Subsection
        title="3.3 Tabla"
        caption="Header sticky sentence case. Sin bordes verticales. Montos derecha con tabular-nums."
      >
        <QuotesTable />
      </Subsection>

      <Subsection
        title="3.4 Tabs"
        caption="Estilo Linear: indicador activo en línea inferior. Click cambia el panel (estado real shadcn)."
      >
        <ProjectTabs />
      </Subsection>

      <Subsection
        title="3.5 Dropdown menu"
        caption="Trigger funcional + mock estático del panel abierto para visualizar contenido sin clicks."
      >
        <DropdownDemo />
      </Subsection>

      <Subsection
        title="3.6 Modal inline"
        caption="Panel inline sin overlay real. Solo para mostrar estructura header + body + footer."
      >
        <ModalDemo />
      </Subsection>

      <Subsection
        title="3.7 Tooltips"
        caption="Tres tooltips simultáneos en posiciones top, bottom y right. Flecha apunta al trigger."
      >
        <TooltipDemo />
      </Subsection>
    </Section>
  );
}

function CardsGrid() {
  return (
    <div className="grid max-w-4xl grid-cols-1 gap-5 md:grid-cols-2">
      <BasicCard />
      <ClickableCard />
      <CardWithActions />
      <ThreePartCard />
    </div>
  );
}

function BasicCard() {
  return (
    <div className="rounded-lg border border-border-subtle bg-bg-surface p-5">
      <h4 className="text-base text-text-primary">Card básica</h4>
      <p className="mt-2 text-sm text-text-secondary">
        Header + body. Es el patrón más común para presentar resúmenes de entidades: clientes,
        proyectos, propiedades.
      </p>
    </div>
  );
}

function ClickableCard() {
  return (
    <a
      href="#"
      className="group block rounded-lg border border-border-subtle bg-bg-surface p-5 transition-colors hover:border-border-default hover:bg-bg-elevated"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-base text-text-primary">Card clickeable</h4>
          <p className="mt-2 text-sm text-text-secondary">
            Hover sube el fondo y oscurece el borde. Útil para grids de proyectos, propiedades o
            cualquier entidad listable.
          </p>
        </div>
        <ChevronRight
          className="mt-1 size-4 shrink-0 text-text-tertiary transition-colors group-hover:text-text-secondary"
          strokeWidth={1.5}
        />
      </div>
    </a>
  );
}

function CardWithActions() {
  return (
    <div className="rounded-lg border border-border-subtle bg-bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <h4 className="text-base text-text-primary">Card con acciones</h4>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex size-7 items-center justify-center rounded-md text-text-tertiary outline-none hover:bg-bg-elevated hover:text-text-primary focus-visible:ring-2 focus-visible:ring-brand"
            aria-label="Acciones"
          >
            <MoreHorizontal className="size-4" strokeWidth={1.5} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <Edit className="size-4" strokeWidth={1.5} />
              Editar
              <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share2 className="size-4" strokeWidth={1.5} />
              Compartir
              <DropdownMenuShortcut>⌘⇧S</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="size-4" strokeWidth={1.5} />
              Duplicar
              <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <Trash2 className="size-4" strokeWidth={1.5} />
              Eliminar
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="mt-2 text-sm text-text-secondary">
        Click en los tres puntos para abrir el menú de acciones contextuales.
      </p>
    </div>
  );
}

function ThreePartCard() {
  return (
    <div className="overflow-hidden rounded-lg border border-border-subtle bg-bg-surface">
      <div className="border-b border-border-subtle px-5 py-4">
        <h4 className="text-base text-text-primary">Estructura compuesta</h4>
        <p className="mt-0.5 text-xs text-text-tertiary">Header con título y subtítulo opcional</p>
      </div>
      <div className="px-5 py-4">
        <p className="text-sm text-text-secondary">
          Cuerpo principal de la card. Usado en vistas de detalle donde el contenido se separa del
          header y de las acciones.
        </p>
      </div>
      <div className="flex items-center justify-end gap-2 border-t border-border-subtle px-5 py-3">
        <button
          type="button"
          className="h-8 rounded-md px-3 text-sm text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
        >
          Cancelar
        </button>
        <button
          type="button"
          className="h-8 rounded-md bg-brand px-3 text-sm font-medium text-white hover:bg-brand-hover"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}

function DenseList() {
  return (
    <div className="overflow-hidden rounded-lg border border-border-subtle bg-bg-surface">
      {PROJECTS_LIST.map((p, i) => (
        <div
          key={i}
          className="flex items-center gap-3 border-b border-border-subtle px-4 py-2.5 transition-colors last:border-0 hover:bg-bg-elevated"
        >
          <Avatar initials={p.initial} size={24} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-text-primary">{p.name}</p>
            <p className="truncate text-xs text-text-tertiary">{p.meta}</p>
          </div>
          <div className="flex w-28 shrink-0 justify-start">
            <Badge tone={p.statusTone}>{p.status}</Badge>
          </div>
          <button
            type="button"
            className="flex size-6 items-center justify-center rounded-md text-text-tertiary hover:bg-bg-overlay hover:text-text-primary"
            aria-label="Acciones"
          >
            <MoreHorizontal className="size-4" strokeWidth={1.5} />
          </button>
        </div>
      ))}
    </div>
  );
}

function QuotesTable() {
  return (
    <div className="overflow-hidden rounded-lg border border-border-subtle bg-bg-surface">
      <table className="w-full">
        <thead className="border-b border-border-subtle bg-bg-elevated">
          <tr className="text-left">
            <th className="px-4 py-2.5 text-xs font-normal text-text-tertiary">Id</th>
            <th className="px-4 py-2.5 text-xs font-normal text-text-tertiary">Cliente</th>
            <th className="px-4 py-2.5 text-xs font-normal text-text-tertiary">Propiedad</th>
            <th className="px-4 py-2.5 text-right text-xs font-normal text-text-tertiary">
              Monto MXN
            </th>
            <th className="px-4 py-2.5 text-xs font-normal text-text-tertiary">Estado</th>
          </tr>
        </thead>
        <tbody>
          {QUOTES_TABLE.map((q) => (
            <tr
              key={q.id}
              className="border-b border-border-subtle transition-colors last:border-0 hover:bg-bg-elevated"
            >
              <td className="px-4 py-2.5 font-mono text-xs text-text-secondary">{q.id}</td>
              <td className="px-4 py-2.5 text-sm text-text-primary">{q.client}</td>
              <td className="px-4 py-2.5 text-sm text-text-secondary">{q.property}</td>
              <td className="px-4 py-2.5 text-right text-sm tabular-nums text-text-primary">
                {formatMXN(q.amount)}
              </td>
              <td className="px-4 py-2.5">
                <Badge tone={q.tone}>{q.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProjectTabs() {
  return (
    <div className="max-w-3xl">
      <ShowcaseTabs
        defaultValue="resumen"
        items={[
          {
            value: 'resumen',
            label: 'Resumen',
            content:
              'Vista general del proyecto con sus KPIs principales: presupuesto, avance, fecha estimada de cierre y subcontratistas asignados.',
          },
          {
            value: 'cotizaciones',
            label: 'Cotizaciones',
            content:
              'Listado de cotizaciones original + obras extra. Cada una con su estado y monto.',
          },
          {
            value: 'etapas',
            label: 'Etapas',
            content:
              'Subdivisión del proyecto en etapas con avance porcentual y fechas de inicio/cierre.',
          },
          {
            value: 'documentos',
            label: 'Documentos',
            content: 'Adjuntos del proyecto: planos, fotos de avance, comprobantes, contratos.',
          },
        ]}
      />
    </div>
  );
}

function DropdownDemo() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs text-text-tertiary">Dropdown funcional (shadcn)</p>
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex h-8 items-center gap-2 rounded-md border border-border-default bg-bg-elevated px-3 text-sm text-text-primary outline-none hover:bg-bg-overlay focus-visible:ring-2 focus-visible:ring-brand">
            Acciones
            <ChevronDown className="size-3.5 text-text-tertiary" strokeWidth={1.5} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem>
              <Edit className="size-4" strokeWidth={1.5} />
              Editar
              <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share2 className="size-4" strokeWidth={1.5} />
              Compartir
              <DropdownMenuShortcut>⌘⇧S</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="size-4" strokeWidth={1.5} />
              Duplicar
              <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <Trash2 className="size-4" strokeWidth={1.5} />
              Eliminar
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-text-tertiary">Mock estático del panel abierto (sin overlay)</p>
        <div className="w-56 rounded-md border border-border-default bg-bg-overlay p-1 shadow-md">
          <InlineDropdownItem icon={Edit} label="Editar" shortcut="⌘E" />
          <InlineDropdownItem icon={Share2} label="Compartir" shortcut="⌘⇧S" />
          <InlineDropdownItem icon={Copy} label="Duplicar" shortcut="⌘D" />
          <div className="my-1 h-px bg-border-subtle" />
          <InlineDropdownItem icon={Trash2} label="Eliminar" shortcut="⌘⌫" destructive />
        </div>
      </div>
    </div>
  );
}

function InlineDropdownItem({
  icon: Icon,
  label,
  shortcut,
  destructive,
}: {
  icon: typeof Edit;
  label: string;
  shortcut: string;
  destructive?: boolean;
}) {
  const colorClass = destructive ? 'text-danger-text' : 'text-text-primary';
  return (
    <div
      className={`flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm ${colorClass} hover:bg-bg-elevated`}
    >
      <Icon className="size-4" strokeWidth={1.5} />
      <span className="flex-1">{label}</span>
      <span className="font-mono text-xs text-text-tertiary">{shortcut}</span>
    </div>
  );
}

function ModalDemo() {
  return (
    <div className="mx-auto max-w-md overflow-hidden rounded-xl border border-border-subtle bg-bg-elevated shadow-lg">
      <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
        <h4 className="text-base text-text-primary">Confirmar eliminación</h4>
        <button
          type="button"
          className="flex size-6 items-center justify-center rounded-md text-text-tertiary hover:bg-bg-overlay hover:text-text-primary"
          aria-label="Cerrar"
        >
          <X className="size-4" strokeWidth={1.5} />
        </button>
      </div>
      <div className="px-6 py-5">
        <p className="text-sm text-text-secondary">
          ¿Estás seguro de eliminar la cotización{' '}
          <code className="rounded-sm bg-bg-overlay px-1.5 py-0.5 font-mono text-xs text-text-primary">
            COT-001
          </code>
          ? Esta acción no se puede deshacer.
        </p>
      </div>
      <div className="flex items-center justify-end gap-2 border-t border-border-subtle px-6 py-4">
        <button
          type="button"
          className="h-8 rounded-md px-3 text-sm text-text-secondary hover:bg-bg-overlay hover:text-text-primary"
        >
          Cancelar
        </button>
        <button
          type="button"
          className="h-8 rounded-md bg-danger px-3 text-sm font-medium text-white hover:bg-danger/90"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}

function TooltipDemo() {
  return (
    <div className="grid max-w-3xl grid-cols-3 gap-6 place-items-center pt-14 pb-12">
      <FakeTooltip placement="top" content="Tooltip arriba">
        <TooltipTrigger icon={Calendar} />
      </FakeTooltip>
      <FakeTooltip placement="bottom" content="Tooltip abajo">
        <TooltipTrigger icon={Building2} />
      </FakeTooltip>
      <FakeTooltip placement="right" content="Tooltip a la derecha">
        <TooltipTrigger icon={User} />
      </FakeTooltip>
    </div>
  );
}

function TooltipTrigger({ icon: Icon }: { icon: typeof Calendar }) {
  return (
    <button
      type="button"
      className="flex size-9 items-center justify-center rounded-md border border-border-default bg-bg-elevated text-text-secondary"
    >
      <Icon className="size-4" strokeWidth={1.5} />
    </button>
  );
}

function FakeTooltip({
  placement,
  content,
  children,
}: {
  placement: 'top' | 'bottom' | 'right';
  content: string;
  children: ReactNode;
}) {
  const bubbleBase =
    'absolute z-10 rounded-sm border border-border-default bg-bg-overlay px-2 py-1 text-xs whitespace-nowrap text-text-primary shadow-sm';
  const arrowBase = 'absolute size-2 rotate-45 border border-border-default bg-bg-overlay';

  return (
    <div className="relative inline-block">
      {children}
      {placement === 'top' && (
        <>
          <div className={`${bubbleBase} bottom-full left-1/2 mb-2 -translate-x-1/2`}>
            {content}
          </div>
          <div
            className={`${arrowBase} bottom-full left-1/2 -mb-1 -translate-x-1/2 border-t-transparent border-l-transparent`}
          />
        </>
      )}
      {placement === 'bottom' && (
        <>
          <div className={`${bubbleBase} top-full left-1/2 mt-2 -translate-x-1/2`}>{content}</div>
          <div
            className={`${arrowBase} top-full left-1/2 -mt-1 -translate-x-1/2 border-r-transparent border-b-transparent`}
          />
        </>
      )}
      {placement === 'right' && (
        <>
          <div className={`${bubbleBase} top-1/2 left-full ml-2 -translate-y-1/2`}>{content}</div>
          <div
            className={`${arrowBase} top-1/2 left-full -ml-1 -translate-y-1/2 border-t-transparent border-r-transparent`}
          />
        </>
      )}
    </div>
  );
}
