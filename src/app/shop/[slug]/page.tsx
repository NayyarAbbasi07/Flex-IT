import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getRelatedProducts,
  products,
} from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { siteConfig } from "@/lib/config";
import { Container } from "@/components/ui/Container";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductInfo } from "@/components/products/ProductInfo";
import { RelatedProducts } from "@/components/products/RelatedProducts";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product not found" };

  const title = `${product.brand} ${product.name}`;
  const description = product.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${siteConfig.url}/shop/${product.slug}`,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.brand} ${product.name}`,
    description: product.description,
    brand: { "@type": "Brand", name: product.brand },
    color: product.color,
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency,
      price: product.price,
      availability:
        product.availability === "available"
          ? "https://schema.org/InStock"
          : product.availability === "sold"
            ? "https://schema.org/SoldOut"
            : "https://schema.org/PreOrder",
      url: `${siteConfig.url}/shop/${product.slug}`,
    },
  };

  return (
    <div className="pb-28 pt-28 md:pb-28 md:pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container>
        <nav className="mb-8 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="transition hover:text-foreground focus-ring rounded-sm">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/shop" className="transition hover:text-foreground focus-ring rounded-sm">
                Shop
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-foreground">{product.name}</li>
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <ProductGallery product={product} />
          <ProductInfo product={product} />
        </div>

        <p className="sr-only">
          Price {formatPrice(product.price)} for {product.brand} {product.name}
        </p>

        <div className="mt-20 md:mt-28">
          <RelatedProducts products={related} />
        </div>
      </Container>
    </div>
  );
}
