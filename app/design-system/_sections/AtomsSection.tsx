'use client';

import {
  AlertCircle,
  ArrowUpRight,
  Banknote,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Filter,
  Hammer,
  Home,
  Info,
  Lock,
  MoreHorizontal,
  Paperclip,
  Pencil,
  Plus,
  Receipt,
  Search,
  Settings,
  Trash2,
  Upload,
  User,
  Users,
  Wrench,
  X,
  type LucideIcon,
} from 'lucide-react';
import { ReactNode } from 'react';
import { IconCircle } from '@/components/shared/DetailCard';
import { SplitActionButton } from '@/components/shared/DetailPanel';
import { SPLIT_ACTION_CLASS } from '@/components/shared/panelChrome';
import { Avatar, type AvatarTone } from '@/components/ui/avatar';
import { Badge, type BadgeTone } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { CopyJSXButton } from '../_components/CopyJSXButton';
import { Section } from '../_components/Section';
import { Subsection } from '../_components/Subsection';

// ---------------------------------------------------------------------------
// JSX copiable
// ---------------------------------------------------------------------------

const PRIMARY_BUTTON_JSX = `<Button>
  <Plus className="size-3.5" strokeWidth={1.5} />
  Nueva cotización
</Button>`;

const SPLIT_BUTTON_JSX = `<SplitActionButton
  primary={
    <button type="button" className={SPLIT_ACTION_CLASS} onClick={onCollect}>
      Cobrar
    </button>
  }
  menu={[
    <DropdownMenuItem key="edit" onSelect={onEdit}>Editar</DropdownMenuItem>,
    <DropdownMenuItem key="origin" onSelect={onOrigin}>Ver origen</DropdownMenuItem>,
    <DropdownMenuSeparator key="sep" />,
    <DropdownMenuItem key="cancel" variant="destructive" onSelect={onCancel}>
      Cancelar
    </DropdownMenuItem>,
  ]}
/>`;

const BADGE_JSX = `<Badge tone="success">Aprobada</Badge>

{/* Punto + texto, cuando hay muchos estados juntos */}
<span className="inline-flex items-center gap-1.5 text-sm text-text-secondary">
  <span className="size-1.5 rounded-full bg-success" />
  Cobrado
</span>`;

const AVATAR_JSX = `<Avatar name="María Pérez" size={32} />
<Avatar name="Juan Hernández" src={photoUrl} size={40} />
<Avatar name="Casa Montejo" square size={32} />
<Avatar name="Ana Ruiz" tone="info" size={24} />`;

const SEARCH_INPUT_JSX = `<div className="relative">
  <Search
    className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-tertiary"
    strokeWidth={1.5}
  />
  <Input placeholder="Buscar cotización…" className="bg-bg-surface pr-10 pl-9" />
  <Kbd className="absolute top-1/2 right-2 -translate-y-1/2">F</Kbd>
</div>`;

const ICON_CIRCLE_JSX = `<IconCircle icon={Banknote} tone="success" />`;

// ---------------------------------------------------------------------------
// Datos
// ---------------------------------------------------------------------------

const BADGE_TONES: Array<{ tone: BadgeTone; label: string; dot: string }> = [
  { tone: 'success', label: 'Aprobada', dot: 'bg-success' },
  { tone: 'warning', label: 'Por vencer', dot: 'bg-warning' },
  { tone: 'danger', label: 'Vencida', dot: 'bg-danger' },
  { tone: 'info', label: 'En revisión', dot: 'bg-info' },
  { tone: 'brand', label: 'Administrada', dot: 'bg-brand' },
  { tone: 'neutral', label: 'Archivada', dot: 'bg-text-tertiary' },
];

const AVATAR_SIZES = [20, 24, 32, 40];

const AVATAR_TONES: Array<{ tone: AvatarTone; name: string }> = [
  { tone: 'success', name: 'Sofía Cantón' },
  { tone: 'warning', name: 'Luis Ek' },
  { tone: 'danger', name: 'Rosa Chan' },
  { tone: 'info', name: 'Ana Ruiz' },
  { tone: 'brand', name: 'NAJA' },
  { tone: 'neutral', name: 'Bodega norte' },
];

