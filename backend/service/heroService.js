const { prisma } = require('./prisma');

async function getOrCreateHero() {
  let hero = await prisma.heroSection.findFirst({ orderBy: { updatedAt: 'desc' } });
  if (!hero) {
    hero = await prisma.heroSection.create({
      data: {
        heading: 'Curated Fashion.',
        subheading: '',
        description: 'Imported Premium Thrift Sneakers Curated For Every Style.',
        imageUrls: [],
      },
    });
  } else if (
    /^flex\s*it!?$/i.test(String(hero.heading || '').trim()) &&
    String(hero.subheading || '').trim()
  ) {
    // Legacy seed put brand in heading and the real line in subheading — swap once
    hero = await prisma.heroSection.update({
      where: { id: hero.id },
      data: {
        heading: hero.subheading,
        subheading: '',
      },
    });
  }
  return { success: true, hero };
}

async function updateHero(data) {
  const existing = await prisma.heroSection.findFirst({ orderBy: { updatedAt: 'desc' } });
  const hero = existing
    ? await prisma.heroSection.update({ where: { id: existing.id }, data })
    : await prisma.heroSection.create({ data });
  return { success: true, hero };
}

module.exports = {
  getOrCreateHero,
  updateHero,
};
