import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/config";

export type StoreSettingsMap = {
  brandName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  businessHours: string;
  logoUrl: string;
  faviconUrl: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  shippingInfo: string;
  returnPolicy: string;
  privacyPolicy: string;
  termsConditions: string;
};

const defaults: StoreSettingsMap = {
  brandName: siteConfig.name,
  tagline: siteConfig.tagline,
  email: siteConfig.contact.email,
  phone: siteConfig.contact.phone,
  address: siteConfig.contact.city,
  whatsappNumber: siteConfig.whatsapp.number,
  whatsappDefaultMessage: siteConfig.whatsapp.defaultMessage,
  businessHours: "11:00 AM – 9:00 PM (PKT)",
  logoUrl: "",
  faviconUrl: "/favicon.ico",
  instagram: siteConfig.social.instagram,
  facebook: siteConfig.social.facebook,
  tiktok: siteConfig.social.tiktok,
  shippingInfo: "Nationwide delivery across Pakistan. Charges confirmed on WhatsApp.",
  returnPolicy: "Returns accepted within 3 days for unused items in original condition.",
  privacyPolicy: "We only use your contact details to fulfill orders and support requests.",
  termsConditions: "All products are curated thrift imports and sold as described.",
};

export async function getStoreSettings(): Promise<StoreSettingsMap> {
  try {
    const rows = await prisma.storeSetting.findMany();
    const map = { ...defaults };
    for (const row of rows) {
      const key = row.key as keyof StoreSettingsMap;
      if (key in map) {
        map[key] = String(row.value as string);
      }
    }
    return map;
  } catch {
    return defaults;
  }
}

export async function upsertStoreSettings(partial: Partial<StoreSettingsMap>) {
  const entries = Object.entries(partial) as [keyof StoreSettingsMap, string][];
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

export function buildWhatsAppUrlFromSettings(
  number: string,
  message: string
) {
  const cleaned = number.replace(/[^\d]/g, "");
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}
