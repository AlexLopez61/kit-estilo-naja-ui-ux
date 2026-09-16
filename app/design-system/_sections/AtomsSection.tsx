import {
  AlertCircle,
  Banknote,
  Briefcase,
  Building,
  Building2,
  Calendar,
  CheckCircle2,
  ClipboardList,
  DollarSign,
  Download,
  Edit,
  EllipsisVertical,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Hammer,
  HardHat,
  Home,
  Info,
  LandPlot,
  Loader2,
  Lock,
  MoreHorizontal,
  Plus,
  Receipt,
  Search,
  Settings,
  Shapes,
  Share2,
  Store,
  Trash2,
  Upload,
  User,
  Warehouse,
  Wrench,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import { ReactNode } from 'react';
import { Avatar } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CopyJSXButton } from '../_components/CopyJSXButton';
import { Section } from '../_components/Section';
import { Subsection } from '../_components/Subsection';

const PRIMARY_BUTTON_JSX = `<button
  type="button"
  className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md bg-brand px-3 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
>
  <Plus className="size-3.5" strokeWidth={1.75} />
  Crear
</button>`;

const VARIANTS = ['primary', 'secondary', 'ghost', 'destructive'] as const;
type Variant = (typeof VARIANTS)[number];

const SIZES = ['sm', 'md', 'lg'] as const;
type Size = (typeof SIZES)[number];

const STATES = ['default', 'hover', 'focus', 'disabled', 'loading'] as const;
type State = (typeof STATES)[number];

const VARIANT_LABEL: Record<Variant, string> = {
  primary: 'Crear',
  secondary: 'Cancelar',
  ghost: 'Acción',
  destructive: 'Eliminar',
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'h-7 px-2.5 text-xs gap-1.5',
  md: 'h-8 px-3 text-sm gap-1.5',
  lg: 'h-10 px-4 text-base gap-2',
};

const VARIANT_STATIC: Record<Variant, string> = {
  primary: 'bg-brand text-white',
  secondary: 'bg-bg-elevated border border-border-default text-text-primary',
  ghost: 'text-text-secondary',
  destructive: 'text-danger-text',
};

const VARIANT_HOVER_STATIC: Record<Variant, string> = {
  primary: 'bg-brand-hover text-white',
  secondary: 'bg-bg-overlay border border-border-strong text-text-primary',
  ghost: 'bg-bg-elevated text-text-primary',
  destructive: 'bg-danger-subtle text-danger-text',
};

const VARIANT_HOVER_PREFIX: Record<Variant, string> = {
  primary: 'hover:bg-brand-hover',
  secondary: 'hover:bg-bg-overlay hover:border-border-strong',
  ghost: 'hover:bg-bg-elevated hover:text-text-primary',
  destructive: 'hover:bg-danger-subtle',
};

type BadgeVariant = {
  name: string;
  label: string;
  bg: string;
  text: string;
  dot: string;
};

const BADGES: BadgeVariant[] = [
  {
    name: 'success',
    label: 'Aprobada',
    bg: 'bg-success-subtle',
    text: 'text-success-text',
    dot: 'bg-success',
  },
  {
    name: 'warning',
    label: 'Pendiente',
    bg: 'bg-warning-subtle',
    text: 'text-warning-text',
    dot: 'bg-warning',
  },
  {
    name: 'danger',
    label: 'Vencida',
    bg: 'bg-danger-subtle',
    text: 'text-danger-text',
    dot: 'bg-danger',
  },
  {
    name: 'info',
    label: 'En revisión',
    bg: 'bg-info-subtle',
    text: 'text-info-text',
    dot: 'bg-info',
  },
  {
    name: 'neutral',
    label: 'Archivada',
    bg: 'bg-bg-elevated',
    text: 'text-text-secondary',
    dot: 'bg-text-tertiary',
  },
];

