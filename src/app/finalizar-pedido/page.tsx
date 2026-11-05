'use client';

import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { resolveCartItems } from '@/lib/cart';
import OrderItemList from '@/components/cart/OrderItemList';
import OrderSummary from '@/components/cart/OrderSummary';

export default function ReviewOrderPage() {
  const { items, isHydrated } = useCart();
  const { valid } = resolveCartItems(items);
  if (!isHydrated) return <main className="mx-auto max-w-4xl px-4 py-20 text-center text-sm text-graphite/60">Carregando pedido...</main>;
  if (!valid.length) return <main className="mx-auto max-w-xl px-4 py-20 text-center"><ShoppingBag className="mx-auto h-10 w-10 text-brand" /><h1 className="mt-4 font-display text-2xl font-bold text-navy">Não há itens para revisar</h1><Link href="/#vitrine" className="mt-6 inline-flex rounded-full bg-navy px-5 py-3 text-sm font-bold text-white">Explorar categorias</Link></main>;
  const hasDemonstrativePrices = valid.some((item) => item.demonstrativePrice);
  return <main className="checkout-page py-8 sm:py-12"><div className="mx-auto max-w-5xl px-4 sm:px-6"><Link href="/carrinho" className="text-xs font-bold text-brand">← Voltar ao carrinho</Link><h1 className="mt-3 font-display text-3xl font-bold text-navy">Revise seu pedido</h1><div className="checkout-steps"><span className="active">1. Carrinho</span><span className="active">2. Identificação</span><span>3. Entrega</span><span>4. Pagamento</span></div><p className="mt-2 text-sm text-graphite/60">A confirmação, disponibilidade e pagamento serão tratados diretamente com a equipe da Mega.</p>{hasDemonstrativePrices && <p className="mt-4 rounded-xl border border-brand/25 bg-brand/10 p-3 text-xs leading-relaxed text-navy">Este pedido inclui valores demonstrativos. Ele não pode ser concluído como compra: solicite a confirmação do valor oficial com a equipe.</p>}<div className="mt-7 grid gap-6 lg:grid-cols-[1fr_320px]"><OrderItemList items={valid} /><div className="space-y-3"><OrderSummary items={valid} /><Link href="/escolher-vendedor" className="flex w-full items-center justify-center gap-2 rounded-md bg-brand px-5 py-3.5 text-sm font-bold text-white transition hover:bg-brand-dark">{hasDemonstrativePrices ? 'Solicitar confirmação no WhatsApp' : 'Continuar pelo WhatsApp'} <ArrowRight className="h-4 w-4" /></Link></div></div></div></main>;
}
