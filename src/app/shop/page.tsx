import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ShopCatalog } from "@/components/products/ShopCatalog";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse curated imported thrift sneakers from Nike, Adidas, New Balance, HOKA, and more at Flex it!",
};

export default function ShopPage() {
  return (
    <div className="pb-20 pt-28 md:pb-28 md:pt-32">
      <Container>
        <div className="mb-10 md:mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Catalog
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Shop
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground sm:text-lg">
            Premium curated imported thrift sneakers. Filter by brand, size,
            condition, and availability.
          </p>
        </div>
        <ShopCatalog />
      </Container>
    </div>
  );
}
