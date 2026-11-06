import HomeHero from '@/components/home/HomeHero';
import HowItWorks from '@/components/home/HowItWorks';
import CorporateGifts from '@/components/home/CorporateGifts';
import Benefits from '@/components/home/Benefits';
import ContactCTA from '@/components/home/ContactCTA';
import FeaturedPersonalizedProducts from '@/components/home/FeaturedPersonalizedProducts';
import StoreLocation from '@/components/home/StoreLocation';
import Personalized3DCarousel from '@/components/home/Personalized3DCarousel';
export default function HomePage() {

  return (
    <>
      <HomeHero />
      <FeaturedPersonalizedProducts />
      <Benefits />
      <Personalized3DCarousel />
      <HowItWorks />
      <CorporateGifts />
      <StoreLocation />
      <ContactCTA />
    </>
  );
}
