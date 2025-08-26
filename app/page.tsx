import { HeroSection } from "@/components/home/hero-section";
import { FeaturedLocations } from "@/components/home/featured-locations";
import { UniversitySearch } from "@/components/home/university-search";
// import { FeaturedUniversities } from "@/components/home/featured-universities";
import { HowItWorks } from "@/components/home/how-it-works";
import { Testimonials } from "@/components/home/testimonials";
import { LatestNews } from "@/components/home/latest-news";
import { Newsletter } from "@/components/home/newsletter";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FeaturedLocations />
      <UniversitySearch />
      {/* <FeaturedUniversities /> */}
      <HowItWorks />
      <Testimonials />
      <LatestNews />
      <Newsletter />
    </div>
  );
}
