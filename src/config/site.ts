/**
 * Configuração central da Mega Eletrônicos & Personalizados.
 *
 * Os canais oficiais (WhatsApp, Instagram, e-mail, endereço e horários)
 * permanecem vazios até que sejam confirmados pelo cliente. Nenhum contato
 * fictício ou dado da operação anterior é reutilizado.
 */

export const SITE = {
  name: 'Mega Eletrônicos & Personalizados',
  shortName: 'Mega Personalizados',
  tagline: 'Seu estilo. Sua ideia. Sua Mega.',
  description:
    'Transformamos ideias em produtos únicos em Sousa-PB: capinhas, canecas, presentes, chaveiros, bonés e brindes corporativos com gravação a laser, impressão DTF e flatbed.',
  url: '',
  logo: '/logos/logoMPersonalizados.png',
  instagramHandle: '',
} as const;

/** Número oficial do WhatsApp (apenas dígitos, com DDI). Vazio = ainda não configurado. */
export const WHATSAPP_NUMBER = '5583993250859';

export const WHATSAPP_ENABLED = /^\d{12,15}$/.test(WHATSAPP_NUMBER);

/** Canais e dados comerciais — preencher apenas com informações confirmadas. */
export const CONTACT = {
  whatsapp: WHATSAPP_NUMBER,
  instagramUrl: SITE.instagramHandle
    ? `https://www.instagram.com/${SITE.instagramHandle}`
    : '',
  email: '',
  address: 'Rua Coronel José Vicente, 52 — Centro, Sousa, PB — CEP 58800-005',
  mapsQuery:
    'Mega Eletrônicos sousa, Rua Coronel José Vicente, 52, Centro, Sousa, PB, 58800-005',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Mega+Eletr%C3%B4nicos+sousa%2C+Rua+Coronel+Jos%C3%A9+Vicente%2C+52%2C+Centro%2C+Sousa%2C+PB%2C+58800-005',
  directionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=Mega+Eletr%C3%B4nicos+sousa%2C+Rua+Coronel+Jos%C3%A9+Vicente%2C+52%2C+Centro%2C+Sousa%2C+PB%2C+58800-005',
  hours: 'Segunda a sexta, 08:00 às 17:30. Sábado, 08:00 às 13:00.',
} as const;

/**
 * Monta um link oficial wa.me com a mensagem codificada.
 * Retorna string vazia quando o número não está configurado.
 */
export function buildWhatsAppLink(message: string): string {
  if (!WHATSAPP_ENABLED) return '';
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Indica se os dados de produto legados são exemplos de desenvolvimento. */
export const USING_SAMPLE_DATA = true;

/** Mensagem padrão para contatos que não partem de um produto específico. */
export const WHATSAPP_GENERAL_MESSAGE =
  'Olá! Vim pelo site da Mega Personalizados e gostaria de solicitar um orçamento.';

/** Mensagem para solicitação de personalização assistida por vendedor (Home). */
export const CUSTOM_ORDER_PERSONALIZATION_MESSAGE =
  'Olá! Vim pelo site da Mega Eletrônicos & Personalizados.\n\nGostaria de fazer um produto personalizado diretamente com um vendedor.\n\nPosso enviar minha ideia e algumas imagens de referência para conversarmos sobre a personalização?';
