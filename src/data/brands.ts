import type { BrandItem } from '@/lib/types';

/**
 * Marcas suportadas pelo catálogo. Novas marcas podem ser adicionadas aqui;
 * a Home exibe apenas as marcas que possuem modelos cadastrados.
 */
export const BRANDS: BrandItem[] = [
  { id: 'apple', name: 'Apple', tagline: 'iPhone e ecossistema iOS' },
  { id: 'samsung', name: 'Samsung', tagline: 'Linhas Galaxy S e Galaxy A' },
  { id: 'motorola', name: 'Motorola', tagline: 'Linha Moto G' },
  { id: 'xiaomi', name: 'Xiaomi', tagline: 'Linhas Redmi e Xiaomi' },
  { id: 'amazon', name: 'Amazon', tagline: 'Casa inteligente Echo' },
  { id: 'jbl', name: 'JBL', tagline: 'Áudio e caixas de som' },
  { id: 'outros', name: 'Outros', tagline: 'Acessórios e compatíveis' },
];
