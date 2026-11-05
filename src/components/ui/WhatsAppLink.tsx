'use client';

import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { buildWhatsAppLink, WHATSAPP_ENABLED } from '@/config/site';
import { cn } from '@/lib/utils';
import WhatsAppIcon from './WhatsAppIcon';

const DISABLED_HINT = 'Atendimento via WhatsApp será ativado em breve.';

interface WhatsAppLinkProps {
  message: string;
  className?: string;
  children?: ReactNode;
  showIcon?: boolean;
  iconClassName?: string;
}

export default function WhatsAppLink({
  message,
  className,
  children,
  showIcon = false,
  iconClassName,
}: WhatsAppLinkProps) {
  const href = buildWhatsAppLink(message);
  const enabled = WHATSAPP_ENABLED && href !== '';

  const attributes: AnchorHTMLAttributes<HTMLAnchorElement> = enabled
    ? {
        href,
        target: '_blank',
        rel: 'noopener noreferrer' as const,
        title: 'Falar no WhatsApp',
        'aria-label': 'Falar no WhatsApp',
      }
    : {
        href: undefined,
        'aria-disabled': true,
        title: DISABLED_HINT,
        role: 'button',
        onClick: (e: React.MouseEvent<HTMLAnchorElement>) => e.preventDefault(),
      };

  return (
    <a {...attributes} className={cn(enabled ? '' : 'cursor-not-allowed', className)}>
      {showIcon && <WhatsAppIcon className={iconClassName ?? 'h-4 w-4'} />}
      {children}
    </a>
  );
}