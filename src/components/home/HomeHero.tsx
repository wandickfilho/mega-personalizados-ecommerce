'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Box, CircleCheck, Play, ShieldCheck, Store, WandSparkles } from 'lucide-react';

const categories = [
  { label: 'Canecas', href: '/personalizados/caneca-linha-premium' },
  { label: 'Camisetas', href: '/personalizados/camiseta-personalizada' },
  { label: 'Garrafas', href: '/personalizados/garrafa-personalizada', active: true },
  { label: 'Capinhas', href: '/personalizados/capinha-identidade' },
  { label: 'Mousepads', href: '/personalizados/mousepad-personalizado' },
  { label: 'E muito mais', href: '/personalizados/outros' },
];

export default function HomeHero() {
  const videoRef = useRef<HTMLVideoElement>(null); const [paused, setPaused] = useState(false);
  useEffect(() => { const media = window.matchMedia('(prefers-reduced-motion: reduce)'); const update = () => { if (media.matches) { videoRef.current?.pause(); setPaused(true); } }; update(); media.addEventListener('change', update); return () => media.removeEventListener('change', update); }, []);
  function toggleVideo() { const video = videoRef.current; if (!video) return; if (video.paused) { void video.play(); setPaused(false); } else { video.pause(); setPaused(true); } }
  return <section className="mega-editorial-hero"><div className="mega-editorial-shell"><nav className="mega-editorial-nav" aria-label="Navegação editorial"><Link href="/" className="mega-editorial-brand"><i /> MEGA PERSONALIZADOS</Link><div className="mega-editorial-links"><Link href="/personalizados">Produtos</Link><Link href="/#personalizados-2d">Personalização 2D</Link><Link href="/sobre">Sobre Nós</Link><Link href="/contato">Contato</Link></div><span className="mega-editorial-location"><b /> Loja física em Sousa-PB</span></nav><div className="mega-editorial-title" aria-hidden="true"><strong>MEGA</strong><span>PERSONALIZADOS</span></div><div className="mega-editorial-dots" aria-hidden="true" /><div className="mega-editorial-product"><video ref={videoRef} src="/videos/heroReels/videoReels.mp4" autoPlay muted loop playsInline preload="metadata" aria-label="Vídeo de uma garrafa personalizada da Mega" /><button type="button" onClick={toggleVideo} aria-label={paused ? 'Reproduzir vídeo' : 'Pausar vídeo'}>{paused && <Play className="h-5 w-5 fill-current" />}</button></div><div className="mega-editorial-copy"><i /><p>Transforme suas ideias em produtos exclusivos e personalizados.</p><Link href="/#personalizados-2d">{'// PERSONALIZE AGORA '}<ArrowRight className="h-4 w-4" /></Link></div><nav className="mega-editorial-categories" aria-label="Categorias de personalizados">{categories.map((category) => <Link key={category.href} href={category.href} className={category.active ? 'active' : ''}>{category.label}</Link>)}</nav><div className="mega-editorial-benefits"><span><Box /> Personalização em 2D</span><span><CircleCheck /> Alta Qualidade</span><span><ShieldCheck /> Compra orientada</span><span><WandSparkles /> Produção Personalizada</span><span><Store /> Loja Física</span></div></div></section>;
}
