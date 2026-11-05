import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  Clock,
  Image as ImageIcon,
  Mail,
  MapPin,
  MessageCircle,
  PackageSearch,
  Sparkles,
} from 'lucide-react';
import InstagramIcon from '@/components/ui/InstagramIcon';
import { CONTACT, SITE, WHATSAPP_ENABLED } from '@/config/site';
import StoreHours from '@/components/ui/StoreHours';

export const metadata: Metadata = {
  title: 'Contato',
  description:
    'Fale com a Mega Personalizados e solicite um orçamento para canecas, capinhas, bonés, brindes corporativos e outros personalizados.',
};

const CHECKLIST = [
  {
    icon: PackageSearch,
    title: 'O que você quer personalizar',
    description: 'Produto, quantidade e para quem é o projeto.',
  },
  {
    icon: ImageIcon,
    title: 'Referências visuais',
    description: 'Logo, frases, cores ou imagens que ajudem a traduzir a sua ideia.',
  },
  {
    icon: Sparkles,
    title: 'Ocasião e prazo desejado',
    description: 'Presente, evento, equipe ou campanha — quanto antes melhor.',
  },
];

export default function ContactPage() {
  const hasChannel = WHATSAPP_ENABLED || Boolean(CONTACT.email) || Boolean(CONTACT.instagramUrl);

  return (
    <div className="bg-canvas">
      <div className="section-shell py-12 sm:py-16 lg:py-20">
        <header className="max-w-3xl">
          <span className="section-kicker">Contato</span>
          <h1 className="section-title mt-4">
            Vamos tirar sua ideia <span className="text-brand">do papel.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-graphite/60 sm:text-base">
            Conte para a {SITE.shortName} o que você imagina. A orientação sobre material,
            técnica e acabamento faz parte do projeto.
          </p>
        </header>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          <section className="rounded-2xl border border-line bg-surface p-6 shadow-soft sm:p-8">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-navy text-white">
                <Check className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 className="font-display text-lg font-extrabold tracking-[-0.03em] text-navy">
                  Antes de falar com a gente
                </h2>
                <p className="text-[11px] text-graphite/45">Ter essas informações agiliza o orçamento.</p>
              </div>
            </div>

            <ul className="mt-6 space-y-3">
              {CHECKLIST.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.title} className="flex gap-3 rounded-xl bg-mist/60 p-3.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface text-brand shadow-soft">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-navy">{item.title}</p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-graphite/55">
                        {item.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 flex items-center gap-2 rounded-xl border border-line bg-canvas px-4 py-3 text-[11px] text-graphite/55">
              <Clock className="h-4 w-4 shrink-0 text-brand" aria-hidden />
              O prazo é combinado após a aprovação da arte e do escopo do projeto.
            </div>
          </section>

          <section className="rounded-2xl bg-navy p-6 text-white shadow-premium sm:p-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/65">
              <MessageCircle className="h-3.5 w-3.5 text-[#ff6b78]" aria-hidden />
              Canais oficiais
            </span>
            <h2 className="mt-5 font-display text-2xl font-extrabold tracking-[-0.04em]">Visite nossa loja.</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/55">
              Estamos na Rua Coronel José Vicente, 52, no Centro de Sousa. Os canais digitais são publicados apenas quando confirmados.
            </p>

            <div className="mt-6 space-y-2.5">
              <ChannelRow
                icon={<MessageCircle className="h-4 w-4" />}
                label="WhatsApp"
                value={WHATSAPP_ENABLED ? 'Disponível' : 'Em breve'}
                href={WHATSAPP_ENABLED ? `https://wa.me/${CONTACT.whatsapp}` : undefined}
              />
              <ChannelRow
                icon={<InstagramIcon className="h-4 w-4" />}
                label="Instagram"
                value={CONTACT.instagramUrl ? `@${SITE.instagramHandle}` : 'Em breve'}
                href={CONTACT.instagramUrl || undefined}
              />
              <ChannelRow
                icon={<Mail className="h-4 w-4" />}
                label="E-mail"
                value={CONTACT.email || 'Em breve'}
                href={CONTACT.email ? `mailto:${CONTACT.email}` : undefined}
              />
              <ChannelRow
                icon={<MapPin className="h-4 w-4" />}
                label="Localização"
                value={CONTACT.address}
                href={CONTACT.mapsUrl}
              />
            </div>

            <StoreHours compact inverse className="mt-5" />

            {!hasChannel && (
              <p className="mt-5 rounded-xl border border-white/10 bg-white/5 p-3 text-[10px] leading-relaxed text-white/40">
                Nenhum contato fictício é exibido. Os canais serão publicados aqui assim que
                forem confirmados.
              </p>
            )}

            <Link
              href="/#categorias"
              className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-white transition hover:text-[#ff6b78]"
            >
              Explorar categorias enquanto isso
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}

function ChannelRow({
  icon,
  label,
  value,
  href,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#ff8a94]">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/35">{label}</p>
        <p className="truncate text-xs font-semibold text-white/80">{value}</p>
      </div>
      {href && <ArrowRight className="h-3.5 w-3.5 text-white/30" aria-hidden />}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 transition hover:border-white/20 hover:bg-white/[0.08]"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3">
      {content}
    </div>
  );
}
