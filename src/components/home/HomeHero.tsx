import Link from 'next/link';
import { ArrowRight, Play, Volume2 } from 'lucide-react';

export default function HomeHero() {
  return (
    <section className="hero-video-section">
      <div className="section-shell hero-video-layout">
        <div className="hero-video-copy">
          <p className="hero-video-kicker">Mega Eletrônicos e Personalizados</p>
          <h1>Sua ideia,<br />no seu <em>estilo!</em></h1>
          <p className="hero-video-intro">
            Canecas, capinhas, presentes e brindes feitos para transformar momentos em algo único.
          </p>
          <div className="hero-video-actions">
            <Link href="#vitrine" className="hero-primary-action">
              Explorar personalizados <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="#producao" className="hero-secondary-action">
              Ver como é feito <Play className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
          <p className="hero-video-note">Loja física em Sousa, Paraíba.</p>
        </div>

        <div className="hero-video-frame">
          <video
            className="hero-video"
            src="/videos/heroReels/videoReels.mp4"
            autoPlay
            muted
            loop
            playsInline
            controls
            preload="metadata"
            aria-label="Apresentação dos personalizados da Mega"
          />
          <p className="hero-video-caption"><Volume2 className="h-3.5 w-3.5" aria-hidden /> Ative o som nos controles para assistir à apresentação.</p>
        </div>
      </div>
    </section>
  );
}
