import { WHATSAPP_GENERAL_MESSAGE } from '@/config/site';
import WhatsAppButton from './WhatsAppButton';

export default function FloatingWhatsApp() {
  return (
    <div className="fixed bottom-5 right-4 z-40 sm:bottom-7 sm:right-6">
      <WhatsAppButton
        variant="floating"
        message={WHATSAPP_GENERAL_MESSAGE}
        label="Falar no WhatsApp"
      />
    </div>
  );
}