const ICONS: Array<{ name: string; Icon: LucideIcon }> = [
  { name: 'home', Icon: Home },
  { name: 'file-text', Icon: FileText },
  { name: 'building-2', Icon: Building2 },
  { name: 'user', Icon: User },
  { name: 'building', Icon: Building },
  { name: 'store', Icon: Store },
  { name: 'briefcase', Icon: Briefcase },
  { name: 'land-plot', Icon: LandPlot },
  { name: 'warehouse', Icon: Warehouse },
  { name: 'shapes', Icon: Shapes },
  { name: 'calendar', Icon: Calendar },
  { name: 'dollar-sign', Icon: DollarSign },
  { name: 'receipt', Icon: Receipt },
  { name: 'banknote', Icon: Banknote },
  { name: 'hammer', Icon: Hammer },
  { name: 'wrench', Icon: Wrench },
  { name: 'hard-hat', Icon: HardHat },
  { name: 'clipboard-list', Icon: ClipboardList },
  { name: 'check-circle-2', Icon: CheckCircle2 },
  { name: 'alert-circle', Icon: AlertCircle },
  { name: 'x-circle', Icon: XCircle },
  { name: 'info', Icon: Info },
  { name: 'search', Icon: Search },
  { name: 'filter', Icon: Filter },
  { name: 'more-horizontal', Icon: MoreHorizontal },
  { name: 'ellipsis-vertical', Icon: EllipsisVertical },
  { name: 'plus', Icon: Plus },
  { name: 'edit', Icon: Edit },
  { name: 'trash-2', Icon: Trash2 },
  { name: 'download', Icon: Download },
  { name: 'upload', Icon: Upload },
  { name: 'share-2', Icon: Share2 },
  { name: 'external-link', Icon: ExternalLink },
  { name: 'eye', Icon: Eye },
  { name: 'lock', Icon: Lock },
  { name: 'settings', Icon: Settings },
];

const PROPERTY_TYPE_ICONS: Array<{ label: string; name: string; Icon: LucideIcon }> = [
  { label: 'Casa', name: 'home', Icon: Home },
  { label: 'Departamento', name: 'building', Icon: Building },
  { label: 'Edificio', name: 'building-2', Icon: Building2 },
  { label: 'Local comercial', name: 'store', Icon: Store },
  { label: 'Oficina', name: 'briefcase', Icon: Briefcase },
  { label: 'Terreno', name: 'land-plot', Icon: LandPlot },
  { label: 'Bodega', name: 'warehouse', Icon: Warehouse },
  { label: 'Otro', name: 'shapes', Icon: Shapes },
];

