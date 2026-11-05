import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Building2, HeartHandshake, Layers3, Palette, ScanLine, Sparkles } from 'lucide-react';
import BrandLogo from '@/components/layout/BrandLogo';
import ContactCTA from '@/components/home/ContactCTA';
import { SITE } from '@/config/site';

export const metadata: Metadata = {
  title: 'Sobre nós',
  description:
    'Conheça a Mega Eletrônicos & Personalizados: projetos sob medida em Sousa-PB, com atenção à identidade, ao acabamento e ao cuidado em cada etapa.',
};

const PILLARS = [
  {
    icon: HeartHandshake,
    title: 'Escuta antes da produção',
    description:
      'Cada projeto começa entendendo o objetivo, o público e a mensagem que precisa ser transmitida.',
  },
  {
    icon: Layers3,
    title: 'Técnicas complementares',
    description:
      'Impressão DTF, gravação a laser e impressão flatbed para diferentes materiais e superfícies.',
  },
  {
    icon: Palette,
    title: 'Identidade com coerência',
    description:
      'A arte, as cores e o acabamento são pensados para representar bem a sua marca ou o seu presente.',
  },
  {
    icon: Building2,
    title: 'Do pessoal ao corporativo',
    description:
      'Presentes únicos, lembranças de eventos, kits para equipes e brindes para clientes.',
  },
];

const TECHNIQUES = ['Impressão DTF', 'Gravação a laser', 'Impressão flatbed'];

export default function AboutPage() {
  return (
    <div className="bg-canvas">
      <div className="section-shell py-12 sm:py-16 lg:py-20">
        <header className="mx-auto max-w-3xl text-center">
          <BrandLogo size="lg" tone="dark" withWordmark={false} className="mx-auto" />
          <span className="section-kicker mt-6 justify-center">Sobre a Mega</span>
          <h1 className="section-title mt-4">
            Personalização com <span className="text-brand">intenção.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-graphite/60 sm:text-base">
            A {SITE.name} nasce para transformar ideias em objetos que representam pessoas,
            marcas e momentos. Um projeto local, em Sousa-PB, com olhar atento para o detalhe
            e para o significado de cada peça.
          </p>
        </header>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {TECHNIQUES.map((technique) => (
            <span
              key={technique}
              className="rounded-full border border-line bg-surface px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-graphite/55 shadow-soft"
            >
              {technique}
            </span>
          ))}
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {PILLARS.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <article
                key={pillar.title}
                className="group rounded-2xl border border-line bg-surface p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-brand/20 hover:shadow-hover"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-mist text-navy transition group-hover:bg-brand group-hover:text-white">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="font-display text-[10px] font-extrabold tracking-[0.14em] text-graphite/20">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h2 className="mt-5 font-display text-lg font-extrabold tracking-[-0.03em] text-navy">
                  {pillar.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-graphite/55">{pillar.description}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative overflow-hidden rounded-2xl bg-navy p-6 text-white sm:p-8">
            <div className="corporate-grid absolute inset-0 opacity-50" aria-hidden />
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand/20 blur-2xl" aria-hidden />
            <div className="relative">
              <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">
                <Sparkles className="h-3.5 w-3.5 text-[#ff6b78]" aria-hidden />
                Nosso jeito de trabalhar
              </span>
              <p className="mt-4 max-w-xl font-display text-xl font-extrabold leading-tight tracking-[-0.03em] sm:text-2xl">
                “Um personalizado só faz sentido quando representa algo para quem recebe.”
              </p>
              <p className="mt-4 max-w-lg text-xs leading-relaxed text-white/50">
                Por isso, cada projeto passa por conversa, alinhamento visual e aprovação antes
                de seguir para a produção.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-6 shadow-soft sm:p-8">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white">
              <ScanLine className="h-5 w-5" aria-hidden />
            </span>
            <h2 className="mt-4 font-display text-lg font-extrabold tracking-[-0.03em] text-navy">
              Quer conhecer as possibilidades?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-graphite/55">
              Explore as categorias e veja exemplos de composição para começar a imaginar o seu
              projeto.
            </p>
            <Link
              href="/#categorias"
              className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-brand transition hover:text-brand-dark"
            >
              Ver categorias
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </div>

      <ContactCTA />
    </div>
  );
}
