import type { Product as DbProduct, Brand, Category, ProductImage, ProductInventory } from "@prisma/client";
import type { Product, ProductAvailability, ProductCondition } from "@/types";

type DbProductFull = DbProduct & {
  brand: Brand;
  category: Category | null;
  images: ProductImage[];
  inventory: ProductInventory[];
};

const conditionMap: Record<string, ProductCondition> = {
  A_PLUS: "like-new",
  A: "excellent",
  B_PLUS: "good",
  B: "fair",
};

export function mapDbProduct(p: DbProductFull): Product {
  const totalQty = p.inventory.reduce((sum, row) => sum + row.quantity, 0);
  let availability: ProductAvailability = "available";
  if (totalQty <= 0) availability = "sold";

  const hasSale =
    typeof p.discountPrice === "number" &&
    p.discountPrice > 0 &&
    p.discountPrice < p.price;

  const inventory = mapDbInventory(p);

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand.name,
    category: "shoes",
    collection: p.brand.slug,
    price: hasSale ? p.discountPrice! : p.price,
    compareAtPrice: hasSale ? p.price : undefined,
    currency: p.currency,
    sizes: inventory.map((i) => i.size),
    inventory,
    condition: conditionMap[p.condition] || "excellent",
    availability,
    color: p.color,
    description: p.description,
    featured: p.featured,
    newest: p.newArrival,
    images:
      p.images.length > 0
        ? p.images.map((img) => ({
            src: img.url,
            alt: img.alt || p.name,
            isPlaceholder: false,
          }))
        : [{ src: "", alt: p.name, isPlaceholder: true }],
    tags: p.tags,
    createdAt: p.createdAt.toISOString().slice(0, 10),
  };
}

export function mapDbInventory(p: DbProductFull) {
  return p.inventory.map((row) => ({
    size: row.size,
    quantity: row.quantity,
    available: row.quantity > 0,
    lowStock: row.quantity > 0 && row.quantity <= row.lowStockAt,
  }));
}
