# CLAUDE.md

> Instrucciones para Claude Code en proyectos nacidos del **KIT Estilo NAJA UI/UX**.
> Versión 1.0 · 16/09/2026.

---

## 1. Qué es este repositorio

Kit de arranque Next.js con un sistema de diseño ya calibrado (estilo Vercel / Geist, claro y oscuro). Si estás leyendo esto dentro de un software nuevo creado desde la plantilla, el sistema de diseño **ya está decidido**: no se reinventa, se aplica.

Fuentes de verdad, en este orden:

1. `docs/01-sistema.md` — tokens, tipografía, escala de elevación, interacción, primitivas, reglas absolutas.
2. `docs/02-moldes.md` — una receta por tipo de pantalla (lista, lista + ficha, ficha, alta, modal, dashboard).
3. `/design-system` en el navegador — catálogo visual; cada bloque trae su JSX.
4. `/demo` — las páginas de ejemplo de cada molde dentro del shell.

## 2. Stack

Next.js 15 (App Router, `typedRoutes`), React 19, TypeScript strict, Tailwind v4 (`@theme inline` en `app/globals.css`, sin `tailwind.config`), shadcn/ui new-york sobre Radix copiado en `components/ui`, Geist (paquete `geist`), lucide-react, `next-themes`, sonner, `tw-animate-css`, recharts, react-hook-form + zod, date-fns.

Comandos: `pnpm dev`, `pnpm build`, `pnpm typecheck`, `pnpm lint`, `pnpm format`.

## 3. Convenciones

- **Idioma**: UI en español (México); código, tipos y nombres de archivo en inglés; comentarios técnicos en español o inglés, consistentes con el archivo.
- **Archivos**: componentes `PascalCase.tsx`; utilidades `camelCase.ts`; páginas Next en kebab-case; componentes específicos de un módulo en `components/<modulo>/`; reutilizables en `components/shared/` (piezas de moldes) o `components/patterns/` (estructura de página).
- **Formato**: Prettier (100 columnas, comillas simples). ESLint de Next.
- **Commits**: Conventional Commits en español (`feat(modulo): …`, `fix: …`, `docs: …`).

## 4. Reglas de UI que Claude debe cumplir siempre

1. **Solo tokens.** Nunca `text-green-800`, `bg-amber-100`, `#171717`. Vistas usan `bg-bg-*`, `text-text-*`, `border-border-*`, semánticos `*-subtle` / `*-text`; primitivas y modales usan los tokens shadcn (`bg-card`, `text-muted-foreground`).
2. **Una primaria por pantalla, negra.** `<Button>` sin variante ya es negro. El resto `outline` o `ghost`. En fichas, la primaria es `SplitActionButton` («Acción | ⌄»).
3. **Escala de elevación.** Contenedores de vista en nivel 3 (`DETAIL_CARD_CLASS`: `bg-bg-surface rounded-lg shadow-md dark:border dark:border-border-card`). Cards dentro de paneles y modales en nivel 0 (sin sombra; borde `border-subtle` solo sobre el piso de un modal o drawer). Controles `shadow-xs`. Overlays `shadow-lg`. Nada en `shadow-sm + border-card`.
4. **Filas.** Hover `hover:bg-row-hover`; seleccionada `bg-bg-elevated shadow-row-selected` + `SelectedStripe`; `cursor-pointer` explícito; sin bordes verticales; montos a la derecha con `tabular-nums`.
5. **Foco** = `focus-visible:border-ring/50 focus-visible:shadow-focus`. Nunca `ring-2`, `ring-[3px]`, borde azul sólido.
6. **Tipografía.** 400 cuerpo, 500 labels y valores, 600 títulos. Sentence case; nunca `uppercase`. Placeholders `text-text-disabled`.
7. **Movimiento.** 150 ms hover, 300 ms paneles; entradas `animate-in fade-in-0 slide-in-from-bottom-1 duration-300`; acordeones con `DisclosureRow` o `Collapsible` animado, nunca `<details>`; sin scale, bounce ni blur.
8. **Modales** sobre `NajaModal` (`headerAlign="center"`, `footerMuted`, `StepCard`), destructivos sobre `ConfirmDeleteModal`. Nunca `Dialog` crudo. Drawers: `Sheet` con `sm:max-w-*`, nunca `w-full`.
9. **Páginas** dentro de `PageContainer`. Módulos operativos abren con toolbar o tabs, sin `PageHeader` (reservado a configuración y detalle). Tabs `variant="line"`, tope siete.
10. **Moldes.** Antes de construir una pantalla, elegir su molde en `docs/02-moldes.md` (M1 lista, M2/M3 lista + ficha en panel, M4 ficha en página, M5 cockpit, M6 drawer, M7 página enfocada, M8 modal, M10 configuración) y copiar la receta. Desviarse requiere una razón escrita en el PR.
11. **Datos.** Moneda y fechas por `lib/i18n/formatters`; color por signo en flujos; saldos rojos solo si negativos; periodos cerrados en filtros financieros (`MonthPicker`).
12. **Permisos.** Lo que un rol no puede hacer no se renderiza; si hay alternativa se muestra en su lugar. Nunca `disabled` sin contexto.

## 5. Antes de dar por terminado un componente

- [ ] Está en un solo nivel de la escala de elevación.
- [ ] Todos los colores salen de tokens y se ve bien en oscuro sin `dark:*` extra.
- [ ] Una sola primaria, negra.
- [ ] Foco glow, hover de 150 ms, sin halo en filas.
- [ ] Montos formateados y alineados; sentence case; pesos 400/500/600.
- [ ] Funciona en móvil y 50 % más estrecho.
- [ ] Se parece al molde que le corresponde, o hay una razón escrita.

## 6. Qué NO trae el kit

Base de datos, autenticación, RLS, lógica de negocio, PDFs. `app/(dashboard)/layout.tsx` marca dónde va la validación de sesión y los providers. Las páginas de `app/(dashboard)/demo` y `app/(focused)/nuevo` son ejemplos con datos ficticios: bórralas cuando existan las reales.

## 7. Mantenimiento del kit

Los cambios de diseño se hacen primero en `docs/01-sistema.md` o `02-moldes.md`, después en `globals.css` o la primitiva, y por último en el showcase. Nunca al revés. Si el kit y un proyecto derivado divergen, gana el kit y el proyecto se actualiza al tocar cada módulo.
