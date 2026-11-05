import { buildWhatsAppLink, WHATSAPP_ENABLED } from '@/config/site';
import { cn } from '@/lib/utils';
import WhatsAppIcon from './WhatsAppIcon';

interface WhatsAppButtonProps {
  message: string;
  label?: string;
  variant?: 'solid' | 'outline' | 'ghost' | 'floating';
  className?: string;
  showIcon?: boolean;
}

const DISABLED_HINT = 'Atendimento via WhatsApp será ativado em breve.';

const VARIANTS: Record<NonNullable<WhatsAppButtonProps['variant']>, string> = {
  solid:
    'premium-action inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_-12px_rgba(124,58,237,0.55)] transition hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-hover active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
  outline:
    'premium-action inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/15 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy-700',
  ghost:
    'premium-action inline-flex items-center justify-center gap-2 rounded-full border border-navy/15 bg-white px-5 py-2.5 text-sm font-semibold text-navy transition hover:-translate-y-0.5 hover:border-navy hover:bg-navy hover:text-white active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
  floating:
    'premium-action inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-float transition hover:-translate-y-1 hover:bg-brand-dark active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
};

export default function WhatsAppButton({
  message,
  label = 'Falar no WhatsApp',
  variant = 'solid',
  className,
  showIcon = true,
}: WhatsAppButtonProps) {
  const href = buildWhatsAppLink(message);
  const enabled = WHATSAPP_ENABLED && href !== '';

  const base = VARIANTS[variant];
  const disabledStyle = cn(base, 'cursor-not-allowed opacity-60');

  if (!enabled) {
    return (
      <button
        type="button"
        aria-disabled="true"
        title={DISABLED_HINT}
        className={cn(disabledStyle, className)}
      >
        {showIcon && <WhatsAppIcon className={variant === 'floating' ? 'h-6 w-6' : 'h-4 w-4'} />}
        {variant !== 'floating' && <span>{label}</span>}
        <span className="sr-only">{DISABLED_HINT}</span>
      </button>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className={cn(base, className)}
    >
      {showIcon && <WhatsAppIcon className={variant === 'floating' ? 'h-6 w-6' : 'h-4 w-4'} />}
      {variant !== 'floating' && <span>{label}</span>}
    </a>
  );
}
