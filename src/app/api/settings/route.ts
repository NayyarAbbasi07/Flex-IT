import { getStoreSettings } from "@/lib/settings";
import { jsonOk } from "@/lib/api";

export async function GET() {
  const settings = await getStoreSettings();
  return jsonOk({
    brandName: settings.brandName,
    tagline: settings.tagline,
    phone: settings.phone,
    email: settings.email,
    whatsappNumber: settings.whatsappNumber,
    whatsappDefaultMessage: settings.whatsappDefaultMessage,
    businessHours: settings.businessHours,
    social: {
      instagram: settings.instagram,
      facebook: settings.facebook,
      tiktok: settings.tiktok,
    },
  });
}
