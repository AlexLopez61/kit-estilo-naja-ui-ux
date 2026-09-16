# Moldes de pantalla

> Versión 2.0 · 16/09/2026 · copia del kit. Complementa `01-sistema.md`.
> Un molde = una receta completa de pantalla o de pieza grande: anatomía, componentes que la arman, estado en la URL y referencia viva en este repositorio (`/demo/*` dentro del shell y `/design-system`). Antes de construir una vista, elegir el molde y copiarlo; desviarse requiere una razón escrita.
> Capturas claro/oscuro en `docs/capturas/`.

| # | Molde | Cuándo | Referencia viva |
| --- | --- | --- | --- |
| M0 | Anatomía de página y tabs de módulo | Toda página del dashboard | `/demo/ficha`, showcase › Moldes |
| M1 | Lista plana | Índice de una entidad sin ficha en panel | `/demo/lista`, showcase › Moldes |
| M2 | Lista + ficha en panel | Índice donde seleccionar abre la ficha sin salir | `/demo/lista?ver=…` |
| M3 | Ficha en panel | Detalle de un registro o transacción | `/demo/lista?ver=…` |
| M4 | Ficha en página | Detalle de una entidad raíz con varios tabs | `/demo/ficha` |
| M5 | Cockpit / dashboard | Resumen de un módulo o de la empresa | `/demo` |
| M6 | Alta en drawer | Crear sin salir de la lista o de la ficha | `/demo/lista` › «Nueva orden» |
| M7 | Alta en página enfocada | Alta larga por pasos | `/nuevo` |
| M8 | Modal de formulario | Captura corta o cierre de un flujo | showcase › Modales, `/demo/configuracion` |
| M9 | Modal destructivo | Borrar, cancelar, rescindir | `ConfirmDeleteModal` (showcase › Modales) |
| M10 | Página de configuración | Catálogos y ajustes | `/demo/configuracion` |
| M11 | Estados | Vacío, cargando, error, concurrencia | showcase › Estados |
| M12 | Filtros de periodo | Toda vista financiera | `MonthPicker` (showcase › Formularios) |

---

## M0 · Anatomía de página y tabs de módulo

```
PageContainer (max-w 1700, p-6 md:p-8, space-y-6)
├── Tabs del módulo (variante line)  ó  Toolbar (M1)      ← sin título de página
└── Contenido (entra con fade-in + slide-in-from-bottom-1)
```

- **Sin `PageHeader`** en módulos operativos: el sidebar ya nombra el módulo y la primera fila útil es la toolbar o los tabs. `PageHeader` (migaja + título + descripción) se reserva a Configuración y a páginas de detalle.
- **Tabs de módulo** (`Tabs variant="line"`): fila `border-b border-border-subtle`, triggers `px-3 py-2 text-sm`, activo en `text-text-primary` con subrayado `h-0.5 bg-foreground` que se desliza (`translateX` + `width` medidos, 300 ms; la última posición vive en memoria de módulo para que no salte al remontar). Contenido del tab con `animate-in fade-in-0 slide-in-from-bottom-1 duration-300`. Cada tab es `?tab=` en la URL. Tope: **siete** tabs; lo nuevo entra como card o como vista de un `SegmentedControl` dentro de un tab.
- **Acción global del módulo** («+ Registrar ⌄», «Nueva cotización») a la derecha de los tabs o de la toolbar, negra, única.
- El scroll vive en la página salvo en M2, donde vive dentro de la lista y del panel (`PageContainer className="flex h-full min-h-0 flex-col"`).

## M1 · Lista plana (estilo deployments)

```
Toolbar fuera del marco
  [🔍 Buscar…            F] [Todo | Abiertas | Cerradas]  [Estado ▾] [Tipo ▾]      [+ Nueva]
Card nivel 3
  ├── Encabezado  text-xs text-text-tertiary h-9, sin fondo
  ├── Filas       min-h-16 (o h-10 fijo en listas cortas), zebra, hover tinte, cursor-pointer
  └── Pie         conteo · totales · «Cargar anteriores»
```

