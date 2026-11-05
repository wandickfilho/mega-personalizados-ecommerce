import type { CategoryId } from '@/config/categories';

export type ProductTone = 'navy' | 'royal' | 'red' | 'ice' | 'white';

export type ProductMockup =
  | 'phone-case'
  | 'tablet-case'
  | 'mug'
  | 'keychain'
  | 'cap'
  | 'pouch'
  | 'gift'
  | 'kit';

export interface ProductMedia {
  src: string;
  alt: string;
}

export interface PersonalizedProduct {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  technique: string;
  description: string;
  tags: string[];
  tone: ProductTone;
  mockup: ProductMockup;
  isDemo: true;
  corporate?: boolean;
  options?: PersonalizedProductOptions;
  video?: string;
  media?: ProductMedia;
  demonstrativePrice?: number;
}

export interface PersonalizedProductOptions {
  text?: boolean;
  colors?: string[];
  sizes?: string[];
  artwork?: boolean;
  notes?: boolean;
}

/**
 * Dados demonstrativos da vitrine.
 * Não representam preços, estoque, prazos ou avaliações reais. Todos os itens
 * são explicitamente identificados como demonstração na interface.
 */
export const PERSONALIZED_PRODUCTS: PersonalizedProduct[] = [
  {
    id: 'demo-caneca-premium',
    slug: 'caneca-linha-premium',
    name: 'Caneca Linha Premium',
    category: 'canecas',
    technique: 'Impressão flatbed',
    description: 'Composição demonstrativa de caneca com área de personalização ampla.',
    tags: ['Presente', 'Sob medida'],
    tone: 'navy',
    mockup: 'mug',
    isDemo: true,
    options: { text: true, artwork: true, notes: true },
  },
  {
    id: 'demo-capinha-identidade',
    slug: 'capinha-identidade',
    name: 'Capinha Identidade',
    category: 'capinhas-celular',
    technique: 'Impressão flatbed',
    description: 'Exemplo de capinha com arte autoral e acabamento visual limpo.',
    tags: ['Proteção', 'Arte autoral'],
    tone: 'red',
    mockup: 'phone-case',
    isDemo: true,
    media: { src: '/produtos/capinha.mp4', alt: 'Vídeo de uma capinha personalizada da Mega' },
    demonstrativePrice: 29.9,
    options: { artwork: true, notes: true },
  },
  {
    id: 'demo-capa-tablet',
    slug: 'capa-tablet-estudo',
    name: 'Capa para Tablet',
    category: 'capas-tablet',
    technique: 'Impressão flatbed',
    description: 'Referência de capa personalizada para estudo, trabalho e criação.',
    tags: ['Estudo', 'Trabalho'],
    tone: 'royal',
    mockup: 'tablet-case',
    isDemo: true,
    options: { artwork: true, notes: true },
  },
  {
    id: 'demo-chaveiro-acrilico',
    slug: 'chaveiro-acrilico',
    name: 'Chaveiro de Acrílico',
    category: 'chaveiros',
    technique: 'Gravação a laser',
    description: 'Exemplo de chaveiro leve com gravação precisa e acabamento delicado.',
    tags: ['Lembrança', 'Gravação'],
    tone: 'ice',
    mockup: 'keychain',
    isDemo: true,
    options: { text: true, notes: true },
  },
  {
    id: 'demo-bone-marca',
    slug: 'bone-marca',
    name: 'Boné com Marca',
    category: 'bones',
    technique: 'Impressão DTF',
    description: 'Demonstração de boné personalizado para equipes, eventos e marcas.',
    tags: ['Equipes', 'Eventos'],
    tone: 'navy',
    mockup: 'cap',
    isDemo: true,
    media: { src: '/produtos/bone.mp4', alt: 'Vídeo de um boné personalizado da Mega' },
    demonstrativePrice: 49.9,
    corporate: true,
    options: { artwork: true, notes: true },
  },
  {
    id: 'demo-garrafa-personalizada',
    slug: 'garrafa-personalizada',
    name: 'Garrafa Personalizada',
    category: 'presentes',
    technique: 'Impressão UV',
    description: 'Garrafa personalizada para acompanhar a rotina com uma arte exclusiva.',
    tags: ['Dia a dia', 'Presente'],
    tone: 'ice',
    mockup: 'gift',
    isDemo: true,
    media: { src: '/produtos/garrafa.mp4', alt: 'Vídeo de uma garrafa personalizada da Mega' },
    demonstrativePrice: 39.9,
    options: { artwork: true, notes: true },
  },
  {
    id: 'demo-necessaire-viagem',
    slug: 'necessaire-viagem',
    name: 'Nécessaire de Viagem',
    category: 'necessaires',
    technique: 'Impressão DTF',
    description: 'Composição demonstrativa de nécessaire com identidade aplicada em tecido.',
    tags: ['Viagem', 'Organização'],
    tone: 'red',
    mockup: 'pouch',
    isDemo: true,
    corporate: true,
    options: { artwork: true, notes: true },
  },
  {
    id: 'demo-placa-laser',
    slug: 'placa-gravada',
    name: 'Placa Gravada a Laser',
    category: 'presentes',
    technique: 'Gravação a laser',
    description: 'Referência de placa com gravação de precisão para presentes e ambientes.',
    tags: ['Presente', 'Decoração'],
    tone: 'ice',
    mockup: 'gift',
    isDemo: true,
    corporate: true,
    options: { text: true, notes: true },
  },
  {
    id: 'demo-azulejo-flatbed',
    slug: 'azulejo-personalizado',
    name: 'Azulejo Personalizado',
    category: 'presentes',
    technique: 'Impressão flatbed',
    description: 'Exemplo de impressão direta em superfície rígida com composição autoral.',
    tags: ['Decoração', 'Superfície rígida'],
    tone: 'white',
    mockup: 'gift',
    isDemo: true,
    options: { artwork: true, notes: true },
  },
  {
    id: 'demo-presente-estampa',
    slug: 'presente-estampa',
    name: 'Presente com Estampa',
    category: 'presentes',
    technique: 'Impressão DTF',
    description: 'Amostra demonstrativa de composição têxtil personalizada para presente.',
    tags: ['Têxtil', 'Alta definição'],
    tone: 'royal',
    mockup: 'gift',
    isDemo: true,
    options: { artwork: true, notes: true },
  },
  {
    id: 'demo-kit-corporativo',
    slug: 'kit-corporativo-essencial',
    name: 'Kit Corporativo Essencial',
    category: 'brindes-corporativos',
    technique: 'DTF + gravação a laser',
    description: 'Composição demonstrativa de kit com itens de marca para equipes e eventos.',
    tags: ['Empresas', 'Equipes'],
    tone: 'navy',
    mockup: 'kit',
    isDemo: true,
    corporate: true,
    options: { artwork: true, notes: true },
  },
  {
    id: 'demo-caneca-campanha',
    slug: 'caneca-campanha',
    name: 'Caneca de Campanha',
    category: 'brindes-corporativos',
    technique: 'Impressão flatbed',
    description: 'Exemplo de caneca personalizada para campanhas, eventos e brindes.',
    tags: ['Campanha', 'Brinde'],
    tone: 'white',
    mockup: 'mug',
    isDemo: true,
    corporate: true,
  },
  {
    id: 'demo-chaveiro-logo',
    slug: 'chaveiro-logotipo',
    name: 'Chaveiro com Logotipo',
    category: 'brindes-corporativos',
    technique: 'Gravação a laser',
    description: 'Referência de chaveiro corporativo com marca aplicada e acabamento limpo.',
    tags: ['Logotipo', 'Brinde'],
    tone: 'royal',
    mockup: 'keychain',
    isDemo: true,
    corporate: true,
    options: { text: true, notes: true },
  },
];

export function getPersonalizedProductBySlug(slug: string) {
  return PERSONALIZED_PRODUCTS.find((product) => product.slug === slug);
}
