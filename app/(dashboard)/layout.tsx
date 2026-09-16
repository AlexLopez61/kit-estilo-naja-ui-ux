import { cookies } from 'next/headers';
import { AppSidebar } from '@/components/shell/AppSidebar';
import { SiteHeader } from '@/components/shell/SiteHeader';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

/**
 * Shell del dashboard: sidebar inset + vista con marco (m-2, rounded-xl,
 * shadow-md) + header mínimo. Aquí va la validación de sesión del proyecto
 * (redirect a /login si no hay usuario) y los providers globales.
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value !== 'false';

  // Usuario de demostración; el proyecto lo sustituye por el perfil real.
  const user = { name: 'Alex López', email: 'alex@ejemplo.com', roleLabel: 'Admin' };

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      className="h-svh overflow-hidden"
      style={
        {
          '--sidebar-width': '240px',
          '--sidebar-width-icon': '64px',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar brand={{ name: 'Kit' }} role="admin" user={user} variant="inset" />
      <SidebarInset className="overflow-hidden">
        <SiteHeader appName="Kit" />
        {/* [scrollbar-gutter:stable] reserva el carril del scrollbar para que el
            ancho útil no cambie entre páginas con y sin scroll. */}
        <div className="scrollbar-soft min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable]">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
