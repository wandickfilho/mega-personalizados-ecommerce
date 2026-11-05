'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { PhoneModel, PhoneVariant } from '@/lib/types';

export interface CartItem {
  phoneId: string;
  variantId: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  isHydrated: boolean;
  itemCount: number;
  lastAddedId: number;
  addItem: (phone: PhoneModel, variant: PhoneVariant) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
}

const STORAGE_KEY = 'cellshop-cart';
const CartContext = createContext<CartContextValue | null>(null);

function readStoredCart(): CartItem[] {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]');
    if (!Array.isArray(value)) return [];
    return value.filter(
      (item): item is CartItem =>
        typeof item?.phoneId === 'string' &&
        typeof item?.variantId === 'string' &&
        typeof item?.quantity === 'number' &&
        item.quantity > 0
    );
  } catch {
    return [];
  }
}

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [lastAddedId, setLastAddedId] = useState(0);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setItems(readStoredCart());
      setIsHydrated(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (isHydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isHydrated]);

  const addItem = (phone: PhoneModel, variant: PhoneVariant) => {
    setItems((current) => {
      const existing = current.find((item) => item.phoneId === phone.id && item.variantId === variant.id);
      return existing
        ? current.map((item) => item === existing ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { phoneId: phone.id, variantId: variant.id, quantity: 1 }];
    });
    setLastAddedId((current) => current + 1);
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    setItems((current) => quantity < 1 ? current.filter((item) => item.variantId !== variantId) : current.map((item) => item.variantId === variantId ? { ...item, quantity } : item));
  };

  const removeItem = (variantId: string) => setItems((current) => current.filter((item) => item.variantId !== variantId));
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return <CartContext.Provider value={{ items, isHydrated, itemCount, lastAddedId, addItem, updateQuantity, removeItem }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
