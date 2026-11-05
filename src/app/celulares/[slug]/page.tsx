import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PHONES, getPhoneBySlug } from '@/data/phones';
import { sortModels } from '@/lib/phones';
import PhoneDetail from '@/components/phones/PhoneDetail';
import PhoneGrid from '@/components/phones/PhoneGrid';
import SampleDataNotice from '@/components/phones/SampleDataNotice';
import { BRANDS } from '@/data/brands';
import { SITE } from '@/config/site';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PHONES.map((phone) => ({ slug: phone.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const phone = getPhoneBySlug(slug);
  if (!phone) return { title: 'Aparelho não encontrado' };

  const brandName = BRANDS.find((b) => b.id === phone.brand)?.name ?? phone.brand;
  return {
    title: `${brandName} ${phone.name} | ${SITE.name}`,
    description: phone.description,
  };
}

export default async function PhonePage({ params }: PageProps) {
  const { slug } = await params;
  const phone = getPhoneBySlug(slug);
  if (!phone) notFound();

  const related = sortModels(
    PHONES.filter((p) => p.id !== phone.id && p.brand === phone.brand),
    'recentes'
  );
  const fallback = sortModels(
    PHONES.filter((p) => p.id !== phone.id && p.brand !== phone.brand),
    'recentes'
  );
  const relatedPhones = [...related, ...fallback].slice(0, 4);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <PhoneDetail phone={phone} />

        <div className="mt-6">
          <SampleDataNotice />
        </div>

        {relatedPhones.length > 0 && (
          <section className="mt-16 border-t border-line pt-12">
            <div className="mb-8">
              <span className="section-kicker">Continue explorando</span>
              <h2 className="section-title mt-3">Aparelhos relacionados</h2>
            </div>
            <PhoneGrid phones={relatedPhones} />
          </section>
        )}
      </div>
    </div>
  );
}
