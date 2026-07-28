import { Hero } from "@/components/home/Hero";
import { FeaturedCollection } from "@/components/home/FeaturedCollection";
import { LatestShoes } from "@/components/home/LatestShoes";
import { PremiumCollections } from "@/components/home/PremiumCollections";
import { WhyChoose } from "@/components/home/WhyChoose";
import { Reviews } from "@/components/home/Reviews";
import { InstagramGallery } from "@/components/home/InstagramGallery";
import { AboutBrand } from "@/components/home/AboutBrand";
import { FAQs } from "@/components/home/FAQs";
import { CTA } from "@/components/home/CTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCollection />
      <LatestShoes />
      <PremiumCollections />
      <WhyChoose />
      <Reviews />
      <InstagramGallery />
      <AboutBrand />
      <FAQs />
      <CTA />
    </>
  );
}
