const { prisma } = require('./prisma');
const { slugify } = require('../utils/slug');

async function listCategories() {
  const categories = await prisma.category.findMany({
    where: { deletedAt: null },
    include: { _count: { select: { products: true } } },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  });
  return { success: true, categories };
}

async function createCategory(data) {
  const category = await prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug || slugify(data.name),
      description: data.description || null,
      imageUrl: data.imageUrl || null,
      enabled: data.enabled ?? true,
      sortOrder: data.sortOrder ?? 0,
    },
  });
  return { success: true, category };
}

async function updateCategory(id, data) {
  try {
    const category = await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug || slugify(data.name),
        description: data.description,
        imageUrl: data.imageUrl,
        enabled: data.enabled,
        sortOrder: data.sortOrder,
      },
    });
    return { success: true, category };
  } catch {
    return { success: false, message: 'Category not found', statusCode: 404 };
  }
}

async function deleteCategory(id) {
  try {
    await prisma.category.update({ where: { id }, data: { deletedAt: new Date() } });
    return { success: true, category: { id } };
  } catch {
    return { success: false, message: 'Category not found', statusCode: 404 };
  }
}

module.exports = {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
