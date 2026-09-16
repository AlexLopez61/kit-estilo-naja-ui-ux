# Sistema de diseño — estilo Vercel / Geist

> Versión 2.0 · 16/09/2026 · copia del kit.
> Describe el sistema tal como está **implementado en este repositorio**: `app/globals.css`, `components/ui`, `components/shared`, `components/patterns`, `components/modals` y el showcase `/design-system` cumplen todo lo que sigue. Ante una diferencia entre este documento y el código del kit, es un bug del kit.
> Complementa: `02-moldes.md` (recetas de pantalla). El origen y el historial de decisiones viven en el repositorio `naja-app-2` (`docs/design/CHANGELOG.md`).

---

## 1. Principios

1. **Superficies neutras, bordes que separan sin dibujar.** Fondos en escala de grises pura (sin tinte cálido ni azul), bordes al 8 % que se sienten pero no se ven. Si un borde "se ve", está mal.
2. **Elevación por sombra, no por borde.** Un contenedor de vista flota con `shadow-md` sobre el fondo; el borde aparece solo en oscuro, donde la sombra pierde contraste (§5).
3. **Densidad legible.** Escala tipográfica un paso más chica que la de Tailwind (13 px de cuerpo en listas), filas de 40 a 64 px, números tabulares.
4. **Color funcional.** Verde = éxito, ámbar = atención, rojo = peligro, azul = información, gris = neutro. Nada lleva color "porque se ve bonito". La marca es un acento, no un fondo.
5. **Una sola acción primaria por pantalla**, negra. El resto son outline o ghost.
6. **Sentence case siempre.** Sin Title Case ni MAYÚSCULAS, ni en encabezados de tabla ni en etiquetas pequeñas.
7. **Microinteracciones discretas.** 150 ms para hover, 300 ms para paneles y tabs, entradas con fade y 4 px de subida. Sin bounce, sin elastic, sin escala.
8. **Dos temas de primera clase.** Todo token existe en claro y oscuro; nunca literales de color en componentes.

---

## 2. Stack

| Capa | Elección | Nota |
| --- | --- | --- |
| Framework | Next.js 15, App Router | Server components por defecto |
| Estilos | Tailwind v4 con `@theme inline` en `app/globals.css` | Sin `tailwind.config.ts` |
| Primitivas | shadcn/ui estilo new-york sobre Radix | Copiadas al repo y ajustadas; no se actualizan desde el registry sin revisar |
| Tema | `next-themes` con clase `.dark` | Crossfade de 350 ms vía View Transitions |
| Tipografía | Geist Sans y Geist Mono, paquete `geist` | Variables `--font-geist-sans` / `--font-geist-mono` |
| Iconos | lucide-react únicamente | Stroke 1.5, `currentColor` |
| Animación | `tw-animate-css` | `animate-in`, `fade-in-0`, `slide-in-from-bottom-1`, `animate-collapsible-*` |
| Toasts | sonner | Sigue `resolvedTheme` |
| Drawers | Radix Sheet y vaul Drawer | Ambos con el chrome flotante de §7 |
| Comandos / combobox | cmdk | `CommandInput` con placeholder en `text-disabled` |
| Gráficas | recharts | Color por entidad, sin animación, sin trazo |

---

## 3. Tokens

### 3.1 Arquitectura

Tres capas en `globals.css`:

1. **Variables por tema** en `:root` y `.dark`. Dos familias: el espejo shadcn (`--background`, `--card`, `--muted`, `--border`, `--primary`…) y las variables del sistema (`--sb-*` en NAJA; en el kit se renombran a `--ds-*`).
2. **`@theme inline`** que expone ambas como colores de Tailwind: `--color-bg-surface: var(--sb-bg-surface)` → utilidad `bg-bg-surface`.
3. **Utilidades** en los componentes. Nunca se escribe el valor.

Regla de las dos familias:

