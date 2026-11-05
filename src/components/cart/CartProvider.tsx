'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { PhoneModel, PhoneVariant } from '@/lib/types';
import type { PersonalizedProduct } from '@/data/personalizedProducts';

export interface PhoneCartItem { kind?: 'phone'; phoneId: string; variantId: string; quantity: number; }
export interface PersonalizedCartItem { kind: 'personalized'; id: string; productId: string; quantity: number; personalization: { text?: string; color?: string; size?: string; notes?: string; artworkName?: string }; }
export type CartItem = PhoneCartItem | PersonalizedCartItem;

interface CartContextValue {
  items: CartItem[]; isHydrated: boolean; itemCount: number; lastAddedId: number;
  addItem: (phone: PhoneModel, variant: PhoneVariant) => void;
  addPersonalizedItem: (product: PersonalizedProduct, personalization: PersonalizedCartItem['personalization'], quantity: number) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
}

const STORAGE_KEY = 'mega-cart';
const CartContext = createContext<CartContextValue | null>(null);

function readStoredCart(): CartItem[] {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]');
    if (!Array.isArray(value)) return [];
    return value.filter((item): item is CartItem => {
      if (!item || typeof item.quantity !== 'number' || item.quantity < 1) return false;
      if (item.kind === 'personalized') return typeof item.id === 'string' && typeof item.productId === 'string' && typeof item.personalization === 'object';
      return typeof item.phoneId === 'string' && typeof item.variantId === 'string';
    });
  } catch { return []; }
}

export function getItemId(item: CartItem) { return item.kind === 'personalized' ? item.id : item.variantId; }

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [lastAddedId, setLastAddedId] = useState(0);
  useEffect(() => { const frame = window.requestAnimationFrame(() => { setItems(readStoredCart()); setIsHydrated(true); }); return () => window.cancelAnimationFrame(frame); }, []);
  useEffect(() => { if (isHydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [items, isHydrated]);
  const addItem = (phone: PhoneModel, variant: PhoneVariant) => {
    setItems((current) => { const existing = current.find((item) => item.kind !== 'personalized' && item.phoneId === phone.id && item.variantId === variant.id); return existing ? current.map((item) => item === existing ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { phoneId: phone.id, variantId: variant.id, quantity: 1 }]; });
    setLastAddedId((current) => current + 1);
  };
  const addPersonalizedItem = (product: PersonalizedProduct, personalization: PersonalizedCartItem['personalization'], quantity: number) => { setItems((current) => [...current, { kind: 'personalized', id: `${product.id}-${Date.now()}`, productId: product.id, quantity, personalization }]); setLastAddedId((current) => current + 1); };
  const updateQuantity = (itemId: string, quantity: number) => setItems((current) => quantity < 1 ? current.filter((item) => getItemId(item) !== itemId) : current.map((item) => getItemId(item) === itemId ? { ...item, quantity } : item));
  const removeItem = (itemId: string) => setItems((current) => current.filter((item) => getItemId(item) !== itemId));
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  return <CartContext.Provider value={{ items, isHydrated, itemCount, lastAddedId, addItem, addPersonalizedItem, updateQuantity, removeItem }}>{children}</CartContext.Provider>;
}

export function useCart() { const context = useContext(CartContext); if (!context) throw new Error('useCart must be used inside CartProvider'); return context; }
