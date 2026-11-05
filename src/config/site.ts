/**
 * Configuração central da CellShop.
 *
 * IMPORTANTE — Dados pendentes de cadastro pelo cliente:
 * - WHATSAPP_NUMBER: número oficial no formato internacional (somente dígitos).
 *   Ex.: "5583999999999". Enquanto estiver vazio, os botões de WhatsApp ficam
 *   desativados e NENHUM link fictício é gerado.
 * - INSTAGRAM_HANDLE: @ oficial da loja.
 * - ADDRESS / HOURS: preencher apenas quando confirmados (não inventar).
 */

export const SITE = {
  name: 'CellShop',
  shortName: 'CellShop',
  tagline: 'Tecnologia que acompanha você.',
  description:
     'Encontre seu próximo smartphone com praticidade na CellShop. Catálogo de celulares com atendimento pelo WhatsApp.',
  url: 'https://cellshopmax.com.br',
  logo: '/logos/logo-cellshop-light.png',
  instagramHandle: '', // Ex.: 'cellshopmax' — deixar vazio até confirmar
} as const;

/**
 * Número oficial do WhatsApp (apenas dígitos, com DDI). Vazio = ainda não configurado.
 */
export const WHATSAPP_NUMBER = '';

export const WHATSAPP_ENABLED = /^\d{12,15}$/.test(WHATSAPP_NUMBER);

/** Redes e contato — preencher apenas com dados confirmados. */
export const CONTACT = {
  whatsapp: WHATSAPP_NUMBER,
  instagramUrl: SITE.instagramHandle
    ? `https://www.instagram.com/${SITE.instagramHandle}`
    : '',
  email: '', // Ex.: 'contato@cellshopmax.com.br'
  address: 'Rua Coronel José Vicente, 447 — Centro, Sousa, PB — CEP 58800-020',
  hours: '', // Ex.: 'Seg a sex, 9h às 18h'
} as const;

/**
 * Monta um link oficial wa.me com a mensagem codificada.
 * Retorna string vazia quando o número não está configurado (evita links quebrados).
 */
export function buildWhatsAppLink(message: string): string {
  if (!WHATSAPP_ENABLED) return '';
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Indica se os dados de produto carregados são exemplos de desenvolvimento. */
export const USING_SAMPLE_DATA = true;

/** Mensagem padrão para contatos que não partem de um produto específico. */
export const WHATSAPP_GENERAL_MESSAGE =
  'Olá! Vim pelo site da CellShop e gostaria de mais informações.';