- **Vistas y moldes** (listas, fichas, paneles, cards de página) usan la familia del sistema: `bg-bg-*`, `text-text-*`, `border-border-*`, `bg-brand`, semánticos `*-subtle` / `*-text`.
- **Primitivas de `components/ui` y el interior de modales** usan la familia shadcn: `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border`, `bg-muted`, `hover:bg-accent`.
- Las dos apuntan a los mismos valores. Lo prohibido es la tercera vía: literales de Tailwind (`text-green-800`, `bg-amber-100`, `#171717`).

### 3.2 Fondos

| Token | Utilidad | Claro | Oscuro | Uso |
| --- | --- | --- | --- | --- |
| `bg-base` | `bg-bg-base` | `#fafafa` | `#000000` | Fondo de la app y zebra de filas |
| `bg-surface` | `bg-bg-surface` | `#ffffff` | `#0a0a0c` | Cards, tablas, hero de ficha |
| `bg-elevated` | `bg-bg-elevated` | `#f2f2f2` | `#111114` | Sidebar claro, panel derecho, fila seleccionada, chips |
| `bg-overlay` | `bg-bg-overlay` | `#ebebeb` | `#17181c` | Hover de menú, tooltips, `bg-muted` |

Espejo shadcn: `background` = base, `card` = surface, `popover` = surface (claro) / elevated (oscuro), `muted` y `accent` = overlay, `secondary` = elevated.

### 3.3 Bordes

| Token | Claro | Oscuro | Uso |
| --- | --- | --- | --- |
| `border-subtle` | negro 8 % (≈ `#eaeaea`) | blanco 6 % | Divisores de filas y secciones, cards planas dentro de modales |
| `border-default` | negro 14 % | blanco 10 % | Inputs, botones outline, `border` de shadcn |
| `border-strong` | negro 22 % | blanco 16 % | Chips activos, foco de tarjetas outline |
| `border-card` | negro 12 % | blanco 8 % | Contorno de superficies flotantes **solo en oscuro** (`dark:border-border-card`) |

### 3.4 Texto

| Token | Claro | Oscuro | Uso |
| --- | --- | --- | --- |
| `text-primary` | negro 91 % (≈ `#171717`) | blanco 92 % | Títulos, valores, cuerpo principal |
| `text-secondary` | negro 72 % (≈ `#474747`) | blanco 64 % | Labels, texto de apoyo, `muted-foreground` |
| `text-tertiary` | negro 60 % (= `#666`) | blanco 40 % | Metadata, encabezados de tabla, sublines |
| `text-disabled` | negro 37 % (≈ `#a1a1a1`) | blanco 24 % | **Placeholders**, deshabilitados |

Nunca blanco puro para texto: en oscuro produce halo óptico. El negro puro sí está permitido como fondo.

### 3.5 Marca y semánticos

| Familia | Sólido claro | Sólido oscuro | `-subtle` | `-text` claro / oscuro |
| --- | --- | --- | --- | --- |
| `brand` | `#059669` | `#10b981` | 10 % / 12 % | `#059669` / `#34d399` |
| `success` | `#059669` | `#10b981` | 10 % | `#059669` / `#34d399` |
| `warning` | `#d97706` | `#f59e0b` | 10 % | `#d97706` / `#fbbf24` |
| `danger` | `#dc2626` | `#ef4444` | 10 % | `#dc2626` / `#f87171` |
| `info` | `#2563eb` | `#3b82f6` | 10 % | `#2563eb` / `#60a5fa` |

- `brand` y `success` valen lo mismo en NAJA pero son **tokens independientes**: cambiar la marca del kit no debe mover el verde de éxito.
- `*-subtle` para fondos de badges y chips; `*-text` para texto sobre cualquier fondo; el sólido para puntos de estado, barras y franjas.
- `--ring` = `info`. `--destructive` = `danger`. `--primary` = **foreground** (negro en claro, blanco en oscuro): el primario del sistema no lleva color.

### 3.6 Radios

