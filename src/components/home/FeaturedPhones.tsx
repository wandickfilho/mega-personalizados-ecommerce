import Link from 'next/link';
import Reveal from '@/components/ui/Reveal';
import PhoneGrid from '@/components/phones/PhoneGrid';
import { PHONES } from '@/data/phones';
import { sortModels } from '@/lib/phones';

export default function FeaturedPhones() {
  const featured = sortModels(
    PHONES.filter((phone) => phone.isFeatured),
    'recentes'
  ).slice(0, 4);

  if (featured.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-white py-14 sm:py-20">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_50%_-20%,rgba(120,69,255,0.14),transparent_68%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
            <div>
              <span className="section-kicker">Seleção em destaque</span>
              <h2 className="section-title mt-3">Modelos para começar a comparar</h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-graphite/60">Seleção de aparelhos cadastrados para você consultar preços, variações e disponibilidade.</p>
            </div>
            <Link href="/celulares" className="link-ghost">
              Ver catálogo completo
            </Link>
          </div>
        </Reveal>

        <PhoneGrid phones={featured} priorityCount={4} />
      </div>
    </section>
  );
}
