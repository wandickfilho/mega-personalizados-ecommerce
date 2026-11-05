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

const logoSize = { sm: 'h-10 w-10', md: 'h-12 w-12', lg: 'h-16 w-16' };

export default function BrandLogo({
  size = 'md',
  tone = 'dark',
  withWordmark = true,
  className,
}: BrandLogoProps) {
  return (
    <Link
      href="/"
      aria-label={`${SITE.name} — Início`}
      className={cn('group inline-flex items-center gap-2.5', className)}
    >
      <Image
        src={SITE.logo}
        alt=""
        width={128}
        height={128}
        priority={size !== 'sm'}
        className={cn('shrink-0 object-contain transition duration-300 group-hover:scale-[1.03]', logoSize[size])}
      />
      {withWordmark && <span className={cn('hidden font-display text-sm font-bold tracking-[-0.03em] sm:inline', tone === 'light' ? 'text-white' : 'text-navy')}>Mega Personalizados</span>}
    </Link>
  );
}
