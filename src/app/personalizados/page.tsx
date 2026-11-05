import type { Metadata } from 'next';
import FeaturedPersonalizedProducts from '@/components/home/FeaturedPersonalizedProducts';

export const metadata: Metadata = {
  title: 'Personalizados | Mega',
  description: 'Conheça os produtos personalizados em destaque da Mega.',
};

export default function PersonalizedCatalogPage() {
  return <main><FeaturedPersonalizedProducts catalog /></main>;
}