/** Foto de muestra local (sin red): silueta neutra como SVG embebido. */
const SAMPLE_PHOTO = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" fill="silver"/><circle cx="40" cy="30" r="14" fill="white"/><path d="M12 80c0-18 12-28 28-28s28 10 28 28z" fill="white"/></svg>',
)}`;

const ICON_SIZES = [
  { px: 14, className: 'size-3.5', use: 'Inline, junto a texto y dentro de botones' },
  { px: 16, className: 'size-4', use: 'Default: filas, menús, inputs' },
  { px: 20, className: 'size-5', use: 'Botones grandes' },
  { px: 24, className: 'size-6', use: 'Decorativo, máximo' },
];

const ICON_CIRCLES: Array<{
  tone: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  icon: LucideIcon;
  label: string;
}> = [
  { tone: 'neutral', icon: Receipt, label: 'Movimiento' },
  { tone: 'success', icon: Banknote, label: 'Cobro' },
  { tone: 'warning', icon: Clock, label: 'Por vencer' },
  { tone: 'danger', icon: AlertCircle, label: 'Vencido' },
  { tone: 'info', icon: Info, label: 'Aviso' },
];

const ICON_GRID: Array<{ name: string; Icon: LucideIcon }> = [
  { name: 'home', Icon: Home },
  { name: 'building-2', Icon: Building2 },
  { name: 'user', Icon: User },
  { name: 'users', Icon: Users },
  { name: 'file-text', Icon: FileText },
  { name: 'receipt', Icon: Receipt },
  { name: 'banknote', Icon: Banknote },
  { name: 'calendar', Icon: Calendar },
  { name: 'hammer', Icon: Hammer },
  { name: 'wrench', Icon: Wrench },
  { name: 'check-circle-2', Icon: CheckCircle2 },
  { name: 'alert-circle', Icon: AlertCircle },
  { name: 'search', Icon: Search },
  { name: 'filter', Icon: Filter },
  { name: 'plus', Icon: Plus },
  { name: 'pencil', Icon: Pencil },
  { name: 'trash-2', Icon: Trash2 },
  { name: 'more-horizontal', Icon: MoreHorizontal },
  { name: 'download', Icon: Download },
  { name: 'upload', Icon: Upload },
  { name: 'paperclip', Icon: Paperclip },
  { name: 'arrow-up-right', Icon: ArrowUpRight },
  { name: 'external-link', Icon: ExternalLink },
  { name: 'lock', Icon: Lock },
  { name: 'settings', Icon: Settings },
];

// ---------------------------------------------------------------------------
// Sección
// ---------------------------------------------------------------------------

export function AtomsSection() {
  return (
    <Section
      id="atoms"
      title="Átomos"
      description="Las primitivas de components/ui con los ajustes que las distinguen del registry de shadcn: botón primario negro, badges por tono, avatares con iniciales fijas, inputs con placeholder en disabled y foco glow. Todo sale de los tokens de Fundamentos."
    >
      <Subsection
        id="botones"
        title="Botones"
        caption="Button default es negro y es la única primaria de la pantalla; el resto son outline o ghost. Nivel 1 (shadow-xs), hover de fondo. Con icono: size-3.5 y strokeWidth 1.5."
      >
        <div className="space-y-8">
          <div className="flex flex-wrap justify-end gap-2">
            <CopyJSXButton code={PRIMARY_BUTTON_JSX} label="Copiar JSX · primaria" />
            <CopyJSXButton code={SPLIT_BUTTON_JSX} label="Copiar JSX · botón dividido" />
          </div>

          <DemoRow label="Variantes">
            <Button>Guardar</Button>
            <Button variant="outline">Cancelar</Button>
            <Button variant="ghost">Ver más</Button>
            <Button variant="destructive">Eliminar</Button>
            <Button variant="link">Ver detalle</Button>
          </DemoRow>

          <DemoRow label="Tamaños">
            <Button size="xs">xs · 24 px</Button>
            <Button size="sm">sm · 32 px</Button>
            <Button>default · 36 px</Button>
            <Button size="lg">lg · 40 px</Button>
            <Button size="icon-xs" variant="outline" aria-label="Icono xs">
              <Plus strokeWidth={1.5} />
            </Button>
            <Button size="icon-sm" variant="outline" aria-label="Icono sm">
              <Plus strokeWidth={1.5} />
            </Button>
            <Button size="icon" variant="outline" aria-label="Icono">
              <Plus strokeWidth={1.5} />
            </Button>
            <Button size="icon-lg" variant="outline" aria-label="Icono lg">
              <Plus strokeWidth={1.5} />
            </Button>
          </DemoRow>

          <DemoRow label="Con icono">
            <Button>
              <Plus className="size-3.5" strokeWidth={1.5} />
              Nueva cotización
            </Button>
            <Button variant="outline">
              <Download className="size-3.5" strokeWidth={1.5} />
              Exportar
            </Button>
            <Button variant="ghost" size="sm">
              <Pencil className="size-3.5" strokeWidth={1.5} />
              Editar
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="Más acciones">
              <MoreHorizontal className="size-4" strokeWidth={1.5} />
            </Button>
          </DemoRow>

          <DemoRow label="Cargando">
            <Button disabled>
              <Spinner className="size-3.5" />
              Guardando…
            </Button>
            <Button variant="outline" disabled>
              <Spinner className="size-3.5" />
              Exportando…
            </Button>
            <span className="text-xs text-text-tertiary">
              Spinner solo en botones durante una acción. Un botón que un rol no puede usar se
              oculta; nunca disabled sin alternativa.
            </span>
          </DemoRow>

          <DemoRow label="Botón dividido">
            <SplitActionButton
              primary={
                <button type="button" className={SPLIT_ACTION_CLASS}>
                  Cobrar
                </button>
              }
              menu={[
                <DropdownMenuItem key="edit">Editar</DropdownMenuItem>,
                <DropdownMenuItem key="origin">Ver origen</DropdownMenuItem>,
                <DropdownMenuSeparator key="sep" />,
                <DropdownMenuItem key="cancel" variant="destructive">
                  Cancelar
                </DropdownMenuItem>,
              ]}
            />
            <SplitActionButton
              primary={null}
              menu={[
                <DropdownMenuItem key="request">Solicitar corrección</DropdownMenuItem>,
                <DropdownMenuItem key="pdf">Descargar PDF</DropdownMenuItem>,
              ]}
            />
            <span className="text-xs text-text-tertiary">
              «Acción | ⌄»: la forma canónica de la primaria en fichas. Sin primaria posible, un ⋯
              ghost abre el menú.
            </span>
          </DemoRow>

          <div className="grid gap-4 md:grid-cols-2">
            <RuleTile tone="success" label="Una sola primaria por pantalla, y es negra">
              <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
                <Button variant="ghost">Descartar</Button>
                <Button variant="outline">Guardar borrador</Button>
                <Button>Enviar cotización</Button>
              </div>
            </RuleTile>
            <RuleTile tone="danger" label="Dos primarias en la misma pantalla">
              <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
                <Button>Guardar borrador</Button>
                <Button>Enviar cotización</Button>
              </div>
              <p className="mt-3 text-xs text-text-tertiary">
                Tampoco una primaria de color: el primario del sistema no lleva marca.
              </p>
            </RuleTile>
          </div>
        </div>
      </Subsection>

      <Subsection
        id="badges"
        title="Badges"
        caption="Badge con tone: bg-*-subtle + text-*-text, rounded-sm px-2 py-0.5 text-xs, sentence case. Cuando hay muchos estados juntos, la variante punto + texto en secundario."
      >
        <div className="space-y-6">
          <div className="flex justify-end">
            <CopyJSXButton code={BADGE_JSX} label="Copiar JSX · badge" />
          </div>
          <DemoRow label="tone">
            {BADGE_TONES.map((b) => (
              <div key={b.tone} className="flex flex-col items-start gap-1.5">
                <Badge tone={b.tone}>{b.label}</Badge>
                <code className="font-mono text-xs text-text-tertiary">{b.tone}</code>
              </div>
            ))}
          </DemoRow>
          <DemoRow label="Punto + texto">
            {BADGE_TONES.map((b) => (
              <span
                key={b.tone}
                className="inline-flex items-center gap-1.5 text-sm text-text-secondary"
              >
                <span className={cn('size-1.5 rounded-full', b.dot)} />
                {b.label}
              </span>
            ))}
          </DemoRow>
          <DemoRow label="Con icono">
            <Badge tone="success">
              <Check strokeWidth={2} />
              Cobrado
            </Badge>
            <Badge tone="danger">
              <X strokeWidth={2} />
              Rescindido
            </Badge>
            <Badge tone="neutral">Formal</Badge>
          </DemoRow>
        </div>
      </Subsection>

      <Subsection
        id="avatares"
        title="Avatares"
        caption="Circular para personas y contactos; square (rounded-md) para propiedades, unidades, materiales y archivos. Sin foto, iniciales blancas sobre negro fijas en ambos temas con ring-1 ring-border-default; la identidad la da la inicial, no un color por hash."
      >
        <div className="space-y-6">
          <div className="flex justify-end">
            <CopyJSXButton code={AVATAR_JSX} label="Copiar JSX · avatar" />
          </div>
          <DemoRow label="Tamaños">
            {AVATAR_SIZES.map((size) => (
              <div key={size} className="flex flex-col items-center gap-1.5">
                <Avatar name="María Pérez" size={size} />
                <code className="font-mono text-xs tabular-nums text-text-tertiary">{size}</code>
              </div>
            ))}
          </DemoRow>
          <DemoRow label="Con foto">
            {AVATAR_SIZES.map((size) => (
              <Avatar key={size} name="Juan Hernández" src={SAMPLE_PHOTO} size={size} />
            ))}
            <span className="text-xs text-text-tertiary">
              src con fallback automático a las iniciales si la imagen no carga.
            </span>
          </DemoRow>
          <DemoRow label="square">
            <Avatar name="Casa Montejo" square size={32} />
            <Avatar name="Departamento 3B" square size={32} />
            <Avatar initials="PDF" square size={32} />
            <Avatar name="Cemento gris" square size={24} />
            <span className="text-xs text-text-tertiary">
              Propiedades, unidades, archivos, materiales.
            </span>
          </DemoRow>
          <DemoRow label="tone">
            {AVATAR_TONES.map((a) => (
              <div key={a.tone} className="flex flex-col items-center gap-1.5">
                <Avatar name={a.name} tone={a.tone} size={32} />
                <code className="font-mono text-xs text-text-tertiary">{a.tone}</code>
              </div>
            ))}
            <span className="text-xs text-text-tertiary">
              Solo cuando el color es semántico; por defecto no se usa.
            </span>
          </DemoRow>
        </div>
      </Subsection>

      <Subsection
        id="inputs"
        title="Inputs base"
        caption="36 px (sm 32), bg-bg-surface border-border-default rounded-md shadow-xs. Placeholder en text-text-disabled. Foco glow. Error con aria-invalid. Dentro de StepCard van recesados en bg-bg-base."
      >
        <div className="space-y-6">
          <div className="flex justify-end">
            <CopyJSXButton code={SEARCH_INPUT_JSX} label="Copiar JSX · buscador con atajo" />
          </div>
          <div className="grid max-w-3xl gap-5 md:grid-cols-2">
            <InputDemo label="Texto" htmlFor="atom-text" hint="Placeholder en text-text-disabled.">
              <Input id="atom-text" placeholder="Nombre del cliente" className="bg-bg-surface" />
            </InputDemo>

            <InputDemo
              label="Foco"
              htmlFor="atom-focus"
              hint="Simulado con border-ring/50 shadow-focus; tabula al de la izquierda para verlo real."
            >
              <Input
                id="atom-focus"
                defaultValue="Casa Montejo"
                className="border-ring/50 bg-bg-surface shadow-focus"
              />
            </InputDemo>

            <InputDemo
              label="Error"
              htmlFor="atom-error"
              error="El nombre debe tener al menos 2 caracteres."
            >
              <Input id="atom-error" aria-invalid defaultValue="A" className="bg-bg-surface" />
            </InputDemo>

            <InputDemo
              label="Deshabilitado"
              htmlFor="atom-disabled"
              hint="Solo mientras se procesa; nunca como sustituto de un permiso."
            >
              <Input
                id="atom-disabled"
                disabled
                defaultValue="Casa Montejo"
                className="bg-bg-surface"
              />
            </InputDemo>

            <InputDemo
              label="Buscar con atajo"
              htmlFor="atom-search"
              hint="Lupa a la izquierda y Kbd F a la derecha; el atajo es real en la toolbar."
            >
              <div className="relative">
                <Search
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-tertiary"
                  strokeWidth={1.5}
                />
                <Input
                  id="atom-search"
                  type="search"
                  placeholder="Buscar cotización…"
                  className="bg-bg-surface pr-10 pl-9"
                />
                <Kbd className="absolute top-1/2 right-2 -translate-y-1/2">F</Kbd>
              </div>
            </InputDemo>

            <InputDemo
              label="Select"
              htmlFor="atom-select"
              hint="Placeholder en text-text-disabled mientras no hay valor."
            >
              <Select>
                <SelectTrigger id="atom-select" className="w-full bg-bg-surface">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casa">Casa habitación</SelectItem>
                  <SelectItem value="depto">Departamento</SelectItem>
                  <SelectItem value="local">Local comercial</SelectItem>
                </SelectContent>
              </Select>
            </InputDemo>

            <InputDemo label="Tamaño sm" htmlFor="atom-sm" hint="32 px en toolbars y filtros.">
              <div className="flex gap-2">
                <Input id="atom-sm" placeholder="Buscar…" className="h-8 bg-bg-surface" />
                <Select>
                  <SelectTrigger size="sm" className="bg-bg-surface">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Abiertas</SelectItem>
                    <SelectItem value="closed">Cerradas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </InputDemo>

            <InputDemo
              label="Recesado en StepCard"
              htmlFor="atom-recessed"
              hint="Dentro de un modal el input va en bg-bg-base sobre la card bg-bg-surface."
            >
              <div className="rounded-lg border border-border-subtle bg-bg-surface p-3">
                <Input id="atom-recessed" placeholder="0.00" className="bg-bg-base" />
              </div>
            </InputDemo>

            <div className="md:col-span-2">
              <InputDemo
                label="Textarea"
                htmlFor="atom-textarea"
                hint="Solo para texto libre. Un dato compuesto (dirección, datos bancarios) va en inputs separados."
              >
                <Textarea
                  id="atom-textarea"
                  placeholder="Detalla particularidades del trabajo…"
                  className="bg-bg-surface"
                />
              </InputDemo>
            </div>
          </div>
        </div>
      </Subsection>

      <Subsection
        id="iconos"
        title="Iconos"
        caption="Solo lucide-react, strokeWidth 1.5 y currentColor; 2 en iconos de 16 px dentro de círculos. Tamaños 14, 16, 20 y 24. Nunca emojis decorativos ni un segundo sistema de iconos."
      >
        <div className="space-y-8">
          <div className="flex justify-end">
            <CopyJSXButton code={ICON_CIRCLE_JSX} label="Copiar JSX · IconCircle" />
          </div>
          <DemoRow label="Tamaños">
            {ICON_SIZES.map((s) => (
              <div key={s.px} className="flex items-center gap-2.5">
                <Wrench className={cn(s.className, 'text-text-secondary')} strokeWidth={1.5} />
                <div>
                  <code className="block font-mono text-xs tabular-nums text-text-primary">
                    {s.px} px · {s.className}
                  </code>
                  <span className="block text-xs text-text-tertiary">{s.use}</span>
                </div>
              </div>
            ))}
          </DemoRow>
          <DemoRow label="Trazo">
            <div className="flex items-center gap-2.5">
              <Wrench className="size-4 text-text-secondary" strokeWidth={1.5} />
              <code className="font-mono text-xs text-text-tertiary">
                strokeWidth 1.5 · default
              </code>
            </div>
            <div className="flex items-center gap-2.5">
              <IconCircle icon={Wrench} />
              <code className="font-mono text-xs text-text-tertiary">
                strokeWidth 2 · dentro de IconCircle
              </code>
            </div>
          </DemoRow>
          <DemoRow label="IconCircle">
            {ICON_CIRCLES.map((c) => (
              <div key={c.tone} className="flex items-center gap-2.5">
                <IconCircle icon={c.icon} tone={c.tone} />
                <div>
                  <span className="block text-sm text-text-primary">{c.label}</span>
                  <code className="block font-mono text-xs text-text-tertiary">{c.tone}</code>
                </div>
              </div>
            ))}
          </DemoRow>
          <p className="text-xs text-text-tertiary">
            El círculo (size-8 rounded-full bg-*-subtle text-*-text) identifica el tipo de fila y se
            repite en la ficha.
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
            {ICON_GRID.map(({ name, Icon }) => (
              <div
                key={name}
                className="flex items-center gap-3 rounded-md border border-border-subtle bg-bg-surface px-3 py-2.5"
              >
                <Icon className="size-4 shrink-0 text-text-secondary" strokeWidth={1.5} />
                <code className="truncate font-mono text-xs text-text-tertiary">{name}</code>
              </div>
            ))}
          </div>
        </div>
      </Subsection>

      <Subsection
        id="kbd-y-separator"
        title="Kbd y Separator"
        caption="Kbd es el chip mono rounded-sm para atajos; Separator es el divisor de shadcn en bg-border, horizontal o vertical."
      >
        <div className="space-y-6">
          <DemoRow label="Kbd">
            <Kbd>F</Kbd>
            <Kbd>Esc</Kbd>
            <KbdGroup>
              <Kbd>Ctrl</Kbd>
              <Kbd>K</Kbd>
            </KbdGroup>
            <span className="inline-flex items-center gap-2 text-sm text-text-secondary">
              Buscar
              <Kbd>F</Kbd>
            </span>
          </DemoRow>
          <DemoRow label="Separator">
            <div className="w-64 space-y-3">
              <p className="text-sm text-text-primary">Datos del cliente</p>
              <Separator />
              <p className="text-sm text-text-secondary">Contacto principal</p>
            </div>
            <div className="flex h-8 items-center gap-3 text-sm text-text-secondary">
              <span>Editar</span>
              <Separator orientation="vertical" />
              <span>Duplicar</span>
              <Separator orientation="vertical" />
              <span>Eliminar</span>
            </div>
          </DemoRow>
        </div>
      </Subsection>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Piezas locales
// ---------------------------------------------------------------------------

function DemoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-3 md:grid-cols-[120px_minmax(0,1fr)] md:items-start">
      <code className="pt-1.5 font-mono text-xs text-text-tertiary">{label}</code>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">{children}</div>
    </div>
  );
}

function RuleTile({
  tone,
  label,
  children,
}: {
  tone: 'success' | 'danger';
  label: string;
  children: ReactNode;
}) {
  const Icon = tone === 'success' ? Check : X;
  const colorClass = tone === 'success' ? 'text-success-text' : 'text-danger-text';
  return (
    <div className="rounded-lg border border-border-subtle bg-bg-surface p-4">
      <div className={cn('flex items-center gap-1.5 text-xs', colorClass)}>
        <Icon className="size-3.5" strokeWidth={1.5} />
        <span>{label}</span>
      </div>
      {children}
    </div>
  );
}

function InputDemo({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-text-primary">
        {label}
      </Label>
      {children}
      {error ? (
        <p className="text-sm text-danger-text" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-text-tertiary">{hint}</p>
      ) : null}
    </div>
  );
}
