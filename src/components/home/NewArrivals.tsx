import Link from 'next/link';
import Reveal from '@/components/ui/Reveal';
import PhoneGrid from '@/components/phones/PhoneGrid';
import { PHONES } from '@/data/phones';
import { sortModels } from '@/lib/phones';

export default function NewArrivals() {
  // Novidades = cadastros mais recentes que não estão na vitrine de destaque.
  const arrivals = sortModels(
    PHONES.filter((phone) => !phone.isFeatured),
    'recentes'
  ).slice(0, 4);

  if (arrivals.length === 0) return null;

  return (
    <section className="bg-[#f7f7fa] py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
            <div>
              <span className="section-kicker">Recém-chegados</span>
              <h2 className="section-title mt-3">O que chegou ao catálogo</h2>
            </div>
            <Link href="/celulares?ordem=recentes" className="link-ghost">
              Ver novidades
            </Link>
          </div>
        </Reveal>

        <PhoneGrid phones={arrivals} />
      </div>
    </section>
  );
}
