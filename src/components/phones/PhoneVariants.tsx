'use client';

import type { PhoneCondition } from '@/lib/types';
import { CONDITION_LABEL } from '@/lib/phones';
import { cn } from '@/lib/utils';

interface PhoneVariantsProps {
  storages: string[];
  colors: { name: string; hex: string }[];
  conditions: PhoneCondition[];
  selected: { storage: string; color: string; condition: PhoneCondition };
  onStorage: (storage: string) => void;
  onColor: (color: string) => void;
  onCondition: (condition: PhoneCondition) => void;
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2.5">
      <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-navy/70">{title}</h3>
      {children}
    </div>
  );
}

export default function PhoneVariants({
  storages,
  colors,
  conditions,
  selected,
  onStorage,
  onColor,
  onCondition,
}: PhoneVariantsProps) {
  return (
    <div className="space-y-6">
      {storages.length > 1 && (
        <Block title={`Armazenamento — ${selected.storage}`}>
          <div className="flex flex-wrap gap-2">
            {storages.map((storage) => (
              <button
                key={storage}
                type="button"
                onClick={() => onStorage(storage)}
                aria-pressed={selected.storage === storage}
                className={cn(
                  'rounded-lg border px-4 py-2 text-xs font-semibold transition',
                  selected.storage === storage
                    ? 'border-navy bg-navy text-white'
                    : 'border-line bg-white text-graphite/70 hover:border-navy/40 hover:text-navy'
                )}
              >
                {storage}
              </button>
            ))}
          </div>
        </Block>
      )}

      {colors.length > 0 && (
        <Block title={`Cor — ${selected.color}`}>
          <div className="flex flex-wrap items-center gap-3">
            {colors.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => onColor(color.name)}
                title={color.name}
                aria-label={color.name}
                aria-pressed={selected.color === color.name}
                className={cn(
                  'relative h-9 w-9 rounded-full border transition',
                  selected.color === color.name
                    ? 'ring-2 ring-navy ring-offset-2'
                    : 'ring-1 ring-black/10 hover:ring-navy/40'
                )}
                style={{ backgroundColor: color.hex }}
              >
                <span className="sr-only">{color.name}</span>
              </button>
            ))}
          </div>
        </Block>
      )}

      {conditions.length > 0 && (
        <Block title="Condição">
          <div className="flex flex-wrap gap-2">
            {conditions.map((condition) => (
              <button
                key={condition}
                type="button"
                onClick={() => onCondition(condition)}
                aria-pressed={selected.condition === condition}
                className={cn(
                  'rounded-full border px-4 py-2 text-xs font-semibold transition',
                  selected.condition === condition
                    ? 'border-navy bg-navy text-white'
                    : 'border-line bg-white text-graphite/70 hover:border-navy/40 hover:text-navy'
                )}
              >
                {CONDITION_LABEL[condition]}
              </button>
            ))}
          </div>
        </Block>
      )}
    </div>
  );
}
