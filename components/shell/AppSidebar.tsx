'use client';

import * as React from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { Boxes, type LucideIcon } from 'lucide-react';
import { NavMain } from '@/components/shell/NavMain';
import { NavUser, type NavUserProfile } from '@/components/shell/NavUser';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { filterNavigation } from '@/lib/navigation';

type AppSidebarProps = Omit<React.ComponentProps<typeof Sidebar>, 'role'> & {
  /** Nombre e icono de la app en la cabecera del sidebar. */
  brand?: { name: string; href?: Route; icon?: LucideIcon };
  /** Rol del usuario para filtrar items (`NavItem.roles`). */
  role: string | null;
  user: NavUserProfile;
  profileHref?: Route;
  onLogout?: () => void | Promise<void>;
};

export function AppSidebar({
  brand = { name: 'Mi app', icon: Boxes },
  role,
  user,
  profileHref,
  onLogout,
  ...props
}: AppSidebarProps) {
  const groups = React.useMemo(() => filterNavigation(role), [role]);
  const BrandIcon = brand.icon ?? Boxes;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <Link href={brand.href ?? ('/' as Route)}>
                <BrandIcon className="size-5!" />
                <span className="text-base font-medium">{brand.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="overflow-x-hidden">
        <NavMain groups={groups} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} profileHref={profileHref} onLogout={onLogout} />
      </SidebarFooter>
    </Sidebar>
  );
}
