import Link from 'next/link';
import { MessageCircle, PackageOpen } from 'lucide-react';
import { CUSTOM_ORDER_WHATSAPP_ENABLED, CUSTOM_ORDER_WHATSAPP, buildCustomOrderMessage } from '@/config/customOrders';

export const metadata = { title: 'Outros Personalizados' };

export default function OtherPersonalizedPage() {
  const href = CUSTOM_ORDER_WHATSAPP_ENABLED ? `https://wa.me/${CUSTOM_ORDER_WHATSAPP}?text=${encodeURIComponent(buildCustomOrderMessage('outro produto personalizado'))}` : undefined;
  return <main className="custom-studio-page"><div className="section-shell py-12 sm:py-20"><Link href="/personalizados" className="custom-back">← Voltar ao catálogo</Link><section className="mx-auto mt-6 max-w-2xl rounded-2xl border border-line bg-white p-7 text-center shadow-sm sm:p-10"><PackageOpen className="mx-auto h-11 w-11 text-brand" /><p className="mt-5 text-xs font-extrabold uppercase tracking-[.14em] text-brand">Atendimento especializado</p><h1 className="mt-2 font-display text-3xl font-bold text-navy">Outros Personalizados</h1><p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-graphite/70">Conte sua ideia para a equipe Mega. Definimos juntos material, técnica, arte, quantidade e acabamento antes de confirmar qualquer pedido.</p>{href ? <a href={href} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-dark"><MessageCircle className="h-4 w-4" /> Falar com um vendedor</a> : <><button type="button" disabled className="mt-6 inline-flex cursor-not-allowed items-center gap-2 rounded-lg bg-slate-300 px-5 py-3 text-sm font-bold text-slate-600"><MessageCircle className="h-4 w-4" /> Falar com um vendedor</button><p className="mt-3 text-xs text-graphite/55">Atendimento por WhatsApp ainda não configurado.</p></>}</section></div></main>;
}
