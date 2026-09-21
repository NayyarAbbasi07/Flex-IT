import type { Product, ProductFilters, Collection, FAQ, Review } from "@/types";
import { siteConfig } from "@/lib/config";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Demo catalog fallback is for local/dev only.
 * In production a dead API must not show fake seed products.
 */
function allowStaticFallback() {
  if (process.env.NEXT_PUBLIC_ALLOW_STATIC_FALLBACK === "true") return true;
  if (process.env.NEXT_PUBLIC_ALLOW_STATIC_FALLBACK === "false") return false;
  return process.env.NODE_ENV !== "production";
}

async function loadStatic() {
  return import("@/lib/data");
}

async function apiGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json?.success) return null;
    return json.data as T;
  } catch {
    return null;
  }
}

export type StoreSettingsMap = {
  brandName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  businessHours: string;
  logoUrl: string;
  faviconUrl: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  shippingInfo: string;
  returnPolicy: string;
  privacyPolicy: string;
  termsConditions: string;
  social?: {
    instagram: string;
    facebook: string;
    tiktok: string;
  };
};

const settingsDefaults: StoreSettingsMap = {
  brandName: siteConfig.name,
  tagline: siteConfig.tagline,
  email: siteConfig.contact.email,
  phone: siteConfig.contact.phone,
  address: siteConfig.contact.city,
  whatsappNumber: siteConfig.whatsapp.number,
  whatsappDefaultMessage: siteConfig.whatsapp.defaultMessage,
  businessHours: "11:00 AM – 9:00 PM (PKT)",
  logoUrl: "",
  faviconUrl: "/favicon.ico",
  instagram: siteConfig.social.instagram,
  facebook: siteConfig.social.facebook,
  tiktok: siteConfig.social.tiktok,
  shippingInfo: "Nationwide delivery across Pakistan. Charges confirmed on WhatsApp.",
  returnPolicy: "Returns accepted within 3 days for unused items in original condition.",
  privacyPolicy: "We only use your contact details to fulfill orders and support requests.",
  termsConditions: "All products are curated thrift imports and sold as described.",
};

export async function getStoreSettings(): Promise<StoreSettingsMap> {
  const data = await apiGet<Partial<StoreSettingsMap> & { social?: StoreSettingsMap["social"] }>(
    "/api/settings"
  );
  if (!data) return settingsDefaults;
  return {
    ...settingsDefaults,
    ...data,
    instagram: data.social?.instagram || data.instagram || settingsDefaults.instagram,
    facebook: data.social?.facebook || data.facebook || settingsDefaults.facebook,
    tiktok: data.social?.tiktok || data.tiktok || settingsDefaults.tiktok,
  };
}

export type HeroSection = {
  id: string;
  heading: string;
  subheading: string;
  description: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  imageUrls: string[];
  enabled: boolean;
};

export async function loadHero(): Promise<HeroSection | null> {
  return apiGet<HeroSection>("/api/hero");
}

export async function loadFeaturedProducts(limit = 4): Promise<Product[]> {
  const data = await apiGet<Product[]>("/api/products/featured");
  if (data) return data.slice(0, limit);
  if (!allowStaticFallback()) return [];
  const { getFeaturedProducts } = await loadStatic();
  return getFeaturedProducts(limit);
}

export async function loadLatestProducts(limit = 8): Promise<Product[]> {
  const data = await apiGet<Product[]>("/api/products/latest");
  if (data) return data.slice(0, limit);
  if (!allowStaticFallback()) return [];
  const { getLatestProducts } = await loadStatic();
  return getLatestProducts(limit);
}

export async function loadProductBySlug(slug: string): Promise<Product | null> {
  const data = await apiGet<Product>(`/api/products/${encodeURIComponent(slug)}`);
  if (data) return data;
  if (!allowStaticFallback()) return null;
  const { getProductBySlug } = await loadStatic();
  return getProductBySlug(slug) || null;
}

export async function loadRelatedProducts(product: Product, limit = 4) {
  const data = await apiGet<Product[]>(
    `/api/products/${encodeURIComponent(product.slug)}/related`
  );
  if (data) return data.slice(0, limit);
  if (!allowStaticFallback()) return [];
  const { products, getRelatedProducts } = await loadStatic();
  return getRelatedProducts(
    products.find((p) => p.slug === product.slug) || product,
    limit
  );
}

export async function loadFilteredProducts(filters: ProductFilters = {}) {
  const sp = new URLSearchParams();
  if (filters.search) sp.set("q", filters.search);
  if (filters.brand) sp.set("brand", filters.brand.toLowerCase().replace(/\s+/g, "-"));
  if (filters.collection) sp.set("collection", filters.collection);
  if (filters.size) sp.set("size", filters.size);
  if (filters.featured) sp.set("featured", "true");
  if (filters.availableOnly) sp.set("available", "true");
  if (filters.sort) sp.set("sort", filters.sort);

  const data = await apiGet<Product[]>(`/api/products?${sp.toString()}`);
  if (data) {
    let mapped = data;
    if (filters.brand) {
      mapped = mapped.filter((p) => p.brand === filters.brand);
    }
    if (filters.condition) {
      mapped = mapped.filter((p) => p.condition === filters.condition);
    }
    return mapped;
  }
  if (!allowStaticFallback()) return [];
  const { filterProducts } = await loadStatic();
  return filterProducts(filters);
}

export async function loadCollections(): Promise<Collection[]> {
  const data = await apiGet<Collection[]>("/api/collections");
  if (data) return data;
  if (!allowStaticFallback()) return [];
  const { collections } = await loadStatic();
  return collections;
}

export async function loadCollectionBySlug(slug: string): Promise<Collection | null> {
  const data = await apiGet<Collection>(`/api/collections/${encodeURIComponent(slug)}`);
  if (data) return data;
  const all = await loadCollections();
  return all.find((c) => c.slug === slug) || null;
}

export async function loadShopCatalogData() {
  const data = await apiGet<{
    products: Product[];
    brands: string[];
    sizes: string[];
  }>("/api/catalog");

  if (data) return data;

  if (!allowStaticFallback()) {
    return { products: [], brands: [], sizes: [] };
  }

  const { products: staticProducts, filterProducts } = await loadStatic();
  const products = filterProducts({ sort: "newest" });
  return {
    products,
    brands: [...new Set(staticProducts.map((p) => p.brand))].sort(),
    sizes: [...new Set(staticProducts.flatMap((p) => p.sizes))].sort(
      (a, b) => Number(a) - Number(b)
    ),
  };
}

export async function loadFaqs(): Promise<FAQ[]> {
  const data = await apiGet<
    Array<{ id: string; question: string; answer: string }>
  >("/api/faqs");
  if (data?.length) {
    return data.map((f) => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
    }));
  }
  if (!allowStaticFallback()) return [];
  const { faqs } = await loadStatic();
  return faqs;
}

export async function loadTestimonials(): Promise<Review[]> {
  const data = await apiGet<
    Array<{
      id: string;
      name: string;
      rating: number;
      comment: string;
      productName?: string | null;
      location?: string | null;
      createdAt?: string;
    }>
  >("/api/testimonials");
  if (data?.length) {
    return data.map((t) => ({
      id: t.id,
      name: t.name,
      rating: t.rating,
      comment: t.comment,
      productName: t.productName || undefined,
      location: t.location || undefined,
      date: t.createdAt ? t.createdAt.slice(0, 10) : "",
    }));
  }
  if (!allowStaticFallback()) return [];
  const { reviews } = await loadStatic();
  return reviews;
}