| Token | Valor | Uso |
| --- | --- | --- |
| `rounded-sm` | 4 px | Badges, chips, kbd |
| `rounded-md` | 6 px | Inputs, botones, menús, avatares cuadrados |
| `rounded-lg` | 6 px | Cards, tablas, paneles, filas de lista |
| `rounded-xl` | 12 px | Modales, drawers, marco de la vista (`SidebarInset`), tarjeta de cuenta |

Se escribe siempre la utilidad, nunca `rounded-[6px]`.

### 3.7 Sombras

| Token | Claro | Oscuro | Nivel (§5) |
| --- | --- | --- | --- |
| `shadow-xs` | Tailwind | Tailwind | 1 · controles |
| `shadow-sm` | `0 1px 3px rgba(0,0,0,.08)` | `0 1px 2px rgba(0,0,0,.24)` | Pastilla del switch |
| `shadow-md` | `0 4px 12px rgba(0,0,0,.10)` | `0 4px 12px rgba(0,0,0,.32)` | 3 · superficies flotantes |
| `shadow-lg` | `0 12px 32px rgba(0,0,0,.14)` | `0 12px 32px rgba(0,0,0,.40)` | 4 · overlays |
| `shadow-row-selected` | `0 0 18px rgba(0,0,0,.12)` | `0 0 18px rgba(0,0,0,.30)` | Halo de la fila seleccionada |
| `shadow-focus` | contorno 1 px al 25 % + halo 6 px al 20 % del `--ring` | 35 % + 8 px al 26 % | Foco de cualquier control |

Sin sombras internas, sin sombras con tinte, sin sombras decorativas. `shadow-row` (halo en hover) se retira: el hover de fila es tinte de fondo (§6.2).

### 3.8 Otros tokens

- `--color-row-hover`: negro 3 % en claro, blanco 5 % en oscuro. Utilidad `hover:bg-row-hover`.
- Scrollbar: thumb negro/blanco 16 %, hover 20 %; 10 px con borde transparente, track invisible; oculto en móvil salvo `.scrollbar-soft`.
- `--sidebar` = `bg-elevated` en claro, `bg-surface` en oscuro; `--sidebar-ring` = `--ring`.
- Gráficas: cinco `--chart-*` de shadcn se conservan como fallback; el color real sigue a la entidad (tarjeta, cuenta, categoría).

---

## 4. Tipografía

### 4.1 Escala

| Utilidad | Tamaño / interlínea | Peso típico | Uso |
| --- | --- | --- | --- |
| `text-xs` | 11 / 1.4 | 400 | Metadata, encabezados de tabla, sublines, badges |
| `text-sm` | 13 / 1.5 | 400 · 500 · 600 | Cuerpo en listas, labels, títulos de card |
| `text-base` | 14 / 1.5 | 400 | Cuerpo por defecto, labels de formularios grandes |
| `text-lg` | 16 / 1.5 | 500 · 600 | Títulos de modal |
| `text-xl` | 18 / 1.4 | 600 | Heading 3 |
| `text-2xl` | 22 / 1.3 | 600 | Heading 2, valor de KPI |
| `text-3xl` | 28 / 1.2 | 500 · 600 | Heading 1, tile de monto (500) |
| `text-4xl` | 36 / 1.1 | 600 | Valor hero |

El encabezado de ficha usa `text-[26px]` con `tracking-tight`; es la única medida fuera de la escala.

### 4.2 Pesos

- **400** cuerpo y sublines.
- **500** labels, valores, montos, nombres dentro de filas, botones.
- **600** títulos: h1 de página o ficha, títulos de card, sección, tab de detalle, trigger de acordeón, valor de KPI.

### 4.3 Reglas

- `tabular-nums` en todo número que se alinee con otro (montos, fechas, folios, conteos).
- `font-mono` (Geist Mono) para identificadores: folios, SKU, CLABE, coordenadas, atajos `kbd`.
- Sentence case en todo texto de UI. Sin eyebrows en mayúsculas: la etiqueta pequeña sobre un valor es `text-xs text-text-tertiary` en sentence case.
- `tracking-tight` (−0.01 em) solo en títulos de 22 px o más.
- Nada de negritas a media frase; para nombrar una entidad se usa `font-medium` o `font-mono`, no `<strong>`.

