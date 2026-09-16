# KIT Estilo NAJA UI/UX

Kit de arranque para software interno con el sistema de diseño **estilo Vercel / Geist** que se construyó y calibró en NAJA-app 2 entre mayo y septiembre de 2026: tokens de dos temas, primitivas shadcn ajustadas, componentes compartidos, moldes de pantalla, shell de dashboard y un showcase navegable.

Es un repositorio **plantilla**: cada software nuevo nace como copia y evoluciona solo.

## Empezar un software nuevo

```bash
# Desde GitHub: «Use this template», o con el CLI
gh repo create <nuevo-software> --template AlexLopez61/kit-estilo-naja-ui-ux --private --clone
cd <nuevo-software>
pnpm install
pnpm dev
```

- `/design-system` — catálogo de tokens, primitivas y moldes (leer antes de construir).
- `/demo` — el shell del dashboard con las páginas de ejemplo de cada molde: cockpit, lista + ficha en panel, ficha en página, configuración.
- `/nuevo` — alta en página enfocada (sin sidebar).

Cuando el proyecto real avance, borra `app/(dashboard)/demo`, `app/(focused)/nuevo` y sus datos ficticios; conserva `app/design-system` como referencia viva del equipo (o quítalo si estorba).

## Qué contiene

| Carpeta | Qué |
| --- | --- |
| `app/globals.css` | Tokens de ambos temas (`--ds-*` + espejo shadcn), escala tipográfica, radios, sombras, foco, scrollbar |
| `components/ui/` | 57 primitivas shadcn (new-york) con los ajustes del sistema: primario negro, `Card` a 6 px y nivel 3, hover de fila único, tabs con subrayado negro, `SegmentedControl` switch, avatar en blanco y negro, foco glow |
| `components/shared/` | Piezas de los moldes: `DetailCard` (cards, listas densas, KPI, medidores), `DetailPanel` (lista + ficha en panel), `StepCard`, `FormPrimitives`, `SettingsCard`, `FilterSelect`, `MonthPicker`, `SelectedStripe`, `PanelField`, `panelChrome` |
| `components/patterns/` | `PageContainer`, `PageHeader`, `EmptyState`, `DisclosureRow`, `SlideTransition`, `DestructiveConfirm` |
| `components/modals/` | `ConfirmDeleteModal`, `QuickFormModal`, `DetailModal`, `WizardModal`, `LogoUploader` (sobre `NajaModal` de `components/ui`) |
| `components/shell/` | `AppSidebar`, `NavMain`, `NavUser`, `SiteHeader`, `ModulePlaceholder` |
| `lib/` | `cn`, formatters (MXN, dd/MM/yyyy), `navigation.ts` (grupos del sidebar), `concurrency.ts`, `dateWindow.ts` |
| `docs/` | `01-sistema.md` (reglas) y `02-moldes.md` (recetas de pantalla) |

No incluye base de datos, autenticación ni lógica de negocio: el shell tiene un usuario ficticio y un comentario donde va la validación de sesión.

## Reglas en una línea

Solo tokens, nunca literales. Una primaria por pantalla y es negra. Cards de vista en nivel 3 (`shadow-md`), dentro de paneles y modales en nivel 0. Hover de fila = tinte; halo solo en la seleccionada. Foco = glow azul. Sentence case, títulos en 600, sin mayúsculas. Acordeones animados. Modales sobre `NajaModal`. Todo dentro de `PageContainer`. El detalle está en `docs/01-sistema.md`; los moldes en `docs/02-moldes.md`.

## Comandos

```bash
pnpm dev          # servidor de desarrollo
pnpm build        # build de producción
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint
pnpm format       # prettier
```

## Personalizar la marca

1. `app/globals.css`: la familia `--ds-brand*` es el único acento de color. `--ds-success*` es independiente aunque hoy valga igual.
2. `components/shell/AppSidebar.tsx` recibe `brand={{ name, icon, href }}`.
3. `lib/navigation.ts` declara los grupos del sidebar.
4. `app/layout.tsx`: `metadata.title`.

## Origen

Extraído de `naja-app-2` el 16/09/2026 tras consolidar el diseño (auditoría y decisiones en ese repositorio: `docs/CONSOLIDACION_DISENO.md`). Historial de decisiones de diseño: `naja-app-2/docs/design/CHANGELOG.md`.
