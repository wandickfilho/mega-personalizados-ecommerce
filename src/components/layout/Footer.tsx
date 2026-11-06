import Link from 'next/link';
import { ArrowUpRight, Mail, MapPin, MessageCircle } from 'lucide-react';
import { CUSTOM_CATALOG_NAV } from '@/config/customCatalog';
import { CONTACT, SITE, WHATSAPP_ENABLED } from '@/config/site';
import StoreHours from '@/components/ui/StoreHours';
import BrandLogo from './BrandLogo';
import { NAV_LINKS } from './navLinks';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy text-white/70">
      <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-royal/25 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.1fr]">
          <div className="max-w-sm">
            <BrandLogo size="md" tone="light" />
            <p className="mt-5 text-sm leading-relaxed text-white/55">{SITE.description}</p>
            <a href={CONTACT.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white/65 transition hover:text-white">
              <MapPin className="h-3.5 w-3.5 text-brand" aria-hidden />
              {CONTACT.address}
            </a>
          </div>

          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-white">
              Categorias
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {CUSTOM_CATALOG_NAV.map((category) => (
                <li key={category.href}>
                  <Link
                    href={category.href}
                    className="transition hover:text-white"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-white">
              Navegação
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-white">
              Atendimento
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link
                  href={WHATSAPP_ENABLED && CONTACT.whatsapp ? `https://wa.me/${CONTACT.whatsapp}` : '/contato'}
                  className="inline-flex items-center gap-2.5 transition hover:text-white"
                >
                  <MessageCircle className="h-4 w-4 text-brand" aria-hidden />
                  {WHATSAPP_ENABLED ? 'WhatsApp' : 'Solicitar orçamento'}
                </Link>
              </li>
              {CONTACT.email ? (
                <li>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="inline-flex items-center gap-2.5 transition hover:text-white"
                  >
                    <Mail className="h-4 w-4 text-brand" aria-hidden />
                    {CONTACT.email}
                  </a>
                </li>
              ) : (
                <li className="text-white/35">E-mail em breve</li>
              )}
              <li>
                <Link href="/contato" className="inline-flex items-center gap-1.5 font-semibold text-white transition hover:text-brand">
                  Fale com a Mega
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </li>
            </ul>
          </div>

          <StoreHours compact inverse />
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-[11px] text-white/40 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {SITE.name}. Todos os direitos reservados.
          </p>
          <p>Personalizados sob medida · Sousa-PB</p>
        </div>
      </div>
    </footer>
  );
}
