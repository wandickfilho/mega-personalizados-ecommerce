'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { ResolvedCartItem } from '@/lib/cart';
import { variantLabel } from '@/lib/cart';
import { formatCurrency } from '@/lib/utils';
import ProductImagePlaceholder from '@/components/phones/ProductImagePlaceholder';

export default function OrderItemList({ items, editable = false, onQuantity, onRemove }: { items: ResolvedCartItem[]; editable?: boolean; onQuantity?: (variantId: string, quantity: number) => void; onRemove?: (variantId: string) => void }) {
  return <div className="space-y-3">{items.map((item) => {
    const image = item.variant.images[0] ?? item.phone.images[0];
    return <article key={item.variantId} className="flex gap-3 rounded-2xl border border-line bg-white p-3 shadow-soft sm:gap-4 sm:p-4">
      <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-mist sm:h-24 sm:w-20">
        {image ? <Image src={image} alt={item.phone.name} fill sizes="80px" className="object-contain p-1" /> : <ProductImagePlaceholder compact />}
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="font-display text-sm font-bold text-navy sm:text-base">{item.phone.name}</h2>
        <p className="mt-1 text-xs text-graphite/60">{variantLabel(item.variant)}</p>
        <p className="mt-2 text-sm font-bold text-navy">{item.variant.price === null ? 'Sob consulta' : formatCurrency(item.variant.price)}</p>
        {editable ? <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-center rounded-lg border border-line bg-mist/50"><button type="button" onClick={() => onQuantity?.(item.variantId, item.quantity - 1)} aria-label="Diminuir quantidade" className="p-2 text-navy"><Minus className="h-3.5 w-3.5" /></button><span className="min-w-7 text-center text-xs font-bold text-navy">{item.quantity}</span><button type="button" onClick={() => onQuantity?.(item.variantId, item.quantity + 1)} aria-label="Aumentar quantidade" className="p-2 text-navy"><Plus className="h-3.5 w-3.5" /></button></div>
          <button type="button" onClick={() => onRemove?.(item.variantId)} className="inline-flex items-center gap-1 text-xs font-semibold text-[#c13d52] transition hover:text-[#9f293f]"><Trash2 className="h-3.5 w-3.5" /> Remover</button>
        </div> : <p className="mt-2 text-xs font-medium text-graphite/60">Quantidade: {item.quantity}</p>}
      </div>
    </article>;
  })}</div>;
}
