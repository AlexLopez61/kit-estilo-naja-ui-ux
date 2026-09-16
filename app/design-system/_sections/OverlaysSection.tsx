'use client';

import * as React from 'react';
import {
  Archive,
  ArrowRight,
  ArrowUpDown,
  Building2,
  Calendar,
  ChevronDown,
  Copy,
  CornerUpLeft,
  CreditCard,
  FileText,
  Filter,
  Home,
  Mail,
  MoreHorizontal,
  Pencil,
  Phone,
  Plus,
  Search,
  Settings,
  Share2,
  Trash2,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';

import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { Label } from '@/components/ui/label';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Section } from '../_components/Section';
import { Subsection } from '../_components/Subsection';

/**
 * Overlays (01-sistema §5 nivel 4 y §7): menús, popovers, tooltips, hover
 * cards y paleta de comandos. Todos flotan sobre la página con `shadow-lg` +
 * borde, `bg-popover`, `rounded-md` y la entrada de tw-animate-css. Sin blur;
 * foco con glow. El Sheet vive en «Modales y drawers» (M6).
 */
export function OverlaysSection() {
  return (
    <Section
      id="overlays"
      title="Overlays"
      description="Capas que flotan sobre la página: nivel 4 (shadow-lg + borde, bg-popover, rounded-md) con la entrada de tw-animate-css. Sin blur, sin gradientes; foco con glow azul. Los drawers viven en «Modales y drawers»."
    >
      <Subsection
        id="dropdown"
        title="8.1 Dropdown menu"
        caption="Menú ⋯ de una fila o ficha: acciones, separador y el destructivo al final. El segundo ejemplo muestra grupo de radio y casilla para ordenar y filtrar."
      >
        <DropdownDemo />
      </Subsection>

      <Subsection
        id="context-menu"
        title="8.2 Context menu"
        caption="Clic derecho sobre la card. Mismas reglas que el dropdown: iconos en terciario, atajos a la derecha, destructivo separado."
      >
        <ContextMenuDemo />
      </Subsection>

      <Subsection
        id="popover"
        title="8.3 Popover de filtros"
        caption="Popover nivel 4 con header, cuerpo de controles y pie en banda gris (Limpiar ghost + Aplicar negro). Los filtros aplicados viven en la URL."
      >
        <FilterPopoverDemo />
      </Subsection>

      <Subsection
        id="tooltip"
        title="8.4 Tooltip"
        caption="Texto corto en bg-bg-overlay con flecha. Obligatorio en botones de solo icono; nunca sustituye al label de un control con texto."
      >
        <TooltipDemo />
      </Subsection>

      <Subsection
        id="hover-card"
        title="8.5 Hover card"
        caption="Tarjeta de identidad al pasar el cursor sobre un nombre (aparece tras ~500 ms). Avatar con fallback negro fijo y estado como Badge tone."
      >
        <HoverCardDemo />
      </Subsection>

      <Subsection
        id="command-palette"
        title="8.6 Command palette"
        caption="Paleta de comandos sobre cmdk. Arriba, la versión en diálogo (⌘K / Ctrl+K); abajo, la misma paleta mostrada abierta inline. Ítem resaltado neutro (bg-accent)."
      >
        <CommandPaletteDemo />
      </Subsection>

      <Subsection
        id="menubar"
        title="8.7 Menubar"
        caption="Barra de menús horizontal estilo aplicación de escritorio. Se conserva como primitiva; en NAJA no hay topbar global."
      >
        <MenubarDemo />
      </Subsection>
    </Section>
  );
}

// 8.1 ------------------------------------------------------------------------

