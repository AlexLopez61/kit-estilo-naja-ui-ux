'use client';

import { Building2, ImageIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
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
import { formatCurrency } from '@/lib/i18n/formatters';
import { Section } from '../_components/Section';
import { Subsection } from '../_components/Subsection';

/** Skeleton con la superficie del sistema (bg-bg-elevated). */
function S({ className }: { className?: string }) {
  return <Skeleton className={`bg-bg-elevated ${className ?? ''}`} />;
}

export function MiscSection() {
  return (
    <Section
      id="misc"
      title="Misc"
      description="Componentes varios: skeletons de carga, carrusel y paneles redimensionables."
    >
      <Subsection
        id="skeleton"
        title="10.1 Skeleton (variantes)"
        caption="Cinco esqueletos de carga: card, lista, tabla, KPIs y detalle complejo. Todos con animate-pulse."
      >
        <SkeletonDemo />
      </Subsection>

      <Subsection
        id="carousel"
        title="10.2 Carousel"
        caption="Tres slides con flechas y dots de navegación. Embla bajo el capó."
      >
        <CarouselDemo />
      </Subsection>

      <Subsection
        id="resizable"
        title="10.3 Resizable panels"
        caption="Tres paneles horizontales (30 / 50 / 20) con divisores arrastrables."
      >
        <ResizableDemo />
      </Subsection>
    </Section>
  );
}

// 10.1 -----------------------------------------------------------------------

function SkeletonDemo() {
  return (
    <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
      {/* Card */}
      <SkeletonBox label="Card">
        <div className="rounded-lg border border-border-subtle bg-bg-surface p-4">
          <div className="flex items-center gap-3">
            <S className="size-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <S className="h-3 w-2/3" />
              <S className="h-3 w-1/3" />
            </div>
          </div>
          <S className="mt-4 h-3 w-full" />
          <S className="mt-2 h-3 w-4/5" />
        </div>
      </SkeletonBox>

      {/* Lista */}
      <SkeletonBox label="Lista (5 rows)">
        <div className="overflow-hidden rounded-lg border border-border-subtle bg-bg-surface">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 border-b border-border-subtle px-4 py-2.5 last:border-0"
            >
              <S className="size-6 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <S className="h-3 w-1/2" />
                <S className="h-2.5 w-1/3" />
              </div>
              <S className="h-5 w-16 rounded-sm" />
            </div>
          ))}
        </div>
      </SkeletonBox>

      {/* Tabla */}
      <SkeletonBox label="Tabla (header + 5×4)">
        <div className="overflow-hidden rounded-lg border border-border-subtle bg-bg-surface">
          <div className="grid grid-cols-4 gap-3 border-b border-border-subtle bg-bg-elevated px-4 py-2.5">
            {Array.from({ length: 4 }, (_, i) => (
              <S key={i} className="h-3 w-3/4" />
            ))}
          </div>
          {Array.from({ length: 5 }, (_, r) => (
            <div
              key={r}
              className="grid grid-cols-4 gap-3 border-b border-border-subtle px-4 py-3 last:border-0"
            >
              {Array.from({ length: 4 }, (_, c) => (
                <S key={c} className="h-3 w-full" />
              ))}
            </div>
          ))}
        </div>
      </SkeletonBox>

      {/* KPI */}
      <SkeletonBox label="KPI (3 cards)">
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="rounded-lg border border-border-subtle bg-bg-surface p-4">
              <S className="h-2.5 w-2/3" />
              <S className="mt-3 h-6 w-1/2" />
              <S className="mt-2 h-2.5 w-1/3" />
            </div>
          ))}
        </div>
      </SkeletonBox>

      {/* Detalle complejo */}
      <SkeletonBox label="Detalle complejo" className="xl:col-span-2">
        <div className="rounded-lg border border-border-subtle bg-bg-surface p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <S className="size-12 rounded-lg" />
              <div className="space-y-2">
                <S className="h-4 w-40" />
                <S className="h-3 w-24" />
              </div>
            </div>
            <S className="h-8 w-24 rounded-md" />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="space-y-2">
                <S className="h-2.5 w-1/2" />
                <S className="h-4 w-3/4" />
              </div>
            ))}
          </div>
          <S className="mt-5 h-3 w-full" />
          <S className="mt-2 h-3 w-5/6" />
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

function CarouselDemo() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const slidesCount = 3;

  useEffect(() => {
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
            <div className="flex h-48 flex-col items-center justify-center gap-3 rounded-lg border border-border-subtle bg-bg-surface">
              <ImageIcon className="size-10 text-text-tertiary" strokeWidth={1.5} />
              <p className="text-sm text-text-secondary">Galería de obra · Casa Cardín</p>
            </div>
          </CarouselItem>
          <CarouselItem>
            <div className="h-48 rounded-lg border border-border-subtle bg-bg-surface p-4">
              <div className="flex items-center gap-2 text-text-tertiary">
                <Building2 className="size-4" strokeWidth={1.5} />
                <span className="text-xs">Propiedad</span>
              </div>
              <p className="mt-2 text-base text-text-primary">Casa Cardín</p>
              <p className="text-sm text-text-secondary">Recidencial del Mayab · Casa</p>
              <p className="mt-6 text-xs text-text-tertiary">Renta mensual</p>
              <p className="text-xl tabular-nums text-text-primary">{formatCurrency(18500)}</p>
            </div>
          </CarouselItem>
          <CarouselItem>
            <div className="h-48 rounded-lg border border-border-subtle bg-bg-surface p-4">
              <span className="inline-flex items-center rounded-sm bg-info-subtle px-2 py-0.5 text-xs text-info-text">
                En progreso
              </span>
              <p className="mt-2 text-base text-text-primary">Pintura fachada Casa Montejo</p>
              <p className="text-sm text-text-secondary">María Pérez · hace 3 días</p>
              <p className="mt-6 text-xs text-text-tertiary">Presupuesto</p>
              <p className="text-xl tabular-nums text-text-primary">{formatCurrency(156890)}</p>
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: slidesCount }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Ir al slide ${i + 1}`}
            onClick={() => api?.scrollTo(i)}
            className={`size-1.5 rounded-full transition-colors ${
              current === i ? 'bg-brand' : 'bg-border-strong hover:bg-text-tertiary'
            }`}
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
      className="h-64 max-w-3xl rounded-lg border border-border-subtle bg-bg-surface"
    >
      <ResizablePanel defaultSize="30%" minSize="15%">
        <PanelBody title="Lista" hint="30%" />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="50%" minSize="25%">
        <PanelBody title="Preview" hint="50%" />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="20%" minSize="12%">
        <PanelBody title="Acciones" hint="20%" />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

function PanelBody({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-1 p-4">
      <p className="text-sm text-text-primary">{title}</p>
      <p className="text-xs tabular-nums text-text-tertiary">{hint}</p>
    </div>
  );
}
