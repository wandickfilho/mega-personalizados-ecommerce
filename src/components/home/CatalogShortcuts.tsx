import Link from 'next/link';
import { ArrowUpRight, BadgeCheck, Layers3, Smartphone } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

const SHORTCUTS = [
  { title: 'Celulares', href: '/celulares', icon: Smartphone, video: 'iphone16.mp4' },
  { title: 'Lacrados', href: '/celulares?condicao=novo', icon: BadgeCheck, video: 'iphone17_pro.mp4' },
  { title: 'Seminovos', href: '/celulares?condicao=seminovo', icon: Layers3, video: 'iphone12.mp4' },
  { title: 'Xiaomi', href: '/celulares?marca=xiaomi', icon: Smartphone, video: 'redmi_17.mp4' },
];

export default function CatalogShortcuts() {
  return (
    <section className="bg-[#fbfaff] pb-14 pt-7 sm:pb-20 sm:pt-9">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex snap-x gap-3 overflow-x-auto pb-3 no-scrollbar sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible">
          {SHORTCUTS.map(({ title, href, icon: Icon, video }, index) => (
            <Reveal key={title} delay={index * 70}>
              <Link href={href} className="group relative flex h-[154px] w-[154px] shrink-0 snap-start overflow-hidden rounded-2xl border border-line/80 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:border-brand/25 hover:shadow-premium sm:h-[178px] sm:w-auto">
                <video autoPlay muted loop playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-500 group-hover:scale-110 group-hover:opacity-95"><source src={`/videos/produtos/${video}`} type="video/mp4" /></video>
                <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/15 to-transparent" />
                <div className="relative flex w-full flex-col justify-between p-4"><span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 text-navy shadow-soft"><Icon className="h-4 w-4" /></span><span className="flex items-end justify-between gap-2"><span className="font-display text-base font-bold text-white">{title}</span><ArrowUpRight className="h-4 w-4 text-white/75 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span></div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
