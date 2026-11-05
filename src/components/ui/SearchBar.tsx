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
  targetPath?: string;
  targetHash?: string;
  placeholder?: string;
  label?: string;
}

export default function SearchBar({
  defaultValue = '',
  className,
  onSubmitted,
  id,
  tone = 'dark',
  targetPath = '/celulares',
  targetHash = '',
  placeholder = 'Buscar no catálogo',
  label = 'Buscar no catálogo',
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const term = value.trim();
    const query = term ? `?q=${encodeURIComponent(term)}` : '';
    router.push(`${targetPath}${query}${targetHash}`);
    onSubmitted?.();
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn(
        'flex w-full items-center gap-2 rounded-full border py-1.5 pl-4 pr-1.5 transition focus-within:ring-2',
        tone === 'dark'
          ? 'border-line bg-mist/70 focus-within:border-brand/50 focus-within:ring-brand/15'
          : 'border-line bg-white focus-within:border-brand/50 focus-within:ring-brand/15',
        className
      )}
    >
      <Search className="h-4 w-4 shrink-0 text-graphite/45" aria-hidden />
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm text-graphite placeholder:text-graphite/40 focus:outline-none"
      />
      <button
        type="submit"
        className="premium-action shrink-0 rounded-full bg-brand px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-dark active:scale-[0.98]"
      >
        Buscar
      </button>
    </form>
  );
}
