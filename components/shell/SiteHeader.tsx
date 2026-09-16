'use client';

import * as React from 'react';
import type { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Switch } from '@/components/ui/switch';
import { NAVIGATION } from '@/lib/navigation';
import { cn } from '@/lib/utils';

type Crumb = { label: string; href: Route };

function navItemForHref(href: string): Crumb | null {
  for (const group of NAVIGATION) {
    for (const item of group.items) {
      if (item.href === href) return { label: item.label, href: item.href };
    }
  }
  return null;
}

/**
 * Breadcrumb de ubicación derivado del pathname contra NAVIGATION. Se detiene
 * en el primer segmento no resoluble (ids dinámicos), así nunca muestra ids.
 */
function crumbsFromPathname(pathname: string): Crumb[] {
  const segments = pathname.split('/').filter(Boolean);
  const crumbs: Crumb[] = [];
  let cumulative = '';
  for (const segment of segments) {
    cumulative += `/${segment}`;
    const match = navItemForHref(cumulative);
    if (!match) break;
    crumbs.push(match);
  }
  return crumbs;
}

/**
 * Barra superior mínima de la vista: trigger del sidebar, breadcrumb y
 * conmutador de tema. Superficie plana del piso, sin blur ni transparencia.
 */
export function SiteHeader({ appName = 'Inicio' }: { appName?: string }) {
  const pathname = usePathname();
  const crumbs = crumbsFromPathname(pathname);
  const { resolvedTheme, setTheme } = useTheme();
  // Hidratación segura sin efecto: false en SSR/primer render, true tras montar.
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const isDark = mounted && resolvedTheme === 'dark';

  function handleThemeChange(checked: boolean) {
    const next = checked ? 'dark' : 'light';
    if (typeof document.startViewTransition === 'function') {
      document.documentElement.setAttribute('data-theme-transitioning', '');
      const t = document.startViewTransition(() => setTheme(next));
      t.finished.finally(() => {
        document.documentElement.removeAttribute('data-theme-transitioning');
      });
    } else {
      setTheme(next);
    }
  }

  return (
    <header className="bg-background flex h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb className="flex-1">
          <BreadcrumbList>
            {crumbs.length === 0 ? (
              <BreadcrumbItem>
                <BreadcrumbPage>{appName}</BreadcrumbPage>
              </BreadcrumbItem>
            ) : (
              crumbs.map((crumb, idx) => {
                const isLast = idx === crumbs.length - 1;
                return (
                  <React.Fragment key={crumb.href}>
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link href={crumb.href}>{crumb.label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </React.Fragment>
                );
              })
            )}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-1.5">
          <Sun
            className={cn(
              'size-3.5 transition-all duration-300',
              isDark ? 'text-text-disabled rotate-90 scale-75' : 'text-warning-text rotate-0 scale-100',
            )}
          />
          <Switch checked={isDark} onCheckedChange={handleThemeChange} aria-label="Cambiar tema" />
          <Moon
            className={cn(
              'size-3.5 transition-all duration-300',
              isDark ? 'text-info-text rotate-0 scale-100' : 'text-text-disabled -rotate-90 scale-75',
            )}
          />
        </div>
      </div>
    </header>
  );
}
