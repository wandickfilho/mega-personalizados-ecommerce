import { ExternalLink, MapPin } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import StoreHours from '@/components/ui/StoreHours';

const MAP_QUERY = 'Rua Coronel José Vicente, 447, Centro, Sousa, PB, 58800-020';
const MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`;
const EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`;

export default function LocationSection() {
  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-8">
        <Reveal>
          <span className="section-kicker">Visite a CellShop</span>
          <h2 className="section-title mt-3">Tecnologia perto de você.</h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-graphite/60">Encontre a CellShop no centro de Sousa, Paraíba. Venha conhecer os aparelhos e tire suas dúvidas com nossa equipe.</p>
           <p className="mt-6 flex max-w-sm gap-3 rounded-2xl bg-mist p-4 text-sm font-semibold leading-relaxed text-navy"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand" />Rua Coronel José Vicente, 447<br />Centro, Sousa, PB<br />CEP 58800-020</p>
           <StoreHours className="mt-5 max-w-md" />
          <a href={MAP_URL} target="_blank" rel="noopener noreferrer" className="premium-action mt-6 inline-flex items-center gap-2 rounded-full bg-navy px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-hover">Ver no Google Maps <ExternalLink className="h-4 w-4" /></a>
        </Reveal>
        <Reveal delay={100}>
          <div className="overflow-hidden rounded-[1.75rem] border border-line bg-mist p-2 shadow-premium">
            <iframe title="Localização da CellShop em Sousa, Paraíba" src={EMBED_URL} className="h-[320px] w-full rounded-[1.3rem] border-0 sm:h-[380px]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
