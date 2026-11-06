'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { PhoneModel, PhoneVariant } from '@/lib/types';
import type { PersonalizedProduct } from '@/data/personalizedProducts';
import type { ArtworkLayer, StageEditor, TextLayer } from '@/lib/personalization';

export interface PhoneCartItem {
  kind?: 'phone';
  phoneId: string;
  variantId: string;
  quantity: number;
}

export interface PersonalizationState {
  layers: ArtworkLayer[];
  text?: string;
  color?: string;
  textColor?: string;
  size?: string;
  model?: string;
  material?: string;
  font?: string;
  engraving?: string;
  notes?: string;
  editor?: StageEditor;
  artworkName?: string;
  previewImage?: string;
  faceTexts?: Record<string, TextLayer>;
  activeFace?: string;
  design?: {
    positionX: number;
    positionY: number;
    scale: number;
    rotation: number;
    textSize: number;
    imageStorage: 'pending-secure-upload' | 'none';
  };
}

export interface PersonalizedCartItem {
  kind: 'personalized';
  id: string;
  productId: string;
  productSlug: string;
  quantity: number;
  personalization: PersonalizationState;
}

export type CartItem = PhoneCartItem | PersonalizedCartItem;

interface CartContextValue {
  items: CartItem[];
  isHydrated: boolean;
  itemCount: number;
  lastAddedId: number;
  isDrawerOpen: boolean;
  addItem: (phone: PhoneModel, variant: PhoneVariant) => void;
  addPersonalizedItem: (product: PersonalizedProduct, personalization: PersonalizationState, quantity: number) => void;
  updatePersonalizedItem: (itemId: string, personalization: PersonalizationState, quantity: number) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  setDrawerOpen: (open: boolean) => void;
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
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => { setItems(readStoredCart()); setIsHydrated(true); });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (isHydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isHydrated]);

  const addItem = (phone: PhoneModel, variant: PhoneVariant) => {
    setItems((current) => {
      const existing = current.find((item) => item.kind !== 'personalized' && item.phoneId === phone.id && item.variantId === variant.id);
      return existing
        ? current.map((item) => item === existing ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { phoneId: phone.id, variantId: variant.id, quantity: 1 }];
    });
    setLastAddedId((current) => current + 1);
  };

  const addPersonalizedItem = (product: PersonalizedProduct, personalization: PersonalizationState, quantity: number) => {
    setItems((current) => [...current, { kind: 'personalized', id: `${product.id}-${Date.now()}`, productId: product.id, productSlug: product.slug, quantity, personalization }]);
    setLastAddedId((current) => current + 1);
    setDrawerOpen(true);
  };

  const updatePersonalizedItem = (itemId: string, personalization: PersonalizationState, quantity: number) => {
    setItems((current) => current.map((item) => item.kind === 'personalized' && item.id === itemId ? { ...item, personalization, quantity } : item));
    setLastAddedId((current) => current + 1);
  };

  const updateQuantity = (itemId: string, quantity: number) => setItems((current) => quantity < 1 ? current.filter((item) => getItemId(item) !== itemId) : current.map((item) => getItemId(item) === itemId ? { ...item, quantity } : item));
  const removeItem = (itemId: string) => setItems((current) => current.filter((item) => getItemId(item) !== itemId));
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return <CartContext.Provider value={{ items, isHydrated, itemCount, lastAddedId, isDrawerOpen, addItem, addPersonalizedItem, updatePersonalizedItem, updateQuantity, removeItem, setDrawerOpen }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
