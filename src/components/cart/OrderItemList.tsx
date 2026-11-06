'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ImageIcon, Layers, Minus, PencilLine, Plus, Trash2 } from 'lucide-react';
import type { ResolvedCartItem } from '@/lib/cart';
import { formatCurrency } from '@/lib/utils';
import ProductMockup from '@/components/products/ProductMockup';

export default function OrderItemList({ items, editable = false, onQuantity, onRemove }: { items: ResolvedCartItem[]; editable?: boolean; onQuantity?: (itemId: string, quantity: number) => void; onRemove?: (itemId: string) => void }) {
  return <div className="premium-order-items">{items.map((item) => {
    const layerCount = item.personalization?.layers?.length ?? 0;
    return <article key={item.id} className="premium-order-item">
      <div className="premium-order-media">
        {item.personalization?.previewImage ? <Image src={item.personalization.previewImage} alt={`Prévia de ${item.name}`} fill unoptimized sizes="112px" className="object-contain" /> : item.image ? <Image src={item.image} alt={item.name} fill unoptimized sizes="112px" className="object-contain p-2" /> : item.kind === 'personalized' && item.mockup && item.tone ? <ProductMockup variant={item.mockup} tone={item.tone} label={item.name} className="h-16 w-16" /> : <ImageIcon className="h-6 w-6 text-graphite/35" />}
        {item.personalization && <span className="premium-order-media-badge"><Layers className="h-3 w-3" /> {layerCount || 0}</span>}
      </div>
      <div className="premium-order-copy">
        <div className="premium-order-title"><div><h2>{item.name}</h2>{item.personalization ? <span>Personalizado{item.personalization.editor === 'phone-case' ? ' · capinha' : item.personalization.editor === 'mousepad' ? ' · mousepad' : ''}</span> : <span>Produto de catálogo</span>}</div><strong>{item.demonstrativePrice ? formatCurrency(item.demonstrativePrice) : item.price === null ? 'Sob consulta' : formatCurrency(item.price)}</strong></div>
        {item.details.length > 0 && <p className="premium-order-details">{item.details.join(' · ')}</p>}
        {layerCount > 0 && <p className="premium-order-layers"><Layers className="h-3.5 w-3.5" /> {layerCount} imagem(ns) na composição</p>}
        {item.demonstrativePrice && <p className="premium-order-note">Valor demonstrativo, sujeito à confirmação.</p>}
        {editable ? <div className="premium-order-actions">
          <div className="premium-quantity"><button type="button" onClick={() => onQuantity?.(item.id, item.quantity - 1)} aria-label="Diminuir quantidade"><Minus className="h-3.5 w-3.5" /></button><span>{item.quantity}</span><button type="button" onClick={() => onQuantity?.(item.id, item.quantity + 1)} aria-label="Aumentar quantidade"><Plus className="h-3.5 w-3.5" /></button></div>
          <div className="premium-order-links">
            {item.kind === 'personalized' && item.productSlug && <Link href={`/personalizados/${item.productSlug}?edit=${item.id}`}><PencilLine className="h-3.5 w-3.5" /> Editar personalização</Link>}
            <button type="button" onClick={() => onRemove?.(item.id)}><Trash2 className="h-3.5 w-3.5" /> Remover</button>
          </div>
        </div> : <p className="premium-order-layers">Quantidade: {item.quantity}</p>}
      </div>
    </article>;
  })}</div>;
}
