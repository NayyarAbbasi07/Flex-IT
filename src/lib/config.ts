import type { NavLink } from "@/types";

/**
 * Single source of truth for brand settings.
 * Update WhatsApp number, social links, and site URL here.
 */
export const siteConfig = {
  name: "Flex it!",
  tagline: "Curated Fashion",
  description:
    "Premium curated imported thrift sneakers and fashion. Quality-checked pieces selected for every style.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://flex-it-store.pages.dev",
  locale: "en_US",

  /** WhatsApp number in international format without + or spaces */
  whatsapp: {
    number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567",
    defaultMessage: "Hello Flex it!\n\nI'd like to know more about your collection.",
  },

  contact: {
    email: "hello@flexit.store",
    phone: "+92 300 1234567",
    city: "Pakistan",
  },

  social: {
    instagram: "https://instagram.com/flexit",
    facebook: "https://facebook.com/flexit",
    tiktok: "https://tiktok.com/@flexit",
  },

  nav: [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/collections", label: "Collections" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ] as NavLink[],

  currency: {
    code: "PKR",
    symbol: "Rs.",
    locale: "en-PK",
  },
} as const;

export const CONDITION_LABELS: Record<string, string> = {
  new: "Brand New",
  "like-new": "Like New",
  excellent: "Excellent",
  good: "Good",
  fair: "Fair",
};

export const CATEGORY_LABELS: Record<string, string> = {
  shoes: "Shoes",
  clothing: "Clothing",
  jackets: "Jackets",
  hoodies: "Hoodies",
  accessories: "Accessories",
  bags: "Bags",
  caps: "Caps",
};
