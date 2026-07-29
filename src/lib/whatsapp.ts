import { siteConfig } from "./config";

interface WhatsAppProductMessage {
  productName: string;
  size?: string;
  price: string;
}

interface WhatsAppOptions {
  number?: string;
  template?: string;
}

export function buildWhatsAppUrl(message: string, number?: string) {
  const digits = (number || siteConfig.whatsapp.number).replace(/[^\d]/g, "");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${encoded}`;
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

export function getProductWhatsAppUrl(
  params: WhatsAppProductMessage,
  options?: WhatsAppOptions
) {
  const message =
    options?.template?.trim() || buildProductWhatsAppMessage(params);
  // If admin set a default message template, still append product context
  const finalMessage = options?.template?.trim()
    ? [
        options.template.trim(),
        "",
        `Product: ${params.productName}`,
        `Size: ${params.size || "Not selected"}`,
        `Price: ${params.price}`,
      ].join("\n")
    : message;
  return buildWhatsAppUrl(finalMessage, options?.number);
}

export function getGeneralWhatsAppUrl(
  customMessage?: string,
  number?: string
) {
  return buildWhatsAppUrl(
    customMessage || siteConfig.whatsapp.defaultMessage,
    number
  );
}
