'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
import type {
  Availability,
  CatalogFilters,
  PhoneCondition,
  SortOption,
} from '@/lib/types';
import { PHONES } from '@/data/phones';
import { BRANDS } from '@/data/brands';
import { filterModels, sortModels } from '@/lib/phones';
import PhoneGrid from '@/components/phones/PhoneGrid';
import PhoneFilters, { ActiveFilterChips, SortSelect } from '@/components/phones/PhoneFilters';
import SampleDataNotice from '@/components/phones/SampleDataNotice';
import SearchBar from '@/components/ui/SearchBar';

const DEFAULT_FILTERS: CatalogFilters = {
  q: '',
  marca: 'todas',
  categoria: 'todas',
  armazenamento: 'todos',
  condicao: 'todas',
  disponibilidade: 'todas',
  precoMin: null,
  precoMax: null,
  ordem: 'recentes',
};

const CONDITION_VALUES: (PhoneCondition | 'todas')[] = ['todas', 'novo', 'seminovo'];
const AVAILABILITY_VALUES: (Availability | 'todas')[] = [
  'todas',
  'disponivel',
  'sob-consulta',
  'indisponivel',
];
const SORT_VALUES: SortOption[] = ['recentes', 'menor-preco', 'maior-preco', 'nome-asc'];

function parseFilters(params: URLSearchParams): CatalogFilters {
  const condition = params.get('condicao');
  const availability = params.get('disponibilidade');
  const order = params.get('ordem') as SortOption | null;
  const min = params.get('precoMin');
  const max = params.get('precoMax');

  return {
    q: params.get('q') ?? '',
    marca: params.get('marca') ?? 'todas',
    categoria: params.get('categoria') ?? 'todas',
    armazenamento: params.get('armazenamento') ?? 'todos',
    condicao: CONDITION_VALUES.includes(condition as PhoneCondition)
      ? (condition as PhoneCondition)
      : 'todas',
    disponibilidade: AVAILABILITY_VALUES.includes(availability as Availability)
      ? (availability as Availability)
      : 'todas',
    precoMin: min !== null && min !== '' ? Number(min) : null,
    precoMax: max !== null && max !== '' ? Number(max) : null,
    ordem: order && SORT_VALUES.includes(order) ? order : 'recentes',
  };
}

function toQueryString(filters: CatalogFilters): string {
  const params = new URLSearchParams();
  if (filters.q) params.set('q', filters.q);
  if (filters.marca !== 'todas') params.set('marca', filters.marca);
  if (filters.categoria !== 'todas') params.set('categoria', filters.categoria);
  if (filters.armazenamento !== 'todos') params.set('armazenamento', filters.armazenamento);
  if (filters.condicao !== 'todas') params.set('condicao', filters.condicao);
  if (filters.disponibilidade !== 'todas') params.set('disponibilidade', filters.disponibilidade);
  if (filters.precoMin !== null) params.set('precoMin', String(filters.precoMin));
  if (filters.precoMax !== null) params.set('precoMax', String(filters.precoMax));
  if (filters.ordem !== 'recentes') params.set('ordem', filters.ordem);
  return params.toString();
}

