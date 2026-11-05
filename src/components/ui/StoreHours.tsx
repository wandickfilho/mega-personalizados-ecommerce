import { STORE_HOURS_DISPLAY } from '@/config/storeHours';
import StoreOpeningStatus from './StoreOpeningStatus';
import { cn } from '@/lib/utils';

interface StoreHoursProps {
  compact?: boolean;
  inverse?: boolean;
  className?: string;
}

export default function StoreHours({ compact = false, inverse = false, className }: StoreHoursProps) {
  return (
    <section className={cn('store-hours', compact && 'store-hours-compact', inverse && 'store-hours-inverse', className)} aria-label="Horário de atendimento">
      <h2 className="store-hours-title">Horário de atendimento</h2>
      <dl className="store-hours-list">
        {STORE_HOURS_DISPLAY.map(({ label, hours }) => (
          <div key={label}><dt>{label}</dt><dd>{hours}</dd></div>
        ))}
      </dl>
      <StoreOpeningStatus />
    </section>
  );
}
