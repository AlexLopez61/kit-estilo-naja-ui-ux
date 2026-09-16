import { Skeleton } from '@/components/ui/skeleton';

/**
 * Silueta de una ficha en panel (M3) mientras carga: toolbar, hero con
 * título y badges, tile de valor, rejilla de campos y una sub-card. Úsala como
 * `fallback` del `Suspense` que envuelve el detalle en el molde M2.
 */
export function DetailSkeleton() {
  return (
    <div aria-busy="true" aria-label="Cargando ficha" className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="size-8 rounded-md" />
        <Skeleton className="h-8 w-28 rounded-md" />
      </div>
      <div className="bg-bg-surface rounded-lg dark:border dark:border-border-card">
        <div className="border-border-subtle space-y-2.5 border-b px-4 py-3">
          <div className="flex items-center gap-2.5">
            <Skeleton className="size-8 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-44" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
          <div className="flex gap-1.5">
            <Skeleton className="h-5 w-16 rounded-sm" />
            <Skeleton className="h-5 w-20 rounded-sm" />
          </div>
        </div>
        <div className="grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <Skeleton className="h-24 rounded-lg" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3.5 w-24" />
              </div>
            ))}
          </div>
        </div>
        <div className="border-border-subtle border-t px-4 py-2.5">
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
      <div className="bg-bg-surface space-y-3 rounded-lg p-4 dark:border dark:border-border-card">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    </div>
  );
}
