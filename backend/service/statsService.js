const { prisma } = require('./prisma');
const { ProductStatus, InquiryStatus, OrderStatus } = require('../common/enumFunction');

async function getDashboardStats() {
  const [
    total,
    published,
    draft,
    featured,
    brands,
    categories,
    lowStockRows,
    outOfStock,
    inquiriesNew,
    inquiriesTotal,
    ordersPending,
    ordersConfirmed,
    ordersTotal,
  ] = await Promise.all([
    prisma.product.count({ where: { deletedAt: null } }),
    prisma.product.count({ where: { deletedAt: null, status: ProductStatus.PUBLISHED } }),
    prisma.product.count({ where: { deletedAt: null, status: ProductStatus.DRAFT } }),
    prisma.product.count({ where: { deletedAt: null, featured: true } }),
    prisma.brand.count({ where: { deletedAt: null } }),
    prisma.category.count({ where: { deletedAt: null } }),
    prisma.productInventory.findMany({
      where: { quantity: { gt: 0 }, product: { deletedAt: null } },
      select: { quantity: true, lowStockAt: true },
    }),
    prisma.productInventory.count({ where: { quantity: 0, product: { deletedAt: null } } }),
    prisma.inquiry.count({ where: { deletedAt: null, status: InquiryStatus.NEW } }),
    prisma.inquiry.count({ where: { deletedAt: null } }),
    prisma.order.count({ where: { deletedAt: null, status: OrderStatus.PENDING } }),
    prisma.order.count({ where: { deletedAt: null, status: OrderStatus.CONFIRMED } }),
    prisma.order.count({ where: { deletedAt: null } }),
  ]);

  const lowStock = lowStockRows.filter((r) => r.quantity <= r.lowStockAt).length;

  const inStock = await prisma.product.count({
    where: {
      deletedAt: null,
      inventory: { some: { quantity: { gt: 0 } } },
    },
  });

  const recent = await prisma.product.findMany({
    where: { deletedAt: null },
    include: { brand: true, images: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
  });

  const byBrand = await prisma.brand.findMany({
    where: { deletedAt: null },
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  });

  return {
    success: true,
    stats: {
      total,
      published,
      draft,
      featured,
      brands,
      categories,
      inStock,
      outOfStock,
      lowStock,
      inquiriesNew,
      inquiriesTotal,
      ordersPending,
      ordersConfirmed,
      ordersTotal,
      recent,
      byBrand: byBrand.map((b) => ({ name: b.name, count: b._count.products })),
    },
  };
}

module.exports = {
  getDashboardStats,
};
