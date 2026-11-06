'use client';

import Link from 'next/link';
import { ArrowRight, ShoppingBag, X } from 'lucide-react';
import { useCart } from './CartProvider';
import { resolveCartItems } from '@/lib/cart';
import OrderItemList from './OrderItemList';
import OrderSummary from './OrderSummary';

export default function CartDrawer() {
  const { items, isDrawerOpen, setDrawerOpen, updateQuantity, removeItem } = useCart();
  const { valid } = resolveCartItems(items);
  return <div className={`fixed inset-0 z-50 ${isDrawerOpen ? '' : 'pointer-events-none'}`} aria-hidden={!isDrawerOpen}>
    <button type="button" aria-label="Fechar carrinho" onClick={() => setDrawerOpen(false)} className={`absolute inset-0 bg-navy/50 backdrop-blur-[1px] transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100' : 'opacity-0'}`} />
    <aside aria-label="Carrinho de compras" className={`premium-drawer ${isDrawerOpen ? 'is-open' : ''}`}>
      <header className="premium-drawer-head">
        <div><span className="premium-kicker"><ShoppingBag className="h-3.5 w-3.5" /> Sua seleção</span><h2>Carrinho</h2></div>
        <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Fechar"><X className="h-5 w-5" /></button>
      </header>
      <div className="premium-drawer-body">
        {valid.length ? <OrderItemList items={valid} editable onQuantity={updateQuantity} onRemove={removeItem} /> : <div className="premium-drawer-empty"><span><ShoppingBag className="h-7 w-7" /></span><p>Seu carrinho está vazio.</p><button type="button" onClick={() => setDrawerOpen(false)}>Continuar explorando</button></div>}
      </div>
      {valid.length > 0 && <footer className="premium-drawer-foot">
        <OrderSummary items={valid} />
        <div className="premium-drawer-actions">
          <button type="button" onClick={() => setDrawerOpen(false)} className="premium-secondary">Continuar comprando</button>
          <Link href="/finalizar-pedido" onClick={() => setDrawerOpen(false)} className="premium-primary">Finalizar compra <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </footer>}
    </aside>
  </div>;
}
