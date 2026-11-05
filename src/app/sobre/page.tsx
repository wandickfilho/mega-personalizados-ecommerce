import Link from 'next/link';
import type { Metadata } from 'next';
import { Compass, HeartHandshake, LayoutGrid, ShieldCheck } from 'lucide-react';
import BrandLogo from '@/components/layout/BrandLogo';
import ContactCTA from '@/components/home/ContactCTA';
import StoreShowcase from '@/components/home/StoreShowcase';
import { SITE } from '@/config/site';

export const metadata: Metadata = {
  title: `Sobre nós | ${SITE.name}`,
  description:
    'Conheça a proposta da CellShop: um catálogo digital de smartphones com atendimento pelo WhatsApp.',
};

const PILLARS = [
  {
    icon: LayoutGrid,
    title: 'Catálogo digital',
    description:
      'Um site pensado para apresentar aparelhos com clareza, organizados por modelo, marca e variações.',
  },
  {
    icon: Compass,
    title: 'Informação organizada',
    description:
      'Armazenamento, cores, condição, preço e disponibilidade reunidos em um só lugar.',
  },
  {
    icon: HeartHandshake,
    title: 'Atendimento próximo',
    description:
      'O contato acontece de forma direta pelo WhatsApp, para orientar e combinar os detalhes.',
  },
  {
    icon: ShieldCheck,
    title: 'Transparência',
    description:
      'Aparelhos indisponíveis continuam visíveis e identificados. Nada é apresentado como disponível sem ser.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <header className="text-center">
          <BrandLogo size="lg" tone="dark" withWordmark={false} className="mx-auto" />
          <span className="section-kicker mt-6 justify-center">Sobre nós</span>
          <h1 className="section-title mt-3">Tecnologia que acompanha você.</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-graphite/60">
            A {SITE.name} é uma loja de smartphones e tecnologia. Este site funciona como um
            catálogo digital: você conhece os aparelhos disponíveis e fala diretamente com a loja
            pelo WhatsApp.
          </p>
        </header>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="rounded-2xl border border-line bg-white p-6 shadow-soft"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-mist text-navy">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h2 className="mt-4 font-display text-lg font-bold text-navy">{pillar.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-graphite/60">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 rounded-2xl border border-line bg-mist/60 p-6 text-center sm:p-8">
          <h2 className="font-display text-xl font-bold text-navy">
            Quer conhecer os aparelhos?
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-graphite/60">
            Navegue pelo catálogo completo e fale com a loja quando encontrar o que procura.
          </p>
          <Link
            href="/celulares"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-navy-700"
          >
            Ver catálogo
          </Link>
        </div>
      </div>

      <StoreShowcase />
      <ContactCTA />
    </div>
  );
}
