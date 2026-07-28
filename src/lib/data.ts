import type { Collection, FAQ, Product, ProductFilters, Review } from "@/types";

/**
 * Sample catalog — replace image `src` values with real asset paths
 * under /public/products when you provide photos.
 * Keep `isPlaceholder: false` once a real image is set.
 */
export const products: Product[] = [
  {
    id: "1",
    slug: "nike-air-force-1-white",
    name: "Air Force 1 '07",
    brand: "Nike",
    category: "shoes",
    collection: "nike",
    price: 18900,
    compareAtPrice: 24900,
    currency: "PKR",
    sizes: ["40", "41", "42", "43"],
    condition: "excellent",
    availability: "available",
    color: "White / White",
    description:
      "A clean classic. Premium imported Air Force 1 with crisp leather uppers, original detailing, and everyday versatility. Quality-checked and ready to wear.",
    featured: true,
    newest: true,
    images: [
      { src: "", alt: "Nike Air Force 1 White", isPlaceholder: true, placeholderHue: 210 },
      { src: "", alt: "Nike Air Force 1 side view", isPlaceholder: true, placeholderHue: 215 },
      { src: "", alt: "Nike Air Force 1 detail", isPlaceholder: true, placeholderHue: 200 },
    ],
    tags: ["classic", "white", "everyday"],
    createdAt: "2026-07-20",
  },
  {
    id: "2",
    slug: "adidas-samba-og-black",
    name: "Samba OG",
    brand: "Adidas",
    category: "shoes",
    collection: "adidas",
    price: 16500,
    currency: "PKR",
    sizes: ["39", "40", "41", "42", "44"],
    condition: "like-new",
    availability: "available",
    color: "Core Black / Cloud White",
    description:
      "The iconic Samba OG in black. Soft leather, gum sole, and timeless silhouette — curated for streetwear fits and casual weekends.",
    featured: true,
    newest: true,
    images: [
      { src: "", alt: "Adidas Samba OG Black", isPlaceholder: true, placeholderHue: 0 },
      { src: "", alt: "Adidas Samba OG pair", isPlaceholder: true, placeholderHue: 10 },
    ],
    tags: ["samba", "streetwear", "classic"],
    createdAt: "2026-07-18",
  },
  {
    id: "3",
    slug: "new-balance-550-white-green",
    name: "550 White Green",
    brand: "New Balance",
    category: "shoes",
    collection: "new-balance",
    price: 22000,
    compareAtPrice: 28000,
    currency: "PKR",
    sizes: ["40", "41", "42", "43", "44"],
    condition: "excellent",
    availability: "available",
    color: "White / Green",
    description:
      "Court-inspired New Balance 550 with fresh white and green accents. Imported and inspected for premium thrift quality.",
    featured: true,
    newest: false,
    images: [
      { src: "", alt: "New Balance 550 White Green", isPlaceholder: true, placeholderHue: 145 },
      { src: "", alt: "New Balance 550 detail", isPlaceholder: true, placeholderHue: 150 },
    ],
    tags: ["nb550", "court", "premium"],
    createdAt: "2026-07-10",
  },
  {
    id: "4",
    slug: "jordan-1-retro-high-chicago",
    name: "Air Jordan 1 Retro High",
    brand: "Nike",
    category: "shoes",
    collection: "nike",
    price: 45000,
    currency: "PKR",
    sizes: ["41", "42", "43"],
    condition: "good",
    availability: "available",
    color: "Chicago Red / White / Black",
    description:
      "Legendary AJ1 energy. Carefully curated Chicago-inspired colorway with authentic detailing and wearable condition.",
    featured: true,
    newest: true,
    images: [
      { src: "", alt: "Air Jordan 1 Retro High", isPlaceholder: true, placeholderHue: 0 },
      { src: "", alt: "Air Jordan 1 side", isPlaceholder: true, placeholderHue: 350 },
    ],
    tags: ["jordan", "retro", "hype"],
    createdAt: "2026-07-22",
  },
  {
    id: "5",
    slug: "puma-suede-classic-xxi",
    name: "Suede Classic XXI",
    brand: "Puma",
    category: "shoes",
    collection: "puma",
    price: 12500,
    currency: "PKR",
    sizes: ["40", "41", "42", "43", "44", "45"],
    condition: "excellent",
    availability: "available",
    color: "Peacoat / White",
    description:
      "Soft suede upper, Formstrip heritage, and everyday comfort. A wardrobe essential from our Puma edit.",
    featured: false,
    newest: true,
    images: [
      { src: "", alt: "Puma Suede Classic XXI", isPlaceholder: true, placeholderHue: 230 },
    ],
    tags: ["suede", "classic"],
    createdAt: "2026-07-15",
  },
  {
    id: "6",
    slug: "asics-gel-kayano-14",
    name: "GEL-Kayano 14",
    brand: "ASICS",
    category: "shoes",
    collection: "asics",
    price: 27500,
    currency: "PKR",
    sizes: ["40", "41", "42", "43"],
    condition: "like-new",
    availability: "available",
    color: "Cream / Pure Silver",
    description:
      "Performance heritage meets fashion. GEL-Kayano 14 with layered mesh, metallic accents, and unmatched cushioning.",
    featured: true,
    newest: true,
    images: [
      { src: "", alt: "ASICS GEL-Kayano 14", isPlaceholder: true, placeholderHue: 40 },
      { src: "", alt: "ASICS GEL-Kayano 14 angle", isPlaceholder: true, placeholderHue: 35 },
    ],
    tags: ["running", "tech", "premium"],
    createdAt: "2026-07-25",
  },
  {
    id: "7",
    slug: "converse-chuck-70-hi",
    name: "Chuck 70 High",
    brand: "Converse",
    category: "shoes",
    collection: "converse",
    price: 11000,
    currency: "PKR",
    sizes: ["39", "40", "41", "42", "43"],
    condition: "excellent",
    availability: "available",
    color: "Black / Egret / Egret",
    description:
      "Elevated Chuck 70 construction — thicker sole, premium canvas, and timeless high-top attitude.",
    featured: false,
    newest: false,
    images: [
      { src: "", alt: "Converse Chuck 70 High", isPlaceholder: true, placeholderHue: 0 },
    ],
    tags: ["chuck", "high-top"],
    createdAt: "2026-06-28",
  },
  {
    id: "8",
    slug: "vans-old-skool-black",
    name: "Old Skool",
    brand: "Vans",
    category: "shoes",
    collection: "vans",
    price: 9800,
    currency: "PKR",
    sizes: ["40", "41", "42", "43", "44"],
    condition: "good",
    availability: "available",
    color: "Black / White",
    description:
      "The sidewall stripe icon. Durable canvas and suede with that unmistakable skate DNA.",
    featured: false,
    newest: false,
    images: [
      { src: "", alt: "Vans Old Skool Black", isPlaceholder: true, placeholderHue: 0 },
    ],
    tags: ["skate", "classic"],
    createdAt: "2026-06-20",
  },
  {
    id: "9",
    slug: "hoka-clifton-9",
    name: "Clifton 9",
    brand: "HOKA",
    category: "shoes",
    collection: "hoka",
    price: 32000,
    currency: "PKR",
    sizes: ["41", "42", "43", "44"],
    condition: "like-new",
    availability: "available",
    color: "Black / Black",
    description:
      "Cloud-soft cushioning in a sleek silhouette. Ideal for long days and elevated athleisure looks.",
    featured: true,
    newest: true,
    images: [
      { src: "", alt: "HOKA Clifton 9", isPlaceholder: true, placeholderHue: 260 },
      { src: "", alt: "HOKA Clifton 9 sole", isPlaceholder: true, placeholderHue: 255 },
    ],
    tags: ["comfort", "running", "premium"],
    createdAt: "2026-07-24",
  },
  {
    id: "10",
    slug: "nike-dunk-low-panda",
    name: "Dunk Low Retro",
    brand: "Nike",
    category: "shoes",
    collection: "nike",
    price: 24000,
    currency: "PKR",
    sizes: ["40", "41", "42"],
    condition: "excellent",
    availability: "reserved",
    color: "White / Black",
    description:
      "The Panda Dunk — clean contrast, leather panels, and endless outfit potential. Currently reserved.",
    featured: false,
    newest: true,
    images: [
      { src: "", alt: "Nike Dunk Low Panda", isPlaceholder: true, placeholderHue: 0 },
    ],
    tags: ["dunk", "panda"],
    createdAt: "2026-07-21",
  },
  {
    id: "11",
    slug: "adidas-gazelle-bold",
    name: "Gazelle Bold",
    brand: "Adidas",
    category: "shoes",
    collection: "adidas",
    price: 19500,
    currency: "PKR",
    sizes: ["38", "39", "40", "41"],
    condition: "like-new",
    availability: "available",
    color: "Pink Spark / Cloud White",
    description:
      "Platform Gazelle energy with soft suede and bold proportions. A standout piece from our Adidas edit.",
    featured: false,
    newest: true,
    images: [
      { src: "", alt: "Adidas Gazelle Bold", isPlaceholder: true, placeholderHue: 330 },
    ],
    tags: ["gazelle", "platform"],
    createdAt: "2026-07-19",
  },
  {
    id: "12",
    slug: "new-balance-2002r",
    name: "2002R",
    brand: "New Balance",
    category: "shoes",
    collection: "new-balance",
    price: 28500,
    currency: "PKR",
    sizes: ["41", "42", "43", "44"],
    condition: "excellent",
    availability: "sold",
    color: "Grey / Silver",
    description:
      "Technical mesh and stability-inspired design. Sold out — join WhatsApp for restock alerts.",
    featured: false,
    newest: false,
    images: [
      { src: "", alt: "New Balance 2002R", isPlaceholder: true, placeholderHue: 210 },
    ],
    tags: ["2002r", "tech"],
    createdAt: "2026-06-15",
  },
];

