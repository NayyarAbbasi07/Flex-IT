const catalogService = require('./catalogService');

async function getCollections() {
  return catalogService.getCollections();
}

async function getCollectionBySlug(slug) {
  const result = await catalogService.getCollections();
  if (!result.success) return result;
  const collection = result.collections.find((c) => c.slug === slug);
  if (!collection) {
    return { success: false, message: 'Collection not found', statusCode: 404 };
  }
  return { success: true, collection };
}

module.exports = {
  getCollections,
  getCollectionBySlug,
};
