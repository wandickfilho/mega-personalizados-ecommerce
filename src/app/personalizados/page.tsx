import type { Metadata } from 'next';
import FeaturedPersonalizedProducts from '@/components/home/FeaturedPersonalizedProducts';

export const metadata: Metadata = {
  title: 'Personalizados | Mega',
  description: 'Conheça os produtos personalizados em destaque da Mega.',
};

export default async function PersonalizedCatalogPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const params = await searchParams;
  const query = Array.isArray(params.q) ? params.q[0] : params.q;
  return <main><FeaturedPersonalizedProducts query={query ?? ''} /></main>;
}
