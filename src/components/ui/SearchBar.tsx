'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  defaultValue?: string;
  className?: string;
  onSubmitted?: () => void;
  id?: string;
  tone?: 'dark' | 'light';
}

export default function SearchBar({
  defaultValue = '',
  className,
  onSubmitted,
  id,
  tone = 'dark',
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const term = value.trim();
    router.push(term ? `/celulares?q=${encodeURIComponent(term)}` : '/celulares');
    onSubmitted?.();
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn(
        'flex w-full items-center gap-2 rounded-full border py-1.5 pl-4 pr-1.5 transition focus-within:ring-2',
        tone === 'dark'
          ? 'border-line bg-[#faf9ff] focus-within:border-brand/50 focus-within:ring-brand/15'
          : 'border-line bg-white focus-within:border-navy/40 focus-within:ring-navy/15',
        className
      )}
    >
      <Search
        className={cn('h-4 w-4 shrink-0', tone === 'dark' ? 'text-graphite/50' : 'text-graphite/45')}
        aria-hidden
      />
      <label htmlFor={id} className="sr-only">
        Buscar celulares
      </label>
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Busque por modelo, marca ou armazenamento"
        className="min-w-0 flex-1 bg-transparent text-sm text-graphite placeholder:text-graphite/45 focus:outline-none"
      />
      <button
        type="submit"
        className="premium-action shrink-0 rounded-full bg-navy px-4 py-2 text-xs font-semibold text-white transition hover:bg-navy-700 active:scale-[0.98]"
      >
        Buscar
      </button>
    </form>
  );
}
