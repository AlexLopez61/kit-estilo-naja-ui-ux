'use client';

import {
  Activity,
  ChevronDown,
  Compass,
  Layers,
  LayoutDashboard,
  LayoutTemplate,
  ListChecks,
  MoreHorizontal,
  Palette,
  PanelLeft,
  PanelLeftClose,
  Square,
  SquareStack,
  type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';

export type NavItem = { id: string; label: string };
export type NavCategory = {
  id: string;
  label: string;
  icon: LucideIcon;
  items: NavItem[];
};

/**
 * Modelo de navegación del showcase. Cada categoría apunta a un `<Section id>`
 * y cada item a un `<Subsection id>` (slug derivado del título, ver Subsection).
 */
export const SHOWCASE_NAV: NavCategory[] = [
  {
    id: 'foundations',
    label: 'Fundamentos',
    icon: Palette,
    items: [
      { id: 'colores', label: 'Colores' },
      { id: 'tipografia', label: 'Tipografía' },
      { id: 'radios', label: 'Radios' },
      { id: 'elevacion', label: 'Escala de elevación' },
      { id: 'espaciado', label: 'Espaciado' },
      { id: 'interaccion', label: 'Interacción' },
    ],
  },
  {
    id: 'atoms',
    label: 'Átomos',
    icon: Square,
    items: [
      { id: 'botones', label: 'Botones' },
      { id: 'badges', label: 'Badges' },
      { id: 'avatares', label: 'Avatares' },
      { id: 'inputs', label: 'Inputs' },
      { id: 'iconos', label: 'Iconos' },
      { id: 'kbd-y-separator', label: 'Kbd y Separator' },
    ],
  },
  {
    id: 'composites',
    label: 'Cards y tablas',
    icon: LayoutDashboard,
    items: [
      { id: 'cards', label: 'Cards' },
      { id: 'tiles', label: 'Tiles y medidores' },
      { id: 'tabla', label: 'Tabla deployments' },
      { id: 'settings-card', label: 'SettingsCard y DisclosureRow' },
      { id: 'lista-densa', label: 'Listas densas' },
    ],
  },
  {
    id: 'patterns',
    label: 'Moldes de pantalla',
    icon: LayoutTemplate,
    items: [
      { id: 'm0-anatomia-de-pagina', label: 'M0 · Anatomía de página' },
      { id: 'm1-lista-plana', label: 'M1 · Lista plana' },
      { id: 'm2-m3-lista-y-ficha', label: 'M2 + M3 · Lista + ficha' },
      { id: 'm4-ficha-en-pagina', label: 'M4 · Ficha en página' },
      { id: 'm5-cockpit', label: 'M5 · Cockpit' },
    ],
  },
  {
    id: 'states',
    label: 'Estados',
    icon: Activity,
    items: [
      { id: 'estado-vacio', label: 'Vacío' },
      { id: 'loading-states', label: 'Cargando' },
      { id: 'spinner', label: 'Spinner' },
      { id: 'toasts', label: 'Toasts' },
      { id: 'action-error-alert', label: 'Error y concurrencia' },
      { id: 'progress', label: 'Progreso y calificación' },
      { id: 'permisos', label: 'Permisos' },
    ],
  },
  {
    id: 'form-controls',
    label: 'Formularios',
    icon: ListChecks,
    items: [
      { id: 'labels-y-fields', label: 'Label y Field' },
      { id: 'step-card-y-form-card', label: 'StepCard y FormCard' },
      { id: 'segmented-control', label: 'SegmentedControl' },
      { id: 'checkbox', label: 'Checkbox' },
      { id: 'radio-group', label: 'Radio group' },
      { id: 'switch', label: 'Switch' },
      { id: 'slider', label: 'Slider' },
      { id: 'toggle-group', label: 'Toggle group' },
      { id: 'date-picker', label: 'Date picker' },
      { id: 'month-picker', label: 'MonthPicker' },
      { id: 'combobox', label: 'Combobox y FilterSelect' },
      { id: 'password-y-copy-field', label: 'Password y CopyField' },
      { id: 'chips', label: 'Chips' },
    ],
  },
  {
    id: 'overlays',
    label: 'Overlays',
    icon: Layers,
    items: [
      { id: 'dropdown', label: 'Dropdown menu' },
      { id: 'context-menu', label: 'Context menu' },
      { id: 'popover', label: 'Popover' },
      { id: 'tooltip', label: 'Tooltip' },
      { id: 'hover-card', label: 'Hover card' },
      { id: 'command-palette', label: 'Command palette' },
      { id: 'menubar', label: 'Menubar' },
    ],
  },
  {
    id: 'modals',
    label: 'Modales y drawers',
    icon: SquareStack,
    items: [
      { id: 'modal-formulario', label: 'M8 · Formulario' },
      { id: 'modal-confirmacion', label: 'Contexto y desglose' },
      { id: 'modal-exito', label: 'Éxito' },
      { id: 'modal-confirm-delete', label: 'M9 · Destructivo' },
      { id: 'modal-quick-form', label: 'QuickFormModal' },
      { id: 'modal-detail', label: 'DetailModal' },
      { id: 'modal-wizard', label: 'WizardModal' },
      { id: 'drawer-alta', label: 'M6 · Drawer de alta' },
      { id: 'drawer-vaul', label: 'Drawer (vaul)' },
      { id: 'modal-naja-props', label: 'NajaModal · props' },
    ],
  },
  {
    id: 'navigation',
    label: 'Navegación',
    icon: Compass,
    items: [
      { id: 'tabs-modulo', label: 'Tabs de módulo' },
      { id: 'tabs-pildoras', label: 'Tabs píldoras' },
      { id: 'segmented-vista', label: 'Selector de vista' },
      { id: 'breadcrumb', label: 'Breadcrumb' },
      { id: 'disclosure-row', label: 'DisclosureRow' },
      { id: 'pagination', label: 'Pagination' },
      { id: 'sidebar', label: 'Sidebar' },
    ],
  },
  {
    id: 'misc',
    label: 'Misceláneos',
    icon: MoreHorizontal,
    items: [
      { id: 'skeleton', label: 'Skeleton' },
      { id: 'carousel', label: 'Carousel' },
      { id: 'resizable', label: 'Resizable' },
      { id: 'slide-transition', label: 'SlideTransition' },
    ],
  },
];

type Props = {
  collapsed: boolean;
  onToggle: () => void;
  /** id de la subsección o sección actualmente en viewport. */
  activeId: string | null;
  /** id de la categoría cuya sección/subsección está en viewport. */
  activeCategory: string | null;
  onNavigate: (id: string) => void;
};

export function ShowcaseSidebar({
  collapsed,
  onToggle,
  activeId,
  activeCategory,
  onNavigate,
}: Props) {
  return (
    <aside
      data-inspector-ui
      style={{ width: collapsed ? 56 : 240 }}
      className="fixed left-0 top-0 z-30 flex h-screen flex-col overflow-hidden border-r border-border-subtle bg-bg-surface transition-[width] duration-200 ease-out"
    >
      {/* Header + toggle */}
      <div
        className={`flex shrink-0 items-center gap-2 border-b border-border-subtle px-3 py-3 ${
          collapsed ? 'justify-center' : 'justify-between'
        }`}
      >
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-xs tracking-[-0.01em] text-text-primary">Kit Estilo NAJA</p>
            <p className="text-[11px] text-text-tertiary">v1.0.1</p>
          </div>
        )}
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? 'Expandir navegación' : 'Colapsar navegación'}
          aria-pressed={collapsed}
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-text-tertiary outline-none transition-colors hover:bg-bg-elevated hover:text-text-primary focus-visible:shadow-focus"
        >
          {collapsed ? (
            <PanelLeft className="size-4" strokeWidth={1.5} />
          ) : (
            <PanelLeftClose className="size-4" strokeWidth={1.5} />
          )}
        </button>
      </div>

      {/* Navegación scrolleable */}
      <nav className="min-h-0 flex-1 overflow-y-auto px-2 py-3">
        {SHOWCASE_NAV.map((cat) => (
          <CategoryBlock
            key={cat.id}
            category={cat}
            collapsed={collapsed}
            activeId={activeId}
            activeCategory={activeCategory}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
    </aside>
  );
}

function CategoryBlock({
  category,
  collapsed,
  activeId,
  activeCategory,
  onNavigate,
}: {
  category: NavCategory;
  collapsed: boolean;
  activeId: string | null;
  activeCategory: string | null;
  onNavigate: (id: string) => void;
}) {
  const Icon = category.icon;
  const isActiveCat = activeCategory === category.id;
  const [open, setOpen] = useState(true);

  if (collapsed) {
    return (
      <div className="group/icon relative mb-1 flex justify-center">
        <a
          href={`#${category.id}`}
          onClick={(e) => {
            e.preventDefault();
            onNavigate(category.id);
          }}
          aria-label={category.label}
          className={`flex size-9 items-center justify-center rounded-md transition-colors ${
            isActiveCat
              ? 'bg-bg-elevated text-text-primary'
              : 'text-text-tertiary hover:bg-bg-elevated hover:text-text-primary'
          }`}
        >
          <Icon className="size-4" strokeWidth={1.5} />
        </a>
        {/* Tooltip al hover */}
        <span className="pointer-events-none absolute left-full top-1/2 z-40 ml-2 -translate-y-1/2 whitespace-nowrap rounded-sm border border-border-default bg-bg-overlay px-2 py-1 text-xs text-text-primary opacity-0 shadow-md transition-opacity group-hover/icon:opacity-100">
          {category.label}
        </span>
      </div>
    );
  }

  return (
    <div className="mb-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 transition-colors ${
          isActiveCat ? 'text-text-primary' : 'text-text-tertiary'
        } hover:bg-bg-elevated`}
      >
        <Icon className="size-4 shrink-0" strokeWidth={1.5} />
        <span className="flex-1 truncate text-left text-xs font-medium">
          {category.label}
        </span>
        <ChevronDown
          className={`size-3.5 shrink-0 transition-transform duration-150 ${
            open ? '' : '-rotate-90'
          }`}
          strokeWidth={1.5}
        />
      </button>
      {open && (
        <div className="mt-0.5 space-y-0.5 pl-3">
          {category.items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(item.id);
                }}
                aria-current={isActive ? 'true' : undefined}
                className={`block truncate border-l-2 px-3 py-1.5 text-sm transition-colors duration-150 ${
                  isActive
                    ? 'border-foreground bg-bg-elevated text-text-primary'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
