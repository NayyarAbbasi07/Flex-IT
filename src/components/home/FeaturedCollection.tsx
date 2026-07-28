import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedProducts } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { SectionHeading, AnimatedSection } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ProductGrid } from "@/components/products/ProductGrid";

export function FeaturedCollection() {
  const products = getFeaturedProducts(4);

  return (
    <AnimatedSection className="py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow="Featured"
          title="Featured Collection"
          description="Hand-picked imported sneakers with premium presence and verified condition."
          action={
            <Link href="/shop?featured=true" className="focus-ring rounded-xl">
              <Button variant="outline">
                View all
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </Link>
          }
        />
        <ProductGrid products={products} />
      </Container>
    </AnimatedSection>
  );
}
