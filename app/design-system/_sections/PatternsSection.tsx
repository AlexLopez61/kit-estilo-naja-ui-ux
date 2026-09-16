/**
 * «Moldes de pantalla»: una subsección por molde (M0–M5) con un demo
 * funcional a tamaño real y datos ficticios. Las recetas viven en
 * `docs/02-moldes.md`; aquí se ven armadas con las piezas de
 * `components/shared` y `components/ui`.
 */

import { Section } from '../_components/Section';
import { Subsection } from '../_components/Subsection';
import { CockpitDemo } from './patterns/CockpitDemo';
import { FlatListDemo } from './patterns/FlatListDemo';
import { HybridDemo } from './patterns/HybridDemo';
import { PageAnatomyDemo } from './patterns/PageAnatomyDemo';
import { ProjectPageDemo } from './patterns/ProjectPageDemo';

export function PatternsSection() {
  return (
    <Section
      id="patterns"
      title="Moldes de pantalla"
      description="Cada molde es una receta completa de pantalla (docs/02-moldes.md). Antes de construir una vista se elige el molde y se copia; desviarse requiere una razón escrita. Los demos son funcionales: filtran, seleccionan y abren fichas con datos ficticios."
    >
      <Subsection
        id="m0-anatomia-de-pagina"
        title="M0 · Anatomía de página y tabs de módulo"
        caption="PageContainer (max-w 1700, p-6 md:p-8, space-y-6) dentro de la vista flotante (rounded-xl + shadow-md sobre el marco gris). Sin PageHeader en módulos operativos: la primera fila útil son los tabs line (subrayado negro) con la acción global negra a la derecha; el contenido entra con animate-in fade-in-0 slide-in-from-bottom-1 duration-300. Cada tab es ?tab= en la URL; tope de siete."
      >
        <PageAnatomyDemo />
      </Subsection>

      <Subsection
        id="m1-lista-plana"
        title="M1 · Lista plana (estilo deployments)"
        caption="Toolbar fuera del marco: Input con lupa y Kbd F (pulsa F para enfocar), SegmentedControl switch con conteos, dos FilterSelect y la única primaria negra al final. Debajo, card nivel 3 con TABLE_HEAD_CLASS, filas tableRowClass (min-h-16, zebra, hover de tinte) y TableFooter con conteo y total. En la app los filtros viven en la URL; aquí en estado local, pero filtran de verdad."
      >
        <FlatListDemo />
      </Subsection>

      <Subsection
        id="m2-m3-lista-y-ficha"
        title="M2 + M3 · Lista + ficha en panel (HybridSplit)"
        caption="Haz clic en una fila: la lista se comprime a las columnas esenciales y el panel (bg-bg-elevated, shadow-md en el envoltorio) entra desde la derecha en 300 ms; la fila seleccionada comparte fondo con el panel y lleva SelectedStripe. La ficha (M3) es DetailPanelFrame: toolbar con cierre a la izquierda y SplitActionButton «Editar | ⌄» a la derecha, PanelHero con PanelHeroHead, PanelTile, rejilla de PanelField y PanelFoot, y sub-cards planas. Abajo, la variante wide: la lista se comprime a clamp(300px, 36cqw, 420px) y el panel toma el resto (tile y rejilla pasan a lado a lado desde @2xl)."
      >
        <div className="space-y-10">
          <HybridDemo />
          <div className="space-y-3">
            <p className="text-xs text-text-tertiary">Variante wide · abre con una orden seleccionada</p>
            <HybridDemo wide initialId="o-0031" />
          </div>
        </div>
      </Subsection>

      <Subsection
        id="m4-ficha-en-pagina"
        title="M4 · Ficha en página (encabezado «project page»)"
        caption="Entidad raíz con tres o más tabs: migaja text-[13px] terciaria, h1 text-[26px] semibold tracking-tight + Badge neutral, meta con folio mono, estado editable y «Creado el … por» con avatar de 20 px; a la derecha Editar outline, primaria negra dividida y ⋯. Luego tabs line (tope 7) y el contenido del tab como grid de DetailCard: KpiTile ×4, lista densa y medidores. Sin hero card."
      >
        <ProjectPageDemo />
      </Subsection>

      <Subsection
        id="m5-cockpit"
        title="M5 · Cockpit / dashboard"
        caption="Grid gap-4: dos cards hero nivel 3 (dona por cuenta y posición con Meter), fila de KpiTile sm:grid-cols-2 xl:grid-cols-4 (los clicables filtran la bandeja de abajo y suben un nivel en hover), «Últimos movimientos» y «Por cerrar». La dona no lleva animación ni trazo; el color sigue a la entidad (misma rebanada, mismo punto en la leyenda) y la leyenda clicable muestra nombre, % y valor."
      >
        <CockpitDemo />
      </Subsection>
    </Section>
  );
}
