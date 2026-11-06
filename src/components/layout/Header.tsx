'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Box, Clock3, MapPin, Menu, MessageCircle, ShoppingCart, UserRound } from 'lucide-react';
import { CUSTOM_CATALOG_NAV } from '@/config/customCatalog';
import { useCart } from '@/components/cart/CartProvider';
import { useAuth } from '@/components/auth/AuthProvider';
import BrandLogo from './BrandLogo';
import MobileMenu from './MobileMenu';
import SearchBar from '@/components/ui/SearchBar';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount, isHydrated, lastAddedId, setDrawerOpen } = useCart();
  const { user, loading } = useAuth();
  return <>
    <header className="mega-header sticky top-0 z-40 text-white">
      <div className="mega-topbar"><div className="section-shell"><span><MapPin className="h-3 w-3" /> Rua Coronel José Vicente, 52 - Centro, Sousa-PB</span><span className="hidden sm:flex"><Clock3 className="h-3 w-3" /> Seg a Sex: 08:00 às 17:30 · Sáb: 08:00 às 13:00 · Dom: Fechado</span></div></div>
      <div className="mega-mainbar"><div className="section-shell mega-mainbar-content lg:grid lg:grid-cols-[minmax(14rem,1fr)_auto_minmax(14rem,1fr)]">
        <button type="button" onClick={() => setMenuOpen(true)} aria-label="Abrir menu" aria-controls="mobile-menu" aria-expanded={menuOpen} className="mega-menu-button lg:hidden"><Menu className="h-5 w-5" /></button>
        <div className="hidden min-w-0 lg:block"><SearchBar className="mega-search" id="site-search" tone="light" targetPath="/personalizados" placeholder="O que você está procurando?" label="Buscar produtos" /></div>
        <BrandLogo size="lg" tone="light" withWordmark={false} className="shrink-0 lg:justify-self-center" />
        <div className="ml-auto flex items-center gap-4 text-[10px] font-bold sm:gap-6 lg:justify-self-end">
          <Link href="/contato" className="hidden items-center gap-1.5 text-white/85 transition hover:text-brand sm:flex"><MessageCircle className="h-4 w-4" /> <span>Atendimento</span></Link>
          <Link href={user ? '/conta' : '/entrar'} aria-label={user ? 'Minha conta' : 'Entrar na conta'} className="flex flex-col items-center gap-1 text-white transition hover:text-brand"><UserRound className="h-5 w-5" /><span className="hidden sm:block">{loading ? 'Conta' : user ? 'Minha conta' : 'Entrar'}</span></Link>
          <button type="button" onClick={() => setDrawerOpen(true)} aria-label={`Abrir carrinho${isHydrated && itemCount ? `, ${itemCount} itens` : ''}`} className="relative flex flex-col items-center gap-1 text-white transition hover:text-brand"><ShoppingCart key={`bag-${lastAddedId}`} className={`h-5 w-5 ${lastAddedId ? 'cart-bag-feedback' : ''}`} /><span className="hidden sm:block">Carrinho</span>{isHydrated && itemCount > 0 && <span className="absolute -right-2 -top-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[8px] text-white">{itemCount}</span>}</button>
        </div>
      </div><div className="section-shell pb-3 lg:hidden"><SearchBar className="mega-search" id="site-search-mobile" tone="light" targetPath="/personalizados" placeholder="O que você está procurando?" label="Buscar produtos" /></div></div>
      <nav className="mega-category-nav" aria-label="Categorias"><div className="section-shell"><div className="no-scrollbar flex items-center gap-2 overflow-x-auto py-3"><Link href="/personalizados" className="mega-category-trigger"><Menu className="h-4 w-4" /> Categorias</Link>{CUSTOM_CATALOG_NAV.map((item, index) => <Link key={item.href} href={item.href} className={index === 0 ? 'mega-3d-link' : 'mega-nav-link'}>{index === 0 && <Box className="h-4 w-4" />}{item.label}</Link>)}</div></div></nav>
    </header>
    <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
  </>;
}
