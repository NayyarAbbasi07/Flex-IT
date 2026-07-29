import {
  getFeaturedProducts,
  getLatestProducts,
  getPublishedProducts,
  getProductBySlug,
  getRelatedProducts,
  getBrandsPublic,
} from "@/lib/catalog";
import { mapDbProduct } from "@/lib/mappers";
import {
  products as staticProducts,
  collections as staticCollections,
  getFeaturedProducts as staticFeatured,
  getLatestProducts as staticLatest,
  getProductBySlug as staticGetBySlug,
  getRelatedProducts as staticRelated,
  filterProducts as staticFilter,
} from "@/lib/data";
import type { Product, ProductFilters, Collection } from "@/types";

async function dbAvailable() {
  try {
    await getBrandsPublic();
    return true;
  } catch {
    return false;
  }
}

export async function loadFeaturedProducts(limit = 4): Promise<Product[]> {
  if (!(await dbAvailable())) return staticFeatured(limit);
  const rows = await getFeaturedProducts(limit);
  return rows.map(mapDbProduct);
}

export async function loadLatestProducts(limit = 8): Promise<Product[]> {
  if (!(await dbAvailable())) return staticLatest(limit);
  const rows = await getLatestProducts(limit);
  return rows.map(mapDbProduct);
}

export async function loadProductBySlug(slug: string): Promise<Product | null> {
  if (!(await dbAvailable())) return staticGetBySlug(slug) || null;
  const row = await getProductBySlug(slug);
  return row ? mapDbProduct(row) : null;
}

export async function loadRelatedProducts(product: Product, limit = 4) {
  if (!(await dbAvailable())) {
    return staticRelated(
      staticProducts.find((p) => p.slug === product.slug) || product,
      limit
    );
  }
  const full = await getProductBySlug(product.slug);
  if (!full) return [];
  const rows = await getRelatedProducts(full.id, full.brandId, limit);
  return rows.map(mapDbProduct);
}

export async function loadFilteredProducts(filters: ProductFilters = {}) {
  if (!(await dbAvailable())) return staticFilter(filters);

  const rows = await getPublishedProducts({
    search: filters.search,
    brand: filters.brand
      ? filters.brand.toLowerCase().replace(/\s+/g, "-")
      : filters.collection,
    size: filters.size,
    featured: filters.featured,
    availableOnly: filters.availableOnly,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    sort: filters.sort,
  });

  // Brand filter by name when slug mismatch
  let mapped = rows.map(mapDbProduct);
  if (filters.brand) {
    mapped = mapped.filter((p) => p.brand === filters.brand);
  }
  if (filters.condition) {
    mapped = mapped.filter((p) => p.condition === filters.condition);
  }
  return mapped;
}

export async function loadCollections(): Promise<Collection[]> {
  if (!(await dbAvailable())) return staticCollections;
  const brands = await getBrandsPublic();
  const products = await getPublishedProducts({});
  return brands.map((b) => ({
    id: b.id,
    slug: b.slug,
    name: b.name,
    description: b.description || `${b.name} curated collection`,
    productCount: products.filter((p) => p.brandId === b.id).length,
    image: {
      src: b.logoUrl || products.find((p) => p.brandId === b.id)?.images[0]?.url || "",
      alt: `${b.name} Collection`,
      isPlaceholder: !b.logoUrl && !products.find((p) => p.brandId === b.id)?.images[0]?.url,
    },
    featured: b.featured,
  }));
}

export async function loadCollectionBySlug(slug: string): Promise<Collection | null> {
  const all = await loadCollections();
  return all.find((c) => c.slug === slug) || null;
}

export async function loadBrandNames(): Promise<string[]> {
  if (!(await dbAvailable())) {
    return [...new Set(staticProducts.map((p) => p.brand))].sort();
  }
  const brands = await getBrandsPublic();
  return brands.map((b) => b.name);
}

export async function loadAllSizes(): Promise<string[]> {
  if (!(await dbAvailable())) {
    return [...new Set(staticProducts.flatMap((p) => p.sizes))].sort(
      (a, b) => Number(a) - Number(b)
    );
  }
  const products = await getPublishedProducts({});
  const sizes = new Set<string>();
  for (const p of products) {
    for (const row of p.inventory) sizes.add(row.size);
  }
  return [...sizes].sort((a, b) => Number(a) - Number(b) || a.localeCompare(b));
}

export async function loadShopCatalogData() {
  const [products, brands, sizes] = await Promise.all([
    loadFilteredProducts({ sort: "newest" }),
    loadBrandNames(),
    loadAllSizes(),
  ]);
  return { products, brands, sizes };
}
