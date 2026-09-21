const { prisma } = require('./prisma');
const config = require('../config');

const settingsDefaults = {
  brandName: 'Flex it!',
  tagline: 'Curated Fashion',
  email: 'hello@flexit.store',
  phone: '0333 0215663',
  address: 'Pakistan',
  whatsappNumber: config.store.defaultWhatsappNumber,
  whatsappDefaultMessage: "Hello Flex it!\n\nI'd like to know more about your collection.",
  businessHours: '11:00 AM – 9:00 PM (PKT)',
  logoUrl: '',
  faviconUrl: '/favicon.ico',
  instagram: 'https://instagram.com/flexit',
  facebook: 'https://facebook.com/flexit',
  tiktok: 'https://tiktok.com/@flexit',
  shippingInfo: 'Nationwide delivery across Pakistan. Charges confirmed on WhatsApp.',
  returnPolicy: 'Returns accepted within 3 days for unused items in original condition.',
  privacyPolicy: 'We only use your contact details to fulfill orders and support requests.',
  termsConditions: 'All products are curated thrift imports and sold as described.',
};

async function getStoreSettings() {
  try {
    const rows = await prisma.storeSetting.findMany();
    const map = { ...settingsDefaults };
    for (const row of rows) {
      const key = row.key;
      if (key in map) {
        map[key] = String(row.value);
      }
    }
    return { success: true, settings: map };
  } catch {
    return { success: true, settings: settingsDefaults };
  }
}

async function upsertStoreSettings(partial) {
  const entries = Object.entries(partial);
  await Promise.all(
    entries.map(([key, value]) =>
      prisma.storeSetting.upsert({
        where: { key },
        create: { key, value },
        update: { value },
      })
    )
  );
  return getStoreSettings();
}

module.exports = {
  settingsDefaults,
  getStoreSettings,
  upsertStoreSettings,
};
