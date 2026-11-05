'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Eye,
  Layers,
  SlidersHorizontal,
  Wand2,
  X,
} from 'lucide-react';
import { CATEGORIES, getCategory, type CategoryId } from '@/config/categories';
import {
  PERSONALIZED_PRODUCTS,
  type PersonalizedProduct,
  type ProductTone,
} from '@/data/personalizedProducts';
import ProductMockup from '@/components/products/ProductMockup';
import Reveal from '@/components/ui/Reveal';

const TONE_STYLES: Record<
  ProductTone,
  { panel: string; muted: string; badge: string; frame: string }
> = {
  navy: {
    panel: 'bg-navy text-white',
    muted: 'text-white/50',
    badge: 'bg-white/10 text-white/70',
    frame: 'ring-white/10',
  },
  royal: {
    panel: 'bg-royal text-white',
    muted: 'text-white/55',
    badge: 'bg-white/10 text-white/75',
    frame: 'ring-white/10',
  },
  red: {
    panel: 'bg-brand text-white',
    muted: 'text-white/65',
    badge: 'bg-white/15 text-white/85',
    frame: 'ring-white/10',
  },
  ice: {
    panel: 'bg-[#DCE6F7] text-navy',
    muted: 'text-navy/50',
    badge: 'bg-white/70 text-navy/65',
    frame: 'ring-navy/5',
  },
  white: {
    panel: 'bg-white text-navy',
    muted: 'text-navy/45',
    badge: 'bg-mist text-navy/60',
    frame: 'ring-line',
  },
};

interface PersonalizedShowcaseProps {
  initialCategory?: CategoryId;
}

