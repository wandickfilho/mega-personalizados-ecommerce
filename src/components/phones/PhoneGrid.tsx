import { SearchX } from 'lucide-react';
import type { PhoneModel } from '@/lib/types';
import PhoneCard from './PhoneCard';

interface PhoneGridProps {
  phones: PhoneModel[];
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  priorityCount?: number;
}

export default function PhoneGrid({
  phones,
  emptyTitle = 'Nenhum aparelho encontrado',
  emptyDescription = 'Tente ajustar a busca ou remover alguns filtros para ver mais opções.',
  emptyAction,
  priorityCount = 0,
}: PhoneGridProps) {
  if (phones.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-mist/60 px-6 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-navy/50 shadow-soft">
          <SearchX className="h-6 w-6" aria-hidden />
        </span>
        <h3 className="mt-4 font-display text-lg font-bold text-navy">{emptyTitle}</h3>
        <p className="mt-1 max-w-sm text-sm text-graphite/60">{emptyDescription}</p>
        {emptyAction && <div className="mt-5">{emptyAction}</div>}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3.5 min-[360px]:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {phones.map((phone, index) => (
        <PhoneCard key={phone.id} phone={phone} priority={index < priorityCount} />
      ))}
    </div>
  );
}