export const collections: Collection[] = [
  {
    id: "nike",
    slug: "nike",
    name: "Nike",
    description: "Air Force, Dunks, Jordans, and iconic Nike silhouettes.",
    productCount: products.filter((p) => p.collection === "nike").length,
    image: { src: "", alt: "Nike Collection", isPlaceholder: true, placeholderHue: 0 },
    featured: true,
  },
  {
    id: "adidas",
    slug: "adidas",
    name: "Adidas",
    description: "Sambas, Gazelles, and timeless three-stripe essentials.",
    productCount: products.filter((p) => p.collection === "adidas").length,
    image: { src: "", alt: "Adidas Collection", isPlaceholder: true, placeholderHue: 210 },
    featured: true,
  },
  {
    id: "new-balance",
    slug: "new-balance",
    name: "New Balance",
    description: "550s, 2002Rs, and premium lifestyle runners.",
    productCount: products.filter((p) => p.collection === "new-balance").length,
    image: { src: "", alt: "New Balance Collection", isPlaceholder: true, placeholderHue: 145 },
    featured: true,
  },
  {
    id: "puma",
    slug: "puma",
    name: "Puma",
    description: "Suede classics and sport-inspired streetwear kicks.",
    productCount: products.filter((p) => p.collection === "puma").length,
    image: { src: "", alt: "Puma Collection", isPlaceholder: true, placeholderHue: 230 },
    featured: false,
  },
  {
    id: "asics",
    slug: "asics",
    name: "ASICS",
    description: "GEL technology meets fashion-forward running heritage.",
    productCount: products.filter((p) => p.collection === "asics").length,
    image: { src: "", alt: "ASICS Collection", isPlaceholder: true, placeholderHue: 40 },
    featured: true,
  },
  {
    id: "converse",
    slug: "converse",
    name: "Converse",
    description: "Chuck 70s and elevated canvas essentials.",
    productCount: products.filter((p) => p.collection === "converse").length,
    image: { src: "", alt: "Converse Collection", isPlaceholder: true, placeholderHue: 0 },
    featured: false,
  },
  {
    id: "vans",
    slug: "vans",
    name: "Vans",
    description: "Old Skools and skate culture staples.",
    productCount: products.filter((p) => p.collection === "vans").length,
    image: { src: "", alt: "Vans Collection", isPlaceholder: true, placeholderHue: 20 },
    featured: false,
  },
  {
    id: "hoka",
    slug: "hoka",
    name: "HOKA",
    description: "Maximum cushion, modern silhouettes, everyday comfort.",
    productCount: products.filter((p) => p.collection === "hoka").length,
    image: { src: "", alt: "HOKA Collection", isPlaceholder: true, placeholderHue: 260 },
    featured: true,
  },
];