export default function PersonalizedShowcase({ initialCategory }: PersonalizedShowcaseProps) {
  const [active, setActive] = useState<CategoryId | null>(initialCategory ?? null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [preview, setPreview] = useState<PersonalizedProduct | null>(null);

  const activeCategory = active ? getCategory(active) : undefined;
  const products = active
    ? PERSONALIZED_PRODUCTS.filter((product) => product.category === active)
    : PERSONALIZED_PRODUCTS;

  useEffect(() => {
    if (!isFiltering) return;
    const timer = window.setTimeout(() => setIsFiltering(false), 280);
    return () => window.clearTimeout(timer);
  }, [isFiltering]);

  function updateFilter(category: CategoryId | null) {
    setIsFiltering(true);
    setActive(category);
    if (typeof window === 'undefined') return;
    const nextUrl = category
      ? `${window.location.pathname}?categoria=${category}#vitrine`
      : `${window.location.pathname}#vitrine`;
    window.history.replaceState(null, '', nextUrl);
  }

  return (
    <section id="vitrine" className="product-reference-section scroll-mt-36 bg-mist/50 py-14 sm:py-16">
      <div className="section-shell">
        <Reveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="section-kicker">Destaques da Mega</span>
              <h2 className="section-title mt-4">
                Destaques da <span className="text-brand">Mega</span>
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-graphite/60 sm:text-base">
                Uma seleção visual de possibilidades. Os itens abaixo são demonstrações
                de composição — cada projeto é desenvolvido sob medida, sem preços fixos.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-line bg-surface px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-graphite/50 lg:self-auto">
              <Layers className="h-3.5 w-3.5 text-brand" aria-hidden />
              Dados demonstrativos
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-8">
          <div className="flex items-center gap-2">
            <span className="hidden shrink-0 items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-graphite/40 sm:inline-flex">
              <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
              Filtrar
            </span>
            <div className="no-scrollbar -mx-1 flex flex-1 gap-1.5 overflow-x-auto px-1 py-1">
              <FilterChip active={active === null} onClick={() => updateFilter(null)}>
                Todos
              </FilterChip>
              {CATEGORIES.map((category) => (
                <FilterChip
                  key={category.id}
                  active={active === category.id}
                  onClick={() => updateFilter(category.id)}
                >
                  {category.shortName}
                </FilterChip>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-6 flex items-end justify-between gap-4">
          <p className="text-xs text-graphite/45" aria-live="polite">
            {activeCategory ? (
              <>
                Exibindo <span className="font-bold text-navy">{activeCategory.shortName}</span>
              </>
            ) : (
              <>
                <span className="font-bold text-navy">{PERSONALIZED_PRODUCTS.length}</span>{' '}
                exemplos de composição
              </>
            )}
          </p>
          {active && (
            <button
              type="button"
              onClick={() => updateFilter(null)}
              className="text-[11px] font-bold text-brand transition hover:text-brand-dark"
            >
              Limpar filtro
            </button>
          )}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {isFiltering &&
            Array.from({ length: 6 }).map((_, index) => (
              <ProductCardSkeleton key={`skeleton-${index}`} />
            ))}

          {!isFiltering &&
            products.map((product, index) => {
              const category = getCategory(product.category);
              const tone = TONE_STYLES[product.tone];
              return (
                <Reveal key={product.id} delay={index * 40} className="h-full">
                  <article className="product-reference-card group flex h-full flex-col overflow-hidden border border-line bg-surface transition duration-500">
                    <div
                      className={`product-reference-media relative flex h-52 items-center justify-center overflow-hidden p-6 ring-1 ring-inset sm:h-56 ${tone.panel} ${tone.frame}`}
                    >
                      <div className="pointer-events-none absolute inset-0 product-visual" />
                      <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full border border-current opacity-[0.08]" />
                      <div className="pointer-events-none absolute -bottom-12 -right-8 h-44 w-44 rounded-full border border-current opacity-[0.08]" />
                      <span
                        className={`absolute left-4 top-4 rounded-full px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.16em] ${tone.badge}`}
                      >
                        Demonstração
                      </span>
                      <span className={`absolute right-4 top-4 text-[9px] font-bold tracking-[0.16em] ${tone.muted}`}>
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      <ProductMockup
                        variant={product.mockup}
                        tone={product.tone}
                        label={product.name}
                        className="relative h-36 w-36 drop-shadow-lg transition duration-500 group-hover:scale-110 sm:h-40 sm:w-40"
                      />

                      <span
                        className={`absolute bottom-4 right-4 rounded-full px-3 py-1 text-[9px] font-bold ${tone.badge}`}
                      >
                        {product.technique}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-brand">
                        {category?.shortName ?? 'Personalizados'}
                      </p>
                      <h3 className="mt-1.5 font-display text-lg font-extrabold tracking-[-0.03em] text-navy">
                        {product.name}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-graphite/55">
                        {product.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {product.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-mist px-2.5 py-1 text-[9px] font-bold text-graphite/55"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4">
                        <button
                          type="button"
                          onClick={() => setPreview(product)}
                          aria-label={`Visualizar ${product.name}`}
                          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-navy transition hover:text-brand"
                        >
                          <Eye className="h-3.5 w-3.5" aria-hidden />
                          Visualizar
                        </button>
                        <Link
                          href={`/personalizados/${product.slug}`}
                          aria-label={`Personalizar ${product.name}`}
                           className="inline-flex items-center gap-1.5 bg-brand px-3 py-2 text-[10px] font-bold text-white transition hover:bg-brand-dark"
                        >
                          Personalizar
                          <Wand2 className="h-3 w-3" aria-hidden />
                        </Link>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}

          {!isFiltering && products.length === 0 && (
            <div className="md:col-span-2 xl:col-span-3">
              <div className="flex min-h-[18rem] flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-surface px-6 py-12 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mist text-navy">
                  <Layers className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-display text-lg font-extrabold text-navy">
                  Nenhum exemplo nesta categoria.
                </h3>
                <p className="mt-2 max-w-sm text-xs leading-relaxed text-graphite/55">
                  A vitrine é demonstrativa. Fale com a gente para desenvolver uma
                  composição sob medida para este tipo de produto.
                </p>
                <Link
                  href="/contato"
                  className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-brand"
                >
                  Falar sobre meu projeto
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </div>
            </div>
          )}
        </div>

        <Reveal className="mt-8">
          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-line bg-surface p-5 sm:flex-row sm:items-center sm:p-6">
            <div>
              <p className="font-display text-base font-extrabold text-navy">
                Não encontrou o que procura?
              </p>
              <p className="mt-1 text-xs leading-relaxed text-graphite/55">
                Trabalhamos com projetos personalizados para presentes, eventos e empresas.
              </p>
            </div>
            <Link
              href="/contato"
              className="premium-action inline-flex shrink-0 items-center gap-2 rounded-full bg-brand px-5 py-3 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-brand-dark"
            >
              Falar sobre meu projeto
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </Reveal>
      </div>

      {preview && <ProductPreviewModal product={preview} onClose={() => setPreview(null)} />}
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full border px-3.5 py-2 text-[10px] font-bold transition sm:text-[11px] ${
        active
          ? 'border-navy bg-navy text-white shadow-soft'
          : 'border-line bg-surface text-graphite/55 hover:border-brand/30 hover:text-navy'
      }`}
    >
      {children}
    </button>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="h-52 bg-mist sm:h-56" />
      <div className="space-y-3 p-5">
        <div className="h-2 w-20 rounded-full bg-mist" />
        <div className="h-4 w-2/3 rounded-full bg-mist" />
        <div className="h-2 w-full rounded-full bg-mist" />
        <div className="h-2 w-4/5 rounded-full bg-mist" />
        <div className="mt-6 flex justify-between border-t border-line pt-4">
          <div className="h-3 w-20 rounded-full bg-mist" />
          <div className="h-7 w-24 rounded-full bg-mist" />
        </div>
      </div>
    </div>
  );
}

function ProductPreviewModal({
  product,
  onClose,
}: {
  product: PersonalizedProduct;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const category = getCategory(product.category);
  const tone = TONE_STYLES[product.tone];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-navy/75 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-title"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-surface shadow-2xl sm:rounded-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Fechar prévia do produto"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-navy shadow-soft transition hover:bg-mist"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>

        <div className="grid gap-0 sm:grid-cols-[0.92fr_1.08fr]">
          <div
            className={`relative flex min-h-[15rem] items-center justify-center overflow-hidden p-6 ring-1 ring-inset sm:min-h-full ${tone.panel} ${tone.frame}`}
          >
            <div className="pointer-events-none absolute inset-0 product-visual" />
            <ProductMockup
              variant={product.mockup}
              tone={product.tone}
              label={product.name}
              className="relative h-48 w-48 drop-shadow-xl sm:h-56 sm:w-56"
            />
            <span
              className={`absolute left-4 top-4 rounded-full px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.16em] ${tone.badge}`}
            >
              Prévia demonstrativa
            </span>
          </div>

          <div className="p-5 sm:p-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand">
              {category?.shortName ?? 'Personalizados'}
            </p>
            <h3
              id="preview-title"
              className="mt-2 font-display text-2xl font-extrabold tracking-[-0.04em] text-navy"
            >
              {product.name}
            </h3>
            <p className="mt-1 text-[11px] font-semibold text-graphite/45">
              Técnica: {product.technique}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-graphite/60">
              {product.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-mist px-2.5 py-1 text-[9px] font-bold text-graphite/55"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-line bg-mist/60 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-navy/60">
                Importante
              </p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-graphite/55">
                Esta é uma composição ilustrativa. Cores, proporções, materiais e
                resultado final são definidos no atendimento. Nenhum arquivo é enviado
                ou salvo nesta prévia.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Link
                href="#personalizacao"
                onClick={onClose}
                className="premium-action inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-brand-dark"
              >
                Abrir no Studio
                <Wand2 className="h-3.5 w-3.5" aria-hidden />
              </Link>
              <Link
                href="/contato"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-line px-5 py-3 text-xs font-bold text-navy transition hover:border-brand/30 hover:text-brand"
              >
                Falar sobre este projeto
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
