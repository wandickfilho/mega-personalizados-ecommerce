import HomeHero from '@/components/home/HomeHero';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import PersonalizedShowcase from '@/components/home/PersonalizedShowcase';
import PersonalizationStudio from '@/components/home/PersonalizationStudio';
import HowItWorks from '@/components/home/HowItWorks';
import CorporateGifts from '@/components/home/CorporateGifts';
import Benefits from '@/components/home/Benefits';
import ContactCTA from '@/components/home/ContactCTA';
import FeaturedPersonalizedProducts from '@/components/home/FeaturedPersonalizedProducts';
import StoreLocation from '@/components/home/StoreLocation';
import Personalized3DCarousel from '@/components/home/Personalized3DCarousel';
import { getCategory } from '@/config/categories';

interface HomePageProps {
  searchParams: Promise<{ categoria?: string | string[] }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const categoryParam = Array.isArray(params.categoria)
    ? params.categoria[0]
    : params.categoria;
  const initialCategory = getCategory(categoryParam)?.id;

  return (
    <>
      <HomeHero />
      <Benefits />
      <Personalized3DCarousel />
      <CategoryShowcase />
       <PersonalizedShowcase
        key={initialCategory ?? 'all'}
        initialCategory={initialCategory}
       />
        <FeaturedPersonalizedProducts />
       <PersonalizationStudio />
      <HowItWorks />
      <CorporateGifts />
       <StoreLocation />
       <ContactCTA />
    </>
  );
}