export function AtomsSection() {
  return (
    <Section
      id="atoms"
      title="Atoms"
      description="Componentes primitivos: botones, badges, inputs, avatares y la grilla de iconos disponibles. Todos derivados directamente de los tokens de Foundations."
    >
      <Subsection
        title="2.1 Botones"
        caption="4 tipos × 3 tamaños × 5 estados. Hover real al pasar el cursor en la columna 'default'."
      >
        <div className="space-y-6">
          <div className="flex justify-end">
            <CopyJSXButton code={PRIMARY_BUTTON_JSX} label="Copiar JSX · primary" />
          </div>
          <div className="space-y-10">
            {VARIANTS.map((variant) => (
              <ButtonGrid key={variant} variant={variant} />
            ))}
          </div>
        </div>
      </Subsection>

      <Subsection
        title="2.2 Badges"
        caption="Pill completo + variante dot+texto. 5 estados semánticos del dominio."
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs text-text-tertiary">Pill</p>
            <div className="flex flex-wrap items-center gap-3">
              {BADGES.map((b) => (
                <span
                  key={b.name}
                  className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs ${b.bg} ${b.text}`}
                >
                  {b.label}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-xs text-text-tertiary">Dot + texto</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {BADGES.map((b) => (
                <span
                  key={b.name}
                  className="inline-flex items-center gap-1.5 text-xs text-text-secondary"
                >
                  <span className={`size-1.5 rounded-full ${b.dot}`} />
                  {b.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Subsection>

      <Subsection
        title="2.3 Inputs"
        caption="Altura 36 px md. Border subtle por defecto, accent ring al enfocar. Label arriba, helper o error abajo."
      >
        <div className="grid max-w-3xl grid-cols-1 gap-5 md:grid-cols-2">
          <InputField label="Texto default" helper="Nombre del cliente o propietario.">
            <input
              type="text"
              placeholder="Casa Montejo"
              className="h-9 w-full rounded-md border border-border-default bg-bg-surface px-3 text-sm text-text-primary placeholder:text-text-disabled focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-subtle"
            />
          </InputField>

          <InputField label="Texto enfocado (forzado)" helper="Estado focus simulado.">
            <input
              type="text"
              defaultValue="Casa Montejo"
              className="h-9 w-full rounded-md border border-brand bg-bg-surface px-3 text-sm text-text-primary placeholder:text-text-disabled outline-none ring-2 ring-brand-subtle"
            />
          </InputField>

          <InputField label="Texto con error" error="El nombre debe tener al menos 2 caracteres.">
            <input
              type="text"
              defaultValue="A"
              className="h-9 w-full rounded-md border border-danger-text bg-bg-surface px-3 text-sm text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-danger-subtle"
            />
          </InputField>

          <InputField label="Texto deshabilitado" helper="No editable mientras se procesa.">
            <input
              type="text"
              disabled
              defaultValue="Casa Montejo"
              className="h-9 w-full cursor-not-allowed rounded-md border border-border-subtle bg-bg-elevated px-3 text-sm text-text-disabled opacity-70"
            />
          </InputField>

          <InputField label="Buscar" helper="Filtra resultados conforme escribes.">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-text-tertiary"
                strokeWidth={1.5}
              />
              <input
                type="search"
                placeholder="Buscar proyecto..."
                className="h-9 w-full rounded-md border border-border-default bg-bg-surface pl-9 pr-3 text-sm text-text-primary placeholder:text-text-disabled focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-subtle"
              />
            </div>
          </InputField>

          <InputField
            label="Tipo de propiedad"
            helper="Catálogo cerrado. Click en el trigger para ver el dropdown."
          >
            <Select defaultValue="casa">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casa">Casa habitación</SelectItem>
                <SelectItem value="depto">Departamento</SelectItem>
                <SelectItem value="local">Local comercial</SelectItem>
              </SelectContent>
            </Select>
          </InputField>

          <div className="md:col-span-2">
            <InputField
              label="Notas de la cotización"
              helper="Visible solo para usuarios internos. Máx. 500 caracteres."
            >
              <textarea
                rows={3}
                placeholder="Detalla particularidades del trabajo..."
                className="w-full resize-y rounded-md border border-border-default bg-bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-disabled focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-subtle"
              />
            </InputField>
          </div>
        </div>
      </Subsection>

      <Subsection
        title="2.4 Avatares"
        caption="3 tamaños (24/32/40 px) × 3 variantes. Color por hash del nombre para iniciales."
      >
        <AvatarGrid />
      </Subsection>

      <Subsection
        title="2.5 Iconos"
        caption="36 iconos lucide-react relevantes para NAJA. Stroke 1.5, tamaños 16/20/24 px."
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {ICONS.map(({ name, Icon }) => (
            <div
              key={name}
              className="flex flex-col items-center gap-3 rounded-md border border-border-subtle bg-bg-surface p-3"
            >
              <div className="flex items-end gap-3 text-text-secondary">
                <Icon className="size-4" strokeWidth={1.5} />
                <Icon className="size-5" strokeWidth={1.5} />
                <Icon className="size-6" strokeWidth={1.5} />
              </div>
              <code className="font-mono text-xs text-text-tertiary">{name}</code>
            </div>
          ))}
        </div>
      </Subsection>

      <Subsection
        title="2.6 Iconos por tipo de propiedad"
        caption="Un icono dedicado por cada tipo del catálogo de propiedades (property_types)."
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {PROPERTY_TYPE_ICONS.map(({ label, name, Icon }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-md border border-border-subtle bg-bg-surface p-3"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-bg-elevated text-text-secondary">
                <Icon className="size-5" strokeWidth={1.5} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm text-text-primary">{label}</p>
                <code className="font-mono text-xs text-text-tertiary">{name}</code>
              </div>
            </div>
          ))}
        </div>
      </Subsection>
    </Section>
  );
}

function ButtonGrid({ variant }: { variant: Variant }) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-text-primary capitalize">{variant}</h4>
      <div className="grid grid-cols-[64px_repeat(5,minmax(0,1fr))] items-center gap-x-4 gap-y-3">
        <div />
        {STATES.map((s) => (
          <div key={s} className="text-xs text-text-tertiary">
            {s}
          </div>
        ))}
        {SIZES.map((size) => (
          <RowGroup key={size} variant={variant} size={size} />
        ))}
      </div>
    </div>
  );
}

function RowGroup({ variant, size }: { variant: Variant; size: Size }) {
  return (
    <>
      <div className="text-xs text-text-tertiary">{size}</div>
      {STATES.map((state) => (
        <div key={state} className="flex">
          <DemoButton variant={variant} size={size} state={state} />
        </div>
      ))}
    </>
  );
}

function DemoButton({ variant, size, state }: { variant: Variant; size: Size; state: State }) {
  const isDisabled = state === 'disabled' || state === 'loading';
  const base =
    'inline-flex items-center justify-center rounded-md font-medium transition-colors duration-150 outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  let visual: string;

  if (state === 'hover') {
    visual = VARIANT_HOVER_STATIC[variant];
  } else if (state === 'focus') {
    visual = `${VARIANT_STATIC[variant]} ring-2 ring-brand`;
  } else {
    visual = `${VARIANT_STATIC[variant]} ${VARIANT_HOVER_PREFIX[variant]}`;
  }

  const spinnerSize = size === 'lg' ? 'size-4' : size === 'md' ? 'size-3.5' : 'size-3';

  return (
    <button
      type="button"
      disabled={isDisabled}
      className={`${base} ${SIZE_CLASSES[size]} ${visual}`}
    >
      {state === 'loading' && (
        <Loader2 className={`${spinnerSize} animate-spin`} strokeWidth={1.75} />
      )}
      {VARIANT_LABEL[variant]}
    </button>
  );
}

function InputField({
  label,
  helper,
  error,
  children,
}: {
  label: string;
  helper?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs text-text-secondary">{label}</label>
      {children}
      {error ? (
        <p className="text-xs text-danger-text">{error}</p>
      ) : helper ? (
        <p className="text-xs text-text-tertiary">{helper}</p>
      ) : null}
    </div>
  );
}

function AvatarGrid() {
  const NAMES = ['María Pérez', 'Juan Hernández', 'Roberto García'];
  const SIZES_PX = [24, 32, 40];

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-xs text-text-tertiary">Iniciales (color por hash del nombre)</p>
        <div className="flex flex-col gap-4">
          {NAMES.map((name) => (
            <div key={name} className="flex items-center gap-5">
              <span className="w-40 text-sm text-text-secondary">{name}</span>
              <div className="flex items-end gap-3">
                {SIZES_PX.map((s) => (
                  <InitialsAvatar key={s} name={name} size={s} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs text-text-tertiary">Imagen</p>
        <div className="flex items-end gap-3">
          {SIZES_PX.map((s) => (
            <ImageAvatar key={s} size={s} />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs text-text-tertiary">Fallback (icono lucide)</p>
        <div className="flex items-end gap-3">
          {SIZES_PX.map((s) => (
            <IconAvatar key={s} size={s} />
          ))}
        </div>
      </div>
    </div>
  );
}

function InitialsAvatar({ name, size }: { name: string; size: number }) {
  return <Avatar name={name} size={size} />;
}

function ImageAvatar({ size }: { size: number }) {
  return (
    <Avatar size={size} className="bg-bg-overlay">
      <svg viewBox="0 0 100 100" className="block h-full w-full" aria-hidden>
        <circle cx="50" cy="38" r="16" fill="rgba(255,255,255,0.45)" />
        <path
          d="M50 60 C25 60, 15 88, 15 100 L85 100 C85 88, 75 60, 50 60 Z"
          fill="rgba(255,255,255,0.45)"
        />
      </svg>
    </Avatar>
  );
}

function IconAvatar({ size }: { size: number }) {
  const iconSize = size < 28 ? 14 : size < 36 ? 18 : 22;
  return (
    <Avatar size={size} className="items-center justify-center bg-bg-overlay text-text-secondary">
      <User style={{ width: iconSize, height: iconSize }} strokeWidth={1.5} />
    </Avatar>
  );
}
