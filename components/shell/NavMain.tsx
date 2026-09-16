'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, CirclePlus, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import type { NavGroup, NavItem } from '@/lib/navigation';

const STORAGE_KEY = 'sidebar-collapsed-groups';

export function NavMain({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname();
  const { state } = useSidebar();
  // En modo icono no hay sub-listas (se ocultan); renderizamos los items planos
  // con su icono para no perder la navegación.
  const iconMode = state === 'collapsed';

  // Secciones plegadas (por label). Persistido en localStorage.
  const [collapsed, setCollapsed] = React.useState<Set<string>>(new Set());
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hidratación-safe
      if (raw) setCollapsed(new Set(JSON.parse(raw) as string[]));
    } catch {
      /* localStorage no disponible */
    }
  }, []);

  function toggleGroup(label: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        /* localStorage no disponible */
      }
      return next;
    });
  }

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  // Drill-down (estilo Vercel): label de la sección en la que estamos "dentro",
  // o null = sidebar principal. Se inicializa desde la ruta para que al cargar
  // directo en una página de la sección (p. ej. /configuracion) el sidebar entre
  // ya al detalle.
  const activeDrilldownLabel =
    groups.find((g) => g.drilldown && g.items.some((i) => isActive(i.href)))?.label ?? null;
  const [drilled, setDrilled] = React.useState<string | null>(activeDrilldownLabel);
  // Dirección de la última transición, para animar el slide: 'forward' entra al
  // detalle (desde la derecha), 'back' vuelve (desde la izquierda), 'none' no
  // anima (carga inicial y navegación normal dentro de la misma vista).
  const [dir, setDir] = React.useState<'forward' | 'back' | 'none'>('none');

  function goDrill(label: string | null) {
    setDir('forward');
    setDrilled(label);
  }
  function goRoot() {
    setDir('back');
    setDrilled(null);
  }

  // En cada cambio de ruta el sidebar refleja dónde estás: entra al detalle si
  // la ruta pertenece a una sección drill-down, y sale si no (evita que el drill
  // quede "pegado" al navegar fuera con el botón atrás o un link de la página).
  // Se ajusta en render (mismo patrón "estado derivado de prev" que el wizard),
  // no en efecto. Dentro de la misma ruta, "Volver" y el clic en la sección
  // mandan (onClick).
  const [prevPath, setPrevPath] = React.useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    if (activeDrilldownLabel !== drilled) {
      setDir(activeDrilldownLabel ? 'forward' : 'back');
      setDrilled(activeDrilldownLabel);
    }
  }

  const drilledGroup = drilled ? (groups.find((g) => g.label === drilled) ?? null) : null;
  const drillAnim =
    dir === 'forward' ? 'animate-in fade-in-0 slide-in-from-right-3 duration-200' : '';
  const rootAnim = dir === 'back' ? 'animate-in fade-in-0 slide-in-from-left-3 duration-200' : '';

  // Items planos (con icono): para las secciones sin título (Dashboard, Finanzas,
  // Calendario) y para el modo icono colapsado.
  function renderFlatItems(items: NavItem[]) {
    return (
      <SidebarMenu>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.label}>
                <Link href={item.href}>
                  <Icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    );
  }

  // Vista drill-down: reemplaza el sidebar por los items de la sección + un
  // botón "Volver". Solo en modo expandido; en modo icono se listan planos como
  // el resto (no hay espacio para el patrón).
  if (drilledGroup && !iconMode) {
    const GroupIcon = drilledGroup.icon;
    return (
      <div key="drill" className={cn('flex w-full flex-col gap-2', drillAnim)}>
        <SidebarGroup className="py-1">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={goRoot}
                className="text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft />
                <span>Volver</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="py-1">
          <SidebarGroupLabel className="flex items-center gap-2">
            {GroupIcon && <GroupIcon className="size-4" />}
            {drilledGroup.label}
          </SidebarGroupLabel>
          <SidebarGroupContent>{renderFlatItems(drilledGroup.items)}</SidebarGroupContent>
        </SidebarGroup>
      </div>
    );
  }

  return (
    <div key="root" className={cn('flex w-full flex-col gap-2', rootAnim)}>
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <SidebarMenuButton
                tooltip="Crear rápido"
                className="bg-secondary text-foreground hover:bg-accent active:bg-accent min-w-8 duration-200 ease-linear"
              >
                <CirclePlus />
                <span>Crear rápido</span>
              </SidebarMenuButton>
              <Button
                size="icon"
                className="size-8 group-data-[collapsible=icon]:opacity-0"
                variant="outline"
              >
                <Mail />
                <span className="sr-only">Bandeja</span>
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {groups.map((group) => {
        // Secciones sin título (Dashboard, Finanzas, Calendario): cada item es su
        // propia fila top-level con el mismo ritmo vertical (py-1) que las secciones
        // con encabezado, para que el espaciado del sidebar sea uniforme.
        if (!group.label) {
          return group.items.map((item) => (
            <SidebarGroup key={item.href} className="py-1">
              {renderFlatItems([item])}
            </SidebarGroup>
          ));
        }

        // Modo icono: sin acordeón (las sub-listas se ocultan), items planos.
        if (iconMode) {
          return (
            <SidebarGroup key={group.label} className="py-1">
              {renderFlatItems(group.items)}
            </SidebarGroup>
          );
        }

        // Sección drill-down (p. ej. Sistema): un botón que abre el sub-sidebar
        // en vez del acordeón. Se marca activo si la ruta está dentro.
        if (group.drilldown) {
          const GroupIcon = group.icon;
          const childActive = group.items.some((item) => isActive(item.href));
          return (
            <SidebarGroup key={group.label} className="py-1">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip={group.label}
                    isActive={childActive}
                    onClick={() => goDrill(group.label ?? null)}
                  >
                    {GroupIcon && <GroupIcon />}
                    <span>{group.label}</span>
                    <ChevronRight className="ml-auto" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          );
        }

        const open = !collapsed.has(group.label);
        const GroupIcon = group.icon;

        return (
          <SidebarGroup key={group.label} className="py-1">
            <SidebarMenu>
              <Collapsible
                asChild
                open={open}
                onOpenChange={() => toggleGroup(group.label as string)}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={group.label}>
                      {GroupIcon && <GroupIcon />}
                      <span>{group.label}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                    <SidebarMenuSub>
                      {group.items.map((item) => (
                        <SidebarMenuSubItem key={item.href}>
                          <SidebarMenuSubButton asChild isActive={isActive(item.href)}>
                            <Link href={item.href}>
                              <span>{item.label}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroup>
        );
      })}
    </div>
  );
}
