'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import type { PhoneModel } from '@/lib/types';
import {
  CONDITION_LABEL,
  getModelConditions,
  getStorages,
  getModelAvailability,
  hasPrice,
  priceLabel,
} from '@/lib/phones';
import AvailabilityBadge from './AvailabilityBadge';
import ProductImagePlaceholder from './ProductImagePlaceholder';
import AddToCartButton from '@/components/cart/AddToCartButton';
import { BRANDS } from '@/data/brands';

interface PhoneCardProps {
  phone: PhoneModel;
  priority?: boolean;
}

export default function PhoneCard({ phone, priority = false }: PhoneCardProps) {
  const image = phone.images[0] ?? phone.variants.find((v) => v.images[0])?.images[0];
  const [imageFailed, setImageFailed] = useState(false);
  const storages = getStorages(phone);
  const conditions = getModelConditions(phone);
  const availability = getModelAvailability(phone);
  const brandName = BRANDS.find((b) => b.id === phone.brand)?.name ?? phone.brand;
  const price = priceLabel(phone);

  return (
    <article className="product-card group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition duration-500 ease-out hover:-translate-y-1.5 hover:border-brand/35 hover:shadow-premium">
      <Link
        href={`/celulares/${phone.slug}`}
        className="product-card-media relative block aspect-[4/5] w-full overflow-hidden bg-mist transition-colors duration-500"
        aria-label={`Ver detalhes de ${phone.name}`}
      >
        {image && !imageFailed ? (
          <Image
            src={image}
            alt={`${brandName} ${phone.name}`}
            fill
            priority={priority}
            sizes="(max-width: 359px) 100vw, (max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-110 sm:p-5"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <ProductImagePlaceholder />
        )}

        <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-col items-start gap-1.5">
          {phone.isNew && (
            <span className="rounded-full bg-navy px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              Novidade
            </span>
          )}
          {phone.isDemo && <span className="rounded-full bg-white/85 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-navy shadow-soft">Demonstração</span>}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-navy/60">
          {brandName} · {phone.category}
        </span>

        <h3 className="mt-1">
          <Link
            href={`/celulares/${phone.slug}`}
            className="line-clamp-1 font-display text-sm font-bold text-navy transition-colors hover:text-brand sm:text-[15px]"
          >
            {phone.name}
          </Link>
        </h3>

        <p className="mt-1.5 line-clamp-1 text-[11px] text-graphite/55">
          {storages.length > 1 ? `${storages.join(' · ')}` : storages[0]}
          {conditions.length > 0 && ` • ${conditions.map((c) => CONDITION_LABEL[c]).join(' / ')}`}
        </p>

        <div className="mt-4 border-t border-line pt-3">
          <span className="font-display text-[1.15rem] font-bold tracking-tight text-navy">
            {price}
          </span>
          {!hasPrice(phone) && (
            <span className="ml-2 align-middle text-[10px] font-medium uppercase tracking-wider text-graphite/45">
              Consulte
            </span>
          )}
        </div>

        <div className="mt-2.5">
          <AvailabilityBadge availability={availability} />
        </div>

        <AddToCartButton phone={phone} label="Adicionar" className="mt-4 w-full" />
        <Link
          href={`/celulares/${phone.slug}`}
          className="premium-action mt-2 inline-flex items-center justify-between gap-1.5 rounded-xl bg-mist px-4 py-3 text-xs font-bold text-navy transition duration-300 hover:-translate-y-0.5 hover:bg-navy hover:text-white hover:shadow-soft"
        >
          Ver detalhes
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
