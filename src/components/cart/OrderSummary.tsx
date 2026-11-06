import { ShieldCheck, Sparkles } from 'lucide-react';
import { cartSubtotal, hasConsultationItems, type ResolvedCartItem } from '@/lib/cart';
import { formatCurrency } from '@/lib/utils';

export default function OrderSummary({ items }: { items: ResolvedCartItem[] }) {
  const subtotal = cartSubtotal(items);
  const hasConsultation = hasConsultationItems(items);
  const units = items.reduce((total, item) => total + item.quantity, 0);
  return <aside className="premium-summary">
    <div className="premium-summary-head"><h2>Resumo do pedido</h2><span><Sparkles className="h-3.5 w-3.5" /> {items.length} item(ns)</span></div>
    <div className="premium-summary-row"><span>Unidades</span><b>{units}</b></div>
    <div className="premium-summary-row"><span>Produtos personalizados</span><b>{items.filter((item) => item.kind === 'personalized').length}</b></div>
    <div className="premium-summary-total"><span>Subtotal conhecido</span><strong>{formatCurrency(subtotal)}</strong></div>
    {hasConsultation && <p className="premium-summary-note">Há itens sob consulta ou com valor demonstrativo. O total final, frete e pagamento são confirmados pela equipe Mega — nenhuma cobrança é feita agora.</p>}
    <div className="premium-summary-secure"><ShieldCheck className="h-4 w-4" /><span>Pedido com aprovação humana e arquivos em armazenamento privado.</span></div>
  </aside>;
}
