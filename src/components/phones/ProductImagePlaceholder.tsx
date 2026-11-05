import { cn } from '@/lib/utils';

interface ProductImagePlaceholderProps {
  className?: string;
  compact?: boolean;
}

export default function ProductImagePlaceholder({
  className,
  compact = false,
}: ProductImagePlaceholderProps) {
  return (
    <div
      className={cn(
        'product-image-placeholder relative flex h-full w-full items-center justify-center overflow-hidden',
        className
      )}
      role="img"
      aria-label="Imagem do produto em breve"
    >
      <span className={cn('product-image-placeholder-label', compact && 'product-image-placeholder-label-compact')}>
        Em breve...
      </span>
    </div>
  );
}