---

## 5. Escala de elevación

Cinco niveles. Cada superficie pertenece a uno y no cambia de nivel salvo en hover (sube uno).

| Nivel | Receta | Qué vive ahí |
| --- | --- | --- |
| **0 Plano** | sin sombra. Sobre el gris del panel: `bg-bg-surface rounded-lg dark:border dark:border-border-card`. Sobre el piso de un modal o drawer: `bg-bg-surface border border-border-subtle rounded-lg` | Hero, sub-cards y tile dentro de un panel; StepCard y FormCard dentro de modales y drawers; toolbars, tabs, chips, filas en reposo |
| **1 Control** | `shadow-xs` | Inputs, selects, botones outline y primario. El hover de un control es de fondo, no de sombra |
| **2** | retirado | Existió como `shadow-sm + border-border-card` (02/09/2026). Se conserva el token `border-card` para el nivel 3 en oscuro |
| **3 Flotante** | `bg-bg-surface rounded-lg shadow-md dark:border dark:border-border-card` (`DETAIL_CARD_CLASS`) | Todo contenedor de vista: card de tabla, KPI tiles, cards del dashboard, panel derecho, tile de monto, popover de filtros, tooltip de gráfica |
| **4 Overlay** | `shadow-lg` + `border border-border` | Modales, drawers, menús, barra flotante de acciones |

Reglas:

- Una card clicable sube **un** nivel en hover (`hover:shadow-lg` desde nivel 3) con `transition-shadow duration-150`; nunca dos niveles ni `translate`.
- El contenido de la página no pasa de nivel 3; el 4 es solo para lo que flota sobre ella.
- En oscuro, toda superficie de nivel 3 recupera `dark:border dark:border-border-card` porque la sombra pierde contraste sobre negro (mismo recurso que Vercel).
- Cuando una superficie anima su ancho dentro de un envoltorio `overflow-hidden`, la sombra va en el **envoltorio** (la del hijo se recorta).
- Sobre el gris del panel (`bg-bg-elevated`) las cards de nivel 0 no llevan borde en claro: blanco sobre gris ya separa.
- El foco es siempre `shadow-focus` y no se mezcla con sombra de elevación en el mismo estado.

---

## 6. Interacción

### 6.1 Foco

Glow azul, nunca línea: `focus-visible:border-ring/50 focus-visible:shadow-focus`. Ya está en todas las primitivas; un control custom lo copia. Prohibido `ring-2`, `ring-[3px]`, `ring-brand`, borde azul al 100 %. Un input sin caja (título grande) lleva `border border-transparent border-b-border-subtle` en reposo y al enfocar muestra la caja completa con glow.

### 6.2 Filas y listas

- Reposo: `border-b border-border-subtle`, opcional zebra `odd:bg-bg-base` en tablas largas.
- Hover: `hover:bg-row-hover` (tinte), `transition-colors duration-150`. Sin halo, sin cambio de sombra.
- Seleccionada: `bg-bg-elevated shadow-row-selected z-10` + `SelectedStripe` (pill `bg-success` de 3 px en el borde izquierdo, dentro de la primera celda `relative`). La fila seleccionada y el panel comparten `bg-bg-elevated`: se leen como una superficie continua.
- Clicable = `cursor-pointer` explícito en `div`/`tr` (la regla global de `globals.css` solo cubre `button`, roles de Radix, `summary` y `label[for]`).
- Sin bordes verticales; solo divisores horizontales. Montos a la derecha.

### 6.3 Movimiento

