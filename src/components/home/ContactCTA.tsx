import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

export default function ContactCTA() {
  return (
    <section className="contact-cta-section py-14 sm:py-20">
      <div className="section-shell">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-royal px-6 py-12 text-white shadow-premium sm:px-10 sm:py-14 lg:px-14">
            <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border border-white/15" aria-hidden />
            <div className="pointer-events-none absolute -bottom-24 -left-12 h-64 w-64 rounded-full bg-brand/25 blur-2xl" aria-hidden />
            <div className="corporate-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden />

            <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/80">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  Seu projeto começa aqui
                </span>
                <h2 className="mt-5 font-display text-3xl font-extrabold leading-[1.02] tracking-[-0.045em] text-balance sm:text-4xl lg:text-[3.1rem]">
                  Vamos criar algo com a sua cara?
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
                  Conte a sua ideia para presente, evento ou empresa. A Mega ajuda a
                  encontrar a melhor forma de transformar isso em um personalizado de verdade.
                </p>
              </div>

              <div className="flex w-full shrink-0 flex-col gap-2.5 sm:w-auto sm:flex-row lg:flex-col lg:items-stretch">
                <Link
                  href="/contato"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-navy shadow-soft transition hover:-translate-y-0.5 hover:bg-mist"
                >
                  Solicitar orçamento
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link
                  href="/#categorias"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-bold text-white transition hover:border-white/50 hover:bg-white/10"
                >
                  Explorar categorias
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </Link>
                <p className="mt-1 text-center text-[10px] font-semibold text-white/55 lg:text-left">
                  Atendimento em Sousa-PB e região
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
