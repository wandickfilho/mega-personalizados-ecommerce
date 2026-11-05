import Link from 'next/link';
import { ArrowDownRight, ArrowRight, BadgeCheck, Search, ShieldCheck } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white py-4 sm:py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden rounded-[1.75rem] border border-[#e9e2f7] bg-[#f8f5ff] px-6 py-11 shadow-premium sm:rounded-[2.25rem] sm:px-10 sm:py-16 lg:grid lg:min-h-[560px] lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-12 lg:px-16 lg:py-16">
          <div aria-hidden className="absolute -left-28 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-brand/15 blur-3xl" />
          <div aria-hidden className="absolute -right-24 -top-32 h-[34rem] w-[34rem] rounded-full border-[54px] border-brand/[0.07]" />
          <div aria-hidden className="absolute bottom-0 right-[28%] h-full w-1/3 bg-white/45 [clip-path:polygon(55%_0,100%_0,45%_100%,0_100%)]" />

          <div className="relative z-10">
            <span className="eyebrow animate-hero-enter text-brand">Tecnologia, do seu jeito</span>
            <h2 className="animate-hero-enter-delay mt-5 max-w-xl font-display text-[clamp(2.55rem,5vw,4.65rem)] font-bold leading-[0.98] tracking-[-0.06em] text-navy text-balance">
              Mais que um celular. <span className="text-brand">Uma escolha.</span>
            </h2>
            <p className="animate-hero-enter-delay mt-6 max-w-md text-[15px] leading-relaxed text-graphite/65 sm:text-base">
              Modelos organizados por marca, condição e armazenamento para você comparar com clareza antes de falar com a loja.
            </p>

            <div className="animate-hero-enter-delay mt-8 flex flex-wrap gap-3">
              <Link href="/celulares" className="premium-action inline-flex items-center gap-2 rounded-full bg-navy px-5 py-3 text-sm font-bold text-white shadow-float transition hover:-translate-y-0.5 hover:shadow-hover active:translate-y-0">
                Explorar catálogo <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href="/celulares?ordem=recentes" className="premium-action inline-flex items-center gap-2 rounded-full border border-brand/20 bg-white/70 px-5 py-3 text-sm font-semibold text-navy transition hover:-translate-y-0.5 hover:border-brand/40 hover:bg-white">
                Ver novidades <ArrowDownRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>

            <div className="mt-10 grid max-w-md grid-cols-2 gap-3 border-t border-brand/10 pt-5 text-xs text-graphite/60">
              <span className="inline-flex items-start gap-2"><BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand" />Modelos e variações reunidos</span>
              <span className="inline-flex items-start gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand" />Preços e disponibilidade claros</span>
            </div>
          </div>

          <div className="relative z-10 mt-10 lg:mt-0">
            <div className="animate-orbit relative mx-auto aspect-[0.82/1] max-w-[360px] overflow-hidden rounded-[2.25rem] border-[7px] border-white bg-navy shadow-[0_35px_65px_-24px_rgba(75,35,145,0.55)] sm:rounded-[2.75rem]">
              <video autoPlay muted loop playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover opacity-90" aria-label="Vídeo de produto CellShop">
                <source src="/videos/produtos/iphone17_pro.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-navy/10" />
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-5 sm:p-6">
                <div><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/55">CellShop</p><p className="mt-1 font-display text-lg font-bold tracking-tight sm:text-xl">Tecnologia em movimento</p></div>
                <Link href="/celulares" aria-label="Buscar no catálogo" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-navy transition hover:scale-105"><Search className="h-4 w-4" /></Link>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-2 hidden rounded-2xl border border-brand/10 bg-white/90 px-4 py-3 shadow-soft backdrop-blur-md sm:block lg:-left-8">
              <span className="block text-[10px] font-bold uppercase tracking-[0.15em] text-graphite/45">Catálogo digital</span>
              <span className="mt-1 block text-xs font-semibold text-navy">Escolha no seu ritmo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
