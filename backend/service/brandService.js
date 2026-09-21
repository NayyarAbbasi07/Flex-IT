const { prisma } = require('./prisma');
const { slugify } = require('../utils/slug');

async function listBrands() {
  const brands = await prisma.brand.findMany({
    where: { deletedAt: null },
    include: { _count: { select: { products: true } } },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  });
  return { success: true, brands };
}

async function createBrand(data) {
  const brand = await prisma.brand.create({
    data: {
      name: data.name,
      slug: data.slug || slugify(data.name),
      description: data.description || null,
      logoUrl: data.logoUrl || null,
      featured: data.featured ?? false,
      sortOrder: data.sortOrder ?? 0,
    },
  });
  return { success: true, brand };
}

async function updateBrand(id, data) {
  try {
    const brand = await prisma.brand.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug || slugify(data.name),
        description: data.description,
        logoUrl: data.logoUrl,
        featured: data.featured,
        sortOrder: data.sortOrder,
      },
    });
    return { success: true, brand };
  } catch {
    return { success: false, message: 'Brand not found', statusCode: 404 };
  }
}

async function deleteBrand(id) {
  try {
    await prisma.brand.update({ where: { id }, data: { deletedAt: new Date() } });
    return { success: true, brand: { id } };
  } catch {
    return { success: false, message: 'Brand not found', statusCode: 404 };
  }
}

module.exports = {
  listBrands,
  createBrand,
  updateBrand,
  deleteBrand,
};
