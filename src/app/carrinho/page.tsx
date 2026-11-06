'use client';

import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles, ShoppingBag } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { resolveCartItems } from '@/lib/cart';
import OrderItemList from '@/components/cart/OrderItemList';
import OrderSummary from '@/components/cart/OrderSummary';

export default function CartPage() {
  const { items, isHydrated, updateQuantity, removeItem } = useCart();
  const { valid, invalid } = resolveCartItems(items);
  if (!isHydrated) return <main className="checkout-page py-20 text-center text-sm text-graphite/60">Carregando seu carrinho...</main>;
  if (!valid.length) return <main className="checkout-page"><div className="section-shell premium-empty">
    <span className="premium-empty-icon"><ShoppingBag className="h-8 w-8" /></span>
    <span className="premium-kicker">Sua seleção</span>
    <h1>Seu carrinho está vazio</h1>
    <p>Explore os personalizados e crie uma composição com até 5 imagens.</p>
    <Link href="/personalizados" className="premium-primary">Explorar personalizados <ArrowRight className="h-4 w-4" /></Link>
  </div></main>;
  return <main className="checkout-page py-8 sm:py-12"><div className="section-shell max-w-6xl">
    <div className="premium-page-heading">
      <div><span className="premium-kicker"><Sparkles className="h-4 w-4" /> Sua seleção</span><h1>Meu carrinho</h1><p>Revise itens, quantidades e personalizações antes de finalizar.</p></div>
      <div className="premium-secure-badge"><ShieldCheck className="h-5 w-5" /><span>Compra assistida<br /><b>Confirmação com a equipe</b></span></div>
    </div>
    <ol className="premium-steps" aria-label="Etapas da compra">
      {['Carrinho', 'Identificação', 'Entrega', 'Pagamento', 'Confirmação'].map((name, index) => <li key={name} className={index === 0 ? 'current' : 'upcoming'}><span className="premium-step-dot">{index + 1}</span><span className="premium-step-label">{name}</span></li>)}
    </ol>
    {invalid.length > 0 && <p className="premium-alert">Alguns itens não estão mais disponíveis no catálogo e foram ignorados nesta revisão.</p>}
    <div className="premium-cart-grid">
      <section className="premium-panel premium-cart-main">
        <div className="premium-panel-head"><div><span className="premium-step-eyebrow">Itens selecionados</span><h2>{valid.length} produto(s)</h2></div><Link href="/personalizados" className="premium-tertiary">Continuar comprando</Link></div>
        <OrderItemList items={valid} editable onQuantity={updateQuantity} onRemove={removeItem} />
      </section>
      <div className="premium-cart-aside">
        <OrderSummary items={valid} />
        <Link href="/finalizar-pedido" className="premium-primary premium-cta-full">Finalizar compra <ArrowRight className="h-4 w-4" /></Link>
        <Link href="/personalizados" className="premium-secondary premium-cta-full">Continuar comprando</Link>
        <p className="premium-aside-fineprint"><ShieldCheck className="h-3.5 w-3.5" /> Nenhum pagamento é simulado. O pedido é enviado para confirmação da equipe.</p>
      </div>
    </div>
  </div></main>;
}
