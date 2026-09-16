import type { Metadata } from 'next';
// Paquete oficial de Vercel: glifos completos + font-feature-settings (la
// versión de Google Fonts es un subset recortado). Define --font-geist-sans.
import { GeistSans } from 'geist/font/sans';
// Geist Mono para códigos, folios y cifras font-mono (define --font-geist-mono);
// sin esto el fallback en Windows es Consolas, mucho menos legible.
import { GeistMono } from 'geist/font/mono';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kit Estilo NAJA',
  description: 'Kit de arranque UI/UX estilo Vercel / Geist',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <ThemeProvider>
          <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
