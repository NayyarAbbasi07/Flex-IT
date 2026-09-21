import { siteConfig } from "./config";
import type { CartItem } from "./cart";
import { calcCartCount, calcCartTotal } from "./cart";
import { formatPrice } from "./utils";

export interface WhatsAppProductMessage {
  productName: string;
  slug: string;
  sku?: string;
  size?: string;
  price: string;
  condition?: string;
}

interface WhatsAppOptions {
  /** Store WhatsApp number from CMS (digits with country code). Falls back to siteConfig. */
  number?: string;
}

export function buildWhatsAppUrl(message: string, number?: string) {
  const digits = (number || siteConfig.whatsapp.number).replace(/[^\d]/g, "");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${encoded}`;
}

export function getProductPageUrl(slug: string) {
  const base = siteConfig.url.replace(/\/$/, "");
  return `${base}/shop/${slug}`;
}

function formatSizeLine(size?: string) {
  return size
    ? `Size: EU ${size}`
    : "Size: Not selected yet (please confirm)";
}

function buildProductDetailsBlock(params: WhatsAppProductMessage) {
  const lines = ["Order details:", `Product: ${params.productName}`];

  if (params.sku) {
    lines.push(`Ref: ${params.sku}`);
  }

  lines.push(formatSizeLine(params.size), `Price: ${params.price}`);

  if (params.condition) {
    lines.push(`Condition: ${params.condition}`);
  }

  lines.push(`Link: ${getProductPageUrl(params.slug)}`);

  return lines.join("\n");
}

/** Dedicated product-order message — never uses the general default chat text. */
export function buildProductWhatsAppMessage(params: WhatsAppProductMessage) {
  return [
    "Hello Flex it!",
    "",
    "I want to order this shoe:",
    "",
    buildProductDetailsBlock(params),
    "",
    "Please confirm availability. Thanks!",
  ].join("\n");
}

export function getProductWhatsAppUrl(
  params: WhatsAppProductMessage,
  options?: WhatsAppOptions
) {
  return buildWhatsAppUrl(buildProductWhatsAppMessage(params), options?.number);
}

function buildCartItemBlock(item: CartItem, index: number) {
  const lines = [
    `${index + 1}) ${item.brand} ${item.name}`,
    `   Size: EU ${item.size}`,
    `   Qty: ${item.quantity}`,
    `   Price: ${formatPrice(item.price)}${item.quantity > 1 ? ` × ${item.quantity} = ${formatPrice(item.price * item.quantity)}` : ""}`,
  ];

  if (item.sku) {
    lines.splice(1, 0, `   Ref: ${item.sku}`);
  }
  if (item.condition) {
    lines.push(`   Condition: ${item.condition}`);
  }
  lines.push(`   Link: ${getProductPageUrl(item.slug)}`);

  return lines.join("\n");
}

/** Multi-shoe cart order — one WhatsApp message for the whole bag. */
export function buildCartWhatsAppMessage(items: CartItem[]) {
  if (!items.length) {
    return [
      "Hello Flex it!",
      "",
      "I'd like to know more about your collection.",
    ].join("\n");
  }

  if (items.length === 1 && items[0].quantity === 1) {
    const item = items[0];
    return buildProductWhatsAppMessage({
      productName: `${item.brand} ${item.name}`,
      slug: item.slug,
      sku: item.sku,
      size: item.size,
      price: formatPrice(item.price),
      condition: item.condition,
    });
  }

  const blocks = items.map((item, index) => buildCartItemBlock(item, index));
  const count = calcCartCount(items);
  const total = formatPrice(calcCartTotal(items));

  return [
    "Hello Flex it!",
    "",
    `I want to order these ${count} item${count === 1 ? "" : "s"}:`,
    "",
    blocks.join("\n\n"),
    "",
    "────────────",
    `Total items: ${count}`,
    `Estimated total: ${total}`,
    "",
    "Please confirm availability for each pair. Thanks!",
  ].join("\n");
}

export function getCartWhatsAppUrl(items: CartItem[], options?: WhatsAppOptions) {
  return buildWhatsAppUrl(buildCartWhatsAppMessage(items), options?.number);
}

/** General chat (navbar, hero, contact) — uses CMS default message when provided. */
export function getGeneralWhatsAppUrl(
  customMessage?: string,
  number?: string
) {
  return buildWhatsAppUrl(
    customMessage || siteConfig.whatsapp.defaultMessage,
    number
  );
}
