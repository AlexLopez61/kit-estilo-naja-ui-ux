'use client';

import {
  Activity,
  Building2,
  ChevronDown,
  Compass,
  IdCard,
  Layers,
  LayoutDashboard,
  ListChecks,
  MoreHorizontal,
  Palette,
  PanelLeft,
  PanelLeftClose,
  Sparkles,
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
    label: 'Foundations',
    icon: Palette,
    items: [
      { id: 'colores', label: 'Colores' },
      { id: 'tipografia', label: 'Tipografía' },
      { id: 'spacing', label: 'Spacing' },
      { id: 'border-radius', label: 'Radius' },
      { id: 'shadows', label: 'Sombras' },
    ],
  },
  {
    id: 'atoms',
    label: 'Atoms',
    icon: Square,
    items: [
      { id: 'botones', label: 'Botones' },
      { id: 'badges', label: 'Badges' },
      { id: 'inputs', label: 'Inputs' },
      { id: 'avatares', label: 'Avatares' },
      { id: 'iconos', label: 'Iconos' },
    ],
  },
  {
    id: 'composites',
    label: 'Composites',
    icon: LayoutDashboard,
    items: [
      { id: 'cards', label: 'Cards' },
      { id: 'lista-densa', label: 'Listas' },
      { id: 'tabla', label: 'Tablas' },
      { id: 'tabs', label: 'Tabs' },
      { id: 'dropdown-menu', label: 'Dropdowns' },
      { id: 'modal-inline', label: 'Modales' },
      { id: 'tooltips', label: 'Tooltips' },
    ],
  },
  {
    id: 'patterns',
    label: 'Patterns NAJA',
    icon: Building2,
    items: [
      { id: 'kpi-card', label: 'KPI cards' },
      { id: 'card-de-cotizacion', label: 'Card de cotización' },
      { id: 'card-de-proyecto', label: 'Card de proyecto' },
      { id: 'card-de-pagare', label: 'Card de pagaré' },
      { id: 'empty-state', label: 'Empty state' },
      { id: 'bento-dashboard', label: 'Bento dashboard' },
    ],
  },
  {
    id: 'states',
    label: 'States',
    icon: Activity,
    items: [
      { id: 'loading-states', label: 'Loading' },
      { id: 'estados-de-error', label: 'Errores' },
      { id: 'notificaciones-toasts', label: 'Notificaciones' },
      { id: 'progress-indicators', label: 'Progress' },
    ],
  },
  {
    id: 'form-controls',
    label: 'Form controls',
    icon: ListChecks,
    items: [
      { id: 'accordion', label: 'Accordion' },
      { id: 'switch', label: 'Switch' },
      { id: 'radio-group', label: 'Radio group' },
      { id: 'checkbox', label: 'Checkbox' },
      { id: 'date-picker', label: 'Date picker' },
      { id: 'calendar', label: 'Calendar' },
      { id: 'slider', label: 'Slider' },
      { id: 'toggle-group', label: 'Toggle group' },
    ],
  },
  {
    id: 'overlays',
    label: 'Overlays',
    icon: Layers,
    items: [
      { id: 'sheet', label: 'Sheet' },
      { id: 'hover-card', label: 'Hover card' },
      { id: 'command-palette', label: 'Command palette' },
      { id: 'combobox', label: 'Combobox' },
      { id: 'context-menu', label: 'Context menu' },
      { id: 'menubar', label: 'Menubar' },
    ],
  },
  {
    id: 'modals',
    label: 'Modales',
    icon: SquareStack,
    items: [
      { id: 'modal-proveedor-form', label: 'Formulario largo' },
      { id: 'modal-confirm-delete', label: 'Confirmación' },
      { id: 'modal-detail', label: 'Detalle' },
      { id: 'modal-quick-form', label: 'Formulario corto' },
      { id: 'modal-wizard', label: 'Wizard' },
      { id: 'modal-naja-props', label: 'NajaModal props' },
    ],
  },
  {
    id: 'navigation',
    label: 'Navigation',
    icon: Compass,
    items: [
      { id: 'breadcrumb', label: 'Breadcrumb' },
      { id: 'pagination', label: 'Pagination' },
    ],
  },
  {
    id: 'domain-cards',
    label: 'Domain cards',
    icon: IdCard,
    items: [
      { id: 'card-cliente', label: 'Cliente' },
      { id: 'card-propietario', label: 'Propietario' },
      { id: 'card-inquilino', label: 'Inquilino' },
      { id: 'card-propiedad', label: 'Propiedad' },
      { id: 'card-unidad', label: 'Unidad' },
      { id: 'card-contrato', label: 'Contrato' },
      { id: 'card-subcontratista', label: 'Subcontratista' },
    ],
  },
  {
    id: 'misc',
    label: 'Misc',
    icon: MoreHorizontal,
    items: [
      { id: 'skeleton', label: 'Skeleton (variantes)' },
      { id: 'carousel', label: 'Carousel' },
      { id: 'resizable', label: 'Resizable panels' },
    ],
  },
  {
    id: 'inspiration',
    label: 'Inspiration',
    icon: Sparkles,
    items: [
      { id: 'huly-hero', label: 'Huly hero' },
      { id: 'linear-list', label: 'Linear list' },
      { id: 'vercel-kpi', label: 'Vercel KPI' },
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
            <p className="truncate text-xs tracking-[-0.01em] text-text-primary">Soft Bento Dark</p>
            <p className="text-[11px] text-text-tertiary">v1.0.1</p>
          </div>
        )}
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? 'Expandir navegación' : 'Colapsar navegación'}
          aria-pressed={collapsed}
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-text-tertiary outline-none transition-colors hover:bg-bg-elevated hover:text-text-primary focus-visible:ring-2 focus-visible:ring-brand"
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
        <span className="flex-1 truncate text-left text-xs uppercase tracking-wider">
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
                    ? 'border-brand bg-bg-elevated text-text-primary'
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
