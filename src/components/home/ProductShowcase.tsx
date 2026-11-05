'use client';

import { useState } from 'react';
import Link from 'next/link';
import Reveal from '@/components/ui/Reveal';
import PhoneGrid from '@/components/phones/PhoneGrid';
import { PHONES } from '@/data/phones';
import { sortModels } from '@/lib/phones';
import { cn } from '@/lib/utils';

type Tab = 'featured' | 'arrivals';

const FEATURED = sortModels(PHONES.filter((phone) => phone.isFeatured), 'recentes').slice(0, 4);
const ARRIVALS = sortModels(PHONES.filter((phone) => phone.isNew && !phone.isDemo), 'recentes').slice(0, 4);

const TABS: Array<{ id: Tab; label: string }> = [
  { id: 'featured', label: 'Destaques' },
  { id: 'arrivals', label: 'Novidades' },
];

export default function ProductShowcase() {
  const [tab, setTab] = useState<Tab>('featured');
  const isFeatured = tab === 'featured';
  const phones = isFeatured ? FEATURED : ARRIVALS;

  return (
    <section className="bg-[var(--theme-surface)] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="section-kicker">Vitrine</span>
              <h2 className="section-title mt-3">Escolhas para começar.</h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-graphite/60">
                Compare modelos, variações e disponibilidade antes de falar com a loja.
              </p>
            </div>

            <div className="flex items-center justify-between gap-6 sm:justify-end">
              <div className="flex items-center gap-5" role="group" aria-label="Escolher vitrine">
                {TABS.map((item) => {
                  const active = tab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTab(item.id)}
                      aria-pressed={active}
                      aria-controls="product-showcase-panel"
                      className={cn(
                        'relative pb-1 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-surface)]',
                        active ? 'text-navy' : 'text-graphite/45 hover:text-navy'
                      )}
                    >
                      {item.label}
                      <span className={cn('absolute inset-x-0 -bottom-0.5 h-px transition-colors', active ? 'bg-brand' : 'bg-transparent')} />
                    </button>
                  );
                })}
              </div>

              <Link href={isFeatured ? '/celulares' : '/celulares?ordem=recentes'} className="link-ghost">
                {isFeatured ? 'Ver catálogo' : 'Ver novidades'}
              </Link>
            </div>
          </div>
        </Reveal>

        <p className="sr-only" aria-live="polite">
          Mostrando {isFeatured ? 'destaques' : 'novidades'}.
        </p>

        <div id="product-showcase-panel" className="mt-8 sm:mt-10">
          <PhoneGrid phones={phones} priorityCount={isFeatured ? 4 : 0} />
        </div>
      </div>
    </section>
  );
}
