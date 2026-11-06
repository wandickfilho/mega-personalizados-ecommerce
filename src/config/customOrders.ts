/**
 * Canal para pedidos que precisam de atendimento humano.
 * Preencha apenas com o WhatsApp oficial, em formato internacional e só dígitos.
 */
export const CUSTOM_ORDER_WHATSAPP = '';
export const CUSTOM_ORDER_WHATSAPP_ENABLED = /^\d{12,15}$/.test(CUSTOM_ORDER_WHATSAPP);

export function buildCustomOrderMessage(productName: string) {
  return `Olá! Vim pelo site da Mega Personalizados e gostaria de personalizar: ${productName}.`;
}
