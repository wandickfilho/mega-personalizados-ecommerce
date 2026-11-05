import Link from 'next/link';
import { ArrowRight, Boxes, Building2, Gift, Users } from 'lucide-react';
import ProductMockup from '@/components/products/ProductMockup';
import Reveal from '@/components/ui/Reveal';

const CORPORATE_ITEMS = [
  {
    icon: Gift,
    title: 'Brindes personalizados',
    description: 'Itens Ãºteis que mantÃªm a sua marca presente no dia a dia.',
  },
  {
    icon: Users,
    title: 'Kits para equipes',
    description: 'Boas-vindas, eventos internos e reconhecimento de time.',
  },
  {
    icon: Boxes,
    title: 'Presentes para clientes',
    description: 'ExperiÃªncias com acabamento cuidado e identidade consistente.',
  },
];

export default function CorporateGifts() {
  return (
    <section id="corporativo" className="scroll-mt-36 py-16 sm:py-20 lg:py-24">
      <div className="section-shell">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-navy text-white shadow-premium">
            <div className="corporate-grid absolute inset-0 opacity-60" aria-hidden />
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand/20 blur-3xl" aria-hidden />
            <div className="pointer-events-none absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-royal/30 blur-3xl" aria-hidden />

            <div className="relative grid gap-10 p-6 sm:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:p-14">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/65">
                  <Building2 className="h-3.5 w-3.5 text-[#FF7582]" aria-hidden />
                  Projetos corporativos
                </span>

                <h2 className="mt-6 max-w-xl font-display text-3xl font-extrabold leading-[1.02] tracking-[-0.045em] text-balance sm:text-4xl lg:text-[3.1rem]">
                  Sua marca merece ser <span className="text-[#FF7582]">lembrada.</span>
                </h2>
                <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/60 sm:text-base">
                  Criamos brindes e presentes personalizados para empresas que querem
                  marcar presenÃ§a com cuidado, coerÃªncia e um acabamento que representa
                  bem a sua identidade.
                </p>

                <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
                  <Link
                    href="/contato"
                    className="premium-action inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-brand-dark"
                  >
                    Personalize para sua empresa
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                  <Link
                    href="#categorias"
                    className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3.5 text-sm font-bold text-white transition hover:border-white/35 hover:bg-white/5"
                  >
                    Ver categorias
                  </Link>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-md">
                <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.055] p-4 backdrop-blur-sm sm:p-5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/35">
                        Projeto
                      </p>
                      <p className="mt-1 font-display text-sm font-extrabold">Kit corporativo</p>
                    </div>
                    <span className="rounded-full bg-brand px-3 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white">
                      Sob medida
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-royal/25 p-3">
                    <ProductMockup
                      variant="kit"
                      tone="ice"
                      label="Sua marca"
                      className="h-20 w-20 shrink-0"
                    />
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/45">
                        Prévia demonstrativa
                      </p>
                      <p className="mt-1 font-display text-sm font-extrabold text-white">
                        Composição de kit
                      </p>
                      <p className="mt-0.5 text-[10px] leading-relaxed text-white/50">
                        Itens, materiais e arte definidos no atendimento.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    {CORPORATE_ITEMS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.title}
                          className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3.5"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#FF9AA3]">
                            <Icon className="h-4 w-4" aria-hidden />
                          </span>
                          <div>
                            <p className="text-xs font-bold text-white">{item.title}</p>
                            <p className="mt-0.5 text-[10px] leading-relaxed text-white/45">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex items-center justify-between rounded-xl bg-white px-4 py-3 text-navy">
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-navy/50">
                      Identidade aplicada
                    </span>
                    <span className="font-display text-sm font-extrabold">Do kit ao detalhe</span>
                  </div>
                </div>

                <div className="absolute -bottom-5 -right-3 rotate-[5deg] rounded-2xl bg-brand px-4 py-3 text-white shadow-float sm:-right-6">
                  <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-white/65">
                    Para eventos e equipes
                  </p>
                  <p className="mt-0.5 font-display text-sm font-extrabold">Sua marca, presente.</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