const STORAGES = Array.from(
  new Set(PHONES.flatMap((phone) => phone.variants.map((v) => v.storage)))
).sort();
const CATEGORIES = Array.from(new Set(PHONES.map((phone) => phone.category))).sort();

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const queryString = searchParams.toString();

  const [filters, setFilters] = useState<CatalogFilters>(() =>
    parseFilters(new URLSearchParams(queryString))
  );
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const lastPushed = useRef(queryString);

  // Sincroniza a partir da URL (navegação externa, compartilhamento de link).
  useEffect(() => {
    if (queryString === lastPushed.current) return;
    lastPushed.current = queryString;
    setFilters(parseFilters(new URLSearchParams(queryString)));
  }, [queryString]);

  // Reflete o estado atual na URL.
  useEffect(() => {
    const next = toQueryString(filters);
    if (next === queryString) return;
    lastPushed.current = next;
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const update = (patch: Partial<CatalogFilters>) =>
    setFilters((prev) => ({ ...prev, ...patch }));

  const reset = () => setFilters({ ...DEFAULT_FILTERS });

  const results = useMemo(
    () => sortModels(filterModels({ models: PHONES, filters }), filters.ordem),
    [filters]
  );

  const activeCount = useMemo(() => {
    let count = 0;
    if (filters.q) count += 1;
    if (filters.marca !== 'todas') count += 1;
    if (filters.armazenamento !== 'todos') count += 1;
    if (filters.condicao !== 'todas') count += 1;
    if (filters.disponibilidade !== 'todas') count += 1;
    if (filters.precoMin !== null || filters.precoMax !== null) count += 1;
    return count;
  }, [filters]);

  const content = (
    <div className="bg-[#fbfaff]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        {/* Cabeçalho */}
        <div className="rounded-[1.5rem] bg-navy px-5 py-8 text-white shadow-premium sm:rounded-[2rem] sm:px-9 sm:py-10">
          <nav
            aria-label="Navegação estrutural"
            className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45"
          >
            <Link href="/" className="transition hover:text-white">
              Início
            </Link>
            <span>/</span>
            <span className="text-white/80">Celulares</span>
          </nav>

          <h1 className="mt-4 font-display text-3xl font-bold tracking-[-0.035em] text-white sm:text-4xl">
            Catálogo de celulares
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65">
            Todos os modelos cadastrados, independentemente da marca. Filtre, compare e fale com a
            loja pelo WhatsApp quando encontrar o seu.
          </p>
          <div className="mt-4">
            <SampleDataNotice />
          </div>
        </div>

        <div className="grid gap-7 pt-8 lg:grid-cols-[264px_1fr] lg:gap-10">
          {/* Sidebar desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-2xl border border-line bg-white p-5 shadow-soft">
              <PhoneFilters
                filters={filters}
                onChange={update}
                onReset={reset}
                brands={BRANDS}
                storages={STORAGES}
                categories={CATEGORIES}
              />
            </div>
          </aside>

          <div>
            {/* Busca + controles */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="w-full sm:max-w-sm">
                <SearchBar
                  key={filters.q}
                  id="catalog-search"
                  tone="light"
                  defaultValue={filters.q}
                  onSubmitted={() => undefined}
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-xs font-bold text-navy shadow-soft transition hover:border-navy lg:hidden"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
                  Filtros
                  {activeCount > 0 && (
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-navy text-[10px] text-white">
                      {activeCount}
                    </span>
                  )}
                </button>
                <SortSelect value={filters.ordem} onChange={(ordem) => update({ ordem })} />
              </div>
            </div>

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-graphite/50">
                <strong className="font-semibold text-graphite">{results.length}</strong>{' '}
                {results.length === 1 ? 'aparelho encontrado' : 'aparelhos encontrados'}
              </p>
              <ActiveFilterChips
                filters={filters}
                brands={BRANDS}
                onClear={(key) => {
                  if (key === 'precoMin') update({ precoMin: null, precoMax: null });
                  else if (key === 'marca') update({ marca: 'todas' });
                  else if (key === 'categoria') update({ categoria: 'todas' });
                  else if (key === 'armazenamento') update({ armazenamento: 'todos' });
                  else if (key === 'condicao') update({ condicao: 'todas' });
                  else if (key === 'disponibilidade') update({ disponibilidade: 'todas' });
                }}
              />
            </div>

            <PhoneGrid
              phones={results}
              priorityCount={4}
              emptyAction={
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-full bg-navy px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-navy-700"
                >
                  Limpar filtros
                </button>
              }
            />
          </div>
        </div>
      </div>

      {/* Drawer de filtros mobile */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Fechar filtros"
            onClick={() => setMobileFiltersOpen(false)}
            className="absolute inset-0 animate-fade-in bg-black/60 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filtros"
            className="absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-3.5">
              <h2 className="font-display text-sm font-bold text-navy">Filtros</h2>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Fechar filtros"
                className="rounded-full p-2 text-graphite/60 transition hover:bg-mist hover:text-navy"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <PhoneFilters
                filters={filters}
                onChange={update}
                onReset={reset}
                brands={BRANDS}
                storages={STORAGES}
                categories={CATEGORIES}
              />
            </div>
            <div className="border-t border-line p-4">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full rounded-full bg-navy py-3 text-sm font-semibold text-white transition hover:bg-navy-700"
              >
                Ver {results.length} {results.length === 1 ? 'resultado' : 'resultados'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return content;
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-20 text-center text-sm text-graphite/50">
          Carregando catálogo…
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
