'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { PhoneCondition, PhoneModel } from '@/lib/types';
import {
  CONDITION_LABEL,
  buildAvailabilityMessage,
  buildProductMessage,
  getStorages,
} from '@/lib/phones';
import { formatCurrency } from '@/lib/utils';
import PhoneGallery from './PhoneGallery';
import PhoneVariants from './PhoneVariants';
import AvailabilityBadge from './AvailabilityBadge';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { BRANDS } from '@/data/brands';
import AddToCartButton from '@/components/cart/AddToCartButton';

interface PhoneDetailProps {
  phone: PhoneModel;
}

function pickInitial(phone: PhoneModel) {
  const preferred =
    phone.variants.find((v) => v.availability === 'disponivel') ?? phone.variants[0];
  return {
    storage: preferred.storage,
    color: preferred.colorName,
    condition: preferred.condition,
  };
}

export default function PhoneDetail({ phone }: PhoneDetailProps) {
  const [selection, setSelection] = useState(() => pickInitial(phone));
  const [imageIndex, setImageIndex] = useState(0);

  const storages = getStorages(phone);

  const colors = useMemo(() => {
    const map = new Map<string, string>();
    phone.variants
      .filter((v) => v.storage === selection.storage)
      .forEach((v) => {
        if (!map.has(v.colorName)) map.set(v.colorName, v.colorHex);
      });
    return Array.from(map, ([name, hex]) => ({ name, hex }));
  }, [phone.variants, selection.storage]);

  const conditions = useMemo(() => {
    const set = new Set<PhoneCondition>();
    phone.variants
      .filter((v) => v.storage === selection.storage && v.colorName === selection.color)
      .forEach((v) => set.add(v.condition));
    return (['novo', 'seminovo'] as PhoneCondition[]).filter((c) => set.has(c));
  }, [phone.variants, selection.storage, selection.color]);

  const variant = useMemo(
    () =>
      phone.variants.find(
        (v) =>
          v.storage === selection.storage &&
          v.colorName === selection.color &&
          v.condition === selection.condition
      ),
    [phone.variants, selection]
  );

  const galleryImages = variant?.images.length ? variant.images : phone.images;

  const updateSelection = (next: typeof selection) => {
    setSelection(next);
    setImageIndex(0);
  };

  const handleStorage = (storage: string) => {
    const nextColors = phone.variants.filter((v) => v.storage === storage);
    const color = nextColors.some((v) => v.colorName === selection.color)
      ? selection.color
      : nextColors[0]?.colorName ?? selection.color;
    const nextConditions = nextColors.filter((v) => v.colorName === color);
    const condition = nextConditions.some((v) => v.condition === selection.condition)
      ? selection.condition
      : nextConditions[0]?.condition ?? selection.condition;
    updateSelection({ storage, color, condition });
  };

  const handleColor = (color: string) => {
    const nextConditions = phone.variants.filter(
      (v) => v.storage === selection.storage && v.colorName === color
    );
    const condition = nextConditions.some((v) => v.condition === selection.condition)
      ? selection.condition
      : nextConditions[0]?.condition ?? selection.condition;
    updateSelection({ ...selection, color, condition });
  };

  const handleCondition = (condition: PhoneCondition) => {
    updateSelection({ ...selection, condition });
  };

  const brandName = BRANDS.find((b) => b.id === phone.brand)?.name ?? phone.brand;
  const availability = variant?.availability ?? 'indisponivel';
  const unavailable = availability === 'indisponivel';

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
      {/* Galeria */}
      <div>
        <nav
          aria-label="Navegação estrutural"
          className="mb-4 flex items-center gap-1.5 text-[11px] text-graphite/50"
        >
          <Link href="/" className="transition hover:text-navy">
            Início
          </Link>
          <ChevronRight className="h-3 w-3" aria-hidden />
          <Link href="/celulares" className="transition hover:text-navy">
            Celulares
          </Link>
          <ChevronRight className="h-3 w-3" aria-hidden />
          <span className="truncate text-graphite/80">{phone.name}</span>
        </nav>

        <PhoneGallery
          images={galleryImages}
          alt={`${brandName} ${phone.name}`}
          selectedIndex={imageIndex}
          onSelect={setImageIndex}
        />
      </div>

      {/* Informações e variações */}
      <div className="space-y-6">
        <div>
          <Link
            href={`/celulares?marca=${phone.brand}`}
            className="text-[11px] font-bold uppercase tracking-[0.16em] text-navy/60 transition hover:text-brand"
          >
            {brandName}
          </Link>
          {phone.isDemo && <span className="ml-2 rounded-full bg-mist px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-brand">Item demonstrativo</span>}
          <h1 className="mt-1.5 font-display text-3xl font-bold leading-tight tracking-tight text-navy sm:text-4xl">
            {phone.name}
          </h1>
          <p className="mt-3 max-w-prose text-sm leading-relaxed text-graphite/65">
            {phone.description}
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-mist/60 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="font-display text-3xl font-bold tracking-tight text-navy">
                {variant?.price != null ? formatCurrency(variant.price) : 'Preço sob consulta'}
              </span>
              {variant?.price != null && (
                <p className="mt-0.5 text-xs text-graphite/55">
                  {CONDITION_LABEL[selection.condition]} • {selection.storage} • {selection.color}
                </p>
              )}
            </div>
            <AvailabilityBadge availability={availability} />
          </div>
        </div>

        <PhoneVariants
          storages={storages}
          colors={colors}
          conditions={conditions}
          selected={selection}
          onStorage={handleStorage}
          onColor={handleColor}
          onCondition={handleCondition}
        />

        <div className="space-y-2.5">
          {variant && !unavailable && <AddToCartButton phone={phone} variant={variant} className="w-full" />}
          {unavailable ? (
            <WhatsAppButton
              variant="solid"
              label="Consultar reposição"
              message={buildAvailabilityMessage(phone, variant)}
              className="w-full"
            />
          ) : (
            <WhatsAppButton
              variant="solid"
              label="Tenho interesse no WhatsApp"
              message={buildProductMessage(phone, variant)}
              className="w-full"
            />
          )}
          <p className="text-center text-[11px] leading-relaxed text-graphite/50">
            {unavailable
              ? 'Este aparelho está indisponível no momento. Consulte a reposição pelo WhatsApp.'
              : 'Combine valores, formas de pagamento e retirada diretamente com a loja.'}
          </p>
        </div>

        {/* Ficha técnica */}
        {phone.specs.length > 0 && (
          <div className="pt-2">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-navy/70">
              Ficha técnica
            </h2>
            <dl className="mt-3 divide-y divide-line rounded-2xl border border-line">
              {phone.specs.map((spec) => (
                <div key={spec.label} className="flex items-start justify-between gap-4 px-4 py-3">
                  <dt className="text-xs font-medium text-graphite/55">{spec.label}</dt>
                  <dd className="text-right text-xs font-semibold text-graphite">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
