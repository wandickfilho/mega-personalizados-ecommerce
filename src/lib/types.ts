export type Availability = 'disponivel' | 'sob-consulta' | 'indisponivel';

export type PhoneCondition = 'novo' | 'seminovo';

export interface PhoneSpec {
  label: string;
  value: string;
}

/**
 * Uma combinação comercial cadastrável: armazenamento + cor + condição.
 * `price` nulo significa "sem preço cadastrado" (nunca inventar valores).
 */
export interface PhoneVariant {
  id: string;
  storage: string;
  colorName: string;
  colorHex: string;
  condition: PhoneCondition;
  price: number | null;
  availability: Availability;
  images: string[];
}

/** Agrupamento de modelo: um único card por modelo, com todas as variações. */
export interface PhoneModel {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  specs: PhoneSpec[];
  images: string[];
  variants: PhoneVariant[];
  isFeatured?: boolean;
  isNew?: boolean;
  isDemo?: boolean;
  /** Data de cadastro em ISO — base para "Mais recentes". */
  createdAt: string;
}

export interface BrandItem {
  id: string;
  name: string;
  tagline: string;
}

export type SortOption = 'recentes' | 'menor-preco' | 'maior-preco' | 'nome-asc';

export interface CatalogFilters {
  q: string;
  marca: string;
  categoria: string;
  armazenamento: string;
  condicao: PhoneCondition | 'todas';
  disponibilidade: Availability | 'todas';
  precoMin: number | null;
  precoMax: number | null;
  ordem: SortOption;
}
