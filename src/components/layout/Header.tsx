'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Clock3, MapPin, Menu, MessageCircle, ShoppingCart } from 'lucide-react';
import { CATEGORIES } from '@/config/categories';
import { useCart } from '@/components/cart/CartProvider';
import BrandLogo from './BrandLogo';
import MobileMenu from './MobileMenu';
import SearchBar from '@/components/ui/SearchBar';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount, isHydrated, lastAddedId } = useCart();
  return <>
    <header className="mega-header sticky top-0 z-40 text-white">
      <div className="mega-topbar"><div className="section-shell"><span><MapPin className="h-3 w-3" /> Rua Coronel José Vicente, 52 · Centro, Sousa-PB</span><span className="hidden sm:flex"><Clock3 className="h-3 w-3" /> Seg a Sex: 08:00 às 17:30 · Sáb: 08:00 às 13:00 · Dom: Fechado</span></div></div>
      <div className="mega-mainbar"><div className="section-shell mega-mainbar-content">
        <button type="button" onClick={() => setMenuOpen(true)} aria-label="Abrir menu" aria-controls="mobile-menu" aria-expanded={menuOpen} className="mega-menu-button lg:hidden"><Menu className="h-5 w-5" /></button>
        <BrandLogo size="md" tone="light" className="shrink-0" />
        <div className="hidden min-w-0 flex-1 px-8 md:block"><SearchBar id="site-search" tone="light" targetPath="/" targetHash="#vitrine" placeholder="O que você está procurando?" label="Buscar produtos" /></div>
        <div className="ml-auto flex items-center gap-4 text-[10px] font-bold sm:gap-6">
          <Link href="/contato" className="hidden items-center gap-1.5 text-white/85 transition hover:text-brand sm:flex"><MessageCircle className="h-4 w-4" /> <span>Atendimento</span></Link>
          <Link href="/carrinho" aria-label={`Carrinho${isHydrated && itemCount ? `, ${itemCount} itens` : ''}`} className="relative flex flex-col items-center gap-1 text-white transition hover:text-brand"><ShoppingCart key={`bag-${lastAddedId}`} className={`h-5 w-5 ${lastAddedId ? 'cart-bag-feedback' : ''}`} /><span className="hidden sm:block">Carrinho</span>{isHydrated && itemCount > 0 && <span className="absolute -right-2 -top-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[8px] text-white">{itemCount}</span>}</Link>
        </div>
      </div><div className="section-shell pb-3 md:hidden"><SearchBar id="site-search-mobile" tone="light" targetPath="/" targetHash="#vitrine" placeholder="O que você está procurando?" label="Buscar produtos" /></div></div>
      <nav className="mega-category-nav" aria-label="Categorias"><div className="section-shell"><div className="no-scrollbar flex items-center gap-1 overflow-x-auto py-2"><Link href="/#categorias" className="mega-category-trigger">☰ Categorias</Link>{CATEGORIES.map((category) => <Link key={category.id} href={`/?categoria=${category.id}#vitrine`} className="shrink-0 px-3 py-2 text-[11px] font-bold text-white/80 transition hover:text-white">{category.shortName}</Link>)}</div></div></nav>
    </header>
    <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
  </>;
}
