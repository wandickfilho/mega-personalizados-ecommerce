import { PHONES } from '@/data/phones';
import { PERSONALIZED_PRODUCTS } from '@/data/personalizedProducts';
import type { CartItem } from '@/components/cart/CartProvider';
import { CONDITION_LABEL } from '@/lib/phones';
import { formatCurrency } from '@/lib/utils';

export interface ResolvedCartItem { id: string; quantity: number; name: string; price: number | null; demonstrativePrice?: number; details: string[]; kind: 'phone' | 'personalized'; image?: string; mockup?: (typeof PERSONALIZED_PRODUCTS)[number]['mockup']; tone?: (typeof PERSONALIZED_PRODUCTS)[number]['tone']; }
export function resolveCartItems(items: CartItem[]) {
  const valid: ResolvedCartItem[] = []; const invalid: CartItem[] = [];
  for (const item of items) {
    if (item.kind === 'personalized') {
      const product = PERSONALIZED_PRODUCTS.find((entry) => entry.id === item.productId);
      if (!product) { invalid.push(item); continue; }
      const details = [item.personalization.text && `Texto: ${item.personalization.text}`, item.personalization.color && `Cor: ${item.personalization.color}`, item.personalization.size && `Tamanho: ${item.personalization.size}`, item.personalization.artworkName && `Arte: ${item.personalization.artworkName}`, item.personalization.notes && `Observações: ${item.personalization.notes}`].filter((value): value is string => Boolean(value));
      valid.push({ id: item.id, quantity: item.quantity, name: product.name, price: null, demonstrativePrice: product.demonstrativePrice, details, kind: 'personalized', mockup: product.mockup, tone: product.tone }); continue;
    }
    const phone = PHONES.find((entry) => entry.id === item.phoneId); const variant = phone?.variants.find((entry) => entry.id === item.variantId);
    if (!phone || !variant) { invalid.push(item); continue; }
    valid.push({ id: item.variantId, quantity: item.quantity, name: phone.name, price: variant.price, details: [[variant.storage, variant.colorName, CONDITION_LABEL[variant.condition]].filter(Boolean).join(' / ')], kind: 'phone', image: variant.images[0] ?? phone.images[0] });
  }
  return { valid, invalid };
}
export function cartSubtotal(items: ResolvedCartItem[]) { return items.reduce((total, item) => total + (item.price ?? 0) * item.quantity, 0); }
export function hasConsultationItems(items: ResolvedCartItem[]) { return items.some((item) => item.price === null); }
export function buildCartWhatsAppMessage(sellerName: string, items: ResolvedCartItem[]) { const lines = items.map((item, index) => [`${index + 1}. ${item.name}`, ...item.details, `Quantidade: ${item.quantity}`, `Valor anunciado: ${item.demonstrativePrice ? `${formatCurrency(item.demonstrativePrice)} (demonstrativo, confirmar)` : item.price === null ? 'Sob consulta' : formatCurrency(item.price)}`].join('\n')); return `Olá, ${sellerName}!\n\nVim pelo site da Mega Personalizados e gostaria de consultar os seguintes itens:\n\n${lines.join('\n\n')}\n\nOs itens personalizados, valores demonstrativos e o envio da arte precisam ser confirmados pela equipe.`; }