- **Toolbar**: controles sueltos sobre el fondo, `flex flex-wrap items-center gap-2`. Buscador `Input` con `Search` a la izquierda y `Kbd` `F` a la derecha (atajo de teclado real); `SegmentedControl variant="switch" className="w-auto"` con conteos para el pipeline; `FilterSelect` (label, `allLabel`, opciones con avatar o tag opcional) para cada dimensión; `Button` negro con `Plus` al final. Los filtros viven en la URL.
- **Card**: `DETAIL_CARD_CLASS` (nivel 3). Encabezado `TABLE_HEAD_CLASS` (grid con las mismas columnas que la fila). Fila `tableRowClass(selected, zebra)`: grid, `px-4`, `border-b border-border-subtle`, `hover:bg-row-hover`, zebra `bg-bg-base`. Pie `TableFooter`.
- **Columna principal** con avatar o `IconCircle` + nombre `font-medium` + subline `text-xs text-text-tertiary` (tipo · «Creado el dd/MM/yyyy por Nombre»). Estado como punto + texto (`text-*-text`), no como badge, cuando hay una columna de estado. Montos a la derecha `tabular-nums`. Folios en `font-mono text-xs`.
- **Altura fija** de la celda principal (`h-10`) y del encabezado (`h-5`) cuando la tabla se comprime en M2, para que no brinque.
- Vista de tarjetas o Kanban como alternativa: mismo `SegmentedControl` switch a la derecha de la toolbar.

## M2 · Lista + ficha en panel (`HybridSplit`)

```
<HybridSplit open={!!ver} panelKey={ver} wide?
  list={  card nivel 3 con la tabla de M1 (se comprime a 3–4 columnas al abrir) }
  panel={ <DetailPanelFrame …> (M3) } />
```

- **Dos cards independientes** separadas por `gap-4`: la lista (nivel 3) y el panel (`rounded-lg shadow-md`, fondo `bg-bg-elevated`, `dark:border-border-card`). Ningún contenedor común con borde.
- **Anchos**: lista `calc(100cqw − 396px)` (xl: −436) y panel `380px` (xl: `420px`); con `wide` la lista se comprime a `clamp(300px, 36cqw, 420px)` y el panel toma el resto (fichas grandes). Transición de 300 ms en `width`, `opacity`, `visibility`; el panel entra desde 12 px a la derecha. `lg:sticky top-4` para que la ficha acompañe el scroll de la lista.
- **Identidad**: `panelKey` remonta la entrada (`fade-in slide-in-from-bottom-2`) al cambiar de selección; el último detalle se retiene durante la salida.
- **Estado en la URL**: `?ver=<id>`. Dos variantes: (a) selección en cliente con `useShallowSearchParam('ver')` (pushState, sin navegación) cuando la ficha se arma con datos ya cargados; (b) server-driven, `page.tsx` valida el id y renderiza la ficha en `<Suspense key={id} fallback={<DetailSkeleton/>}>` cuando la ficha necesita queries propias. `/módulo/[id]` redirige a `?ver=`.
- **Fila seleccionada**: `bg-bg-elevated shadow-row-selected` + `SelectedStripe`. Con el panel abierto la tabla oculta columnas secundarias y conserva la principal + monto.
- **Cerrar**: chevron `›` en la toolbar del panel (`PanelCloseControl`); en móvil «← Volver». Sin cierre por clic fuera. En móvil lista y panel se alternan.
- Los tabs del módulo con el panel abierto cambian la lista (`?tab=`) sin perder `?ver=` si la selección sigue siendo válida.
- **No hay** riel de avatares ni modo teatro: si una ficha no cabe en 420 px, usa `wide`; si tampoco, es una entidad raíz y va en página (M4).

## M3 · Ficha en panel (`DetailPanelFrame`)

