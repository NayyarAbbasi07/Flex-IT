function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function generateSku(brandName, productName) {
  const brand = slugify(brandName).replace(/-/g, '').slice(0, 4).toUpperCase() || 'FLX';
  const product = slugify(productName).replace(/-/g, '').slice(0, 6).toUpperCase() || 'ITEM';
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${brand}-${product}-${suffix}`;
}

module.exports = { slugify, generateSku };
