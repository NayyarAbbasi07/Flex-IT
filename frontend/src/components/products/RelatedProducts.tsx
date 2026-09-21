import type { Product } from "@/types";
import { ProductGrid } from "./ProductGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="border-t border-border pt-16 md:pt-20">
      <SectionHeading
        eyebrow="You may also like"
        title="Related Products"
        description="More curated pieces from similar brands and collections."
      />
      <ProductGrid products={products} priorityCount={0} />
    </section>
  );
}
