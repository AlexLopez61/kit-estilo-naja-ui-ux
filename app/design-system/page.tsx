import { InspectorLayer, InspectorProvider, InspectorToggle } from './_components/inspector';
import { ShowcaseShell } from './_components/ShowcaseShell';
import { AtomsSection } from './_sections/AtomsSection';
import { CompositesSection } from './_sections/CompositesSection';
import { FormControlsSection } from './_sections/FormControlsSection';
import { FoundationsSection } from './_sections/FoundationsSection';
import { MiscSection } from './_sections/MiscSection';
import { ModalsSection } from './_sections/ModalsSection';
import { NavigationSection } from './_sections/NavigationSection';
import { OverlaysSection } from './_sections/OverlaysSection';
import { PatternsSection } from './_sections/PatternsSection';
import { StatesSection } from './_sections/StatesSection';

export const metadata = {
  title: 'Sistema de diseño',
  description: 'Catálogo de tokens, primitivas y moldes del kit.',
};

export default function DesignSystemPage() {
  return (
    <InspectorProvider>
      <div data-showcase-root className="min-h-screen bg-bg-base text-text-primary">
        <ShowcaseShell>
          <header className="flex items-start justify-between gap-4 px-6 py-5">
            <div>
              <p className="text-xs text-text-tertiary">Kit Estilo NAJA · v1.0</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-[-0.01em]">Sistema de diseño</h1>
              <p className="mt-2 max-w-2xl text-sm text-text-secondary">
                Catálogo de tokens, primitivas y moldes de pantalla del kit. Es la versión visual
                de{' '}
                <code className="rounded-sm bg-bg-elevated px-1.5 py-0.5 font-mono text-xs">
                  docs/01-sistema.md
                </code>{' '}
                y{' '}
                <code className="rounded-sm bg-bg-elevated px-1.5 py-0.5 font-mono text-xs">
                  docs/02-moldes.md
                </code>
                .
              </p>
            </div>
            <div className="shrink-0 pt-1">
              <InspectorToggle />
            </div>
          </header>

          <FoundationsSection />
          <AtomsSection />
          <CompositesSection />
          <PatternsSection />
          <StatesSection />
          <FormControlsSection />
          <OverlaysSection />
          <ModalsSection />
          <NavigationSection />
          <MiscSection />
        </ShowcaseShell>
      </div>

      <InspectorLayer />
    </InspectorProvider>
  );
}
