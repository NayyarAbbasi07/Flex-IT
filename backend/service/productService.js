const { prisma } = require('./prisma');
const { slugify, generateSku } = require('../utils/slug');
const { Gender, ConditionGrade, ProductStatus } = require('../common/enumFunction');

const productInclude = {
  brand: true,
  category: true,
  images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] },
  inventory: { orderBy: { size: 'asc' } },
};

async function listProducts(filters = {}) {
  const {
    q,
    status,
    brandId,
    categoryId,
    page = 1,
    pageSize = 20,
  } = filters;

  const where = {
    deletedAt: null,
    ...(status ? { status } : {}),
    ...(brandId ? { brandId } : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { sku: { contains: q, mode: 'insensitive' } },
            { brand: { name: { contains: q, mode: 'insensitive' } } },
          ],
        }
      : {}),
  };

  const take = Math.min(Math.max(Number(pageSize) || 20, 1), 100);
  const skip = (Math.max(Number(page) || 1, 1) - 1) * take;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy: { updatedAt: 'desc' },
      skip,
      take,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    success: true,
    products,
    pagination: {
      page: Math.max(Number(page) || 1, 1),
      pageSize: take,
      total,
      totalPages: Math.ceil(total / take) || 1,
    },
  };
}

async function listLowStock() {
  const rows = await prisma.productInventory.findMany({
    where: {
      quantity: { gt: 0 },
      product: { deletedAt: null },
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          sku: true,
          slug: true,
          status: true,
        },
      },
    },
    orderBy: { quantity: 'asc' },
  });

  const items = rows
    .filter((row) => row.quantity <= row.lowStockAt)
    .map((row) => ({
      inventoryId: row.id,
      productId: row.productId,
      productName: row.product.name,
      sku: row.product.sku,
      slug: row.product.slug,
      status: row.product.status,
      size: row.size,
      quantity: row.quantity,
      lowStockAt: row.lowStockAt,
    }));

  return { success: true, items };
}

async function bulkUpdateStatus(ids, status) {
  const result = await prisma.product.updateMany({
    where: { id: { in: ids }, deletedAt: null },
    data: { status },
  });
  return { success: true, result: { count: result.count, status } };
}

async function getProduct(id) {
  const product = await prisma.product.findFirst({
    where: { id, deletedAt: null },
    include: productInclude,
  });
  if (!product) {
    return { success: false, message: 'Product not found', statusCode: 404 };
  }
  return { success: true, product };
}

async function createProduct(data) {
  const brand = await prisma.brand.findUnique({ where: { id: data.brandId } });
  if (!brand) {
    return { success: false, message: 'Brand not found', statusCode: 404 };
  }

  const slug = data.slug || slugify(data.name);
  const sku = data.sku || generateSku(brand.name, data.name);
  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug,
      sku,
      description: data.description || '',
      features: data.features || [],
      tags: (data.tags || []).map((t) => t.toLowerCase()),
      brandId: data.brandId,
      categoryId: data.categoryId || null,
      gender: data.gender || Gender.UNISEX,
      shoeType: data.shoeType || 'Sneakers',
      condition: data.condition || ConditionGrade.A,
      originalBrand: data.originalBrand || brand.name,
      importedFrom: data.importedFrom || null,
      color: data.color || '',
      price: data.price,
      discountPrice: data.discountPrice ?? null,
      featured: data.featured ?? false,
      newArrival: data.newArrival ?? true,
      bestSeller: data.bestSeller ?? false,
      status: data.status || ProductStatus.DRAFT,
      images: data.images?.length
        ? {
            create: data.images.map((img, i) => ({
              url: img.url,
              alt: img.alt || data.name,
              sortOrder: img.sortOrder ?? i,
              isPrimary: img.isPrimary ?? i === 0,
            })),
          }
        : undefined,
      inventory: data.inventory?.length
        ? {
            create: data.inventory.map((row) => ({
              size: row.size,
              quantity: row.quantity,
              lowStockAt: row.lowStockAt ?? 2,
            })),
          }
        : undefined,
    },
    include: productInclude,
  });

  return { success: true, product };
}

async function updateProduct(id, data) {
  const existing = await prisma.product.findFirst({ where: { id, deletedAt: null } });
  if (!existing) {
    return { success: false, message: 'Product not found', statusCode: 404 };
  }

  const product = await prisma.$transaction(async (tx) => {
    if (data.inventory) {
      await tx.productInventory.deleteMany({ where: { productId: id } });
      await tx.productInventory.createMany({
        data: data.inventory.map((row) => ({
          productId: id,
          size: row.size,
          quantity: row.quantity,
          lowStockAt: row.lowStockAt ?? 2,
        })),
      });
    }
    if (data.images) {
      await tx.productImage.deleteMany({ where: { productId: id } });
      await tx.productImage.createMany({
        data: data.images.map((img, i) => ({
          productId: id,
          url: img.url,
          alt: img.alt || data.name || existing.name,
          sortOrder: img.sortOrder ?? i,
          isPrimary: img.isPrimary ?? i === 0,
        })),
      });
    }
    return tx.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug || (data.name ? slugify(data.name) : undefined),
        sku: data.sku,
        description: data.description,
        features: data.features,
        tags: data.tags?.map((t) => t.toLowerCase()),
        brandId: data.brandId,
        categoryId: data.categoryId === undefined ? undefined : data.categoryId,
        gender: data.gender,
        shoeType: data.shoeType,
        condition: data.condition,
        originalBrand: data.originalBrand,
        importedFrom: data.importedFrom,
        color: data.color,
        price: data.price,
        discountPrice: data.discountPrice,
        featured: data.featured,
        newArrival: data.newArrival,
        bestSeller: data.bestSeller,
        status: data.status,
      },
      include: productInclude,
    });
  });

  return { success: true, product };
}

async function deleteProduct(id) {
  const existing = await prisma.product.findFirst({ where: { id, deletedAt: null } });
  if (!existing) {
    return { success: false, message: 'Product not found', statusCode: 404 };
  }

  await prisma.product.update({
    where: { id },
    data: { deletedAt: new Date(), status: ProductStatus.ARCHIVED },
  });

  return { success: true, product: { id } };
}

module.exports = {
  listProducts,
  listLowStock,
  bulkUpdateStatus,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
