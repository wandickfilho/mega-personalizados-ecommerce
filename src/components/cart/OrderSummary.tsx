import { cartSubtotal, hasConsultationItems, type ResolvedCartItem } from '@/lib/cart';
import { formatCurrency } from '@/lib/utils';

export default function OrderSummary({ items }: { items: ResolvedCartItem[] }) {
  const subtotal = cartSubtotal(items);
  const hasConsultation = hasConsultationItems(items);
  return <aside className="rounded-2xl border border-line bg-mist/60 p-5">
    <h2 className="font-display text-lg font-bold text-navy">Resumo do pedido</h2>
    <div className="mt-4 flex items-end justify-between gap-3 border-t border-line pt-4"><span className="text-sm text-graphite/65">Subtotal conhecido</span><strong className="font-display text-xl text-navy">{formatCurrency(subtotal)}</strong></div>
    {hasConsultation && <p className="mt-3 rounded-xl bg-white/70 p-3 text-xs leading-relaxed text-graphite/65">Há itens com preço sob consulta. O subtotal considera apenas os produtos com valor cadastrado e não representa o valor final.</p>}
  </aside>;
}
