import BrandSection from '@/components/home/BrandSection';
import FeaturedPhones from '@/components/home/FeaturedPhones';
import NewArrivals from '@/components/home/NewArrivals';
import WhyChoose from '@/components/home/WhyChoose';
import StoreShowcase from '@/components/home/StoreShowcase';
import ContactCTA from '@/components/home/ContactCTA';
import LocationSection from '@/components/home/LocationSection';
import CinematicHero from '@/components/home/CinematicHero';
import CategoryBento from '@/components/home/CategoryBento';

export default function HomePage() {
  return (
    <>
      <CinematicHero />
      <CategoryBento />
      <BrandSection />
      <FeaturedPhones />
      <NewArrivals />
      <WhyChoose />
      <StoreShowcase />
      <LocationSection />
      <ContactCTA />
    </>
  );
}