```
DetailPanelFrame onClose actions={<SplitActionButton primary menu/>}
├── toolbar sticky con vidrio (PANEL_GLASS_TOP_CLASS): ‹cerrar          [Acción | ⌄]
├── PanelHero (nivel 0 sobre el gris)
│   ├── PanelHeroHead lead={IconCircle | Avatar} title subtitle badges
│   ├── PanelTile label value sub     ← monto text-3xl font-medium tabular-nums, shadow-md
│   ├── rejilla de PanelField (2 col desde @xs, 3 desde @3xl)
│   └── PanelFoot: «Registrado por {avatar} Nombre · fecha»
├── PanelSubCard title action …  (Relación · Comprobante · Notas · Historial)
└── vidrio inferior (PANEL_GLASS_BOTTOM_CLASS), pb-16
```

- **Toolbar**: única excepción sancionada de glass (degradado de 5 paradas tintado con `--color-bg-elevated` + `backdrop-blur-[2px]` + máscara), sticky dentro del `AutoHideScrollArea`; cerrar a la izquierda, a la derecha **una** primaria negra con el resto de acciones detrás del chevron. Prioridad de la primaria: la acción que el usuario puede ejecutar ahora (Editar › Cobrar / Pagar › Ver origen › Solicitar corrección). Sin primaria posible, un `⋯` ghost abre el menú.
- **Hero** plano (`bg-bg-surface rounded-lg`, borde solo en oscuro): franja de identidad con el mismo icono de la fila, título `text-sm font-semibold`, subtitle terciario, badges de estado (`Badge tone`). El **tile** de valor principal lleva `shadow-md` (nivel 3) dentro del hero. La rejilla de campos usa `PanelField` (label `text-xs` secundaria, valor `text-sm`). Pie de auditoría siempre.
- **Sub-cards** planas con título `text-sm font-semibold` y acción a la derecha («Ver … ↗», «Subir»). Avisos (posible duplicado, saldo) entre el hero y las sub-cards.
- **Container queries**: desde `@2xl/<containerName>` la franja de identidad pasa a una línea y tile + rejilla van lado a lado; las sub-cards a dos columnas.
- Montos con la regla del libro (`01-sistema` §10).

## M4 · Ficha en página (encabezado "project page")

```
PageContainer
├── migaja  text-[13px] text-text-tertiary   Módulo › Nombre
├── fila título
│   ├── h1 text-[26px] font-semibold tracking-tight  + Badge tone="neutral" (tipo)
│   ├── meta text-[13px] terciaria: folio font-mono · estado editable · «Creado el fecha por {avatar} Nombre»
│   └── derecha: [Editar] outline · [Primaria | ⌄] negro dividido · [⋯] icon-sm
├── ProjectTabs (M0, tope 7)
└── contenido del tab: DetailCard nivel 3 en grid, o M2 dentro del tab
```

- **Sin hero card**: los datos viven en las cards del primer tab. El encabezado es texto + acciones.
- **Cards de detalle** (`DetailCard`): `DetailCardHeader` (título `text-sm font-semibold` + subline terciaria + enlace «Ver … ↗» con `ArrowUpRight`), cuerpo `DenseList` / `DenseRow` (grid `32px · 1fr · auto`, `px-5 py-2.5`, hover tinte, cada fila navega a donde se resuelve), `KpiTile` (label `text-sm` secundaria + icono, valor `text-2xl font-semibold`, detalle terciario), `Meter` (barra `h-1.5` con relleno y pista del mismo ramp, clicable), `SignedAmount`, `RowPill`.
- **Cuándo página y cuándo panel**: entidad raíz con tres o más tabs (proyecto, cliente, contrato) = página; registro, transacción o elemento de una lista (movimiento, orden, etapa) = panel M3. La variante con hero card y foto queda para entidades donde la imagen es protagonista; el resto usa este encabezado.
- Estado finalizado: banner de cierre como card nivel 3 con `IconCircle` en `success-subtle` o `danger-subtle` sustituye a la card principal; acciones cambian (Reabrir, Acta, Archivar).

