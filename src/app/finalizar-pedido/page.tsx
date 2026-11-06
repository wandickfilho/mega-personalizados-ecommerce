'use client';

import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { resolveCartItems } from '@/lib/cart';
import CheckoutFlow from '@/components/cart/CheckoutFlow';

export default function CheckoutPage() {
  const { items, isHydrated } = useCart();
  const { valid } = resolveCartItems(items);
  if (!isHydrated) return <main className="checkout-page py-20 text-center text-sm text-graphite/60">Preparando seu checkout...</main>;
  if (!valid.length) return <main className="checkout-page"><div className="section-shell premium-empty">
    <span className="premium-empty-icon"><ShoppingBag className="h-8 w-8" /></span>
    <h1>Não há itens para finalizar</h1>
    <p>Adicione um produto personalizado ou um aparelho ao carrinho para continuar.</p>
    <Link href="/personalizados" className="premium-primary">Explorar personalizados <ArrowRight className="h-4 w-4" /></Link>
  </div></main>;
  return <CheckoutFlow items={valid} />;
}
