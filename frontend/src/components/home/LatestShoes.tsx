import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { loadLatestProducts } from "@/lib/storefront";
import { Container } from "@/components/ui/Container";
import { SectionHeading, AnimatedSection } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ProductGrid } from "@/components/products/ProductGrid";

export async function LatestShoes() {
  const products = await loadLatestProducts(8);

  return (
    <AnimatedSection className="bg-muted/40 py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow="Just In"
          title="Latest Shoes"
          description="Fresh drops from our latest curated import selection."
          action={
            <Link href="/shop?sort=newest" className="focus-ring rounded-xl">
              <Button variant="outline">
                Shop newest
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </Link>
          }
        />
        <ProductGrid products={products} priorityCount={0} />
      </Container>
    </AnimatedSection>
  );
}