| Qué | Receta |
| --- | --- |
| Hover de color o fondo | 150 ms |
| Paneles, anchos, columnas | 300 ms `ease-out`, `transition-[width,opacity,visibility]` |
| Entrada de contenido (tab, panel, lista) | `animate-in fade-in-0 slide-in-from-bottom-1 duration-300 ease-out` |
| Subrayado de tabs | Indicador absoluto `h-0.5 bg-foreground` que se desplaza con `translateX` + `width` medidos; la última posición se guarda en memoria de módulo para no saltar al remontar |
| Pastilla de SegmentedControl | Se desliza entre segmentos |
| Acordeones | Radix `Collapsible` + `animate-collapsible-down/up`; chevron rota 90°. Nunca `<details>` nativo |
| Cambio de tema | View Transition de 350 ms; `transition-colors` congelado durante el crossfade |
| Reduced motion | `motion-reduce:transition-none` / `motion-reduce:animate-none` en todo lo anterior |

Prohibido: `transform: scale` en hover, bounce, elastic, transiciones mayores a 300 ms.

### 6.4 Carga y vacío

Skeleton (`bg-bg-elevated` animado) para listas y paneles; spinner solo en botones durante una acción. Estado vacío con `EmptyState` (icono en círculo, título, descripción, una acción). Un panel que cambia de selección conserva el contenido anterior durante el re-fetch (`Suspense` con la misma `key`) y solo muestra skeleton con `key` nueva.

---

## 7. Primitivas (`components/ui`)

Las 57 primitivas de shadcn viven copiadas en el repo. Ajustes que las distinguen del registry y que el kit conserva:

| Primitiva | Ajuste |
| --- | --- |
| `Button` | `default` = **negro** (`bg-primary` con `--primary` = foreground), `shadow-xs`, hover `bg-primary/90`. Variantes: `outline` (borde default, hover `bg-accent`), `ghost`, `destructive`, `link`. Tamaños: `xs` 24 px · `sm` 32 px · `default` 36 px · `lg` 40 px · `icon-*`. Con icono: `size-3.5 strokeWidth 1.5` |
| Botón dividido | `SplitActionButton`: segmento principal + `w-px bg-background/30` + chevron que abre el resto de acciones en `DropdownMenu`. Es la forma canónica de la primaria en fichas |
| `Badge` | API `tone` (`success · warning · danger · info · brand · neutral`) → `bg-*-subtle text-*-text`, `rounded-sm px-2 py-0.5 text-xs`. Variante "punto + texto" (`size-1.5 rounded-full bg-*` + texto secundario) cuando hay muchos estados juntos |
| `Avatar` | Circular para personas y contactos; `square` (`rounded-md`) para propiedades, unidades, materiales, archivos. Fallback de iniciales **blancas sobre negro, fijo en ambos temas** (como los logos de Vercel; única excepción sancionada a «sin literales») con `ring-1 ring-border-default`; `tone` explícito opcional con tokens. Tamaños 20 · 24 · 32 · 40 |
| `Input`, `Textarea`, `Select` | 36 px (`sm` 32), `bg-bg-surface border-border-default rounded-md px-3 shadow-xs`; placeholder `text-text-disabled`; foco §6.1. Dentro de StepCard van recesados `bg-bg-base`. Sin flechas en `type=number` |
| `Label` | `text-sm font-medium text-text-primary` en formularios de página y drawer; `text-xs text-text-secondary` en el `Field` de StepCard (modales). Requerido: asterisco `text-brand-text`. Error `text-danger-text text-sm`; hint `text-text-tertiary` |
| `Card` | `rounded-lg` (no `xl`), nivel 3. Se usa en Configuración y formularios; en vistas se prefiere `DetailCard` |
| `Table` | Encabezado `text-xs text-text-tertiary` sin fondo, `h-9`; filas §6.2; pie con conteo |
| `Tabs` | Variante `line`: `border-b border-border-subtle`, trigger `px-3 py-2 text-text-secondary`, activo `text-text-primary` con subrayado `bg-foreground` deslizante. Variante `default` (píldoras sobre `bg-muted`) solo dentro de formularios |
| `SegmentedControl` | `switch` (riel `bg-muted`, pastilla `bg-background shadow-sm ring-border`) para todo selector de vista de una lista; `tint` (pastilla `*-subtle`) solo para opciones dentro de un formulario. `value={null}` = sin selección |
| `Sheet` / `Drawer` | Card flotante: `inset-y-2 right-2 w-[calc(100%-1rem)] rounded-xl border shadow-lg overflow-hidden`, animación `slide-in-from-right-[calc(100%+0.5rem)]`. El consumidor solo pasa `sm:max-w-*` (`md` formularios · `xl` fichas · `2xl` resúmenes); nunca `w-full`. Scroll dentro del body con header y footer fijos |
| `Dialog` | No se usa crudo: todo modal pasa por `NajaModal` (§ `02-moldes` M8) o `ConfirmDeleteModal` (M9). Overlay `bg-black/50` sin blur |
| `DropdownMenu`, `Popover`, `Tooltip`, `HoverCard` | Nivel 4, `bg-popover`, `rounded-md`, entrada de `tw-animate-css` |
| `Kbd` | Chip mono `rounded-sm` para atajos (`F` en buscadores) |
| `Sidebar` | Variante `inset`: 16 rem expandido, 3 rem en icono, 18 rem en móvil; fondo `bg-sidebar`; la vista (`SidebarInset`) lleva `m-2 rounded-xl shadow-md z-20` sobre el marco gris |
| `Sonner` | Tema de `resolvedTheme`; mensajes en español |
| `Skeleton`, `Empty`, `Spinner`, `Progress` (`h-1.5`) | Sin cambios de estilo |

