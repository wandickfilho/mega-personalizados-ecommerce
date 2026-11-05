import Reveal from '@/components/ui/Reveal';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { SITE, WHATSAPP_GENERAL_MESSAGE } from '@/config/site';

export default function ContactCTA() {
  return (
    <section className="contact-cta-section py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[1.75rem] bg-navy px-6 py-12 text-center text-white shadow-premium sm:rounded-[2.25rem] sm:px-12 sm:py-16">
            <div className="relative mx-auto max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em]">
                Atendimento CellShop
              </span>
              <h2 className="mt-5 font-display text-3xl font-bold leading-tight tracking-[-0.03em] sm:text-4xl">
                Atendimento especializado para a sua escolha.
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/70">
                Converse com a {SITE.name} pelo WhatsApp e receba orientação sobre modelos, valores e disponibilidade antes de decidir.
              </p>
              <div className="mt-8 flex justify-center">
                <WhatsAppButton
                  message={WHATSAPP_GENERAL_MESSAGE}
                  label="Conversar no WhatsApp"
                  className="px-7 py-3.5 text-base"
                />
              </div>
              <p className="mt-5 text-xs text-white/50">
                Carrinho, revisão do pedido e atendimento próximo.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
