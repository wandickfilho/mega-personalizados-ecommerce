'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageCircle, UserRound } from 'lucide-react';
import { SELLERS } from '@/config/sellers';
import { useCart } from '@/components/cart/CartProvider';
import { buildCartWhatsAppMessage, resolveCartItems } from '@/lib/cart';
import OrderItemList from '@/components/cart/OrderItemList';
import OrderSummary from '@/components/cart/OrderSummary';

export default function ChooseSellerPage() {
  const { items, isHydrated } = useCart();
  const [openError, setOpenError] = useState(false);
  const { valid } = resolveCartItems(items);
  if (!isHydrated) return <main className="mx-auto max-w-4xl px-4 py-20 text-center text-sm text-graphite/60">Carregando pedido...</main>;
  if (!valid.length) return <main className="mx-auto max-w-xl px-4 py-20 text-center"><h1 className="font-display text-2xl font-bold text-navy">Seu pedido está vazio</h1><Link href="/carrinho" className="mt-6 inline-flex rounded-full bg-navy px-5 py-3 text-sm font-bold text-white">Voltar ao carrinho</Link></main>;

  return <main className="bg-[var(--theme-canvas)] py-8 sm:py-12"><div className="mx-auto max-w-6xl px-4 sm:px-6"><Link href="/finalizar-pedido" className="inline-flex items-center gap-1 text-xs font-bold text-brand"><ArrowLeft className="h-3.5 w-3.5" /> Voltar ao pedido</Link><div className="mt-4 grid gap-8 lg:grid-cols-[1fr_340px]"><section><span className="section-kicker">Etapa final</span><h1 className="section-title mt-3">Escolha seu atendimento.</h1><p className="mt-3 max-w-xl text-sm leading-relaxed text-graphite/65">Seu pedido será preparado em uma mensagem para o WhatsApp. A compra só será confirmada após o atendimento.</p><div className="mt-7 grid gap-4 sm:grid-cols-3">{SELLERS.map((seller) => {
    const ready = seller.active && /^\d{12,15}$/.test(seller.whatsappNumber);
    const openWhatsApp = () => {
      if (!ready) return;
      const url = `https://wa.me/${seller.whatsappNumber}?text=${encodeURIComponent(buildCartWhatsAppMessage(seller.name, valid))}`;
      const popup = window.open(url, '_blank');
      if (popup) popup.opener = null;
      else setOpenError(true);
    };
    return <article key={seller.id} className="relative overflow-hidden rounded-2xl border border-line bg-white p-4 shadow-soft transition hover:-translate-y-1 hover:shadow-premium"><div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand/15 blur-2xl" /><div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7845ff] to-[#315bff] text-white"><UserRound className="h-6 w-6" /></div><h2 className="relative mt-5 font-display text-base font-bold text-navy">{seller.name}</h2><p className="relative mt-1 text-xs text-graphite/55">Atendimento CellShop</p><button type="button" onClick={openWhatsApp} disabled={!ready} title={ready ? `Finalizar pelo WhatsApp com ${seller.name}` : 'Configuração pendente: número do vendedor ainda não cadastrado.'} className="relative mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-navy px-3 py-3 text-xs font-bold text-white transition enabled:hover:-translate-y-0.5 enabled:hover:bg-brand disabled:cursor-not-allowed disabled:opacity-45"><MessageCircle className="h-3.5 w-3.5" />{ready ? 'Finalizar pelo WhatsApp' : 'Configuração pendente'}</button></article>;
  })}</div>{openError && <p className="mt-4 rounded-xl border border-[#e44fd9]/25 bg-[#e44fd9]/10 p-3 text-xs text-navy">Não foi possível abrir o WhatsApp. Verifique se o bloqueador de pop-ups está ativo e tente novamente.</p>}</section><aside className="lg:sticky lg:top-28 lg:self-start"><h2 className="font-display text-lg font-bold text-navy">Prévia do pedido</h2><div className="mt-4"><OrderItemList items={valid} /></div><div className="mt-4"><OrderSummary items={valid} /></div></aside></div></div></main>;
}
