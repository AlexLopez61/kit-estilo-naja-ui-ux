import type { Route } from 'next';
import {
  Cog,
  FolderOpen,
  Home,
  LayoutGrid,
  Palette,
  Settings,
  UserRound,
  type LucideIcon,
} from 'lucide-react';

/**
 * Navegación del shell. Cada software declara aquí sus grupos; el sidebar
 * (`components/shell/AppSidebar`) y el breadcrumb (`SiteHeader`) los leen.
 *
 * - Grupo sin `label`: sus items van planos al nivel superior.
 * - Grupo con `label`: acordeón plegable (persistido en localStorage).
 * - `drilldown`: en vez de acordeón, el sidebar se reemplaza por los items del
 *   grupo con un botón «Volver» (estilo Vercel), ideal para «Sistema».
 * - `roles`: si se omite, todos los usuarios autenticados ven el item.
 */
export type NavItem = {
  href: Route;
  label: string;
  icon: LucideIcon;
  roles?: string[];
};

export type NavGroup = {
  label?: string;
  icon?: LucideIcon;
  drilldown?: boolean;
  items: NavItem[];
};

export const NAVIGATION: NavGroup[] = [
  {
    items: [{ href: '/demo' as Route, label: 'Inicio', icon: Home }],
  },
  {
    label: 'Módulos de ejemplo',
    icon: LayoutGrid,
    items: [
      { href: '/demo/lista' as Route, label: 'Lista + ficha', icon: FolderOpen },
      { href: '/demo/ficha' as Route, label: 'Ficha en página', icon: UserRound },
    ],
  },
  {
    items: [{ href: '/design-system' as Route, label: 'Sistema de diseño', icon: Palette }],
  },
  {
    label: 'Sistema',
    icon: Cog,
    drilldown: true,
    items: [
      {
        href: '/demo/configuracion' as Route,
        label: 'Configuración',
        icon: Settings,
        roles: ['admin'],
      },
    ],
  },
];

export function filterNavigation(role: string | null): NavGroup[] {
  return NAVIGATION.map((group) => ({
    ...group,
    items: group.items.filter(
      (item) => !item.roles || (role !== null && item.roles.includes(role)),
    ),
  })).filter((group) => group.items.length > 0);
}
