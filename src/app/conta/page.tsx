'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, LogOut, Package, ShoppingBag, UserRound } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import AuthPanel from '@/components/auth/AuthPanel';
import { formatCurrency } from '@/lib/utils';

interface AccountOrder {
  order_number: string;
  share_token: string;
  status: string;
  created_at: string;
  subtotal: number | null;
  items: Array<{ name: string; quantity: number; unitPrice: number | null }>;
}

export default function AccountPage() {
  const { configured, loading, user, signOut } = useAuth();
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');

  useEffect(() => {
    if (!user) return;
    let active = true;
    let request: AbortController | null = null;
    const frame = window.requestAnimationFrame(() => {
      request = new AbortController();
      setOrdersLoading(true);
      setOrdersError('');
      fetch('/api/orders', { signal: request.signal }).then(async (response) => {
        const data = await response.json() as { orders?: AccountOrder[]; error?: string };
        if (!active) return;
        if (!response.ok) setOrdersError(data.error ?? 'Não foi possível carregar seus pedidos.');
        else setOrders(data.orders ?? []);
      }).catch(() => {
        if (active) setOrdersError('Não foi possível carregar seus pedidos.');
      }).finally(() => { if (active) setOrdersLoading(false); });
    });
    return () => { active = false; window.cancelAnimationFrame(frame); request?.abort(); };
  }, [user]);

  if (!configured) return <main className="checkout-page py-8 sm:py-14"><div className="section-shell max-w-4xl"><Link href="/" className="custom-back"><ChevronLeft className="h-4 w-4" /> Voltar ao site</Link><div className="mt-6"><AuthPanel title="Conta Mega" subtitle="O Supabase Auth precisa ser configurado para acessar sua conta." /></div></div></main>;

  if (loading) return <main className="checkout-page py-20 text-center text-sm text-graphite/60">Carregando sua conta...</main>;

  if (!user) return <main className="checkout-page py-8 sm:py-14"><div className="section-shell max-w-6xl"><Link href="/" className="custom-back"><ChevronLeft className="h-4 w-4" /> Voltar ao site</Link><div className="auth-page-grid mt-6"><div className="auth-page-copy"><span className="premium-kicker">Conta Mega</span><h1>Entre para ver seus pedidos.</h1><p>Seu histórico, personalizações e arquivos ficam vinculados à conta usada na compra.</p></div><AuthPanel title="Acessar minha conta" subtitle="Entre com Google ou e-mail." /></div></div></main>;

  return <main className="checkout-page py-8 sm:py-12">
    <div className="section-shell max-w-5xl">
      <Link href="/" className="custom-back"><ChevronLeft className="h-4 w-4" /> Voltar ao site</Link>
      <div className="account-head">
        <div className="account-avatar"><UserRound className="h-6 w-6" /></div>
        <div><span className="premium-kicker">Minha conta</span><h1>{user.user_metadata?.full_name ?? user.email?.split('@')[0]}</h1><p>{user.email}</p></div>
        <button type="button" onClick={() => void signOut()} className="account-logout"><LogOut className="h-4 w-4" /> Sair</button>
      </div>
      <section className="premium-panel mt-6 p-5 sm:p-7">
        <div className="account-orders-head"><h2><Package className="h-5 w-5" /> Meus pedidos</h2><Link href="/personalizados" className="premium-secondary">Criar novo personalizado</Link></div>
        {ordersLoading && <p className="mt-5 text-sm text-graphite/60">Carregando pedidos...</p>}
        {ordersError && <p className="auth-message error mt-5">{ordersError}</p>}
        {!ordersLoading && !ordersError && orders.length === 0 && <div className="account-empty"><ShoppingBag className="h-9 w-9" /><p>Você ainda não enviou pedidos personalizados.</p><Link href="/personalizados" className="premium-primary">Explorar produtos</Link></div>}
        <div className="account-order-list">
          {orders.map((order) => <article key={order.order_number} className="account-order-card">
            <div><strong>{order.order_number}</strong><span>{new Date(order.created_at).toLocaleDateString('pt-BR')} · {order.items.reduce((total, item) => total + item.quantity, 0)} item(ns)</span></div>
            <p>{order.items.map((item) => `${item.name} × ${item.quantity}`).join(' · ')}</p>
            <div className="account-order-foot"><span>{order.subtotal && order.subtotal > 0 ? formatCurrency(order.subtotal) : 'Valor a confirmar'}</span><Link href={`/pedido/${order.share_token}`}>Ver detalhes</Link></div>
          </article>)}
        </div>
      </section>
    </div>
  </main>;
}
