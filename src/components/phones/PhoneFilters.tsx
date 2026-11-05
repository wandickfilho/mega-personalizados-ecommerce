'use client';

import { X } from 'lucide-react';
import type { Availability, CatalogFilters, PhoneCondition, SortOption } from '@/lib/types';
import type { BrandItem } from '@/lib/types';
import { AVAILABILITY_LABEL, CONDITION_LABEL } from '@/lib/phones';
import { cn } from '@/lib/utils';

interface PhoneFiltersProps {
  filters: CatalogFilters;
  onChange: (patch: Partial<CatalogFilters>) => void;
  onReset: () => void;
  brands: BrandItem[];
  storages: string[];
  categories: string[];
}

const AVAILABILITY_OPTIONS: (Availability | 'todas')[] = [
  'todas',
  'disponivel',
  'sob-consulta',
  'indisponivel',
];

const CONDITION_OPTIONS: (PhoneCondition | 'todas')[] = ['todas', 'novo', 'seminovo'];

function GroupTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-navy/70">{children}</h3>
  );
}

export function SortSelect({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (value: SortOption) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-xs text-graphite/60">
      <span className="hidden sm:inline">Ordenar por</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="rounded-xl border border-line bg-white px-3.5 py-2.5 text-xs font-semibold text-navy transition hover:border-navy/30 focus:border-navy focus:outline-none"
      >
        <option value="recentes">Mais recentes</option>
        <option value="menor-preco">Menor preço</option>
        <option value="maior-preco">Maior preço</option>
        <option value="nome-asc">Nome de A a Z</option>
      </select>
    </label>
  );
}

