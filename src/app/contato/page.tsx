import type { Metadata } from 'next';
import { Clock, Mail, MapPin, MessageCircle } from 'lucide-react';
import InstagramIcon from '@/components/ui/InstagramIcon';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import SampleDataNotice from '@/components/phones/SampleDataNotice';
import { CONTACT, SITE, WHATSAPP_GENERAL_MESSAGE } from '@/config/site';

export const metadata: Metadata = {
  title: `Contato | ${SITE.name}`,
  description:
    'Fale com a CellShop pelo WhatsApp para tirar dúvidas sobre modelos, valores e disponibilidade.',
};

const INFO = [
  {
    icon: MapPin,
    label: 'Endereço',
    value: CONTACT.address || 'Endereço em breve',
  },
  {
    icon: Clock,
    label: 'Horário de funcionamento',
    value: CONTACT.hours || 'Horário em breve',
  },
  {
    icon: Mail,
    label: 'E-mail',
    value: CONTACT.email || 'E-mail em breve',
  },
];

export default function ContactPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <header className="max-w-2xl">
          <span className="section-kicker">Contato</span>
          <h1 className="section-title mt-3">Fale com a CellShop</h1>
          <p className="mt-4 text-sm leading-relaxed text-graphite/60">
            O atendimento é feito pelo WhatsApp. Envie sua dúvida sobre modelos, valores e
            disponibilidade e a loja responde o mais rápido possível.
          </p>
          <div className="mt-5">
            <SampleDataNotice />
          </div>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-2xl border border-line bg-mist/50 p-6 sm:p-8">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-white">
              <MessageCircle className="h-5 w-5" aria-hidden />
            </span>
            <h2 className="mt-5 font-display text-xl font-bold text-navy">
              Atendimento pelo WhatsApp
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-graphite/60">
              Toque no botão abaixo para iniciar uma conversa. Você pode perguntar sobre qualquer
              aparelho do catálogo.
            </p>
            <div className="mt-6">
              <WhatsAppButton
                message={WHATSAPP_GENERAL_MESSAGE}
                label="Iniciar conversa"
                className="px-6 py-3.5 text-base"
              />
            </div>
          </div>

          <div className="space-y-3">
            {INFO.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4 shadow-soft"
                >
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-mist text-navy">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-graphite/45">
                      {item.label}
                    </p>
                    <p className="text-sm text-graphite/75">{item.value}</p>
                  </div>
                </div>
              );
            })}

            {CONTACT.instagramUrl ? (
              <a
                href={CONTACT.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4 shadow-soft transition hover:border-navy/30"
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-mist text-navy">
                  <InstagramIcon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-graphite/45">
                    Instagram
                  </p>
                  <p className="text-sm text-graphite/75">Seguir a {SITE.name}</p>
                </div>
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
