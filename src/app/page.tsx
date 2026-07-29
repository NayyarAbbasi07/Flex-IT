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
import {
  loadCollections,
  loadFeaturedProducts,
  loadLatestProducts,
} from "@/lib/storefront";
import { getStoreSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ROTATOR_BRANDS = ["Nike", "Adidas", "Puma", "HOKA"] as const;

async function loadHeroContent() {
  try {
    const hero = await prisma.heroSection.findFirst({
      where: { enabled: true },
      orderBy: { updatedAt: "desc" },
    });
    return hero;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const [featured, latest, collections, settings, hero] = await Promise.all([
    loadFeaturedProducts(8),
    loadLatestProducts(8),
    loadCollections(),
    getStoreSettings(),
    loadHeroContent(),
  ]);

  const rotatorShoes = ROTATOR_BRANDS.map(
    (brand) =>
      featured.find((p) => p.brand === brand) ||
      latest.find((p) => p.brand === brand)
  ).filter((p): p is NonNullable<typeof p> => Boolean(p));

  const shoes =
    rotatorShoes.length > 0
      ? rotatorShoes
      : featured.slice(0, 4).length
        ? featured.slice(0, 4)
        : latest.slice(0, 4);

  return (
    <>
      <Hero
        shoes={shoes}
        brandName={settings.brandName}
        heading={hero?.heading || "Curated Fashion."}
        description={
          hero?.description ||
          "Imported Premium Thrift Sneakers Curated For Every Style."
        }
        primaryCtaText={hero?.primaryCtaText}
        primaryCtaHref={hero?.primaryCtaHref}
        secondaryCtaText={hero?.secondaryCtaText}
        whatsappNumber={settings.whatsappNumber}
        whatsappMessage={settings.whatsappDefaultMessage}
      />
      <FeaturedCollection />
      <LatestShoes />
      <PremiumCollections collections={collections} />
      <WhyChoose />
      <Reviews />
      <InstagramGallery />
      <AboutBrand />
      <FAQs />
      <CTA
        whatsappNumber={settings.whatsappNumber}
        whatsappMessage={settings.whatsappDefaultMessage}
      />
    </>
  );
}