## M5 · Cockpit / dashboard

```
grid gap-4 (12 col opcional)
├── 2 cards hero nivel 3 (dona · posición con Meter)
├── fila de tiles KpiTile (sm:grid-cols-2 xl:grid-cols-4)
├── lista densa «Últimos …» (DetailCard + DenseList)
└── «Por cerrar» (pendientes derivados con deep link)
```

- Todas las cards en nivel 3 con `DetailCardHeader` y enlace contextual «Ver … ↗».
- Reparto acordado: **Dashboard** = ¿cómo va el negocio? (dos lentes, deltas, brazos); **Resumen de un módulo** = ¿cómo está su caja / su operación hoy?. No repetir KPIs entre ambos.
- Gráficas: el color sigue a la entidad (misma tarjeta, misma rebanada, misma fila); leyenda clicable con punto + nombre + % + valor; la identidad nunca depende solo del color; con menos de dos series no se pinta la dona. Sin animación, sin trazo.
- KPI clicable = filtro de la bandeja de abajo; sube un nivel en hover.
- Sin `PageHeader`; tabs o «+ Registrar» arriba.

## M6 · Alta en drawer

```
Sheet sm:max-w-xl (card flotante, M0 §7)
├── header fijo: título + descripción (o título grande borderless editable)
├── body scroll: FormCard × N  (Hero · ¿Dónde? · Fechas · ¿Quién? · Vincular · Adjuntos)
└── footer fijo: [Cancelar] outline   [Crear …] negro
```

- **`FormCard`** = nivel 0 sobre el piso del drawer: `bg-bg-surface border border-border-subtle rounded-lg p-6`, título `text-base font-semibold` con icono terciario y hint debajo; sin título es la card hero. Controles a escala grande (`h-11 text-base`) cuando el formulario es el foco de la pantalla.
- **Labels** `text-sm` o `text-base font-medium text-text-primary`; requerido con asterisco `text-brand-text`; error `text-danger-text`; hint terciario. No usar el `Field` chico de StepCard aquí.
- **Opciones excluyentes** como chips (`CHIP_CLASS`, activo `border-border-strong bg-bg-elevated font-medium`) o `SegmentedControl tint`. Opcionales plegados como `AddOnTile` (botón punteado que se convierte en bloque).
- **Contexto prellenado** desde la ficha que lo abre (`?nueva=`, `?proyecto=`): lo fijo se muestra como chip sin ✕. Alta inline en la misma página cuando la lista y el formulario caben juntos.
- Altas de catálogo dentro del formulario (marca, proveedor, cliente) abren un M8 sobre el drawer y regresan seleccionadas.

## M7 · Alta en página enfocada

```
app/(focused)/…  — sin sidebar
├── topbar sticky h-12 grid [1fr auto 1fr]: ← Volver · título · [Cancelar] [Guardar] negro
├── main max-w-[960px] px-6 pt-10 pb-24
│   ├── pasos como 3 tiles (grid-cols-3 gap-3) con estado
│   ├── SettingsCard × N por paso (título · descripción · contenido · footer strip hint + acción)
│   └── confirmación: tile resumen + acción final
```

- Para altas largas o con sub-entidades (una entidad con varias unidades, un artículo con variantes). El scroll vive en el layout con `scrollbar-gutter: stable`; los pasos hacen scroll-to-top.
- **`SettingsCard`**: `rounded-lg border bg-card overflow-hidden`; header con título `font-semibold` + chip opcional («Opcional») + descripción; footer `border-t bg-muted/30 min-h-12 px-6 py-2.5` con hint a la izquierda y acción a la derecha. Sub-secciones repetibles en acordeón `DisclosureRow`.
- Proporción 7/5 entre columna de formulario y columna de ayuda cuando hay dos columnas.

## M8 · Modal de formulario (lenguaje Vercel)

