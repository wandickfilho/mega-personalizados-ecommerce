import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { BRANDS } from '@/data/brands';
import { PHONES } from '@/data/phones';

export const metadata: Metadata = {
  title: 'Marcas | CellShop',
  description: 'Marcas de smartphones suportadas pela CellShop.',
};

export default function BrandsPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <header className="max-w-2xl">
          <span className="section-kicker">Marcas</span>
          <h1 className="section-title mt-3">Marcas</h1>
          <p className="mt-4 text-sm leading-relaxed text-graphite/60">
            A CellShop trabalha com smartphones das principais marcas. Escolha uma marca para
            ver os modelos cadastrados no catálogo.
          </p>
        </header>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BRANDS.map((brand) => {
            const count = PHONES.filter((phone) => phone.brand === brand.id).length;
            return (
              <div
                key={brand.id}
                className="flex flex-col justify-between rounded-2xl border border-line bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-hover"
              >
                <div>
                  <h2 className="font-display text-xl font-bold tracking-tight text-navy">
                    {brand.name}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-graphite/55">{brand.tagline}</p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
                  <span className="text-xs text-graphite/50">
                    {count} {count === 1 ? 'modelo' : 'modelos'}
                  </span>
                  <Link
                    href={`/celulares?marca=${brand.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy transition hover:text-brand"
                  >
                    Ver modelos
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
