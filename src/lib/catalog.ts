import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type PublicProductFilters = {
  search?: string;
  brand?: string;
  category?: string;
  size?: string;
  gender?: string;
  condition?: string;
  featured?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
  availableOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "featured" | "price-asc" | "price-desc" | "name";
};

const productInclude = {
  brand: true,
  category: true,
  images: { orderBy: [{ isPrimary: "desc" as const }, { sortOrder: "asc" as const }] },
  inventory: { orderBy: { size: "asc" as const } },
};

export async function getPublishedProducts(filters: PublicProductFilters = {}) {
  const where: Prisma.ProductWhereInput = {
    deletedAt: null,
    status: "PUBLISHED",
  };

  if (filters.search) {
    const q = filters.search;
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { sku: { contains: q, mode: "insensitive" } },
      { tags: { has: q.toLowerCase() } },
      { brand: { name: { contains: q, mode: "insensitive" } } },
      { category: { name: { contains: q, mode: "insensitive" } } },
    ];
  }

  if (filters.brand) {
    where.brand = { slug: filters.brand, deletedAt: null };
  }
  if (filters.category) {
    where.category = { slug: filters.category, deletedAt: null, enabled: true };
  }
  if (filters.gender) {
    where.gender = filters.gender as Prisma.EnumGenderFilter["equals"];
  }
  if (filters.condition) {
    where.condition = filters.condition as Prisma.EnumConditionGradeFilter["equals"];
  }
  if (filters.featured) where.featured = true;
  if (filters.newArrival) where.newArrival = true;
  if (filters.bestSeller) where.bestSeller = true;
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {};
    if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
    if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
  }
  if (filters.size) {
    where.inventory = {
      some: {
        size: filters.size,
        ...(filters.availableOnly ? { quantity: { gt: 0 } } : {}),
      },
    };
  } else if (filters.availableOnly) {
    where.inventory = { some: { quantity: { gt: 0 } } };
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  switch (filters.sort) {
    case "price-asc":
      orderBy = { price: "asc" };
      break;
    case "price-desc":
      orderBy = { price: "desc" };
      break;
    case "name":
      orderBy = { name: "asc" };
      break;
    case "featured":
      orderBy = { featured: "desc" };
      break;
    default:
      orderBy = { createdAt: "desc" };
  }

  return prisma.product.findMany({
    where,
    include: productInclude,
    orderBy,
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, deletedAt: null, status: "PUBLISHED" },
    include: productInclude,
  });
}

export async function getFeaturedProducts(limit = 4) {
  return prisma.product.findMany({
    where: {
      deletedAt: null,
      status: "PUBLISHED",
      featured: true,
      inventory: { some: { quantity: { gt: 0 } } },
    },
    include: productInclude,
    orderBy: { updatedAt: "desc" },
    take: limit,
  });
}

export async function getLatestProducts(limit = 8) {
  return prisma.product.findMany({
    where: { deletedAt: null, status: "PUBLISHED", newArrival: true },
    include: productInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getRelatedProducts(
  productId: string,
  brandId: string,
  limit = 4
) {
  return prisma.product.findMany({
    where: {
      deletedAt: null,
      status: "PUBLISHED",
      id: { not: productId },
      OR: [{ brandId }, { featured: true }],
      inventory: { some: { quantity: { gt: 0 } } },
    },
    include: productInclude,
    take: limit,
  });
}

export async function getBrandsPublic() {
  return prisma.brand.findMany({
    where: { deletedAt: null },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function getCategoriesPublic() {
  return prisma.category.findMany({
    where: { deletedAt: null, enabled: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function getDashboardStats() {
  const [total, published, draft, featured, brands, categories, lowStock, outOfStock] =
    await Promise.all([
      prisma.product.count({ where: { deletedAt: null } }),
      prisma.product.count({ where: { deletedAt: null, status: "PUBLISHED" } }),
      prisma.product.count({ where: { deletedAt: null, status: "DRAFT" } }),
      prisma.product.count({ where: { deletedAt: null, featured: true } }),
      prisma.brand.count({ where: { deletedAt: null } }),
      prisma.category.count({ where: { deletedAt: null } }),
      prisma.productInventory.count({ where: { quantity: { gt: 0, lte: 2 } } }),
      prisma.productInventory.count({ where: { quantity: 0 } }),
    ]);

  const inStock = await prisma.product.count({
    where: {
      deletedAt: null,
      inventory: { some: { quantity: { gt: 0 } } },
    },
  });

  const recent = await prisma.product.findMany({
    where: { deletedAt: null },
    include: { brand: true, images: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const byBrand = await prisma.brand.findMany({
    where: { deletedAt: null },
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return {
    total,
    published,
    draft,
    featured,
    brands,
    categories,
    inStock,
    outOfStock,
    lowStock,
    recent,
    byBrand: byBrand.map((b) => ({ name: b.name, count: b._count.products })),
  };
}
