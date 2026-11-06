import type { ArtworkLayer, TextLayer } from '@/lib/personalization';

export interface OrderCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface OrderDelivery {
  method: 'pickup' | 'address';
  cep?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  complement?: string;
}

export interface OrderPayment {
  method: 'quote';
  note?: string;
}

export interface OrderLayerPayload extends Omit<ArtworkLayer, 'preview' | 'storageKey'> {
  storageKey: string;
  assetPath?: string;
}

export interface OrderItemPayload {
  kind: 'phone' | 'personalized';
  phoneId?: string;
  variantId?: string;
  productId?: string;
  productSlug?: string;
  name: string;
  quantity: number;
  unitPrice: number | null;
  demonstrativePrice?: number;
  details: string[];
  personalization?: {
    text?: string;
    color?: string;
    textColor?: string;
    size?: string;
    model?: string;
    material?: string;
    font?: string;
    engraving?: string;
    notes?: string;
    editor?: string;
    faceTexts?: Record<string, TextLayer>;
    activeFace?: string;
    layers: OrderLayerPayload[];
  };
  previewPath?: string;
}

export interface OrderPayload {
  customer: OrderCustomer;
  delivery: OrderDelivery;
  payment: OrderPayment;
  items: OrderItemPayload[];
}

export interface StoredOrder {
  id: string;
  order_number: string;
  share_token: string;
  status: string;
  customer: OrderCustomer;
  delivery: OrderDelivery;
  payment: OrderPayment;
  items: OrderItemPayload[];
  subtotal: number | null;
  created_at: string;
}

export interface OrderResponse {
  orderNumber: string;
  token: string;
  detailsUrl: string;
  whatsappUrl: string;
  whatsappConfigured: boolean;
}
