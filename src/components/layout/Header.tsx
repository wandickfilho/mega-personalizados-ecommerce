'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Search, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import BrandLogo from './BrandLogo';
import MobileMenu from './MobileMenu';
import { NAV_LINKS } from './navLinks';
import SearchBar from '@/components/ui/SearchBar';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import { buildWhatsAppLink, WHATSAPP_ENABLED, WHATSAPP_GENERAL_MESSAGE } from '@/config/site';
import { useCart } from '@/components/cart/CartProvider';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { itemCount, isHydrated, lastAddedId } = useCart();
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const whatsappHref = buildWhatsAppLink(WHATSAPP_GENERAL_MESSAGE);
  const whatsappReady = WHATSAPP_ENABLED && whatsappHref !== '';

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line/80 bg-white/90 text-graphite backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 py-3 sm:gap-5 lg:py-3.5">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menu"
              aria-controls="mobile-menu"
              aria-expanded={menuOpen}
              className="-ml-1 rounded-lg p-2 text-navy transition hover:bg-mist focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
            >
              <Menu className="h-6 w-6" />
            </button>

            <BrandLogo size="md" tone="dark" className="shrink-0" />

            <div className="hidden flex-1 justify-center px-6 md:flex">
              <div className="w-full max-w-2xl">
                <SearchBar />
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Link href="/carrinho" aria-label={`Carrinho${isHydrated && itemCount ? `, ${itemCount} itens` : ''}`} className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-navy/75 transition hover:bg-mist hover:text-navy">
                <ShoppingBag key={`bag-${lastAddedId}`} className={`h-5 w-5 ${lastAddedId ? 'cart-bag-feedback' : ''}`} />
                {isHydrated && itemCount > 0 && <span key={`count-${lastAddedId}`} className={`absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[9px] font-bold text-white ${lastAddedId ? 'cart-count-feedback' : ''}`}>{itemCount}</span>}
              </Link>
              <Link href="/celulares" aria-label="Buscar no catálogo" className="inline-flex h-10 w-10 items-center justify-center rounded-full text-navy/75 transition hover:bg-mist hover:text-navy md:hidden">
                <Search className="h-5 w-5" />
              </Link>
              <a
                href={whatsappReady ? whatsappHref : undefined}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={whatsappReady ? 'Falar no WhatsApp' : 'WhatsApp em breve'}
                title={whatsappReady ? 'Falar no WhatsApp' : 'Atendimento via WhatsApp em breve.'}
                aria-disabled={!whatsappReady}
                onClick={(e) => {
                  if (!whatsappReady) e.preventDefault();
                }}
                className={cn(
                  'hidden h-10 w-10 items-center justify-center rounded-full transition min-[390px]:inline-flex sm:hidden',
                  whatsappReady
                    ? 'bg-brand text-white hover:bg-brand-dark'
                    : 'cursor-not-allowed bg-mist text-navy/45'
                )}
              >
                <WhatsAppIcon className="h-5 w-5" />
              </a>

              <div className="hidden sm:block">
                <WhatsAppButton message={WHATSAPP_GENERAL_MESSAGE} label="Falar no WhatsApp" />
              </div>
            </div>
          </div>

        </div>

        {/* Navegação (desktop) */}
        <nav
          aria-label="Navegação principal"
          className="hidden border-t border-line/70 lg:block"
        >
          <ul className="mx-auto flex max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={cn(
                    'relative inline-flex py-3 text-[13px] font-semibold transition',
                    isActive(link.href)
                      ? 'text-navy'
                      : 'text-graphite/60 hover:text-navy'
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      'absolute inset-x-1 bottom-0 h-0.5 rounded-full bg-brand transition-opacity',
                      isActive(link.href) ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
