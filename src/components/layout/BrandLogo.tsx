import Link from 'next/link';
import Image from 'next/image';
import { SITE } from '@/config/site';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  tone?: 'light' | 'dark';
  withWordmark?: boolean;
  className?: string;
}

const markSize = {
  sm: 'h-9',
  md: 'h-11',
  lg: 'h-16',
};

const textSize = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
};

export default function BrandLogo({
  size = 'md',
  tone = 'light',
  withWordmark = false,
  className,
}: BrandLogoProps) {
  return (
    <Link
      href="/"
      aria-label={`${SITE.name} — Início`}
      className={cn('group inline-flex items-center gap-3', className)}
    >
      <span
        className={cn(
          'inline-flex shrink-0 items-center',
          markSize[size]
        )}
      >
        {/* Logo para o modo claro */}
        <Image
          src="/logos/logo-cellshop-light.png"
          alt={SITE.name}
          width={2172}
          height={724}
          className="block h-full w-auto object-contain object-left dark:hidden"
          priority={size !== 'lg'}
        />

        {/* Logo para o modo escuro */}
        <Image
          src="/logos/logo-cellshop-dark.png"
          alt={SITE.name}
          width={2172}
          height={724}
          className="hidden h-full w-auto object-contain object-left dark:block"
          priority={size !== 'lg'}
        />
      </span>

      {withWordmark && (
        <span
          className={cn(
            'font-display font-bold leading-none tracking-tight',
            textSize[size],
            tone === 'light' ? 'text-white' : 'text-navy'
          )}
        >
          CellShop
        </span>
      )}
    </Link>
  );
}
