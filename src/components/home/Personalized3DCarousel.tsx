'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS = [
  { title: 'Capinhas personalizadas', description: 'Proteção e identidade para acompanhar o seu dia.', src: '/videos/produtosCategoriaHome/capinhaCelular1.mp4', href: '/?categoria=capinhas-celular#vitrine' },
  { title: 'Capinhas com a sua arte', description: 'Sua imagem, frase ou marca em uma peça única.', src: '/videos/produtosCategoriaHome/capinhaCelular2.mp4', href: '/?categoria=capinhas-celular#vitrine' },
  { title: 'Chaveiro personalizado', description: 'Um detalhe pequeno para levar a sua ideia por perto.', src: '/videos/produtosCategoriaHome/chaveiro1.mp4', href: '/?categoria=chaveiros#vitrine' },
  { title: 'Garrafa personalizada', description: 'Mais personalidade em cada escolha do dia a dia.', src: '/videos/produtosCategoriaHome/garrafa1.mp4', href: '/#vitrine' },
  { title: 'Garrafa com sua identidade', description: 'Um presente ou item especial feito para você.', src: '/videos/produtosCategoriaHome/garrafa2.mp4', href: '/#vitrine' },
] as const;

function relativePosition(index: number, active: number) {
  const total = ITEMS.length;
  let position = index - active;
  if (position > total / 2) position -= total;
  if (position < -total / 2) position += total;
  return position;
}

export default function Personalized3DCarousel() {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const pointerStart = useRef<number | null>(null);
  const transitionLock = useRef(false);
  const previousStyles = useRef<Map<HTMLButtonElement, { transform: string; opacity: string; filter: string }> | null>(null);
  const runningAnimations = useRef<Animation[]>([]);
  const canAdvance = visible && documentVisible && !hovered && !reducedMotion;

  function move(direction: -1 | 1) {
    if (transitionLock.current) return;
    runningAnimations.current.forEach((animation) => animation.cancel());
    previousStyles.current = new Map(
      itemRefs.current.flatMap((element) => {
        if (!element) return [];
        const style = window.getComputedStyle(element);
        return [[element, { transform: style.transform, opacity: style.opacity, filter: style.filter }] as const];
      })
    );
    transitionLock.current = true;
    setIsTransitioning(true);
    setActive((current) => (current + direction + ITEMS.length) % ITEMS.length);
  }
  const previous = () => move(-1);
  const next = () => move(1);
  function select(index: number) {
    if (index === active || isTransitioning) return;
    const position = relativePosition(index, active);
    move(position > 0 ? 1 : -1);
  }

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(mediaQuery.matches);
    const updateVisibility = () => setDocumentVisible(document.visibilityState === 'visible');
    updatePreference(); updateVisibility();
    mediaQuery.addEventListener('change', updatePreference);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => { mediaQuery.removeEventListener('change', updatePreference); document.removeEventListener('visibilitychange', updateVisibility); };
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      const position = Math.abs(relativePosition(index, active));
      if (visible && documentVisible && !reducedMotion && position <= 1) void video.play().catch(() => undefined);
      else video.pause();
    });
  }, [active, visible, documentVisible, reducedMotion]);

  useLayoutEffect(() => {
    const previous = previousStyles.current;
    if (!previous || reducedMotion) return;
    previousStyles.current = null;
    runningAnimations.current = [...previous.entries()].map(([element, from]) => {
      const to = window.getComputedStyle(element);
      return element.animate(
        [
          { transform: from.transform, opacity: from.opacity, filter: from.filter },
          { transform: to.transform, opacity: to.opacity, filter: to.filter },
        ],
        { duration: 850, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'both' }
      );
    });
  }, [active, reducedMotion]);

  useEffect(() => {
    if (!isTransitioning) return;
    const timer = window.setTimeout(() => { transitionLock.current = false; setIsTransitioning(false); }, 850);
    return () => window.clearTimeout(timer);
  }, [isTransitioning]);

  useEffect(() => {
    if (!canAdvance) return;
    const timer = window.setInterval(next, 6000);
    return () => window.clearInterval(timer);
  }, [canAdvance, active]);

  function onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === 'ArrowLeft') { event.preventDefault(); previous(); }
    if (event.key === 'ArrowRight') { event.preventDefault(); next(); }
  }
  function onPointerDown(event: React.PointerEvent) { pointerStart.current = event.clientX; }
  function onPointerUp(event: React.PointerEvent) {
    if (pointerStart.current === null) return;
    const distance = event.clientX - pointerStart.current;
    pointerStart.current = null;
    if (Math.abs(distance) < 42) return;
    if (distance > 0) previous(); else next();
  }

  const item = ITEMS[active];
  return <section ref={sectionRef} className="personalized-carousel" aria-label="Carrossel de personalizados" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onKeyDown={onKeyDown} tabIndex={0}>
    <div className="section-shell">
      <header className="personalized-carousel-heading"><p>Vitrine em movimento</p><h2>Personalizados que têm a <span>sua cara.</span></h2><span>Escolha, personalize e transforme suas ideias em algo único.</span></header>
      <div className="personalized-carousel-stage" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        <div className="personalized-carousel-aura" aria-hidden />
        {ITEMS.map((carouselItem, index) => {
          const position = relativePosition(index, active);
          const location = position === 0 ? 'center' : position === -1 ? 'left' : position === 1 ? 'right' : position < 0 ? 'far-left' : 'far-right';
          return <button ref={(element) => { itemRefs.current[index] = element; }} key={carouselItem.src} type="button" aria-label={`Selecionar ${carouselItem.title}`} aria-current={position === 0} onClick={() => select(index)} className={`personalized-carousel-item ${location}`}>
            <video ref={(element) => { videoRefs.current[index] = element; }} src={carouselItem.src} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" />
          </button>;
        })}
        <button type="button" onClick={previous} className="personalized-carousel-arrow previous" aria-label="Produto anterior"><ChevronLeft className="h-5 w-5" /></button>
        <button type="button" onClick={next} className="personalized-carousel-arrow next" aria-label="Próximo produto"><ChevronRight className="h-5 w-5" /></button>
      </div>
      <div className="personalized-carousel-details" aria-live="polite"><div key={item.src} className="personalized-carousel-copy"><p>Personalizados Mega</p><h3>{item.title}</h3><span>{item.description}</span></div><Link href={item.href} className="personalized-carousel-cta">Ver personalizados</Link></div>
      <div className="personalized-carousel-dots" role="tablist" aria-label="Escolher item do carrossel">{ITEMS.map((carouselItem, index) => <button key={carouselItem.src} type="button" role="tab" aria-selected={index === active} aria-label={`Ir para ${carouselItem.title}`} onClick={() => select(index)} className={index === active ? 'active' : ''} />)}</div>
    </div>
  </section>;
}
