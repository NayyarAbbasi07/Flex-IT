import type { Metadata } from "next";
import Link from "next/link";
import { collections } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Explore Flex it! brand collections — Nike, Adidas, New Balance, HOKA, ASICS, and more.",
};

export default function CollectionsPage() {
  return (
    <div className="pb-20 pt-28 md:pb-28 md:pt-32">
      <Container>
        <div className="mb-10 md:mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Brands
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Collections
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground sm:text-lg">
            Dynamic brand edits designed to scale as we add clothing,
            accessories, and more categories.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.slug}`}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-500 hover:shadow-md focus-ring"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                <PlaceholderImage
                  image={collection.image}
                  fill
                  zoomOnHover
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="absolute inset-0 h-full w-full"
                />
              </div>
              <div className="p-5 sm:p-6">
                <h2 className="font-display text-2xl font-bold tracking-tight">
                  {collection.name}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {collection.description}
                </p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {collection.productCount} products
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
