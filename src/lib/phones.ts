import type {
  Availability,
  CatalogFilters,
  PhoneCondition,
  PhoneModel,
  PhoneVariant,
} from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

export const AVAILABILITY_LABEL: Record<Availability, string> = {
  disponivel: 'Disponível',
  'sob-consulta': 'Sob consulta',
  indisponivel: 'Indisponível',
};

export const CONDITION_LABEL: Record<PhoneCondition, string> = {
  novo: 'Novo',
  seminovo: 'Seminovo',
};

/** Prioridade de exibição/ordenação: disponível > sob consulta > indisponível. */
export const AVAILABILITY_RANK: Record<Availability, number> = {
  disponivel: 0,
  'sob-consulta': 1,
  indisponivel: 2,
};

function pricesOf(model: PhoneModel): number[] {
  return model.variants
    .map((v) => v.price)
    .filter((p): p is number => typeof p === 'number' && p > 0);
}

export function getMinPrice(model: PhoneModel): number | null {
  const prices = pricesOf(model);
  return prices.length ? Math.min(...prices) : null;
}

export function getMaxPrice(model: PhoneModel): number | null {
  const prices = pricesOf(model);
  return prices.length ? Math.max(...prices) : null;
}

export function hasPrice(model: PhoneModel): boolean {
  return pricesOf(model).length > 0;
}

/** Melhor disponibilidade entre as variações (a menos restritiva). */
export function getModelAvailability(model: PhoneModel): Availability {
  if (!model.variants.length) return 'indisponivel';
  return model.variants.reduce<Availability>(
    (best, v) =>
      AVAILABILITY_RANK[v.availability] < AVAILABILITY_RANK[best] ? v.availability : best,
    'indisponivel'
  );
}

/** Armazenamentos únicos presentes nas variações, ordenados numericamente. */
export function getStorages(model: PhoneModel): string[] {
  const set = new Set(model.variants.map((v) => v.storage));
  return Array.from(set).sort((a, b) => parseStorage(a) - parseStorage(b));
}

export function parseStorage(value: string): number {
  const numeric = parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.'));
  if (Number.isNaN(numeric)) return Number.MAX_SAFE_INTEGER;
  const isTb = /tb/i.test(value);
  return isTb ? numeric * 1024 : numeric;
}

export function getModelColors(model: PhoneModel): { name: string; hex: string }[] {
  const map = new Map<string, string>();
  model.variants.forEach((v) => {
    if (!map.has(v.colorName)) map.set(v.colorName, v.colorHex);
  });
  return Array.from(map, ([name, hex]) => ({ name, hex }));
}

export function getModelConditions(model: PhoneModel): PhoneCondition[] {
  const set = new Set(model.variants.map((v) => v.condition));
  return (['novo', 'seminovo'] as PhoneCondition[]).filter((c) => set.has(c));
}

export function findVariant(
  model: PhoneModel,
  filters: { storage?: string; color?: string; condition?: PhoneCondition }
): PhoneVariant | undefined {
  return model.variants.find(
    (v) =>
      (filters.storage === undefined || v.storage === filters.storage) &&
      (filters.color === undefined || v.colorName === filters.color) &&
      (filters.condition === undefined || v.condition === filters.condition)
  );
}

export function buildProductMessage(
  model: PhoneModel,
  variant?: PhoneVariant
): string {
  const parts: string[] = [];
  if (variant) {
    parts.push(`o ${model.name} de ${variant.storage}`);
    parts.push(`na cor ${variant.colorName}`);
  } else {
    parts.push(`o ${model.name}`);
  }
  const details = parts.join(', ');
  return `Olá! Vi ${details} no catálogo da CellShop. Gostaria de mais informações sobre esse aparelho.`;
}

export function buildAvailabilityMessage(model: PhoneModel, variant?: PhoneVariant): string {
  const target = variant ? `${model.name} (${variant.storage} • ${variant.colorName})` : model.name;
  return `Olá! Tenho interesse no ${target} e gostaria de consultar a reposição no catálogo da CellShop.`;
}

interface FilterOptions {
  models: PhoneModel[];
  filters: CatalogFilters;
}

export function filterModels({ models, filters }: FilterOptions): PhoneModel[] {
  const q = filters.q.trim().toLowerCase();

  return models.filter((model) => {
    if (q) {
      const haystack = [
        model.name,
        model.brand,
        model.category,
        model.description,
        ...model.variants.map((v) => `${v.storage} ${v.colorName}`),
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    if (filters.marca !== 'todas' && model.brand !== filters.marca) return false;
    if (filters.categoria !== 'todas' && model.category !== filters.categoria) return false;

    if (
      filters.armazenamento !== 'todos' &&
      !model.variants.some((v) => v.storage === filters.armazenamento)
    ) {
      return false;
    }

    if (
      filters.condicao !== 'todas' &&
      !model.variants.some((v) => v.condition === filters.condicao)
    ) {
      return false;
    }

    if (
      filters.disponibilidade !== 'todas' &&
      getModelAvailability(model) !== filters.disponibilidade &&
      !model.variants.some((v) => v.availability === filters.disponibilidade)
    ) {
      return false;
    }

    const min = getMinPrice(model);
    const priceFilterActive = filters.precoMin !== null || filters.precoMax !== null;
    if (priceFilterActive) {
      if (min === null) return false;
      if (filters.precoMin !== null && min < filters.precoMin) return false;
      if (filters.precoMax !== null && min > filters.precoMax) return false;
    }

    return true;
  });
}

export function sortModels(models: PhoneModel[], order: CatalogFilters['ordem']): PhoneModel[] {
  const sorted = [...models];

  // Sempre prioriza disponibilidade, depois aplica o critério escolhido.
  const byAvailability = (a: PhoneModel, b: PhoneModel) =>
    AVAILABILITY_RANK[getModelAvailability(a)] - AVAILABILITY_RANK[getModelAvailability(b)];

  switch (order) {
    case 'menor-preco':
      sorted.sort((a, b) => {
        const av = byAvailability(a, b);
        if (av !== 0) return av;
        const pa = getMinPrice(a) ?? Infinity;
        const pb = getMinPrice(b) ?? Infinity;
        return pa - pb;
      });
      break;
    case 'maior-preco':
      sorted.sort((a, b) => {
        const av = byAvailability(a, b);
        if (av !== 0) return av;
        const pa = getMinPrice(a) ?? -Infinity;
        const pb = getMinPrice(b) ?? -Infinity;
        return pb - pa;
      });
      break;
    case 'nome-asc':
      sorted.sort((a, b) => {
        const av = byAvailability(a, b);
        if (av !== 0) return av;
        return a.name.localeCompare(b.name, 'pt-BR');
      });
      break;
    case 'recentes':
    default:
      sorted.sort((a, b) => {
        const av = byAvailability(a, b);
        if (av !== 0) return av;
        return b.createdAt.localeCompare(a.createdAt);
      });
      break;
  }

  return sorted;
}

export function priceLabel(model: PhoneModel): string {
  const min = getMinPrice(model);
  const max = getMaxPrice(model);
  if (min === null) return 'Preço sob consulta';
  if (max !== null && max > min) return `A partir de ${formatCurrency(min)}`;
  return formatCurrency(min);
}
