'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Monitor, Moon, Sun, X } from 'lucide-react';
import { CATEGORIES } from '@/config/categories';
import { useTheme, type ThemePreference } from '@/components/ui/ThemeProvider';
import CategoryIcon from '@/components/ui/CategoryIcon';
import BrandLogo from './BrandLogo';
import { NAV_LINKS } from './navLinks';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
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
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="Fechar menu"
        onClick={onClose}
        className="absolute inset-0 animate-fade-in bg-navy/60 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        className="animate-menu-in relative z-10 flex h-full w-[90%] max-w-sm flex-col bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <BrandLogo size="sm" tone="dark" />
          <button
            type="button"
            data-autofocus
            onClick={onClose}
            aria-label="Fechar menu"
            className="rounded-full p-2 text-graphite/70 transition hover:bg-mist hover:text-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6" aria-label="Navegação principal">
          <p className="px-1 text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
            Categorias
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                href={`/?categoria=${category.id}#vitrine`}
                onClick={onClose}
                className="group flex min-h-24 flex-col justify-between rounded-2xl border border-line bg-mist/50 p-3 transition hover:border-brand/30 hover:bg-white hover:shadow-soft"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-navy text-white">
                  <CategoryIcon icon={category.icon} className="h-4 w-4" />
                </span>
                <span className="mt-3 text-xs font-bold leading-tight text-navy">
                  {category.shortName}
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-7 border-t border-line pt-5">
            <p className="px-1 text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
              Navegação
            </p>
            <ul className="mt-2 space-y-0.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="group flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-graphite transition hover:bg-mist hover:text-navy"
                  >
                    {link.label}
                    <ChevronRight className="h-4 w-4 text-graphite/35 transition group-hover:translate-x-0.5 group-hover:text-brand" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 rounded-2xl bg-navy p-4 text-white">
            <p className="font-display text-base font-bold">Tem um projeto em mente?</p>
            <p className="mt-1 text-xs leading-relaxed text-white/60">
              Conte o que precisa e receba orientação sobre materiais, técnicas e possibilidades.
            </p>
            <Link
              href="/contato"
              onClick={onClose}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-xs font-bold text-white transition hover:bg-brand-dark"
            >
              Solicitar orçamento
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>

          <div className="mt-6">
            <ThemePicker preference={preference} onChange={setPreference} />
          </div>
        </nav>

        <div className="border-t border-line p-4">
          <p className="text-center text-[11px] leading-relaxed text-graphite/50">
            Mega Eletrônicos &amp; Personalizados · Sousa-PB
          </p>
        </div>
      </div>
    </div>
  );
}

function ThemePicker({
  preference,
  onChange,
}: {
  preference: ThemePreference;
  onChange: (preference: ThemePreference) => void;
}) {
  const options = [
    { value: 'light' as const, label: 'Claro', icon: Sun },
    { value: 'dark' as const, label: 'Escuro', icon: Moon },
    { value: 'system' as const, label: 'Auto', icon: Monitor },
  ];

  return (
    <section aria-label="Aparência">
      <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
        Aparência
      </p>
      <div className="grid grid-cols-3 gap-1 rounded-xl bg-mist p-1">
        {options.map(({ value, label, icon: Icon }) => {
          const selected = preference === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onChange(value)}
              aria-pressed={selected}
              className={`flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-[10px] font-bold transition ${
                selected
                  ? 'theme-option-selected bg-white text-navy shadow-soft'
                  : 'text-graphite/55 hover:text-navy'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