---

## 8. Layout

- **Marco**: sidebar inset a la izquierda + vista con `m-2 rounded-xl shadow-md`. Sin topbar global: las acciones viven junto al contenido.
- **`PageContainer`** envuelve toda página del dashboard: `mx-auto w-full max-w-[1700px] space-y-6 p-6 md:p-8`. Con `flex h-full min-h-0 flex-col` cuando el scroll debe vivir dentro de la lista y del panel.
- **Apertura de página** (`02-moldes` M0): los módulos operativos abren con su toolbar o sus tabs, sin título. `PageHeader` (migaja + título + descripción) queda para Configuración y páginas de detalle.
- **Rutas enfocadas** (`app/(focused)`): flujos de alta a pantalla completa sin sidebar, topbar propio de 48 px, contenido `max-w-[960px]`.
- **Grid** opcional de 12 columnas y `gap-4` para dashboards; un tile que no llena su tamaño se reduce, no se infla.
- **Responsive**: gutter mínimo 16 px; lista y panel se alternan en móvil con regreso explícito; tablas se comprimen a las columnas esenciales antes de scrollear.

---

## 9. Iconos y avatares

- Solo lucide-react, `strokeWidth 1.5` (2 en iconos de 16 px dentro de círculos). Tamaños: 14 inline, 16 default, 20 en botones grandes, 24 decorativo máximo.
- Icono con círculo (`IconCircle`): `size-8 rounded-full bg-*-subtle text-*-text`; identifica el tipo de fila y se repite en la ficha.
- Avatares: §7. Color por hash de nombre **eliminado**; la identidad la da la inicial, no el color.
- Nunca emojis decorativos.

---

## 10. Formato de datos

- Moneda y fechas siempre por `lib/i18n/formatters` (`formatCurrency`, `formatCurrencyCompact`, `formatDate` dd/MM/yyyy, `formatDateTime`, `formatMonthYear`, `formatBytes`). Nunca `toLocaleString` ad hoc.
- **Color por signo** en flujos: `+` en `success-text`, `−` en `danger-text`, sin signo en primario. **Regla del libro** en tablas de movimientos: solo las salidas en rojo, las entradas en negro.
- **Saldos y balances** son estados: rojo solo si negativo, primario si positivo. Pendientes (por cobrar, por pagar) en primario sin signo.
- Fechas relativas deterministas ("hoy", "ayer", "hace 3 días") solo en actividad reciente; en tablas, fecha completa.
- Periodos en filtros: mes como primario, trimestre / año / histórico como cerrados (`MonthPicker`). Nunca un rango libre como cara principal de una vista financiera.
- Todo número mostrado se redondea antes de renderizar.

