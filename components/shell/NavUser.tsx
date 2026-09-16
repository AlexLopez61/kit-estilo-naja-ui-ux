'use client';

import * as React from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { LogOut, MoreVertical, User as UserIcon } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

export type NavUserProfile = {
  name: string | null;
  email: string;
  /** Etiqueta legible del rol («Admin», «Coordinador»). */
  roleLabel?: string | null;
  avatarUrl?: string | null;
};

/**
 * Pie del sidebar: avatar + nombre + rol, con menú de perfil y cierre de
 * sesión. `onLogout` recibe la acción del proyecto (Server Action, fetch…).
 */
export function NavUser({
  user,
  profileHref,
  onLogout,
}: {
  user: NavUserProfile;
  profileHref?: Route;
  onLogout?: () => void | Promise<void>;
}) {
  const { isMobile } = useSidebar();
  const displayName = user.name ?? user.email;
  const avatarName = user.name ?? user.email;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar
                className="h-8 w-8"
                size={32}
                name={avatarName}
                src={user.avatarUrl ?? undefined}
              />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.roleLabel ?? user.email}
                </span>
              </div>
              <MoreVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar
                  className="h-8 w-8"
                  size={32}
                  name={avatarName}
                  src={user.avatarUrl ?? undefined}
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="text-muted-foreground truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            {profileHref && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href={profileHref}>
                      <UserIcon />
                      Mi perfil
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </>
            )}
            {onLogout && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onSelect={() => void onLogout()}>
                  <LogOut />
                  Cerrar sesión
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
