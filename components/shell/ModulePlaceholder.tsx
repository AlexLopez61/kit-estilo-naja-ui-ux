import * as React from 'react';
import { Construction } from 'lucide-react';
import { PageContainer } from '@/components/patterns/PageContainer';
import { PageHeader } from '@/components/patterns/PageHeader';
import { EmptyState } from '@/components/patterns/EmptyState';

/** Página de relleno para módulos aún no construidos. */
export function ModulePlaceholder({ title, description }: { title: string; description?: string }) {
  return (
    <PageContainer>
      <PageHeader title={title} description={description} />
      <EmptyState
        icon={<Construction size={24} />}
        title="Módulo en construcción"
        description="Esta pantalla todavía no existe. Elige su molde en docs/02-moldes.md antes de construirla."
      />
    </PageContainer>
  );
}