export const reviews: Review[] = [
  {
    id: "1",
    name: "Ahmed K.",
    rating: 5,
    comment:
      "Got my AF1s in perfect condition. Packaging was premium and the WhatsApp process was super smooth.",
    productName: "Air Force 1 '07",
    location: "Lahore",
    date: "2026-07-12",
  },
  {
    id: "2",
    name: "Sara M.",
    rating: 5,
    comment:
      "Finally a thrift store that feels luxury. The Samba quality check was thorough — love Flex it!",
    productName: "Samba OG",
    location: "Karachi",
    date: "2026-07-08",
  },
  {
    id: "3",
    name: "Hassan R.",
    rating: 5,
    comment:
      "Ordered the Kayano 14 and it looked brand new. Fast delivery and honest condition notes.",
    productName: "GEL-Kayano 14",
    location: "Islamabad",
    date: "2026-07-01",
  },
  {
    id: "4",
    name: "Fatima Z.",
    rating: 4,
    comment:
      "Beautiful curation. Prices feel fair for imported pieces. Already planning my next pickup.",
    location: "Faisalabad",
    date: "2026-06-22",
  },
  {
    id: "5",
    name: "Bilal A.",
    rating: 5,
    comment:
      "The HOKA Clifton was exactly as described. Premium vibe from browsing to delivery.",
    productName: "Clifton 9",
    location: "Rawalpindi",
    date: "2026-07-18",
  },
];

