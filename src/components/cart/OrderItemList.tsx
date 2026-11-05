'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { ResolvedCartItem } from '@/lib/cart';
import { formatCurrency } from '@/lib/utils';
import ProductMockup from '@/components/products/ProductMockup';

export default function OrderItemList({ items, editable = false, onQuantity, onRemove }: { items: ResolvedCartItem[]; editable?: boolean; onQuantity?: (itemId: string, quantity: number) => void; onRemove?: (itemId: string) => void }) {
  return <div className="space-y-3">{items.map((item) => <article key={item.id} className="flex gap-3 border border-line bg-white p-3 sm:gap-4 sm:p-4">
    <div className="relative flex h-20 w-16 shrink-0 items-center justify-center overflow-hidden bg-mist sm:h-24 sm:w-20">
      {item.kind === 'personalized' && item.mockup && item.tone ? <ProductMockup variant={item.mockup} tone={item.tone} label={item.name} className="h-16 w-16" /> : item.image ? <Image src={item.image} alt={item.name} fill sizes="80px" className="object-contain p-1" /> : null}
    </div>
    <div className="min-w-0 flex-1"><h2 className="font-display text-sm font-bold text-navy sm:text-base">{item.name}</h2>{item.details.map((detail) => <p key={detail} className="mt-1 text-xs text-graphite/60">{detail}</p>)}<p className="mt-2 text-sm font-bold text-navy">{item.demonstrativePrice ? formatCurrency(item.demonstrativePrice) : item.price === null ? 'Sob consulta' : formatCurrency(item.price)}</p>{item.demonstrativePrice && <p className="mt-1 text-[10px] font-semibold text-brand">Valor demonstrativo</p>}
    {editable ? <div className="mt-3 flex items-center justify-between gap-2"><div className="flex items-center border border-line bg-mist/50"><button type="button" onClick={() => onQuantity?.(item.id, item.quantity - 1)} aria-label="Diminuir quantidade" className="p-2 text-navy"><Minus className="h-3.5 w-3.5" /></button><span className="min-w-7 text-center text-xs font-bold text-navy">{item.quantity}</span><button type="button" onClick={() => onQuantity?.(item.id, item.quantity + 1)} aria-label="Aumentar quantidade" className="p-2 text-navy"><Plus className="h-3.5 w-3.5" /></button></div><button type="button" onClick={() => onRemove?.(item.id)} className="inline-flex items-center gap-1 text-xs font-semibold text-[#c13d52] transition hover:text-[#9f293f]"><Trash2 className="h-3.5 w-3.5" /> Remover</button></div> : <p className="mt-2 text-xs font-medium text-graphite/60">Quantidade: {item.quantity}</p>}</div>
  </article>)}</div>;
}
