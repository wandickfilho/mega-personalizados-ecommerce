import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import type { Availability } from '@/lib/types';
import { AVAILABILITY_LABEL } from '@/lib/phones';
import { cn } from '@/lib/utils';

const STYLES: Record<Availability, { wrap: string; icon: typeof CheckCircle2 }> = {
  disponivel: {
    wrap: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15',
    icon: CheckCircle2,
  },
  'sob-consulta': {
    wrap: 'bg-amber-50 text-amber-700 ring-amber-600/15',
    icon: Clock,
  },
  indisponivel: {
    wrap: 'bg-graphite/5 text-graphite/60 ring-graphite/10',
    icon: XCircle,
  },
};

interface AvailabilityBadgeProps {
  availability: Availability;
  className?: string;
  withIcon?: boolean;
}

export default function AvailabilityBadge({
  availability,
  className,
  withIcon = true,
}: AvailabilityBadgeProps) {
  const style = STYLES[availability];
  const Icon = style.icon;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset',
        style.wrap,
        className
      )}
    >
      {withIcon && <Icon className="h-3.5 w-3.5" aria-hidden />}
      {AVAILABILITY_LABEL[availability]}
    </span>
  );
}
