/**
 * Route group de rutas enfocadas (M7): altas largas a pantalla completa, sin
 * sidebar ni header del dashboard. El scroll vive aquí (`data-scroll-root`)
 * con `scrollbar-gutter: stable` para que el ancho útil no cambie entre pasos;
 * cada paso hace scroll-to-top sobre este elemento.
 */
export default function FocusedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-scroll-root className="h-svh overflow-y-auto bg-background [scrollbar-gutter:stable]">
      {children}
    </div>
  );
}
