'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, ZoomIn } from 'lucide-react';
import ProductImagePlaceholder from './ProductImagePlaceholder';
import { cn } from '@/lib/utils';

interface PhoneGalleryProps {
  images: string[];
  alt: string;
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export default function PhoneGallery({
  images,
  alt,
  selectedIndex,
  onSelect,
}: PhoneGalleryProps) {
  const [zoomOpen, setZoomOpen] = useState(false);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const current = images[selectedIndex] ?? images[0];
  const currentFailed = !current || failedImages.includes(current);

  const markImageFailed = (src: string) => {
    setFailedImages((failed) => (failed.includes(src) ? failed : [...failed, src]));
  };

  useEffect(() => {
    if (!zoomOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoomOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [zoomOpen]);

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-line bg-mist sm:aspect-square">
        {!currentFailed && current ? (
          <>
            <Image
              src={current}
              alt={alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-contain bg-white p-4 object-center sm:p-8"
              onError={() => markImageFailed(current)}
            />
            <button
              type="button"
              onClick={() => setZoomOpen(true)}
              aria-label="Ampliar imagem"
              className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-navy shadow-soft backdrop-blur transition hover:bg-white"
            >
              <ZoomIn className="h-4 w-4" aria-hidden />
            </button>
          </>
        ) : (
          <ProductImagePlaceholder />
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
          {images.map((img, index) => (
            <button
              key={img}
              type="button"
              onClick={() => onSelect(index)}
              aria-label={`Ver imagem ${index + 1}`}
              aria-current={selectedIndex === index}
              className={cn(
                'relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-mist transition sm:h-20 sm:w-20',
                selectedIndex === index
                  ? 'border-navy ring-1 ring-navy'
                  : 'border-line opacity-70 hover:opacity-100'
              )}
            >
              {failedImages.includes(img) ? (
                <ProductImagePlaceholder compact />
              ) : (
                <Image
                  src={img}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-contain bg-white p-1"
                  onError={() => markImageFailed(img)}
                />
              )}
            </button>
          ))}
        </div>
      )}

      {zoomOpen && current && !currentFailed && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Imagem ampliada"
        >
          <button
            type="button"
            onClick={() => setZoomOpen(false)}
            aria-label="Fechar imagem ampliada"
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-navy transition hover:bg-white"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative h-[80vh] w-full max-w-3xl">
            <Image
              src={current}
              alt={alt}
              fill
              sizes="100vw"
              className="object-contain"
              onError={() => {
                markImageFailed(current);
                setZoomOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
