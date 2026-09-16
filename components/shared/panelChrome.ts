/**
 * Chrome compartido de las fichas en panel de la vista híbrida (Finanzas ›
 * Movimientos, Pendientes y Cuentas; Alex 07/09/2026):
 *
 *  - Vidrio "liquid glass" del toolbar sticky y del pie espejado: receta de
 *    `NajaModal` tintada con `--color-bg-elevated` (el fondo del panel) en vez
 *    de `--background`. Excepción sancionada en `docs/UI_UX_VERCEL.md`
 *    (§Chrome glass del panel). Sin carril `md:right-2.5`: la barra de scroll
 *    de estas fichas es overlay (`AutoHideScrollArea`, z-30) y pasa por encima.
 *  - Botón dividido primario negro «Acción | ⌄»: clase del segmento principal
 *    (button o Link); el chevron abre el menú con el resto de acciones.
 *
 * Son strings y no componentes porque cada ficha compone el toolbar con sus
 * propios controles; lo que se comparte es la receta visual.
 */

/** Vidrio del toolbar: degradado de 5 paradas hacia arriba + blur + máscara. */
export const PANEL_GLASS_TOP_CLASS =
  'pointer-events-none absolute inset-y-0 right-0 left-0 -z-10 bg-[linear-gradient(to_top,transparent,color-mix(in_oklab,var(--color-bg-elevated)_20%,transparent)_35%,color-mix(in_oklab,var(--color-bg-elevated)_50%,transparent)_55%,color-mix(in_oklab,var(--color-bg-elevated)_80%,transparent)_78%,var(--color-bg-elevated))] backdrop-blur-[2px] [mask-image:linear-gradient(to_top,transparent,black_20%)]';

/** Vidrio inferior espejado, sin contenido (overlay absoluto de 64px). */
export const PANEL_GLASS_BOTTOM_CLASS =
  'pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-[linear-gradient(to_bottom,transparent,color-mix(in_oklab,var(--color-bg-elevated)_20%,transparent)_35%,color-mix(in_oklab,var(--color-bg-elevated)_50%,transparent)_55%,color-mix(in_oklab,var(--color-bg-elevated)_80%,transparent)_78%,var(--color-bg-elevated))] backdrop-blur-[2px] [mask-image:linear-gradient(to_bottom,transparent,black_20%)]';

/** Segmento principal del botón dividido negro (`bg-foreground text-background`). */
export const SPLIT_ACTION_CLASS =
  'inline-flex cursor-pointer items-center gap-1.5 px-3.5 text-sm font-medium outline-none transition-opacity hover:opacity-85 focus-visible:opacity-85 disabled:cursor-default disabled:opacity-60';

/** Chevron del botón dividido (trigger del menú). */
export const SPLIT_MENU_TRIGGER_CLASS =
  'inline-flex cursor-pointer items-center px-2 outline-none transition-opacity hover:opacity-85 focus-visible:opacity-85';
