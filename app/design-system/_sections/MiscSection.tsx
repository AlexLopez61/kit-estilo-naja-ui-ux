'use client';

import * as React from 'react';
import { Building2, ChevronLeft, ChevronRight, Home, ImageIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Skeleton } from '@/components/ui/skeleton';
import { SlideTransition } from '@/components/patterns/SlideTransition';
import { DETAIL_CARD_CLASS, IconCircle } from '@/components/shared/DetailCard';
import { formatCurrency } from '@/lib/i18n/formatters';
import { cn } from '@/lib/utils';
import { Section } from '../_components/Section';
import { Subsection } from '../_components/Subsection';

/** Skeleton con la superficie del sistema (bg-bg-elevated). */
function Bone({ className }: { className?: string }) {
  return <Skeleton className={cn('bg-bg-elevated', className)} />;
}

export function MiscSection() {
  return (
    <Section
      id="misc"
      title="Misceláneos"
      description="Piezas que no pertenecen a un molde: variantes de skeleton, carrusel, paneles redimensionables y la transición direccional entre niveles de un módulo. Todo sobre tokens y en nivel 3 cuando vive en la página."
    >
      <Subsection
        id="skeleton"
        title="10.1 Skeleton (variantes)"
        caption="Cinco siluetas de carga en cards de nivel 3: card, lista, tabla (encabezado sin fondo), KPIs y detalle. Todas con animate-pulse sobre bg-bg-elevated."
      >
        <SkeletonDemo />
      </Subsection>

      <Subsection
        id="carousel"
        title="10.2 Carousel"
        caption="Embla con flechas y puntos de navegación. El punto activo es primario (no de marca); las cards de cada slide van en nivel 3."
      >
        <CarouselDemo />
      </Subsection>

      <Subsection
        id="resizable"
        title="10.3 Resizable panels"
        caption="Tres paneles horizontales (30 / 50 / 20) con divisores arrastrables dentro de una card de nivel 3."
      >
        <ResizableDemo />
      </Subsection>

      <Subsection
        id="slide-transition"
        title="10.4 SlideTransition"
        caption="Transición direccional entre niveles de un módulo: al profundizar el contenido entra desde la derecha; al regresar, desde la izquierda (300 ms, fade + 32 px). El scope aísla el historial por módulo y el primer montaje no anima."
      >
        <SlideTransitionDemo />
      </Subsection>
    </Section>
  );
}

// 10.1 -----------------------------------------------------------------------

function SkeletonDemo() {
  return (
    <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
      <SkeletonBox label="Card">
        <div className={cn(DETAIL_CARD_CLASS, 'p-4')}>
          <div className="flex items-center gap-3">
            <Bone className="size-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Bone className="h-3 w-2/3" />
              <Bone className="h-3 w-1/3" />
            </div>
          </div>
          <Bone className="mt-4 h-3 w-full" />
          <Bone className="mt-2 h-3 w-4/5" />
        </div>
      </SkeletonBox>

      <SkeletonBox label="Lista · 5 filas">
        <div className={cn(DETAIL_CARD_CLASS, 'overflow-hidden')}>
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 border-b border-border-subtle px-4 py-2.5 last:border-0"
            >
              <Bone className="size-6 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Bone className="h-3 w-1/2" />
                <Bone className="h-2.5 w-1/3" />
              </div>
              <Bone className="h-5 w-16 rounded-sm" />
            </div>
          ))}
        </div>
      </SkeletonBox>

      <SkeletonBox label="Tabla · encabezado + 5×4">
        <div className={cn(DETAIL_CARD_CLASS, 'overflow-hidden')}>
          <div className="grid h-9 grid-cols-4 items-center gap-3 border-b border-border-subtle px-4">
            {Array.from({ length: 4 }, (_, i) => (
              <Bone key={i} className="h-2 w-3/4" />
            ))}
          </div>
          {Array.from({ length: 5 }, (_, r) => (
            <div
              key={r}
              className="grid grid-cols-4 gap-3 border-b border-border-subtle px-4 py-3 last:border-0"
            >
              {Array.from({ length: 4 }, (_, c) => (
                <Bone key={c} className="h-3 w-full" />
              ))}
            </div>
          ))}
        </div>
      </SkeletonBox>

      <SkeletonBox label="KPI · 3 tiles">
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className={cn(DETAIL_CARD_CLASS, 'p-4')}>
              <Bone className="h-2.5 w-2/3" />
              <Bone className="mt-3 h-6 w-1/2" />
              <Bone className="mt-2 h-2.5 w-1/3" />
            </div>
          ))}
        </div>
      </SkeletonBox>

      <SkeletonBox label="Detalle" className="xl:col-span-2">
        <div className={cn(DETAIL_CARD_CLASS, 'p-4')}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bone className="size-12 rounded-md" />
              <div className="space-y-2">
                <Bone className="h-4 w-40" />
                <Bone className="h-3 w-24" />
              </div>
            </div>
            <Bone className="h-8 w-24" />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="space-y-2">
                <Bone className="h-2.5 w-1/2" />
                <Bone className="h-4 w-3/4" />
              </div>
            ))}
          </div>
          <Bone className="mt-5 h-3 w-full" />
          <Bone className="mt-2 h-3 w-5/6" />
        </div>
      </SkeletonBox>
    </div>
  );
}

function SkeletonBox({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <p className="mb-2 text-xs text-text-tertiary">{label}</p>
      {children}
    </div>
  );
}

// 10.2 -----------------------------------------------------------------------

const SLIDES_COUNT = 3;

