'use client';

import type { AnchorHTMLAttributes } from 'react';
import { buildWhatsAppLink, CUSTOM_ORDER_PERSONALIZATION_MESSAGE, WHATSAPP_ENABLED } from '@/config/site';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';

const DISABLED_HINT = 'Atendimento por WhatsApp ainda não configurado.';

export default function PersonalizedAssistantBanner() {
  const href = buildWhatsAppLink(CUSTOM_ORDER_PERSONALIZATION_MESSAGE);
  const enabled = WHATSAPP_ENABLED && href !== '';

  const linkAttributes: AnchorHTMLAttributes<HTMLAnchorElement> = enabled
    ? {
        href,
        target: '_blank',
        rel: 'noopener noreferrer' as const,
        title: 'Conversar com vendedor',
        'aria-label': 'Conversar com vendedor pelo WhatsApp',
      }
    : {
        href: undefined,
        'aria-disabled': true,
        role: 'button',
        title: DISABLED_HINT,
        'aria-label': DISABLED_HINT,
        onClick: (event: React.MouseEvent<HTMLAnchorElement>) => event.preventDefault(),
      };

  return (
    <div className="mega-assistant-banner" role="region" aria-label="Personalização assistida por vendedor">
      <div className="mega-assistant-copy">
        <span className="mega-assistant-kicker">PERSONALIZAÇÃO ASSISTIDA</span>
        <h2 className="mega-assistant-title">Sua ideia, do seu jeito.</h2>
        <p className="mega-assistant-description">
          Tem uma criação especial em mente? Converse com nossa equipe, envie suas referências e personalize seu produto com atendimento direto.
        </p>
        <p className="mega-assistant-aux">
          Prefere criar sozinho? Escolha um produto logo abaixo e personalize online.
        </p>
      </div>
      <a {...linkAttributes} className="mega-assistant-button">
        <WhatsAppIcon className="h-5 w-5" />
        <span>Conversar com vendedor</span>
      </a>
    </div>
  );
}
