import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingWhatsApp from '@/components/ui/FloatingWhatsApp';
import { SITE } from '@/config/site';
import ThemeProvider from '@/components/ui/ThemeProvider';
import CartProvider from '@/components/cart/CartProvider';

export const metadata: Metadata = {
  ...(SITE.url ? { metadataBase: new URL(SITE.url) } : {}),
  title: {
    default: `${SITE.name} | Personalizados sob medida`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    'personalizados',
    'canecas personalizadas',
    'capinhas personalizadas',
    'brindes corporativos',
    'gravação a laser',
    'impressão DTF',
    'Sousa Paraíba',
  ],
  icons: {
    icon: SITE.logo,
    shortcut: SITE.logo,
    apple: SITE.logo,
  },
  openGraph: {
    title: `${SITE.name} | Personalizados sob medida`,
    description: SITE.description,
    type: 'website',
    siteName: SITE.name,
    locale: 'pt_BR',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#0b1b3a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=localStorage.getItem('mega-theme')||'system';var d=p==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):p;document.documentElement.dataset.theme=d;document.documentElement.style.colorScheme=d}catch(e){}})();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Sora:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-screen flex-col bg-canvas text-graphite antialiased">
        <ThemeProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <FloatingWhatsApp />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
