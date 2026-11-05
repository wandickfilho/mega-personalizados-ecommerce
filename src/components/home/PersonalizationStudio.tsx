'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Palette, ShieldCheck, Sparkles, Type } from 'lucide-react';
import type { ProductMockup as MockupVariant, ProductTone } from '@/data/personalizedProducts';
import ProductMockup from '@/components/products/ProductMockup';
import { cn } from '@/lib/utils';

const STUDIO_PRODUCTS: Array<{
  id: string;
  label: string;
  variant: MockupVariant;
}> = [
  { id: 'caneca', label: 'Caneca', variant: 'mug' },
  { id: 'capinha', label: 'Capinha', variant: 'phone-case' },
  { id: 'chaveiro', label: 'Chaveiro', variant: 'keychain' },
  { id: 'bone', label: 'Boné', variant: 'cap' },
  { id: 'necessaire', label: 'Nécessaire', variant: 'pouch' },
];

const STUDIO_TONES: Array<{ id: ProductTone; label: string; swatch: string }> = [
  { id: 'navy', label: 'Azul profundo', swatch: 'bg-navy' },
  { id: 'royal', label: 'Azul royal', swatch: 'bg-royal' },
  { id: 'red', label: 'Vermelho Mega', swatch: 'bg-brand' },
  { id: 'ice', label: 'Azul gelo', swatch: 'bg-[#DCE6F7]' },
  { id: 'white', label: 'Branco', swatch: 'bg-white' },
];

const STEPS = [
  'Escolha um produto para visualizar.',
  'Teste cor e mensagem na prévia.',
  'Envie a arte final durante o atendimento.',
];

export default function PersonalizationStudio() {
  const [productId, setProductId] = useState(STUDIO_PRODUCTS[0].id);
  const [tone, setTone] = useState<ProductTone>('navy');
  const [message, setMessage] = useState('Sua marca');

  const selected =
    STUDIO_PRODUCTS.find((product) => product.id === productId) ?? STUDIO_PRODUCTS[0];

  return (
    <section
      id="personalizacao"
      className="relative scroll-mt-36 overflow-hidden bg-navy py-16 text-white sm:py-20 lg:py-24"
    >
      <div className="hero-grid absolute inset-0 opacity-60" aria-hidden />
      <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-royal/30 blur-3xl" aria-hidden />
      <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-brand/20 blur-3xl" aria-hidden />

      <div className="section-shell relative">
        <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
          <div>
            <span className="section-kicker">Personalization Studio</span>
            <h2 className="mt-4 max-w-xl font-display text-3xl font-extrabold leading-[1.04] tracking-[-0.045em] text-balance sm:text-4xl lg:text-[2.85rem]">
              Veja sua ideia <span className="text-[#FF7582]">tomar forma.</span>
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/65 sm:text-base">
              Uma prévia interativa para explorar produto, cor e mensagem antes de
              conversar com a nossa equipe. Simples, visual e sem compromisso.
            </p>

            <ul className="mt-7 space-y-3">
              {STEPS.map((step) => (
                <li key={step} className="flex items-start gap-3 text-sm text-white/70">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#FF7582]">
                    <Check className="h-3 w-3" aria-hidden />
                  </span>
                  {step}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contato"
                className="premium-action inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-[0_18px_40px_-20px_rgba(227,38,54,0.9)] transition hover:-translate-y-0.5 hover:bg-brand-dark"
              >
                Continuar no atendimento
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="#categorias"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:border-white/35 hover:bg-white/10"
              >
                Ver categorias
              </Link>
            </div>

            <p className="mt-5 flex items-start gap-2 text-[10px] leading-relaxed text-white/40">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
              Demonstração visual. Nenhum arquivo é enviado, salvo ou produzido a partir
              desta prévia.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/15 bg-white p-3 text-navy shadow-[0_40px_90px_-30px_rgba(0,0,0,0.75)] sm:p-4">
            <div className="flex items-center justify-between px-2 py-1">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy text-white">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                </span>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-navy/60">
                  Mega Studio · Prévia
                </p>
              </div>
              <span className="rounded-full bg-mist px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.16em] text-navy/45">
                Demonstração
              </span>
            </div>

            <div className="relative mt-3 flex h-[17rem] items-center justify-center overflow-hidden rounded-2xl bg-mist sm:h-[21rem]">
              <div className="pointer-events-none absolute inset-0 product-visual" />
              <div className="pointer-events-none absolute inset-0 fine-grid opacity-30" />
              <div className="absolute h-52 w-52 rounded-full border border-navy/10 sm:h-64 sm:w-64" />
              <ProductMockup
                variant={selected.variant}
                tone={tone}
                label={message || 'Sua arte'}
                className="relative h-52 w-52 drop-shadow-xl transition duration-500 sm:h-64 sm:w-64"
              />
              <span className="absolute bottom-3 left-3 rounded-full bg-white/85 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.14em] text-navy/55 shadow-sm">
                Prévia ilustrativa
              </span>
              <span className="absolute right-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.14em] text-navy/55 shadow-sm">
                {selected.label}
              </span>
            </div>

            <div className="mt-4 space-y-4 px-1 pb-1">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-navy/45">
                  Escolha o produto
                </p>
                <div className="no-scrollbar mt-2 flex gap-1.5 overflow-x-auto pb-1">
                  {STUDIO_PRODUCTS.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => setProductId(product.id)}
                      aria-pressed={product.id === selected.id}
                      className={cn(
                        'shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-bold transition',
                        product.id === selected.id
                          ? 'border-navy bg-navy text-white'
                          : 'border-line bg-surface text-graphite/55 hover:border-brand/30 hover:text-navy'
                      )}
                    >
                      {product.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-[1fr_1.1fr]">
                <div>
                  <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-navy/45">
                    <Palette className="h-3 w-3" aria-hidden />
                    Cor de referência
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    {STUDIO_TONES.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setTone(item.id)}
                        aria-pressed={tone === item.id}
                        aria-label={item.label}
                        title={item.label}
                        className={cn(
                          'h-7 w-7 rounded-full border border-navy/10 transition',
                          item.swatch,
                          tone === item.id
                            ? 'ring-2 ring-brand ring-offset-2'
                            : 'hover:scale-110'
                        )}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="studio-message"
                    className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-navy/45"
                  >
                    <Type className="h-3 w-3" aria-hidden />
                    Sua mensagem
                  </label>
                  <input
                    id="studio-message"
                    type="text"
                    maxLength={14}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Sua marca"
                    className="mt-2 w-full rounded-xl border border-line bg-mist/60 px-3 py-2 text-xs font-semibold text-navy outline-none transition placeholder:text-navy/30 focus:border-royal focus:bg-surface"
                  />
                </div>
              </div>

              <p className="rounded-xl bg-mist/70 px-3 py-2 text-[9px] leading-relaxed text-graphite/50">
                A prévia não representa proporções, cores ou acabamento final. A arte,
                o material e a viabilidade são confirmados no atendimento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