function CarouselDemo() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  return (
    <div className="max-w-md">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          <CarouselItem>
            <div
              className={cn(
                DETAIL_CARD_CLASS,
                'flex h-48 flex-col items-center justify-center gap-3',
              )}
            >
              <ImageIcon className="size-10 text-text-tertiary" strokeWidth={1.5} />
              <p className="text-sm text-text-secondary">Galería de obra · Casa Cardín</p>
            </div>
          </CarouselItem>
          <CarouselItem>
            <div className={cn(DETAIL_CARD_CLASS, 'h-48 p-4')}>
              <div className="flex items-center gap-2 text-text-tertiary">
                <Building2 className="size-4" strokeWidth={1.5} />
                <span className="text-xs">Propiedad</span>
              </div>
              <p className="mt-2 text-base font-semibold text-text-primary">Casa Cardín</p>
              <p className="text-sm text-text-secondary">Residencial del Mayab · Casa</p>
              <p className="mt-6 text-xs text-text-tertiary">Renta mensual</p>
              <p className="text-xl font-medium tabular-nums text-text-primary">
                {formatCurrency(18500)}
              </p>
            </div>
          </CarouselItem>
          <CarouselItem>
            <div className={cn(DETAIL_CARD_CLASS, 'h-48 p-4')}>
              <Badge tone="info">En progreso</Badge>
              <p className="mt-2 text-base font-semibold text-text-primary">
                Pintura fachada Casa Montejo
              </p>
              <p className="text-sm text-text-secondary">María Pérez · hace 3 días</p>
              <p className="mt-6 text-xs text-text-tertiary">Presupuesto</p>
              <p className="text-xl font-medium tabular-nums text-text-primary">
                {formatCurrency(156890)}
              </p>
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: SLIDES_COUNT }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Ir al slide ${i + 1}`}
            aria-current={current === i ? 'true' : undefined}
            onClick={() => api?.scrollTo(i)}
            className={cn(
              'size-1.5 rounded-full outline-none transition-colors duration-150 focus-visible:shadow-focus',
              current === i ? 'bg-text-primary' : 'bg-border-strong hover:bg-text-tertiary',
            )}
          />
        ))}
      </div>
    </div>
  );
}

// 10.3 -----------------------------------------------------------------------

function ResizableDemo() {
  return (
    <ResizablePanelGroup
      orientation="horizontal"
      className={cn(DETAIL_CARD_CLASS, 'h-64 max-w-3xl overflow-hidden')}
    >
      <ResizablePanel defaultSize="30%" minSize="15%">
        <PanelBody title="Lista" hint="30 %" />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="50%" minSize="25%">
        <PanelBody title="Vista previa" hint="50 %" />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="20%" minSize="12%">
        <PanelBody title="Acciones" hint="20 %" />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

function PanelBody({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-1 p-4">
      <p className="text-sm font-medium text-text-primary">{title}</p>
      <p className="text-xs tabular-nums text-text-tertiary">{hint}</p>
    </div>
  );
}

// 10.4 -----------------------------------------------------------------------

const PROPERTIES = [
  { id: 'cardin', name: 'Casa Cardín', units: 3, rent: 42800 },
  { id: 'montejo', name: 'Casa Montejo', units: 1, rent: 18500 },
  { id: 'itzimna', name: 'Local Itzimná', units: 2, rent: 26000 },
];

type Property = (typeof PROPERTIES)[number];

function SlideTransitionDemo() {
  const [selected, setSelected] = React.useState<Property | null>(null);
  const depth = selected ? 1 : 0;

  return (
    <div className={cn(DETAIL_CARD_CLASS, 'max-w-md overflow-hidden')}>
      <div className="flex h-12 items-center gap-2 border-b border-border-subtle px-3">
        {selected ? (
          <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>
            <ChevronLeft strokeWidth={1.5} />
            Volver
          </Button>
        ) : (
          <p className="px-1 text-sm font-semibold text-text-primary">Propiedades</p>
        )}
      </div>

      {/* key={depth}: remonta el wrapper para que calcule la dirección del salto. */}
      <SlideTransition key={depth} scope="showcase-slide" depth={depth}>
        {selected ? (
          <div className="p-4">
            <div className="flex items-center gap-3">
              <IconCircle icon={Home} />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text-primary">{selected.name}</p>
                <p className="text-xs text-text-tertiary">
                  {selected.units} {selected.units === 1 ? 'unidad' : 'unidades'}
                </p>
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <dt className="text-xs text-text-secondary">Renta mensual</dt>
                <dd className="text-sm font-medium tabular-nums text-text-primary">
                  {formatCurrency(selected.rent)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-text-secondary">Administración</dt>
                <dd className="text-sm text-text-primary">Sí, con comisión</dd>
              </div>
            </dl>
          </div>
        ) : (
          <ul className="divide-y divide-border-subtle">
            {PROPERTIES.map((property) => (
              <li key={property.id}>
                <button
                  type="button"
                  onClick={() => setSelected(property)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left outline-none transition-colors duration-150 hover:bg-row-hover focus-visible:shadow-focus"
                >
                  <IconCircle icon={Home} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-text-primary">
                      {property.name}
                    </span>
                    <span className="block text-xs text-text-tertiary">
                      {property.units} {property.units === 1 ? 'unidad' : 'unidades'}
                    </span>
                  </span>
                  <span className="text-sm tabular-nums text-text-secondary">
                    {formatCurrency(property.rent)}
                  </span>
                  <ChevronRight className="size-4 text-text-tertiary" strokeWidth={1.5} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </SlideTransition>
    </div>
  );
}
