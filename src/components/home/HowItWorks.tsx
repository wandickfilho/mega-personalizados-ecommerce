import Link from 'next/link';
import { ArrowRight, MousePointerClick, PackageCheck, Wand2 } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

const STEPS = [
  {
    number: '01',
    title: 'Escolha',
    description:
      'Explore as categorias e encontre o produto que combina com a sua ideia, presente ou projeto.',
    icon: MousePointerClick,
    style: 'border-line bg-surface text-navy',
    muted: 'text-graphite/55',
    iconStyle: 'bg-navy text-white',
  },
  {
    number: '02',
    title: 'Personalize',
    description:
      'Defina arte, cor, mensagem e acabamento com a nossa orientação. A aprovação acontece antes da produção.',
    icon: Wand2,
    style: 'border-white/10 bg-royal text-white',
    muted: 'text-white/65',
    iconStyle: 'bg-white text-royal',
  },
  {
    number: '03',
    title: 'Receba',
    description:
      'Produzimos a peça com cuidado e combinamos a melhor forma de entrega para você.',
    icon: PackageCheck,
    style: 'border-line bg-mist text-navy',
    muted: 'text-graphite/55',
    iconStyle: 'bg-brand text-white',
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="scroll-mt-36 py-16 sm:py-20 lg:py-24">
      <div className="section-shell">
        <Reveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <span className="section-kicker">Como funciona</span>
              <h2 className="section-title mt-4">
                Três passos. Uma peça <span className="text-brand">só sua.</span>
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-graphite/60 sm:text-base">
                Um processo próximo, direto e sem complicação. Você participa das
                decisões importantes e aprova a arte antes de produzirmos.
              </p>
            </div>
            <Link
              href="/contato"
              className="group inline-flex shrink-0 items-center gap-2 text-xs font-bold text-navy transition hover:text-brand"
            >
              Começar meu projeto
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" aria-hidden />
            </Link>
          </div>
        </Reveal>

        <div className="relative mt-10 sm:mt-14">
          <div
            className="absolute left-[16.66%] right-[16.66%] top-10 hidden h-px bg-gradient-to-r from-line via-royal/30 to-line md:block"
            aria-hidden
          />
          <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <Reveal key={step.number} delay={index * 80} className="h-full">
                  <article
                    className={`group relative flex h-full flex-col rounded-2xl border p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-hover sm:p-7 ${step.style}`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`relative z-10 inline-flex h-12 w-12 items-center justify-center rounded-full shadow-soft transition group-hover:scale-105 ${step.iconStyle}`}
                      >
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <span className="font-display text-3xl font-extrabold tracking-[-0.05em] opacity-15">
                        {step.number}
                      </span>
                    </div>
                    <h3 className="mt-6 font-display text-xl font-extrabold uppercase tracking-[-0.02em]">
                      {step.title}
                    </h3>
                    <p className={`mt-3 text-xs leading-relaxed ${step.muted}`}>
                      {step.description}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>

        <Reveal className="mt-8">
          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-line bg-surface px-5 py-5 sm:flex-row sm:items-center sm:px-7">
            <div>
              <p className="font-display text-base font-extrabold text-navy">
                Tem uma ideia, mas ainda não sabe por onde começar?
              </p>
              <p className="mt-1 text-xs text-graphite/55">
                A gente ajuda a transformar a sua referência em um projeto possível.
              </p>
            </div>
            <Link
              href="/contato"
              className="premium-action inline-flex shrink-0 items-center gap-2 rounded-full bg-brand px-5 py-3 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-brand-dark"
            >
              Conversar com a Mega
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
