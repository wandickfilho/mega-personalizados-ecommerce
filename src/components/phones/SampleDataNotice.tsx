import { Info } from 'lucide-react';
import { USING_SAMPLE_DATA } from '@/config/site';

interface SampleDataNoticeProps {
  className?: string;
}

/** Aviso discreto de que os dados exibidos são exemplos de desenvolvimento. */
export default function SampleDataNotice({ className }: SampleDataNoticeProps) {
  if (!USING_SAMPLE_DATA) return null;
  return (
    <p
      className={`inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-[11px] font-medium text-amber-700 ring-1 ring-inset ring-amber-600/15 ${className ?? ''}`}
    >
      <Info className="h-3.5 w-3.5" aria-hidden />
      Dados de exemplo para demonstração — sujeitos a alteração.
    </p>
  );
}
