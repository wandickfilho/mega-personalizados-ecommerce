import { PHONES } from '@/data/phones';
import { PERSONALIZED_PRODUCTS } from '@/data/personalizedProducts';
import type { CartItem, PersonalizationState } from '@/components/cart/CartProvider';
import { CONDITION_LABEL } from '@/lib/phones';
import { formatCurrency } from '@/lib/utils';

export interface ResolvedCartItem {
  id: string;
  quantity: number;
  name: string;
  price: number | null;
  demonstrativePrice?: number;
  details: string[];
  kind: 'phone' | 'personalized';
  image?: string;
  phoneId?: string;
  variantId?: string;
  mockup?: (typeof PERSONALIZED_PRODUCTS)[number]['mockup'];
  tone?: (typeof PERSONALIZED_PRODUCTS)[number]['tone'];
  productId?: string;
  productSlug?: string;
  personalization?: PersonalizationState;
}

export function resolveCartItems(items: CartItem[]) {
  const valid: ResolvedCartItem[] = [];
  const invalid: CartItem[] = [];
  for (const item of items) {
    if (item.kind === 'personalized') {
      const product = PERSONALIZED_PRODUCTS.find((entry) => entry.id === item.productId);
      if (!product) { invalid.push(item); continue; }
      const personalization = item.personalization;
      const layers = personalization.layers ?? [];
      const details = [
        personalization.text && `Texto: ${personalization.text}`,
        personalization.color && `Cor: ${personalization.color}`,
        personalization.textColor && `Cor do texto: ${personalization.textColor}`,
        personalization.model && `Modelo: ${personalization.model}`,
        personalization.material && `Material: ${personalization.material}`,
        personalization.font && `Fonte: ${personalization.font}`,
        personalization.engraving && `Acabamento: ${personalization.engraving}`,
        personalization.size && `Tamanho: ${personalization.size}`,
        layers.length > 0 && `${layers.length} ${layers.length === 1 ? 'imagem aplicada' : 'imagens aplicadas'}`,
        layers.length > 0 && layers.map((layer) => layer.fileName).join(', '),
        personalization.notes && `Observacoes: ${personalization.notes}`,
      ].filter((value): value is string => Boolean(value));
      valid.push({
        id: item.id,
        quantity: item.quantity,
        name: product.name,
        price: null,
        demonstrativePrice: product.demonstrativePrice,
        details,
        kind: 'personalized',
        image: personalization.previewImage || layers[0]?.preview,
        mockup: product.mockup,
        tone: product.tone,
        productId: product.id,
        productSlug: product.slug,
        personalization,
      });
      continue;
    }
    const phone = PHONES.find((entry) => entry.id === item.phoneId);
    const variant = phone?.variants.find((entry) => entry.id === item.variantId);
    if (!phone || !variant) { invalid.push(item); continue; }
    valid.push({
      id: item.variantId,
      quantity: item.quantity,
      name: phone.name,
      price: variant.price,
      details: [[variant.storage, variant.colorName, CONDITION_LABEL[variant.condition]].filter(Boolean).join(' / ')],
      kind: 'phone',
      image: variant.images[0] ?? phone.images[0],
      phoneId: phone.id,
      variantId: variant.id,
    });
  }
  return { valid, invalid };
}

export function cartSubtotal(items: ResolvedCartItem[]) {
  return items.reduce((total, item) => total + (item.price ?? 0) * item.quantity, 0);
}

export function hasConsultationItems(items: ResolvedCartItem[]) {
  return items.some((item) => item.price === null);
}

export function hasPricedItems(items: ResolvedCartItem[]) {
  return items.some((item) => item.price !== null);
}

export function buildCartWhatsAppMessage(sellerName: string, items: ResolvedCartItem[]) {
  const lines = items.map((item, index) => [
    `${index + 1}. ${item.name}`,
    ...item.details,
    `Quantidade: ${item.quantity}`,
    `Valor anunciado: ${item.demonstrativePrice ? `${formatCurrency(item.demonstrativePrice)} (demonstrativo, confirmar)` : item.price === null ? 'Sob consulta' : formatCurrency(item.price)}`,
  ].join('\n'));
  return `Ola, ${sellerName}!\n\nVim pelo site da Mega Personalizados e gostaria de consultar os seguintes itens:\n\n${lines.join('\n\n')}\n\nOs itens personalizados, valores demonstrativos e o envio da arte precisam ser confirmados pela equipe.`;
}
