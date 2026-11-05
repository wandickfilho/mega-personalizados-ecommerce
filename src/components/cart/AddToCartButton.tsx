'use client';

import { Check, ShoppingBag } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { PhoneModel, PhoneVariant } from '@/lib/types';
import { useCart } from './CartProvider';

export default function AddToCartButton({ phone, variant, className = '', label = 'Adicionar ao carrinho' }: { phone: PhoneModel; variant?: PhoneVariant; className?: string; label?: string }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const resetTimer = useRef<number | null>(null);
  const selected = variant ?? phone.variants.find((item) => item.availability === 'disponivel') ?? phone.variants.find((item) => item.availability === 'sob-consulta');

  useEffect(() => () => { if (resetTimer.current) window.clearTimeout(resetTimer.current); }, []);

  if (!selected) return null;

  const handleAdd = () => {
    addItem(phone, selected);
    setAdded(true);
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setAdded(false), 1000);
  };

  return (
    <button type="button" onClick={handleAdd} className={`premium-action inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7845ff] via-[#315bff] to-[#e44fd9] px-4 py-3 text-xs font-bold text-white shadow-soft transition duration-300 hover:-translate-y-0.5 hover:shadow-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${className}`}>
      {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />} {added ? 'Adicionado!' : label}
    </button>
  );
}
