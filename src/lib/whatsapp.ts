import { siteConfig } from "./config";

interface WhatsAppProductMessage {
  productName: string;
  size?: string;
  price: string;
}

export function buildWhatsAppUrl(message: string) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${siteConfig.whatsapp.number}?text=${encoded}`;
}

export function buildProductWhatsAppMessage({
  productName,
  size,
  price,
}: WhatsAppProductMessage) {
  return [
    "Hello Flex it!",
    "",
    "I'm interested in this shoe.",
    "",
    `Product:`,
    productName,
    "",
    `Size:`,
    size || "Not selected",
    "",
    `Price:`,
    price,
    "",
    "Is it available?",
  ].join("\n");
}

export function getProductWhatsAppUrl(params: WhatsAppProductMessage) {
  return buildWhatsAppUrl(buildProductWhatsAppMessage(params));
}

export function getGeneralWhatsAppUrl(customMessage?: string) {
  return buildWhatsAppUrl(customMessage || siteConfig.whatsapp.defaultMessage);
}
