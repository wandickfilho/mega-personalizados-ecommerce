import { CreditCard, ShieldCheck, Star, Truck } from 'lucide-react';

const BENEFITS = [
  { icon: Truck, title: 'Envio Rápido', detail: 'Para todo o Brasil' },
  { icon: CreditCard, title: 'Atendimento', detail: 'Orientação para seu pedido' },
  { icon: ShieldCheck, title: 'Compra Segura', detail: 'Dados e pedido protegidos' },
  { icon: Star, title: 'Qualidade Garantida', detail: 'Cuidado em cada detalhe' },
];

export default function Benefits() {
  return <section className="mega-benefits"><div className="section-shell">{BENEFITS.map(({ icon: Icon, title, detail }) => <div key={title}><Icon className="h-6 w-6" aria-hidden /><span><strong>{title}</strong><small>{detail}</small></span></div>)}</div></section>;
}
