import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import { BRANDS } from '@/data/brands';
import { PHONES } from '@/data/phones';

export default function BrandSection() {
  // Exibe apenas marcas que possuem modelos cadastrados no catálogo.
  const brandsWithModels = BRANDS.filter((brand) =>
    PHONES.some((phone) => phone.brand === brand.id)
  );

  if (brandsWithModels.length === 0) return null;

  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
          <div>
            <span className="section-kicker">Navegue por marca</span>
            <h2 className="section-title mt-3">Encontre seu ecossistema</h2>
          </div>
          <Link href="/marcas" className="link-ghost">
            Ver todas as marcas
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-4">
          {brandsWithModels.map((brand, index) => (
            <Reveal key={brand.id} delay={index * 60}>
              <Link
                href={`/celulares?marca=${brand.id}`}
                className="group flex h-full min-h-[165px] flex-col justify-between rounded-2xl border border-line bg-[#fafafd] p-5 transition duration-300 hover:-translate-y-1 hover:border-navy/15 hover:bg-white hover:shadow-premium sm:p-6"
              >
                <div className="flex items-start justify-between">
                  <span className="font-display text-lg font-bold tracking-tight text-navy sm:text-xl">
                    {brand.name}
                  </span>
                  <ArrowUpRight
                    className="h-5 w-5 text-graphite/30 transition group-hover:text-brand"
                    aria-hidden
                  />
                </div>
                <p className="mt-6 text-xs leading-relaxed text-graphite/55">{brand.tagline}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
