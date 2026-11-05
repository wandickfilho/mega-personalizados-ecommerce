import { PHONES } from '@/data/phones';
import type { CartItem } from '@/components/cart/CartProvider';
import type { PhoneModel, PhoneVariant } from '@/lib/types';
import { CONDITION_LABEL } from '@/lib/phones';
import { formatCurrency } from '@/lib/utils';

export interface ResolvedCartItem extends CartItem { phone: PhoneModel; variant: PhoneVariant; }

export function resolveCartItems(items: CartItem[]) {
  const valid: ResolvedCartItem[] = [];
  const invalid: CartItem[] = [];
  for (const item of items) {
    const phone = PHONES.find((entry) => entry.id === item.phoneId);
    const variant = phone?.variants.find((entry) => entry.id === item.variantId);
    if (phone && variant) valid.push({ ...item, phone, variant });
    else invalid.push(item);
  }
  return { valid, invalid };
}

export function cartSubtotal(items: ResolvedCartItem[]) {
  return items.reduce((total, item) => total + (item.variant.price ?? 0) * item.quantity, 0);
}

export function hasConsultationItems(items: ResolvedCartItem[]) {
  return items.some((item) => item.variant.price === null);
}

export function variantLabel(variant: PhoneVariant) {
  return [variant.storage, variant.colorName, CONDITION_LABEL[variant.condition]].filter(Boolean).join(' / ');
}

export function buildCartWhatsAppMessage(sellerName: string, items: ResolvedCartItem[]) {
  const lines = items.map((item, index) => [
    `${index + 1}. ${item.phone.name}`,
    `Variação: ${variantLabel(item.variant)}`,
    `Quantidade: ${item.quantity}`,
    `Valor anunciado: ${item.variant.price === null ? 'Sob consulta' : formatCurrency(item.variant.price)}`,
  ].join('\n'));
  const subtotal = cartSubtotal(items);
  return `Olá, ${sellerName}! 👋\n\nVim pelo site da CellShop e gostaria de consultar a compra dos seguintes produtos:\n\n🛍️ MEU PEDIDO\n\n${lines.join('\n\n')}\n\nSubtotal dos itens com preço conhecido: ${formatCurrency(subtotal)}\n\nPoderia confirmar a disponibilidade, o valor final e as condições de pagamento?`;
}
