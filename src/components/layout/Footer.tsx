import Link from 'next/link';
import { MapPin, Mail } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { NAV_LINKS } from './navLinks';
import InstagramIcon from '@/components/ui/InstagramIcon';
import WhatsAppLink from '@/components/ui/WhatsAppLink';
import { CONTACT, SITE, WHATSAPP_GENERAL_MESSAGE } from '@/config/site';
import StoreHours from '@/components/ui/StoreHours';

export default function Footer() {
  return (
    <footer className="mt-auto bg-navy text-white/80">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Marca */}
          <div className="space-y-4 lg:col-span-2">
            <BrandLogo size="md" tone="light" />
            <p className="max-w-sm text-sm leading-relaxed text-white/60">
              {SITE.description}
            </p>

            <div className="flex flex-col gap-2 text-sm text-white/60">
              <span className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
                {CONTACT.address || 'Endereço em breve'}
              </span>
              {CONTACT.email && (
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="flex items-center gap-2.5 transition hover:text-white"
                >
                  <Mail className="h-4 w-4 shrink-0 text-brand" aria-hidden />
                  {CONTACT.email}
                </a>
              )}
            </div>
            <StoreHours compact inverse className="max-w-sm" />
          </div>

          {/* Navegação */}
          <div className="space-y-3">
            <h3 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-white">
              Navegação
            </h3>
            <ul className="space-y-2 text-sm text-white/60">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Atendimento & Redes */}
          <div className="space-y-3">
            <h3 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-white">
              Atendimento
            </h3>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li>
                <WhatsAppLink
                  message={WHATSAPP_GENERAL_MESSAGE}
                  showIcon
                  iconClassName="h-4 w-4 text-brand"
                  className="inline-flex items-center gap-2.5 transition hover:text-white"
                >
                  WhatsApp
                </WhatsAppLink>
              </li>
              <li>
                {CONTACT.instagramUrl ? (
                  <a
                    href={CONTACT.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 transition hover:text-white"
                  >
                    <InstagramIcon className="h-4 w-4 text-brand" />
                    Instagram
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2.5 text-white/40">
                    <InstagramIcon className="h-4 w-4 text-brand/60" />
                    Instagram em breve
                  </span>
                )}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {SITE.name}. Todos os direitos reservados.
          </p>
          <p>Catálogo digital — atendimento e vendas pelo WhatsApp.</p>
        </div>
      </div>
    </footer>
  );
}
