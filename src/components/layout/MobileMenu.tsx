'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Clock3, FolderOpen, Info, Monitor, Moon, Smartphone, Sparkles, Sun, X } from 'lucide-react';
import BrandLogo from './BrandLogo';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { WHATSAPP_GENERAL_MESSAGE } from '@/config/site';
import { useTheme, type ThemePreference } from '@/components/ui/ThemeProvider';
import StoreHours from '@/components/ui/StoreHours';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const PRODUCT_LINKS = [
  { label: 'Todos os produtos', href: '/celulares', icon: FolderOpen },
  { label: 'Celulares', href: '/celulares', icon: Smartphone },
  { label: 'Seminovos', href: '/celulares?condicao=seminovo', icon: Smartphone },
  { label: 'Lacrados', href: '/celulares?condicao=novo', icon: Smartphone },
  { label: 'Xiaomi', href: '/celulares?marca=xiaomi', icon: Smartphone },
];

const DISCOVERY_LINKS = [
  { label: 'Lançamentos', href: '/celulares?ordem=recentes', icon: Sparkles },
];

const INSTITUTIONAL_LINKS = [
  { label: 'Sobre a CellShop', href: '/sobre', icon: Info },
  { label: 'Fale Conosco', href: '/contato', icon: Clock3 },
];

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { preference, setPreference } = useTheme();

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    const focusTarget = panelRef.current?.querySelector<HTMLElement>('[data-autofocus]');
    focusTarget?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Fechar menu"
        onClick={onClose}
        className="absolute inset-0 animate-fade-in bg-black/60 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        className="animate-menu-in relative z-10 flex h-full w-[88%] max-w-sm flex-col bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <BrandLogo size="sm" tone="dark" />
          <button
            type="button"
            data-autofocus
            onClick={onClose}
            aria-label="Fechar menu"
            className="rounded-full p-2 text-graphite/70 transition hover:bg-mist hover:text-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-navy/40"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6" aria-label="Navegação principal">
          <MenuGroup title="Produtos" items={PRODUCT_LINKS} onClose={onClose} pathname={pathname} />
          <MenuGroup title="Novidades e ofertas" items={DISCOVERY_LINKS} onClose={onClose} pathname={pathname} className="mt-7" />
           <MenuGroup title="Institucional" items={INSTITUTIONAL_LINKS} onClose={onClose} pathname={pathname} className="mt-7" />
           <StoreHours compact className="mt-7" />
        </nav>

        <div className="space-y-4 border-t border-line p-4">
          <ThemePicker preference={preference} onChange={setPreference} />
          <WhatsAppButton
            message={WHATSAPP_GENERAL_MESSAGE}
            label="Falar no WhatsApp"
            variant="solid"
            className="w-full"
          />
          <p className="text-center text-[11px] leading-relaxed text-graphite/50">
            Atendimento e orientação para escolher o seu próximo celular.
          </p>
        </div>
      </div>
    </div>
  );
}

function ThemePicker({ preference, onChange }: { preference: ThemePreference; onChange: (preference: ThemePreference) => void }) {
  const options = [
    { value: 'light' as const, label: 'Claro', icon: Sun },
    { value: 'dark' as const, label: 'Escuro', icon: Moon },
    { value: 'system' as const, label: 'Auto', icon: Monitor },
  ];

  return (
    <section aria-label="Aparência">
      <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.18em] text-brand">Aparência</p>
      <div className="grid grid-cols-3 gap-1 rounded-xl bg-mist p-1">
        {options.map(({ value, label, icon: Icon }) => {
          const selected = preference === value;
          return (
            <button key={value} type="button" onClick={() => onChange(value)} aria-pressed={selected} className={`flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-[10px] font-bold transition ${selected ? 'theme-option-selected bg-white text-navy shadow-soft' : 'text-graphite/55 hover:text-navy'}`}>
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function MenuGroup({
  title,
  items,
  onClose,
  pathname,
  className = '',
}: {
  title: string;
  items: { label: string; href: string; icon: typeof Smartphone }[];
  onClose: () => void;
  pathname: string;
  className?: string;
}) {
  return (
    <section className={className}>
      <h2 className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-brand">{title}</h2>
      <ul className="mt-2 space-y-1 border-y border-line/70 py-2">
        {items.map(({ label, href, icon: Icon }) => {
          const active = href === pathname;
          return (
          <li key={href}>
            <Link href={href} onClick={onClose} aria-current={active ? 'page' : undefined} className={`group flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold transition hover:bg-mist hover:text-navy ${active ? 'bg-mist text-navy' : 'text-graphite'}`}>
              <span className="flex items-center gap-3"><Icon className="h-4 w-4 text-brand" />{label}</span>
              <ChevronRight className="h-4 w-4 text-graphite/35 transition group-hover:translate-x-0.5 group-hover:text-brand" />
            </Link>
          </li>
          );
        })}
      </ul>
    </section>
  );
}
