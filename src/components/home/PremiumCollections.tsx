import Link from "next/link";
import { collections } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { SectionHeading, AnimatedSection } from "@/components/ui/SectionHeading";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

export function PremiumCollections() {
  const items = collections.filter((c) => c.featured);

  return (
    <AnimatedSection className="py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow="Brands"
          title="Premium Collections"
          description="Explore curated edits from the world's most iconic sneaker brands."
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
          {items.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.slug}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-border bg-muted transition-all duration-500 hover:shadow-md focus-ring"
            >
              <PlaceholderImage
                image={collection.image}
                fill
                zoomOnHover
                sizes="(max-width: 768px) 50vw, 20vw"
                className="absolute inset-0 h-full w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <h3 className="font-display text-lg font-bold text-white sm:text-xl">
                  {collection.name}
                </h3>
                <p className="mt-1 text-xs text-white/70">
                  {collection.productCount} pieces
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/collections"
            className="text-sm font-semibold underline-offset-4 transition hover:underline focus-ring rounded-sm"
          >
            Browse all collections →
          </Link>
        </div>
      </Container>
    </AnimatedSection>
  );
}
