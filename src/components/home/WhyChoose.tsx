import { LayoutGrid, MessageCircle, Tags } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

const REASONS = [
  {
    icon: LayoutGrid,
    title: 'Catálogo organizado',
    description:
      'Aparelhos agrupados por modelo e marca, com armazenamento, cores e condição reunidos em um só lugar.',
  },
  {
    icon: Tags,
    title: 'Informação clara',
    description:
      'Preço, condição e disponibilidade aparecem direto nos cards e na página de cada aparelho.',
  },
  {
    icon: MessageCircle,
    title: 'Atendimento pelo WhatsApp',
    description:
      'Tire dúvidas e combine os detalhes diretamente com a CellShop pelo WhatsApp.',
  },
];

export default function WhyChoose() {
  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="section-kicker justify-center">Vantagens</span>
            <h2 className="section-title mt-3">Por que escolher a CellShop?</h2>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {REASONS.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <Reveal key={reason.title} delay={index * 80}>
                <div className="flex h-full flex-col rounded-2xl border border-line bg-[#fafafd] p-6 transition duration-300 hover:-translate-y-1 hover:border-navy/15 hover:bg-white hover:shadow-premium">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-white shadow-soft">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold text-navy">{reason.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-graphite/60">
                    {reason.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
