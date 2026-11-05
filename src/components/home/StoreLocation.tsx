import { ExternalLink, MapPin, Navigation } from 'lucide-react';
import { CONTACT, SITE } from '@/config/site';
import StoreHours from '@/components/ui/StoreHours';

const EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(CONTACT.mapsQuery)}&output=embed`;

export default function StoreLocation() {
  return (
    <section className="mega-location-section">
      <div className="section-shell mega-location-layout">
        <div className="mega-location-copy">
          <p className="section-kicker">Loja física</p>
          <h2>Venha conhecer nossa <span>loja!</span></h2>
          <p>Visite a {SITE.name} no Centro de Sousa e conheça de perto os produtos e possibilidades para o seu projeto.</p>
          <address><MapPin className="h-5 w-5" aria-hidden /> <span>{CONTACT.address}</span></address>
          <StoreHours inverse />
          <a href={CONTACT.directionsUrl} target="_blank" rel="noopener noreferrer" className="mega-directions-link">
            <Navigation className="h-4 w-4" aria-hidden /> Como chegar <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
        <div className="mega-map-frame">
          <iframe
            title="Localização da Mega Eletrônicos e Personalizados em Sousa, Paraíba"
            src={EMBED_URL}
            className="mega-map"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
