'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';

const SLIDES = [
  {
    src: '/videos/heroCarrossel/iphoneCarrossel.webp',
    poster: '/videos/heroCarrossel/iphoneCarrossel-poster.webp',
    alt: 'iPhone em destaque na CellShop',
    eyebrow: 'CellShop · curadoria em tecnologia',
    title: ['O próximo nível', 'está nas suas mãos.'],
    description:
      'Smartphones selecionados, com procedência, condições claras e atendimento próximo.',
    duration: 12500,
    fit: 'cover',
    width: 1100,
    height: 619,
  },
  {
    src: '/videos/heroCarrossel/iphone17carrossel.webp',
    poster: '/videos/heroCarrossel/iphone17carrossel-poster.webp',
    alt: 'Smartphone em destaque na CellShop',
    eyebrow: 'Design e performance',
    title: ['Tecnologia que', 'acompanha o seu ritmo.'],
    description:
      'Conheça a seleção da CellShop e encontre o aparelho certo para a sua rotina.',
    duration: 6500,
    fit: 'contain',
    width: 1100,
    height: 696,
  },
] as const;

export default function CinematicHero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const slide = SLIDES[active];
  const isPaused = paused || hovered || tabHidden || reducedMotion;

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const updateVisibility = () => setTabHidden(document.hidden);
    updateVisibility();
    document.addEventListener('visibilitychange', updateVisibility);
    return () => document.removeEventListener('visibilitychange', updateVisibility);
  }, []);

  const goTo = (index: number) => setActive((index + SLIDES.length) % SLIDES.length);
  const previous = () => goTo(active - 1);
  const next = () => goTo(active + 1);

  const handleProgressEnd = () => {
    if (!isPaused) next();
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    const start = touchStart.current;
    if (!start) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    if (Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      if (deltaX < 0) next();
      else previous();
    }

    touchStart.current = null;
  };

  return (
    <section
      className="relative isolate overflow-hidden bg-black text-white"
      aria-roledescription="carrossel"
      aria-label="Destaques CellShop"
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') setHovered(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse') setHovered(false);
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_46%,rgba(120,69,255,0.14),transparent_48%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-5 lg:min-h-[620px] lg:grid-cols-[0.92fr_1.08fr] lg:gap-8">
          <div key={active} className="relative z-10 pt-10 sm:pt-14 lg:py-16" aria-live="polite">
            <p className="cinematic-enter eyebrow text-[#c7b8ff]">{slide.eyebrow}</p>
            <h1 className="mt-5 max-w-xl font-display text-[clamp(2.8rem,6vw,4.8rem)] font-bold leading-[0.94] tracking-[-0.065em]">
              {slide.title.map((line, index) => (
                <span
                  key={line}
                  className="cinematic-line block"
                  style={{ animationDelay: `${90 + index * 110}ms` }}
                >
                  {line}
                  {index < slide.title.length - 1 ? ' ' : null}
                </span>
              ))}
            </h1>
            <p
              className="cinematic-enter mt-5 max-w-md text-[15px] leading-relaxed text-white/65 sm:text-base"
              style={{ animationDelay: '260ms' }}
            >
              {slide.description}
            </p>
            <div
              className="cinematic-enter mt-7 flex flex-wrap gap-3"
              style={{ animationDelay: '340ms' }}
            >
              <Link
                href="/celulares"
                className="premium-action inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-hover"
              >
                Explorar catálogo
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/celulares?ordem=recentes"
                className="premium-action inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/10"
              >
                Ver novidades
              </Link>
            </div>
          </div>

          <div className="relative min-h-[280px] min-[360px]:min-h-[320px] sm:min-h-[430px] lg:min-h-[clamp(440px,42vw,540px)]">
            {SLIDES.map((item, index) => (
              <picture key={item.src}>
                <img
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'low'}
                  decoding="async"
                  draggable={false}
                  aria-hidden={active !== index}
                  className={`absolute inset-0 h-full w-full transition-opacity duration-700 ease-out ${
                    item.fit === 'cover'
                      ? 'object-cover object-center'
                      : 'object-contain object-center'
                  } ${active === index ? 'opacity-100' : 'opacity-0'}`}
                />
              </picture>
            ))}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black to-transparent"
            />
          </div>
        </div>

        <div className="relative z-20 flex items-center justify-between gap-4 border-t border-white/10 py-5">
          <div className="flex items-center gap-2" aria-label="Selecionar destaque">
            {SLIDES.map((item, index) => (
              <button
                key={item.src}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Ir para destaque ${index + 1}: ${item.title.join(' ')}`}
                aria-current={active === index ? 'true' : undefined}
                className="group relative h-1.5 w-10 overflow-hidden rounded-full bg-white/20"
              >
                {active === index &&
                  (reducedMotion ? (
                    <span className="absolute inset-0 bg-[#b9a7ff]" />
                  ) : (
                    <span
                      key={active}
                      onAnimationEnd={handleProgressEnd}
                      style={{ animationDuration: `${item.duration}ms` }}
                      className={`hero-progress absolute inset-y-0 left-0 bg-[#b9a7ff] ${
                        isPaused ? 'hero-progress-paused' : ''
                      }`}
                    />
                  ))}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
              {String(active + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={previous}
                aria-label="Destaque anterior"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:border-white/35 hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
              </button>
              {!reducedMotion && (
                <button
                  type="button"
                  onClick={() => setPaused((value) => !value)}
                  aria-label={paused ? 'Retomar apresentação' : 'Pausar apresentação'}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:border-white/35 hover:bg-white/20"
                >
                  {paused ? <Play className="h-3.5 w-3.5" aria-hidden /> : <Pause className="h-3.5 w-3.5" aria-hidden />}
                </button>
              )}
              <button
                type="button"
                onClick={next}
                aria-label="Próximo destaque"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:border-white/35 hover:bg-white/20"
              >
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
