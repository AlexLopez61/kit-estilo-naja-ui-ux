'use client';

import {
  ArrowRight,
  Building2,
  Calendar,
  Copy,
  CornerUpLeft,
  CreditCard,
  Edit,
  FileText,
  Home,
  Mail,
  Phone,
  Plus,
  Search,
  Settings,
  Trash2,
  Users,
} from 'lucide-react';
import {
  Command,
  CommandGroup,
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
import { Avatar } from '@/components/ui/avatar';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@/components/ui/menubar';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { formatCurrency } from '@/lib/i18n/formatters';
import { ShowcaseCombobox, type ComboboxOption } from '../_components/ShowcaseCombobox';
import { Section } from '../_components/Section';
import { Subsection } from '../_components/Subsection';

const SUBS: ComboboxOption[] = [
  { value: 'pinturas-merida', label: 'Pinturas Mérida SA', hint: 'Pintura' },
  { value: 'electricos-sureste', label: 'Eléctricos del Sureste', hint: 'Electricidad' },
  { value: 'plomeria-yucatan', label: 'Plomería Yucatán', hint: 'Plomería' },
  { value: 'herreria-itzimna', label: 'Herrería Itzimná', hint: 'Herrería' },
  { value: 'jardines-mayab', label: 'Jardines del Mayab', hint: 'Jardinería' },
  {
    value: 'impermeabilizantes-pen',
    label: 'Impermeabilizantes Península',
    hint: 'Impermeabilización',
  },
  { value: 'aluminio-vidrio', label: 'Aluminio y Vidrio del Golfo', hint: 'Cancelería' },
  { value: 'climas-merida', label: 'Climas Mérida', hint: 'Aire acondicionado' },
];

export function OverlaysSection() {
  return (
    <Section
      id="overlays"
      title="Overlays"
      description="Capas flotantes: sheet lateral, hover card, command palette, combobox, context menu y menubar. Funcionales con Radix y cmdk."
    >
      <Subsection
        id="sheet"
        title="8.1 Sheet / Drawer"
        caption="Panel lateral derecho de 400px. Header, cuerpo con datos y footer con acciones."
      >
        <SheetDemo />
      </Subsection>

      <Subsection
        id="hover-card"
        title="8.2 Hover card"
        caption="Tarjeta de identidad al pasar el cursor sobre un nombre. Aparece tras ~500ms."
      >
        <HoverCardDemo />
      </Subsection>

      <Subsection
        id="command-palette"
        title="8.3 Command palette"
        caption="Paleta de comandos mostrada abierta inline. Búsqueda + grupos con atajos. Item destacado neutro (no emerald)."
      >
        <CommandPaletteDemo />
      </Subsection>

      <Subsection
        id="combobox"
        title="8.4 Combobox"
        caption="Selector con búsqueda sobre cmdk. Check en la opción seleccionada."
      >
        <ComboboxDemo />
      </Subsection>

      <Subsection
        id="context-menu"
        title="8.5 Context menu"
        caption="Click derecho sobre la card para abrir el menú contextual."
      >
        <ContextMenuDemo />
      </Subsection>

      <Subsection
        id="menubar"
        title="8.6 Menubar"
        caption="Barra de menús horizontal estilo aplicación de escritorio."
      >
        <MenubarDemo />
      </Subsection>
    </Section>
  );
}

// 8.1 ------------------------------------------------------------------------

function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="inline-flex h-8 items-center gap-2 rounded-md border border-border-default bg-bg-elevated px-3 text-sm text-text-primary transition-colors hover:bg-bg-overlay"
        >
          <FileText className="size-4" strokeWidth={1.5} />
          Ver detalle del pagaré
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="sm:max-w-[400px]">
        <SheetHeader>
          <SheetTitle>Pagaré #4 · Carla Mendoza</SheetTitle>
          <SheetDescription>Casa Cardín · Depto 101</SheetDescription>
        </SheetHeader>
        <div className="space-y-4 px-4">
          <dl className="space-y-3 text-sm">
            {[
              ['Monto', formatCurrency(12500)],
              ['Fecha de cobro', '01/07/2026'],
              ['Estado', 'Emitido'],
              ['Ubicación física', 'Oficina NAJA'],
              ['Secuencia', '4 de 12'],
            ].map(([k, v]) => (
              <div
                key={k}
                className="flex items-center justify-between border-b border-border-subtle pb-3"
              >
                <dt className="text-text-tertiary">{k}</dt>
                <dd className="tabular-nums text-text-primary">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <SheetFooter className="flex-row justify-end gap-2">
          <SheetClose asChild>
            <button
              type="button"
              className="h-8 rounded-md px-3 text-sm text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
            >
              Cancelar
            </button>
          </SheetClose>
          <button
            type="button"
            className="h-8 rounded-md bg-brand px-3 text-sm font-medium text-white hover:bg-brand-hover"
          >
            Aprobar cobro
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// 8.2 ------------------------------------------------------------------------

function HoverCardDemo() {
  return (
    <p className="max-w-md text-sm text-text-secondary">
      Proyecto asignado a{' '}
      <HoverCard>
        <HoverCardTrigger asChild>
          <button
            type="button"
            className="rounded-sm text-brand-text underline decoration-border-strong underline-offset-2 outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            María Pérez
          </button>
        </HoverCardTrigger>
        <HoverCardContent align="start" className="w-72">
          <div className="flex items-start gap-3">
            <Avatar initials="MP" tone="brand" size={40} />
            <div className="min-w-0">
              <p className="text-sm text-text-primary">María Pérez</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-text-secondary">
                <Mail className="size-3" strokeWidth={1.5} />
                maria.perez@example.mx
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-text-secondary">
                <Phone className="size-3" strokeWidth={1.5} />
                999 123 4567
              </p>
              <span className="mt-2 inline-flex items-center rounded-sm bg-success-subtle px-2 py-0.5 text-xs text-success-text">
                Cliente activo
              </span>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>{' '}
      hace 3 días.
    </p>
  );
}

// 8.3 ------------------------------------------------------------------------

function CommandPaletteDemo() {
  return (
    <div className="max-w-lg overflow-hidden rounded-xl border border-border-default bg-bg-elevated shadow-lg">
      <Command className="bg-bg-elevated">
        <div className="flex items-center gap-2 border-b border-border-subtle px-3">
          <Search className="size-4 shrink-0 text-text-tertiary" strokeWidth={1.5} />
          <input
            readOnly
            placeholder="Buscar acciones, proyectos, cotizaciones…"
            className="h-11 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-disabled"
          />
        </div>
        <CommandList className="max-h-none">
          <CommandGroup heading="Acciones rápidas">
            <CommandItem>
              <Plus className="size-4" strokeWidth={1.5} />
              Nueva cotización
              <CommandShortcut>⌘N</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <CreditCard className="size-4" strokeWidth={1.5} />
              Registrar cobro de renta
              <CommandShortcut>⌘R</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Navegación">
            <CommandItem>
              <Building2 className="size-4" strokeWidth={1.5} />
              Ir a proyectos
            </CommandItem>
            <CommandItem>
              <Home className="size-4" strokeWidth={1.5} />
              Ir a propiedades
            </CommandItem>
            <CommandItem>
              <Settings className="size-4" strokeWidth={1.5} />
              Configuración
              <CommandShortcut>⌘,</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Cotizaciones recientes">
            <CommandItem>
              <FileText className="size-4" strokeWidth={1.5} />
              COT-001 · Casa Montejo
            </CommandItem>
            <CommandItem>
              <FileText className="size-4" strokeWidth={1.5} />
              COT-007 · Casa Tulum
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}

// 8.4 ------------------------------------------------------------------------

function ComboboxDemo() {
  return (
    <div className="max-w-sm">
      <p className="mb-2 text-sm text-text-secondary">Asignar subcontratista</p>
      <ShowcaseCombobox
        options={SUBS}
        placeholder="Selecciona un subcontratista"
        searchPlaceholder="Buscar por nombre…"
        emptyText="Sin subcontratistas."
      />
    </div>
  );
}

// 8.5 ------------------------------------------------------------------------

function ContextMenuDemo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="flex max-w-md cursor-default flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border-default bg-bg-surface px-6 py-10 text-center">
          <p className="text-sm text-text-primary">Right-click para abrir menú</p>
          <p className="text-xs text-text-tertiary">Cotización COT-001 · Casa Montejo</p>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem>
          <Edit className="size-4" strokeWidth={1.5} />
          Editar
          <ContextMenuShortcut>⌘E</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <Copy className="size-4" strokeWidth={1.5} />
          Duplicar
          <ContextMenuShortcut>⌘D</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">
          <Trash2 className="size-4" strokeWidth={1.5} />
          Eliminar
          <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

// 8.6 ------------------------------------------------------------------------

function MenubarDemo() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Archivo</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Plus className="size-4" strokeWidth={1.5} />
            Nuevo proyecto
            <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <FileText className="size-4" strokeWidth={1.5} />
            Nueva cotización
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            <ArrowRight className="size-4" strokeWidth={1.5} />
            Exportar PDF
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Editar</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <CornerUpLeft className="size-4" strokeWidth={1.5} />
            Deshacer
            <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <Copy className="size-4" strokeWidth={1.5} />
            Duplicar
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem variant="destructive">
            <Trash2 className="size-4" strokeWidth={1.5} />
            Eliminar
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Ver</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Users className="size-4" strokeWidth={1.5} />
            Mostrar autor
          </MenubarItem>
          <MenubarItem>
            <Calendar className="size-4" strokeWidth={1.5} />
            Vista calendario
          </MenubarItem>
          <MenubarItem>
            <Building2 className="size-4" strokeWidth={1.5} />
            Agrupar por propiedad
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