function DropdownDemo() {
  const [sort, setSort] = React.useState('recent');
  const [showClosed, setShowClosed] = React.useState(false);

  return (
    <div className="flex flex-wrap items-center gap-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="Más acciones">
            <MoreHorizontal strokeWidth={1.5} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-52 shadow-lg">
          <DropdownMenuItem>
            <Pencil strokeWidth={1.5} />
            Editar
            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Copy strokeWidth={1.5} />
            Duplicar
            <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Share2 strokeWidth={1.5} />
            Compartir enlace
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <Trash2 strokeWidth={1.5} />
            Eliminar
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <ArrowUpDown strokeWidth={1.5} />
            Ordenar por
            <ChevronDown className="text-text-tertiary" strokeWidth={1.5} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-52 shadow-lg">
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            Ordenar por
          </DropdownMenuLabel>
          <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
            <DropdownMenuRadioItem value="recent">Más recientes</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="amount">Monto</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="name">Nombre</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={showClosed}
            onCheckedChange={(checked) => setShowClosed(checked === true)}
          >
            Mostrar cerradas
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// 8.2 ------------------------------------------------------------------------

function ContextMenuDemo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="flex max-w-md cursor-default flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border-default bg-bg-surface px-6 py-10 text-center">
          <p className="text-sm text-text-primary">Clic derecho para abrir el menú</p>
          <p className="text-xs text-text-tertiary">
            <span className="font-mono">COT-001</span> · Casa Montejo
          </p>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48 shadow-lg">
        <ContextMenuItem>
          <Pencil strokeWidth={1.5} />
          Editar
          <ContextMenuShortcut>⌘E</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <Copy strokeWidth={1.5} />
          Duplicar
          <ContextMenuShortcut>⌘D</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">
          <Trash2 strokeWidth={1.5} />
          Eliminar
          <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

// 8.3 ------------------------------------------------------------------------

const STATE_OPTIONS = [
  { value: 'abierta', label: 'Abierta' },
  { value: 'en_curso', label: 'En curso' },
  { value: 'cerrada', label: 'Cerrada' },
] as const;

type StateValue = (typeof STATE_OPTIONS)[number]['value'];

const DEFAULT_STATES: Record<StateValue, boolean> = {
  abierta: true,
  en_curso: true,
  cerrada: false,
};

function FilterPopoverDemo() {
  const [open, setOpen] = React.useState(false);
  const [states, setStates] = React.useState<Record<StateValue, boolean>>(DEFAULT_STATES);
  const [owner, setOwner] = React.useState('');

  const activeCount = Object.values(states).filter(Boolean).length + (owner ? 1 : 0);

  function reset() {
    setStates(DEFAULT_STATES);
    setOwner('');
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter strokeWidth={1.5} />
          Filtros
          <span className="rounded-full bg-bg-elevated px-1.5 text-xs tabular-nums text-text-secondary">
            {activeCount}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-0 shadow-lg">
        <div className="border-b px-4 py-3">
          <p className="text-sm font-semibold text-foreground">Filtros</p>
          <p className="text-xs text-muted-foreground">Se aplican a la lista y viven en la URL.</p>
        </div>
        <div className="space-y-4 px-4 py-3">
          <fieldset className="space-y-2">
            <legend className="mb-2 text-xs text-muted-foreground">Estado</legend>
            {STATE_OPTIONS.map((option) => {
              const id = `filter-${option.value}`;
              return (
                <div key={option.value} className="flex items-center gap-2">
                  <Checkbox
                    id={id}
                    checked={states[option.value]}
                    onCheckedChange={(checked) =>
                      setStates((prev) => ({ ...prev, [option.value]: checked === true }))
                    }
                  />
                  <Label htmlFor={id} className="font-normal">
                    {option.label}
                  </Label>
                </div>
              );
            })}
          </fieldset>
          <div className="space-y-1.5">
            <Label htmlFor="filter-owner" className="text-xs font-normal text-muted-foreground">
              Responsable
            </Label>
            <Select value={owner} onValueChange={setOwner}>
              <SelectTrigger id="filter-owner" size="sm" className="w-full">
                <SelectValue placeholder="Cualquiera" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maria">María Pérez</SelectItem>
                <SelectItem value="juan">Juan Hernández</SelectItem>
                <SelectItem value="roberto">Roberto García</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center justify-between border-t bg-muted/30 px-4 py-2.5">
          <Button variant="ghost" size="sm" onClick={reset}>
            Limpiar
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setOpen(false);
              toast.success('Filtros aplicados');
            }}
          >
            Aplicar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// 8.4 ------------------------------------------------------------------------

const ICON_ACTIONS = [
  { icon: Pencil, label: 'Editar' },
  { icon: Copy, label: 'Duplicar' },
  { icon: Archive, label: 'Archivar' },
];

function TooltipDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {ICON_ACTIONS.map(({ icon: Icon, label }) => (
        <Tooltip key={label}>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon-sm" aria-label={label}>
              <Icon strokeWidth={1.5} />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="shadow-lg">{label}</TooltipContent>
        </Tooltip>
      ))}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">
            <Search strokeWidth={1.5} />
            Buscar
            <Kbd>F</Kbd>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="shadow-lg">
          Enfoca el buscador con la tecla F
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

// 8.5 ------------------------------------------------------------------------

function HoverCardDemo() {
  return (
    <p className="max-w-md text-sm text-text-secondary">
      Proyecto asignado a{' '}
      <HoverCard>
        <HoverCardTrigger asChild>
          <button
            type="button"
            className="rounded-sm font-medium text-text-primary underline decoration-border-strong underline-offset-2 outline-none focus-visible:shadow-focus"
          >
            María Pérez
          </button>
        </HoverCardTrigger>
        <HoverCardContent align="start" className="w-72 shadow-lg">
          <div className="flex items-start gap-3">
            <Avatar name="María Pérez" size={40} />
            <div className="min-w-0">
              <p className="text-sm font-medium text-text-primary">María Pérez</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-text-secondary">
                <Mail className="size-3" strokeWidth={1.5} />
                maria.perez@example.mx
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs tabular-nums text-text-secondary">
                <Phone className="size-3" strokeWidth={1.5} />
                999 123 4567
              </p>
              <Badge tone="success" className="mt-2">
                Cliente activo
              </Badge>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>{' '}
      hace 3 días.
    </p>
  );
}

// 8.6 ------------------------------------------------------------------------

function PaletteItems({ onPick }: { onPick?: (label: string) => void }) {
  const pick = (label: string) => () => {
    onPick?.(label);
    toast(label);
  };
  return (
    <>
      <CommandGroup heading="Acciones rápidas">
        <CommandItem onSelect={pick('Nueva cotización')}>
          <Plus strokeWidth={1.5} />
          Nueva cotización
          <CommandShortcut>⌘N</CommandShortcut>
        </CommandItem>
        <CommandItem onSelect={pick('Registrar cobro de renta')}>
          <CreditCard strokeWidth={1.5} />
          Registrar cobro de renta
          <CommandShortcut>⌘R</CommandShortcut>
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Navegación">
        <CommandItem onSelect={pick('Ir a proyectos')}>
          <Building2 strokeWidth={1.5} />
          Ir a proyectos
        </CommandItem>
        <CommandItem onSelect={pick('Ir a propiedades')}>
          <Home strokeWidth={1.5} />
          Ir a propiedades
        </CommandItem>
        <CommandItem onSelect={pick('Configuración')}>
          <Settings strokeWidth={1.5} />
          Configuración
          <CommandShortcut>⌘,</CommandShortcut>
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Cotizaciones recientes">
        <CommandItem onSelect={pick('COT-001 · Casa Montejo')}>
          <FileText strokeWidth={1.5} />
          <span className="font-mono text-xs">COT-001</span> · Casa Montejo
        </CommandItem>
        <CommandItem onSelect={pick('COT-007 · Casa Tulum')}>
          <FileText strokeWidth={1.5} />
          <span className="font-mono text-xs">COT-007</span> · Casa Tulum
        </CommandItem>
      </CommandGroup>
    </>
  );
}

function CommandPaletteDemo() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="space-y-4">
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Search strokeWidth={1.5} />
        Abrir paleta
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Paleta de comandos"
        description="Busca una acción o navega a un módulo"
        showCloseButton={false}
      >
        <CommandInput placeholder="Buscar acciones, proyectos, cotizaciones…" />
        <CommandList>
          <CommandEmpty>Sin resultados.</CommandEmpty>
          <PaletteItems onPick={() => setOpen(false)} />
        </CommandList>
      </CommandDialog>

      <div className="max-w-lg overflow-hidden rounded-lg border bg-popover shadow-lg">
        <Command>
          <CommandInput placeholder="Buscar acciones, proyectos, cotizaciones…" />
          <CommandList className="max-h-none">
            <CommandEmpty>Sin resultados.</CommandEmpty>
            <PaletteItems />
          </CommandList>
        </Command>
      </div>
    </div>
  );
}

// 8.7 ------------------------------------------------------------------------

function MenubarDemo() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Archivo</MenubarTrigger>
        <MenubarContent className="shadow-lg">
          <MenubarItem>
            <Plus strokeWidth={1.5} />
            Nuevo proyecto
            <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <FileText strokeWidth={1.5} />
            Nueva cotización
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            <ArrowRight strokeWidth={1.5} />
            Exportar PDF
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Editar</MenubarTrigger>
        <MenubarContent className="shadow-lg">
          <MenubarItem>
            <CornerUpLeft strokeWidth={1.5} />
            Deshacer
            <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <Copy strokeWidth={1.5} />
            Duplicar
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem variant="destructive">
            <Trash2 strokeWidth={1.5} />
            Eliminar
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Ver</MenubarTrigger>
        <MenubarContent className="shadow-lg">
          <MenubarItem>
            <Users strokeWidth={1.5} />
            Mostrar autor
          </MenubarItem>
          <MenubarItem>
            <Calendar strokeWidth={1.5} />
            Vista calendario
          </MenubarItem>
          <MenubarItem>
            <Building2 strokeWidth={1.5} />
            Agrupar por propiedad
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
