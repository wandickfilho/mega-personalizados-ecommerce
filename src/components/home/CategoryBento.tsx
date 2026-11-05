import Link from 'next/link';
import { ArrowUpRight, BadgeCheck, Layers3, Sparkles, Smartphone } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

const categories = [
  {
    title: 'Celulares',
    text: 'Compare toda a seleção da CellShop.',
    href: '/celulares',
    icon: Smartphone,
    video: '/videos/produtos/iphone17_pro.mp4',
    className: 'sm:col-span-2 lg:col-span-2 lg:row-span-2 min-h-[360px]',
    tone: 'from-[#050510]/90 via-[#151032]/35 to-transparent',
  },
  {
    title: 'Lacrados',
    text: 'Modelos novos para conhecer.',
    href: '/celulares?condicao=novo',
    icon: BadgeCheck,
    video: '/videos/produtos/iphone16.mp4',
    className: 'min-h-[175px]',
    tone: 'from-[#080614]/90 via-[#1b1445]/35 to-transparent',
  },
  {
    title: 'Seminovos',
    text: 'Opções com curadoria.',
    href: '/celulares?condicao=seminovo',
    icon: Layers3,
    video: '/videos/produtos/iphone12.mp4',
    className: 'min-h-[175px]',
    tone: 'from-[#080614]/90 via-[#261338]/35 to-transparent',
  },
  {
    title: 'Xiaomi',
    text: 'Tecnologia para explorar.',
    href: '/celulares?marca=xiaomi',
    icon: Sparkles,
    video: '/videos/produtos/redmi_17.mp4',
    className: 'sm:col-span-2 min-h-[190px]',
    tone: 'from-[#050510]/90 via-[#10122b]/35 to-transparent',
  },
];

export default function CategoryBento() {
  return (
    <section className="bg-[var(--theme-canvas)] py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-8 max-w-2xl sm:mb-10">
            <span className="section-kicker">Explore por coleção</span>
            <h2 className="section-title mt-3">Uma vitrine criada para descobrir.</h2>
            <p className="mt-3 text-sm leading-relaxed text-graphite/65">Navegue pelas coleções disponíveis e encontre a tecnologia que combina com sua rotina.</p>
          </div>
        </Reveal>
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:grid-rows-2">
          {categories.map(({ title, text, href, icon: Icon, video, className, tone }, index) => (
            <Reveal key={title} delay={index * 80} className={className}>
              <Link href={href} className="bento-card group relative flex h-full overflow-hidden rounded-[1.6rem] border border-white/15 bg-[#10122b] p-5 text-white shadow-float transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050510] sm:p-6">
                <video autoPlay muted loop playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover opacity-60 transition duration-700 group-hover:scale-105 group-hover:opacity-70">
                  <source src={video} type="video/mp4" />
                </video>
                <div className={`absolute inset-0 bg-gradient-to-t ${tone}`} />
                <div className="relative flex w-full flex-col justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md"><Icon className="h-4 w-4" /></span>
                  <span className="flex items-end justify-between gap-4">
                    <span><span className="block font-display text-xl font-bold tracking-tight sm:text-2xl">{title}</span><span className="mt-1 block text-xs text-white/75">{text}</span></span>
                    <ArrowUpRight className="h-5 w-5 shrink-0 transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
