const { prisma } = require('./prisma');
const { ConditionGrade, ProductStatus } = require('../common/enumFunction');

const conditionMap = {
  [ConditionGrade.A_PLUS]: 'like-new',
  [ConditionGrade.A]: 'excellent',
  [ConditionGrade.B_PLUS]: 'good',
  [ConditionGrade.B]: 'fair',
};

const productInclude = {
  brand: true,
  category: true,
  images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] },
  inventory: { orderBy: { size: 'asc' } },
};

function mapDbProduct(p) {
  const totalQty = p.inventory.reduce((sum, row) => sum + row.quantity, 0);
  const availability = totalQty <= 0 ? 'sold' : 'available';
  const hasSale =
    typeof p.discountPrice === 'number' && p.discountPrice > 0 && p.discountPrice < p.price;
  const inventory = p.inventory.map((row) => ({
    size: row.size,
    quantity: row.quantity,
    available: row.quantity > 0,
    lowStock: row.quantity > 0 && row.quantity <= row.lowStockAt,
  }));

  return {
    id: p.id,
    slug: p.slug,
    sku: p.sku,
    name: p.name,
    brand: p.brand.name,
    category: 'shoes',
    collection: p.brand.slug,
    price: hasSale ? p.discountPrice : p.price,
    compareAtPrice: hasSale ? p.price : undefined,
    currency: p.currency,
    sizes: inventory.map((i) => i.size),
    inventory,
    condition: conditionMap[p.condition] || 'excellent',
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
        : [{ src: '', alt: p.name, isPlaceholder: true }],
    tags: p.tags,
    createdAt: p.createdAt.toISOString().slice(0, 10),
  };
}

async function getPublishedProducts(filters = {}) {
  const where = {
    deletedAt: null,
    status: ProductStatus.PUBLISHED,
  };

  if (filters.search) {
    const q = filters.search;
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { sku: { contains: q, mode: 'insensitive' } },
      { tags: { has: q.toLowerCase() } },
      { brand: { name: { contains: q, mode: 'insensitive' } } },
      { category: { name: { contains: q, mode: 'insensitive' } } },
    ];
  }
  if (filters.brand) {
    where.brand = { slug: filters.brand, deletedAt: null };
  }
  if (filters.category) {
    where.category = { slug: filters.category, deletedAt: null, enabled: true };
  }
  if (filters.gender) where.gender = filters.gender;
  if (filters.condition) where.condition = filters.condition;
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

  let orderBy = { createdAt: 'desc' };
  switch (filters.sort) {
    case 'price-asc':
      orderBy = { price: 'asc' };
      break;
    case 'price-desc':
      orderBy = { price: 'desc' };
      break;
    case 'name':
      orderBy = { name: 'asc' };
      break;
    case 'featured':
      orderBy = { featured: 'desc' };
      break;
    default:
      orderBy = { createdAt: 'desc' };
  }

  return prisma.product.findMany({ where, include: productInclude, orderBy });
}

async function getProductBySlugRaw(slug) {
  return prisma.product.findFirst({
    where: { slug, deletedAt: null, status: ProductStatus.PUBLISHED },
    include: productInclude,
  });
}

async function getRelatedProductsRaw(productId, brandId, limit = 4) {
  return prisma.product.findMany({
    where: {
      deletedAt: null,
      status: ProductStatus.PUBLISHED,
      id: { not: productId },
      OR: [{ brandId }, { featured: true }],
      inventory: { some: { quantity: { gt: 0 } } },
    },
    include: productInclude,
    take: limit,
  });
}

async function getBrandsPublic() {
  return prisma.brand.findMany({
    where: { deletedAt: null },
    orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { name: 'asc' }],
  });
}

async function listMappedProducts(filters = {}) {
  const rows = await getPublishedProducts(filters);
  let mapped = rows.map(mapDbProduct);
  if (filters.brand) {
    const brandSlug = filters.brand;
    mapped = mapped.filter(
      (p) =>
        p.collection === brandSlug ||
        p.brand.toLowerCase().replace(/\s+/g, '-') === brandSlug ||
        p.brand === filters.brand
    );
  }
  return { success: true, products: mapped };
}

async function getMappedProductBySlug(slug) {
  const row = await getProductBySlugRaw(slug);
  if (!row) {
    return { success: false, message: 'Product not found', statusCode: 404 };
  }
  return { success: true, product: mapDbProduct(row) };
}

async function getMappedRelated(slug, limit = 4) {
  const full = await getProductBySlugRaw(slug);
  if (!full) {
    return { success: true, products: [] };
  }
  const rows = await getRelatedProductsRaw(full.id, full.brandId, limit);
  return { success: true, products: rows.map(mapDbProduct) };
}

async function getFeaturedProducts(limit = 4) {
  const rows = await prisma.product.findMany({
    where: {
      deletedAt: null,
      status: ProductStatus.PUBLISHED,
      featured: true,
      inventory: { some: { quantity: { gt: 0 } } },
    },
    include: productInclude,
    orderBy: { updatedAt: 'desc' },
    take: limit,
  });
  return { success: true, products: rows.map(mapDbProduct) };
}

async function getLatestProducts(limit = 8) {
  const rows = await prisma.product.findMany({
    where: { deletedAt: null, status: ProductStatus.PUBLISHED, newArrival: true },
    include: productInclude,
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
  return { success: true, products: rows.map(mapDbProduct) };
}

async function getCollections() {
  const brands = await getBrandsPublic();
  const products = await getPublishedProducts({});
  const collections = brands.map((b) => ({
    id: b.id,
    slug: b.slug,
    name: b.name,
    description: b.description || `${b.name} curated collection`,
    productCount: products.filter((p) => p.brandId === b.id).length,
    image: {
      src: b.logoUrl || products.find((p) => p.brandId === b.id)?.images[0]?.url || '',
      alt: `${b.name} Collection`,
      isPlaceholder: !b.logoUrl && !products.find((p) => p.brandId === b.id)?.images[0]?.url,
    },
    featured: b.featured,
  }));
  return { success: true, collections };
}

async function getShopCatalog() {
  const productsResult = await listMappedProducts({ sort: 'newest' });
  const [brands, published] = await Promise.all([
    getBrandsPublic(),
    getPublishedProducts({}),
  ]);
  const sizes = new Set();
  for (const p of published) {
    for (const row of p.inventory) sizes.add(row.size);
  }
  return {
    success: true,
    catalog: {
      products: productsResult.products,
      brands: brands.map((b) => b.name),
      sizes: [...sizes].sort((a, b) => Number(a) - Number(b) || a.localeCompare(b)),
    },
  };
}

module.exports = {
  mapDbProduct,
  listMappedProducts,
  getMappedProductBySlug,
  getMappedRelated,
  getFeaturedProducts,
  getLatestProducts,
  getCollections,
  getShopCatalog,
};