---

## 11. Reglas absolutas

1. Nunca blanco puro para texto; nunca literales de color de Tailwind ni hex en componentes.
2. Nunca gradientes, glassmorphism, neumorphism, glow ni neon. Excepciones sancionadas y encapsuladas: el glow de foco, el toolbar glass del panel de ficha (`panelChrome.ts`), el glow semántico de un KPI estrella, la tarjeta de cuenta con degradado de marca del banco.
3. Nunca `backdrop-blur` fuera de `panelChrome.ts`.
4. Nunca bordes redondeados en un solo lado ni `border-l` como divisor de panel.
5. Nunca Title Case ni MAYÚSCULAS en texto de UI.
6. Nunca emojis decorativos ni un segundo sistema de iconos.
7. Pesos 400 / 500 / 600 según §4.2; nada de 700.
8. Una sola acción primaria visible por pantalla, y es negra.
9. Ocultar el botón que un rol no puede usar; nunca `disabled` sin alternativa. Si hay alternativa, mostrarla ("Solicitar corrección").
10. Skeleton sobre spinner para listas.
11. Tablas sin bordes verticales; montos a la derecha con `tabular-nums`.
12. Hover de fila = tinte; halo solo en la seleccionada.
13. Acordeones siempre animados; nunca `<details>`.
14. Cards de vista en nivel 3; dentro de paneles y modales en nivel 0. Nada en nivel 2.
15. Modales sobre `NajaModal` con el lenguaje Vercel; destructivos sobre `AlertDialog`. Nunca `Dialog` crudo.
16. Placeholders en `text-text-disabled`.
17. Campos compuestos (dirección, datos bancarios, documento) van en inputs separados, nunca en un textarea "todo junto".
18. Toda página dentro de `PageContainer`.
19. Fechas y moneda por los formatters; periodos cerrados en filtros financieros.
20. Datos sensibles con visibilidad progresiva (colapsados, fuera de listas y exportaciones), no con restricción visual improvisada.

---

## 12. Estado en el kit

Todo lo anterior está aplicado en este repositorio. Ajustes hechos al extraer el kit desde NAJA (16/09/2026):

- Variables intermedias renombradas de `--sb-*` a `--ds-*`; `--primary` = `foreground`; `--sidebar-ring` = `--ring`; token nuevo `--ds-row-hover` / `bg-row-hover`.
- `Card` en `rounded-lg` y nivel 3; `Table` con `hover:bg-row-hover`; `Tabs line` con subrayado `foreground`; `SegmentedControl` con `switch` por defecto; `Avatar` con tonos por token; foco `shadow-focus` también en el sidebar.
- `FormCard` sin sombra (nivel 0). Retirados `KpiCard`, `DataTable`, `EntityFormModal` y la clase `.details-animate`.
- Sin dependencias de datos: el shell trae un usuario ficticio y las páginas de `/demo` usan datos locales.

## 13. Test mental antes de aprobar un componente

- [ ] ¿Está en un nivel de la escala de elevación y solo en uno?
- [ ] ¿Todos los colores salen de tokens? ¿Se ve bien en oscuro sin `dark:*` extra?
- [ ] ¿La jerarquía lleva el ojo al dato más importante primero?
- [ ] ¿Hay una sola primaria y es negra?
- [ ] ¿Los montos están formateados, alineados a la derecha y en `tabular-nums`?
- [ ] ¿Sentence case, pesos 400/500/600, placeholders en `disabled`?
- [ ] ¿Foco con glow, hover de 150 ms, sin halo en filas?
- [ ] ¿Funciona 50 % más estrecho y en móvil?
- [ ] ¿Se parece al molde de `02-moldes.md` que le corresponde, o hay una razón escrita para no hacerlo?