```
NajaModal size="md|lg|xl" headerAlign="center" footerMuted icon={Lucide}
├── header: chip circular + título text-lg + descripción centrada (border-b)
├── body scroll px-6 py-5 sobre bg-background
│   └── StepCard step={1..n} title hint action   (nivel 0: bg-bg-surface border-subtle)
│       └── Field label required hint error → inputs recesados bg-bg-base
└── footerMuted: banda bg-muted/30 border-t   [Cancelar] outline  [Confirmar] negro
```

- Tamaños: `sm` 384 · `md` 448 · `lg` 512 · `xl` 672 · `2xl` 768 · `3xl` 896.
- El botón del footer envía el `<form id>` que vive en el body (`form="<id>"`). El body se monta keyed por registro (`{open && <Body key={id ?? 'new'}/>}`) para resetear sin `useEffect`. `isPending` sube al padre para que el footer lo refleje.
- **Dos tonos**: piso `bg-background`; cards, inputs y chips de archivo en `bg-card`/`bg-bg-surface`; inputs dentro de StepCard recesados `bg-bg-base`. Nunca un tercer tono.
- Contexto de solo lectura como **filas-card outline** (`divide-y rounded-lg border`, chip + label + valor a la derecha). Desgloses de dinero como tabla Concepto / Monto con fila total. Secciones ricas como `DisclosureRow`.
- Éxito con estado propio dentro del modal (círculo que escala + palomita que se dibuja, 200/300 ms) cuando el flujo termina ahí (cobro).
- `dismissable={false}` solo en wizards. Variantes listas: `QuickFormModal` (campos simples), `DetailModal` (lectura con avatar y secciones), `WizardModal` (pasos con validez por paso). Campos compuestos siempre en inputs separados.
- **No**: `glassHeader` / `glassFooter` (legado, ver `03-modulos-naja.md`), `Dialog` crudo, títulos en mayúsculas.

## M9 · Modal destructivo

`ConfirmDeleteModal` sobre `AlertDialog`: rol `alertdialog`, sin cierre por clic fuera, título en pregunta, descripción con lo que se pierde, `requireTypedConfirmation` para lo irreversible, botón `destructive`, `isLoading` durante la acción. Toast de confirmación al terminar. El botón que lo abre es ghost o vive en el menú `⋯`; nunca es la primaria de la pantalla.

## M10 · Página de configuración

`PageHeader` con migaja permitido. Lista de `SettingsCard` apiladas (`space-y-6`), cada catálogo con su tabla compacta dentro de la card y «Agregar» en el footer strip. Altas y ediciones en M8; borrado en M9. Solo admin ve las acciones (ocultar, no deshabilitar).

## M11 · Estados

- **Vacío**: `EmptyState` (`min-h-[400px]`, icono en círculo, título, descripción, una acción; `variant="error"` con círculo `destructive/10`). Dentro de una card de M1 el vacío ocupa el cuerpo de la card.
- **Cargando**: `Skeleton` con la silueta de la lista o `DetailSkeleton` en el panel; el panel conserva el contenido anterior si solo cambia el filtro.
- **Error de acción**: `ActionErrorAlert` bajo el formulario, texto en español, con la causa; toast solo para errores fuera de un formulario.
- **Concurrencia**: formularios de edición llevan `VersionField` (candado `updated_at`); el conflicto se muestra como alerta con «Recargar».
- **Permisos**: lo que un rol no puede hacer no se renderiza; si existe alternativa («Solicitar corrección») se muestra en su lugar.

## M12 · Filtros de periodo

`MonthPicker` como cara única de las vistas financieras: mes primario con stepper ‹ ›, periodos cerrados (trimestre, año, histórico) en el menú; emite `{from, to, preset}` a la URL (`?desde&hasta&preset`). `DateRangePicker` solo donde el rango libre ya existía y no es la cara principal. `MonthOnlyPicker` para estados de cuenta mensuales.
