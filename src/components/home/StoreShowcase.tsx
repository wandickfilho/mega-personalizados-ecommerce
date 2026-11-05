import Reveal from '@/components/ui/Reveal';
import { SITE } from '@/config/site';

/**
 * Vídeos reais já disponíveis no projeto, apresentados sem atribuir produtos inexistentes.
 */
export default function StoreShowcase() {
  return (
    <section className="relative overflow-hidden bg-navy py-14 text-white sm:py-20">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
              <span className="h-px w-6 bg-brand" aria-hidden />
              Conheça a loja
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Tecnologia que merece ser vista de perto.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/65">
              Uma seleção de vídeos reais já presentes no catálogo visual da {SITE.name}. Conheça a apresentação dos produtos e explore os modelos disponíveis.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="grid grid-cols-2 gap-4">
              {['iphone16.mp4', 'headphones.mp4'].map((video, index) => (
                <div key={video} className={`relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-white/5 ${index === 1 ? 'mt-6' : ''}`}>
                  <video autoPlay muted loop playsInline preload="metadata" className="h-full w-full object-cover opacity-80"><source src={`/videos/produtos/${video}`} type="video/mp4" /></video>
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