export const faqs: FAQ[] = [
  {
    id: "1",
    question: "Are the shoes authentic?",
    answer:
      "Yes. Every pair is curated from trusted imported thrift sources and inspected for authenticity markers, construction quality, and wear consistency before listing.",
  },
  {
    id: "2",
    question: "How does buying on WhatsApp work?",
    answer:
      "Tap Buy on WhatsApp on any product. You'll get a pre-filled message with product details. Confirm size and availability with us, then we'll guide you through payment and delivery.",
  },
  {
    id: "3",
    question: "What do the condition ratings mean?",
    answer:
      "Like New means minimal wear. Excellent shows light use with clean uppers. Good is wearable with visible but honest wear. We always share clear photos and notes.",
  },
  {
    id: "4",
    question: "Do you deliver nationwide?",
    answer:
      "Yes. We deliver across Pakistan. Delivery timelines and charges are confirmed on WhatsApp based on your city.",
  },
  {
    id: "5",
    question: "Can I request a specific model?",
    answer:
      "Absolutely. Message us on WhatsApp with the model, size, and budget. We'll watch our incoming curated stock for a match.",
  },
  {
    id: "6",
    question: "Will you sell clothing and accessories?",
    answer:
      "Yes. We're starting with premium thrift sneakers and will expand into clothing, jackets, hoodies, bags, caps, and accessories — same curation standard.",
  },
];

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getCollectionBySlug(slug: string) {
  return collections.find((c) => c.slug === slug);
}

export function getFeaturedProducts(limit = 4) {
  return products.filter((p) => p.featured && p.availability !== "sold").slice(0, limit);
}

export function getLatestProducts(limit = 8) {
  return [...products]
    .filter((p) => p.newest)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 4) {
  return products
    .filter(
      (p) =>
        p.id !== product.id &&
        p.availability !== "sold" &&
        (p.brand === product.brand || p.collection === product.collection)
    )
    .slice(0, limit);
}

export function getBrands() {
  return [...new Set(products.map((p) => p.brand))].sort();
}

export function getAllSizes() {
  return [...new Set(products.flatMap((p) => p.sizes))].sort(
    (a, b) => Number(a) - Number(b)
  );
}

export function filterProducts(filters: ProductFilters = {}) {
  let result = [...products];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q)) ||
        p.color.toLowerCase().includes(q)
    );
  }

  if (filters.brand) {
    result = result.filter((p) => p.brand === filters.brand);
  }

  if (filters.size) {
    result = result.filter((p) => p.sizes.includes(filters.size!));
  }

  if (filters.condition) {
    result = result.filter((p) => p.condition === filters.condition);
  }

  if (filters.collection) {
    result = result.filter((p) => p.collection === filters.collection);
  }

  if (filters.category) {
    result = result.filter((p) => p.category === filters.category);
  }

  if (filters.minPrice !== undefined) {
    result = result.filter((p) => p.price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    result = result.filter((p) => p.price <= filters.maxPrice!);
  }

  if (filters.availableOnly) {
    result = result.filter((p) => p.availability === "available");
  }

  if (filters.featured) {
    result = result.filter((p) => p.featured);
  }

  switch (filters.sort) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "name":
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "featured":
      result.sort((a, b) => Number(b.featured) - Number(a.featured));
      break;
    case "newest":
    default:
      result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
  }

  return result;
}