export default function PhoneFilters({
  filters,
  onChange,
  onReset,
  brands,
  storages,
  categories,
}: PhoneFiltersProps) {
  const chipBase =
    'rounded-full border px-3 py-1.5 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-navy/30';
  const chipActive = 'border-navy bg-navy text-white';
  const chipIdle = 'border-line bg-white text-graphite/70 hover:border-navy/40 hover:text-navy';

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <GroupTitle>Filtros</GroupTitle>
        <button
          type="button"
          onClick={onReset}
          className="text-[11px] font-semibold text-brand transition hover:text-brand-dark"
        >
          Limpar
        </button>
      </div>

      {/* Marca */}
      <div className="space-y-3">
        <GroupTitle>Marca</GroupTitle>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onChange({ marca: 'todas' })}
            className={cn(chipBase, filters.marca === 'todas' ? chipActive : chipIdle)}
          >
            Todas
          </button>
          {brands.map((brand) => (
            <button
              key={brand.id}
              type="button"
              onClick={() => onChange({ marca: brand.id })}
              className={cn(chipBase, filters.marca === brand.id ? chipActive : chipIdle)}
            >
              {brand.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <GroupTitle>Categoria</GroupTitle>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => onChange({ categoria: 'todas' })} className={cn(chipBase, filters.categoria === 'todas' ? chipActive : chipIdle)}>Todas</button>
          {categories.map((category) => <button key={category} type="button" onClick={() => onChange({ categoria: category })} className={cn(chipBase, filters.categoria === category ? chipActive : chipIdle)}>{category}</button>)}
        </div>
      </div>

      {/* Armazenamento */}
      <div className="space-y-3">
        <GroupTitle>Armazenamento</GroupTitle>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onChange({ armazenamento: 'todos' })}
            className={cn(chipBase, filters.armazenamento === 'todos' ? chipActive : chipIdle)}
          >
            Todos
          </button>
          {storages.map((storage) => (
            <button
              key={storage}
              type="button"
              onClick={() => onChange({ armazenamento: storage })}
              className={cn(
                chipBase,
                filters.armazenamento === storage ? chipActive : chipIdle
              )}
            >
              {storage}
            </button>
          ))}
        </div>
      </div>

      {/* Condição */}
      <div className="space-y-3">
        <GroupTitle>Condição</GroupTitle>
        <div className="flex flex-wrap gap-2">
          {CONDITION_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onChange({ condicao: option })}
              className={cn(chipBase, filters.condicao === option ? chipActive : chipIdle)}
            >
              {option === 'todas' ? 'Todas' : CONDITION_LABEL[option]}
            </button>
          ))}
        </div>
      </div>

      {/* Disponibilidade */}
      <div className="space-y-3">
        <GroupTitle>Disponibilidade</GroupTitle>
        <div className="flex flex-wrap gap-2">
          {AVAILABILITY_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onChange({ disponibilidade: option })}
              className={cn(
                chipBase,
                filters.disponibilidade === option ? chipActive : chipIdle
              )}
            >
              {option === 'todas' ? 'Todas' : AVAILABILITY_LABEL[option]}
            </button>
          ))}
        </div>
      </div>

      {/* Faixa de preço */}
      <div className="space-y-3">
        <GroupTitle>Faixa de preço (R$)</GroupTitle>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Mínimo"
            value={filters.precoMin ?? ''}
            onChange={(e) =>
              onChange({ precoMin: e.target.value === '' ? null : Number(e.target.value) })
            }
            className="w-full rounded-lg border border-line bg-white px-3 py-2 text-xs text-graphite focus:border-navy focus:outline-none"
          />
          <span className="text-graphite/40">—</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Máximo"
            value={filters.precoMax ?? ''}
            onChange={(e) =>
              onChange({ precoMax: e.target.value === '' ? null : Number(e.target.value) })
            }
            className="w-full rounded-lg border border-line bg-white px-3 py-2 text-xs text-graphite focus:border-navy focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Até R$ 1.500', min: null, max: 1500 },
            { label: 'R$ 1.500–3.000', min: 1500, max: 3000 },
            { label: 'R$ 3.000–5.000', min: 3000, max: 5000 },
            { label: 'Acima de R$ 5.000', min: 5000, max: null },
          ].map((range) => (
            <button
              key={range.label}
              type="button"
              onClick={() => onChange({ precoMin: range.min, precoMax: range.max })}
              className="rounded-full border border-line bg-white px-3 py-1 text-[11px] font-medium text-graphite/60 transition hover:border-navy/40 hover:text-navy"
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ActiveFilterChips({
  filters,
  brands,
  onClear,
}: {
  filters: CatalogFilters;
  brands: BrandItem[];
  onClear: (key: keyof CatalogFilters) => void;
}) {
  const chips: { key: keyof CatalogFilters; label: string }[] = [];

  if (filters.marca !== 'todas') {
    const name = brands.find((b) => b.id === filters.marca)?.name ?? filters.marca;
    chips.push({ key: 'marca', label: `Marca: ${name}` });
  }
  if (filters.categoria !== 'todas') chips.push({ key: 'categoria', label: `Categoria: ${filters.categoria}` });
  if (filters.armazenamento !== 'todos') {
    chips.push({ key: 'armazenamento', label: `Armazenamento: ${filters.armazenamento}` });
  }
  if (filters.condicao !== 'todas') {
    chips.push({ key: 'condicao', label: `Condição: ${CONDITION_LABEL[filters.condicao]}` });
  }
  if (filters.disponibilidade !== 'todas') {
    chips.push({
      key: 'disponibilidade',
      label: `Disponibilidade: ${AVAILABILITY_LABEL[filters.disponibilidade]}`,
    });
  }
  if (filters.precoMin !== null || filters.precoMax !== null) {
    chips.push({ key: 'precoMin', label: 'Faixa de preço' });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => onClear(chip.key)}
          className="inline-flex items-center gap-1.5 rounded-full bg-mist px-3 py-1 text-[11px] font-medium text-graphite/70 transition hover:text-navy"
        >
          {chip.label}
          <X className="h-3 w-3" aria-hidden />
        </button>
      ))}
    </div>
  );
}
