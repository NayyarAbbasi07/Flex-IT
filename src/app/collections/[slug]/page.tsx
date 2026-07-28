import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  collections,
  filterProducts,
  getCollectionBySlug,
} from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { ProductGrid } from "@/components/products/ProductGrid";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) return { title: "Collection not found" };
  return {
    title: collection.name,
    description: collection.description,
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();

  const products = filterProducts({
    collection: collection.slug,
    sort: "newest",
  });

  return (
    <div className="pb-20 pt-28 md:pb-28 md:pt-32">
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
              <Link
                href="/collections"
                className="transition hover:text-foreground focus-ring rounded-sm"
              >
                Collections
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-foreground">{collection.name}</li>
          </ol>
        </nav>

        <div className="mb-10 md:mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Collection
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            {collection.name}
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground sm:text-lg">
            {collection.description}
          </p>
        </div>

        <ProductGrid products={products} />
      </Container>
    </div>
  );
}
